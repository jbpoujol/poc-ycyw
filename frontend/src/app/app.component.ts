import { Component } from '@angular/core';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatComponent],
  template: `
    <div class="container mt-3">
      <div class="row">
        <div class="col-md-12">
          <h1 class="text-center">YCYW Chat</h1>
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
