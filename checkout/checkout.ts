import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistantComponent } from '../app/assistant/assistant.component';

declare var paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, AssistantComponent],
  template: `
    <div class="container">
      <h1>VORTIX Payment Demo</h1>
      
      <div class="main-layout">
        <!-- Saved Cards Section -->
        <div class="saved-cards">
          <h3>My Wallet</h3>
          <div class="card-list">
            <div *ngFor="let card of savedCards" 
                 class="wallet-card" 
                 (click)="onAutoPay(card)"
                 [class.selected]="selectedCard?.id === card.id">
              <div class="card-icon">{{ card.icon }}</div>
              <div class="card-info">
                <div class="card-type">{{ card.name }} •••• {{ card.last4 }}</div>
                <div class="card-balance" [class.low]="card.balance < 10">
                  Balance: \${{ card.balance }}
                </div>
              </div>
              <div class="status-dot" [ngClass]="getTrafficColor(card.trafficLevel)"></div>
            </div>
          </div>
        </div>

        <!-- Payment Terminal -->
        <div class="terminal-card">
          <h3>Total: $10.00</h3>
          <p>Global Route via PayPal Sandbox</p>
          
          <div #paypalRef></div>

          <h3 *ngIf="paidFor" style="color: #00ff88; margin-top: 20px;">
            ✅ Payment Successful! <br>
            <small>Transaction ID: {{ transactionId }}</small>
          </h3>

          <h3 *ngIf="failed" style="color: #ff4444; margin-top: 20px;">
            ❌ Payment Failed! <br>
            <small>VORTIX is rerouting...</small>
          </h3>
        </div>
      </div>

      <app-assistant (autoPayTriggered)="onAutoPay($event)"></app-assistant>
    </div>
  `,
  styles: [`
    .container { padding: 50px; font-family: 'Inter', sans-serif; background: #f5f7fa; min-height: 100vh; }
    .main-layout { display: flex; justify-content: center; gap: 40px; margin-top: 30px; }
    
    .saved-cards { width: 300px; text-align: left; }
    .wallet-card { 
      background: white; padding: 15px; margin-bottom: 10px; border-radius: 12px;
      display: flex; align-items: center; gap: 15px; cursor: pointer;
      border: 2px solid transparent; transition: all 0.2s;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    .wallet-card.selected { border-color: #00f2fe; background: #f0fbff; transform: scale(1.02); }
    
    .card-icon { font-size: 24px; font-weight: bold; color: #333; }
    .card-info { flex: 1; }
    .card-type { font-weight: 600; font-size: 14px; color: #333; }
    .card-balance { font-size: 12px; color: #666; margin-top: 2px; }
    .card-balance.low { color: #ff4444; }
    
    .status-dot { width: 8px; height: 8px; border-radius: 50%; }
    .dot-green { background: #00ff88; }
    .dot-yellow { background: #ffcc00; }
    .dot-red { background: #ff4444; }

    .terminal-card { 
      border: 1px solid #ddd; padding: 30px; width: 350px; border-radius: 10px; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.1); background: white; position: relative;
    }
    
    .processing-overlay {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(255,255,255,0.9); border-radius: 10px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      z-index: 10;
    }
    .v-spinner {
      width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #00f2fe;
      border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 15px;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    
    h1 { color: #333; }
  `]
})
export class CheckoutComponent implements OnInit {
  @ViewChild('paypalRef', { static: true }) paypalRef!: ElementRef;

  paidFor = false;
  failed = false;
  isProcessing = false;
  transactionId = "";
  selectedCard: any = null;

  // Synced with Assistant Data
  savedCards = [
    { id: 'pp', name: 'PayPal Balance', last4: 'BAL', icon: 'PP', trafficLevel: 'High', balance: 5000.00, details: { number: 'N/A', expiry: 'N/A', cvv: 'N/A' } },
    { id: 'c3', name: 'Credit Union 1', last4: '8328', icon: 'BANK', trafficLevel: 'High', balance: 10.00, details: { number: '8328832883288328', expiry: '02/31', cvv: '123' } },
    { id: 'c4', name: 'Amex', last4: '6753', icon: 'AMEX', trafficLevel: 'Medium', balance: 500.00, details: { number: '349264624206753', expiry: '02/31', cvv: '123' } },
    { id: 'c1', name: 'Visa', last4: '4550', icon: 'VISA', trafficLevel: 'Low', balance: 150.00, details: { email: 'sb-ofldt48580358@personal.example.com', number: '4032039262924550', expiry: '02/31', cvv: '123' } }
  ];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (typeof paypal === 'undefined') {
      console.error("PayPal SDK not loaded.");
      return;
    }
    // PayPal button rendering
    setTimeout(() => this.renderPayPal(), 0);
  }

  renderPayPal() {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => actions.order.create({
        purchase_units: [{ description: 'VORTIX Hackathon', amount: { currency_code: 'USD', value: '10.00' } }]
      }),
      onApprove: async (data: any, actions: any) => {
        const order = await actions.order.capture();
        this.completePayment(order.id);
      },
      onError: (err: any) => { console.error(err); this.failed = true; this.cdr.detectChanges(); }
    }).render(this.paypalRef.nativeElement);
  }

  onAutoPay(card: any) {
    this.selectAndFill(card);
  }

  selectAndFill(card: any) {
    if (this.paidFor) return;
    this.selectedCard = card;
    console.log("VORTIX Card Selected:", card.name);
    this.cdr.detectChanges();
  }

  completePayment(id: string) {
    this.paidFor = true;
    this.transactionId = id;
    this.cdr.detectChanges();
  }

  getTrafficColor(level: string) {
    if (level === 'Low') return 'dot-green';
    if (level === 'Medium') return 'dot-yellow';
    return 'dot-red';
  }
}