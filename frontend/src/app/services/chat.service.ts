import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { ChatMessage, MessageType } from '../models/chat-message.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private client!: Client;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  private username: string = '';
  
  // Stocker le dernier message LEAVE par utilisateur avec un timestamp
  private lastLeaveMessages: Map<string, number> = new Map();

  constructor() { }

  connect(username: string): void {
    this.username = username;

    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.wsBackendUrl),
      debug: (str) => console.log(str),
      // Configuration des heartbeats pour maintenir la connexion active
      heartbeatIncoming: 25000,
      heartbeatOutgoing: 25000,
      // Reconnexion automatique en cas de perte de connexion
      reconnectDelay: 5000,
      // Temps d'attente avant de considérer la connexion comme perdue
      connectionTimeout: 60000
    });

    this.client.onConnect = () => {
      console.log('Connecté au WebSocket');

      // S'abonner au canal public
      this.client.subscribe('/topic/public', (message: IMessage) => {
        console.log('Message reçu:', message.body);
        const chatMessage: ChatMessage = JSON.parse(message.body);
        console.log('Type de message:', chatMessage.type, 'Sender:', chatMessage.sender);
        
        // Filtrer les messages LEAVE dupliqués en utilisant un tampon temporel
        if (chatMessage.type === MessageType.LEAVE) {
          const sender = chatMessage.sender;
          const currentTime = new Date().getTime();
          
          // Vérifier si nous avons reçu un message LEAVE pour cet utilisateur récemment
          if (this.lastLeaveMessages.has(sender)) {
            const lastTime = this.lastLeaveMessages.get(sender)!;
            const timeDiff = currentTime - lastTime;
            
            // Si le dernier message LEAVE a été reçu il y a moins de 1 seconde, ignorer celui-ci
            if (timeDiff < 1000) {
              console.log(`Ignorer message LEAVE dupliqué pour ${sender}, reçu ${timeDiff}ms après le précédent`);
              return;
            }
          }
          
          // Enregistrer ce message LEAVE comme le plus récent pour cet utilisateur
          this.lastLeaveMessages.set(sender, currentTime);
          console.log(`Accepter message LEAVE pour ${sender}`);
        }
        
        const currentMessages = this.messagesSubject.value;
        this.messagesSubject.next([...currentMessages, chatMessage]);
      });

      // Envoyer un message JOIN
      this.sendMessage('', MessageType.JOIN);
    };

    this.client.onStompError = (frame) => {
      console.error('Erreur STOMP:', frame);
    };

    this.client.activate();
  }

  disconnect(): void {
    if (this.client && this.client.connected) {
      try {
        // Envoyer explicitement un message LEAVE avant de se déconnecter
        this.sendMessage('', MessageType.LEAVE);
        
        // Utiliser une promesse pour attendre un court instant avant de déconnecter
        // Cela donne le temps au message d'être envoyé sans bloquer l'interface utilisateur
        Promise.resolve().then(() => {
          // Désactiver le client après le prochain cycle de micro-tâches
          this.client.deactivate();
        });
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        // En cas d'erreur, déconnecter quand même
        this.client.deactivate();
      }
    } else if (this.client) {
      // Si le client n'est pas connecté, simplement désactiver
      this.client.deactivate();
    }
  }

  sendMessage(content: string, type: MessageType = MessageType.CHAT): void {
    if (!this.client || !this.client.connected) {
      console.error('Non connecté au serveur WebSocket');
      return;
    }

    const chatMessage: ChatMessage = {
      sender: this.username,
      content,
      type
    };

    this.client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(chatMessage)
    });
  }
}
