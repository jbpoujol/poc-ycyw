import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatMessage, MessageType } from '../../models/chat-message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit, OnDestroy {
  username: string = '';
  message: string = '';
  messages: ChatMessage[] = [];
  isConnected: boolean = false;
  
  // Map pour suivre les utilisateurs qui ont quitté le chat
  private usersWhoLeft: Map<string, boolean> = new Map();

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.messages$.subscribe(messages => {
      // Filtrer les messages pour éviter les doublons de type LEAVE
      this.messages = this.filterDuplicateLeaveMessages(messages);
    });
  }
  
  // Méthode pour filtrer les messages de type LEAVE dupliqués
  private filterDuplicateLeaveMessages(messages: ChatMessage[]): ChatMessage[] {
    // Réinitialiser la map des utilisateurs qui ont quitté
    this.usersWhoLeft.clear();
    
    // Filtrer les messages pour ne garder qu'un seul message LEAVE par utilisateur
    return messages.filter(msg => {
      if (msg.type !== MessageType.LEAVE) {
        return true; // Garder tous les messages qui ne sont pas de type LEAVE
      }
      
      // Pour les messages LEAVE, vérifier si on a déjà vu cet utilisateur
      if (this.usersWhoLeft.has(msg.sender)) {
        return false; // Ignorer ce message car on a déjà un message LEAVE pour cet utilisateur
      }
      
      // Marquer cet utilisateur comme ayant quitté
      this.usersWhoLeft.set(msg.sender, true);
      return true; // Garder ce message
    });
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  connect(): void {
    if (this.username.trim()) {
      this.chatService.connect(this.username);
      this.isConnected = true;
    }
  }

  disconnect(): void {
    if (this.isConnected) {
      this.chatService.disconnect();
      this.isConnected = false;
    }
  }

  sendMessage(): void {
    if (this.message.trim() && this.isConnected) {
      this.chatService.sendMessage(this.message);
      this.message = '';
    }
  }

  getMessageClass(message: ChatMessage): string {
    if (message.type === MessageType.JOIN || message.type === MessageType.LEAVE) {
      return 'event-message';
    }
    return message.sender === this.username ? 'my-message' : 'other-message';
  }
  
  // Méthode pour déterminer si c'est le premier message LEAVE pour un utilisateur
  isFirstLeaveMessage(message: ChatMessage): boolean {
    if (message.type !== MessageType.LEAVE) {
      return true; // Ce n'est pas un message LEAVE, donc on l'affiche
    }
    
    // Trouver l'index du message actuel
    const currentIndex = this.messages.findIndex(msg => msg === message);
    if (currentIndex === -1) {
      return true; // Message non trouvé dans la liste (ne devrait pas arriver)
    }
    
    // Vérifier s'il y a un message LEAVE précédent pour le même utilisateur
    for (let i = 0; i < currentIndex; i++) {
      const msg = this.messages[i];
      if (msg.type === MessageType.LEAVE && msg.sender === message.sender) {
        // Un message LEAVE précédent existe pour cet utilisateur
        return false;
      }
    }
    
    // C'est le premier message LEAVE pour cet utilisateur
    return true;
  }
}
