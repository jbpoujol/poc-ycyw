import { Component } from '@angular/core';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatComponent],
  template: `
    <div class="p-3">
      <div class="flex justify-content-center">
        <div class="w-full">
          <h1 class="text-center text-3xl mb-3">YCYW Chat</h1>
          <app-chat></app-chat>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'YCYW Chat';
}
