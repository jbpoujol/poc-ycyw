import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
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
