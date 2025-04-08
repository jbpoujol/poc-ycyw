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

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
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
}
