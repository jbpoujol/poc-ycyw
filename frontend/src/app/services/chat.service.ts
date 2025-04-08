import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { ChatMessage, MessageType } from '../models/chat-message.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private client: Client;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  private username: string;

  constructor() { }

  connect(username: string): void {
    this.username = username;

    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.wsBackendUrl),
      debug: (str) => console.log(str)
    });

    this.client.onConnect = () => {
      console.log('Connecté au WebSocket');

      // S'abonner au canal public
      this.client.subscribe('/topic/public', (message: IMessage) => {
        const chatMessage: ChatMessage = JSON.parse(message.body);
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
    if (this.client) {
      this.sendMessage('', MessageType.LEAVE);
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
