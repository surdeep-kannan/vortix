import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CheckoutComponent } from '../checkout/checkout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CheckoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('vortix-frontend');
}
