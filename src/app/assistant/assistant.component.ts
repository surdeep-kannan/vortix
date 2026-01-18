import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PaymentMethod {
  id: string;
  name: string;
  last4: string;
  icon: string;
  trafficLevel: 'Low' | 'Medium' | 'High';
  successRate: number;
  balance: number;
  status: 'Recommended' | 'Stable' | 'Congested' | 'Insufficient Funds';
}

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Floating Plugin Trigger -->
    <div class="plugin-trigger" *ngIf="!isOpen" (click)="togglePlugin()">
      <div class="orb mini"></div>
      <span class="trigger-text">VORTIX</span>
    </div>

    <!-- Plugin Sidebar -->
    <div class="plugin-sidebar" [class.open]="isOpen">
      <div class="plugin-header">
        <div class="header-left">
          <div class="orb"></div>
          <div class="title">VORTIX PRO <span class="badge">PLUGIN</span></div>
        </div>
        <button class="close-btn" (click)="togglePlugin()">×</button>
      </div>
      
      <div class="plugin-content">
        <div class="analysis-text" *ngIf="scanning">
          <div class="scanner-line"></div>
          Analyzing Network Nodes...
          <span class="blinking-cursor">|</span>
        </div>

        <div class="recommendation" *ngIf="!scanning && recommendedCard">
          <div class="section-title">OPTIMAL ROUTE</div>
          <div class="card-item glow">
            <div class="card-icon">{{ recommendedCard.icon }}</div>
            <div class="card-details">
              <div class="card-name">{{ recommendedCard.name }} •••• {{ recommendedCard.last4 }}</div>
              <div class="card-stats">
                <span class="stat success">🚀 {{ recommendedCard.successRate }}% Uptime</span>
                <span class="stat balance">💰 \${{ recommendedCard.balance }}</span>
              </div>
            </div>
          </div>

          <div class="reason">
             "{{ recommendedCard.name }} is the clear winner for this session. Low latency routing detected."
          </div>

          <div class="comparison-view">
            <div class="section-title">WALLET AUDIT</div>
            <div class="comp-row" *ngFor="let card of mockCards" [class.active]="card.id === recommendedCard.id">
              <div class="comp-left">
                <span class="dot" [ngClass]="getDotClass(card)"></span>
                <span class="comp-name">{{ card.name }}</span>
              </div>
              <span class="comp-balance">\${{ card.balance }}</span>
            </div>
          </div>

          <div class="plugin-actions">
            <button class="action-btn primary">SELECT OPTIMAL ROUTE</button>
            <div class="action-hint">Click to confirm selection in PayPal</div>
          </div>
        </div>
      </div>

      <div class="plugin-footer">
        VORTIX INTELLIGENCE NODE v2.4
      </div>
    </div>
  `,
  styles: [`
    .plugin-trigger {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border: 1px solid rgba(0, 242, 254, 0.4);
      border-radius: 30px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0, 242, 254, 0.2);
      z-index: 9999;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .plugin-trigger:hover { transform: scale(1.05); box-shadow: 0 8px 30px rgba(0, 242, 254, 0.4); }

    .plugin-sidebar {
      position: fixed;
      top: 0;
      right: -400px;
      width: 360px;
      height: 100vh;
      background: rgba(10, 10, 15, 0.98);
      backdrop-filter: blur(25px);
      border-left: 1px solid rgba(0, 242, 254, 0.2);
      box-shadow: -10px 0 50px rgba(0, 0, 0, 0.5);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .plugin-sidebar.open { right: 0; }

    .plugin-header {
      padding: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-left { display: flex; align-items: center; gap: 12px; }
    .title { font-size: 14px; font-weight: 800; color: #fff; letter-spacing: 1px; }
    .badge { font-size: 9px; background: #00f2fe; color: #000; padding: 2px 6px; border-radius: 4px; vertical-align: middle; margin-left: 4px; }
    .close-btn { background: none; border: none; color: #666; font-size: 24px; cursor: pointer; transition: color 0.2s; }
    .close-btn:hover { color: #fff; }

    .plugin-content { flex: 1; overflow-y: auto; padding: 24px; }
    
    .section-title { font-size: 10px; font-weight: 700; color: #00f2fe; letter-spacing: 2px; margin-bottom: 16px; text-transform: uppercase; }

    .orb { width: 14px; height: 14px; background: radial-gradient(circle at 30% 30%, #4facfe, #00f2fe); border-radius: 50%; box-shadow: 0 0 10px #00f2fe; animation: pulse 2s infinite; }
    .orb.mini { width: 10px; height: 10px; }
    @keyframes pulse { 0% { box-shadow: 0 0 5px #00f2fe; scale: 1; } 50% { box-shadow: 0 0 15px #00f2fe; scale: 1.1; } 100% { box-shadow: 0 0 5px #00f2fe; scale: 1; } }

    .card-item { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(0, 242, 254, 0.1); border-radius: 12px; padding: 16px; margin-bottom: 20px; }
    .card-item.glow { border-color: rgba(0, 242, 254, 0.4); box-shadow: 0 0 20px rgba(0, 242, 254, 0.1); }
    .card-details { margin-top: 8px; }
    .card-name { font-size: 14px; color: #fff; font-weight: 600; }
    .card-stats { display: flex; gap: 16px; font-size: 11px; margin-top: 6px; }
    .stat.success { color: #00ff88; }
    .stat.balance { color: #f0ad4e; }

    .reason { font-size: 12px; color: #94a3b8; line-height: 1.6; font-style: italic; background: rgba(0,0,0,0.2); border-left: 2px solid #00f2fe; padding: 12px; border-radius: 0 8px 8px 0; margin-bottom: 24px; }

    .comparison-view { margin-bottom: 30px; }
    .comp-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.03); }
    .comp-row.active { background: rgba(0, 242, 254, 0.05); margin: 0 -24px; padding: 10px 24px; }
    .comp-left { display: flex; align-items: center; gap: 10px; }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: #475569; }
    .dot.green { background: #00ff88; box-shadow: 0 0 8px #00ff88; }
    .dot.yellow { background: #f0ad4e; }
    .dot.red { background: #ff4444; }
    .comp-name { font-size: 12px; color: #94a3b8; }
    .comp-balance { font-size: 12px; font-weight: 600; color: #fff; }

    .plugin-actions { margin-top: auto; }
    .action-btn { width: 100%; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; }
    .action-btn.primary { background: #00f2fe; color: #000; box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3); }
    .action-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
    .action-hint { font-size: 10px; color: #475569; text-align: center; margin-top: 8px; }

    .plugin-footer { padding: 20px; text-align: center; font-size: 9px; color: #334155; border-top: 1px solid rgba(255, 255, 255, 0.03); letter-spacing: 2px; }

    .analysis-text { color: #94a3b8; font-size: 13px; display: flex; flex-direction: column; align-items: center; gap: 16px; margin-top: 100px; }
    .scanner-line { width: 40px; height: 1px; background: #00f2fe; box-shadow: 0 0 10px #00f2fe; animation: scan 2s infinite cubic-bezier(0.4, 0, 0.2, 1); }
    @keyframes scan { 0% { transform: scaleX(1); opacity: 0; } 50% { transform: scaleX(3); opacity: 1; } 100% { transform: scaleX(1); opacity: 0; } }

    .blinking-cursor { animation: blink 1s step-end infinite; }
    @keyframes blink { 50% { opacity: 0; } }
  `]
})
export class AssistantComponent implements OnInit {
  @Output() autoPayTriggered = new EventEmitter<PaymentMethod>();

  isOpen = false;
  scanning = true;
  recommendedCard: PaymentMethod | null = null;
  transactionAmount = 10.00; // Hardcoded for this demo

  // Mock Data from User Image
  mockCards: PaymentMethod[] = [
    { id: 'pp', name: 'PayPal Balance', last4: 'BAL', icon: 'PP', trafficLevel: 'High', successRate: 0, balance: 5000.00, status: 'Insufficient Funds' },
    { id: 'c3', name: 'Credit Union 1', last4: '8328', icon: 'BANK', trafficLevel: 'High', successRate: 45, balance: 10.00, status: 'Congested' },
    { id: 'c4', name: 'Amex', last4: '6753', icon: 'AMEX', trafficLevel: 'Medium', successRate: 92, balance: 500.00, status: 'Stable' },
    { id: 'c1', name: 'Visa', last4: '4550', icon: 'VISA', trafficLevel: 'Low', successRate: 99, balance: 150.00, status: 'Recommended' }
  ];

  ngOnInit() {
    // Initial delay to simulate "loading" when plugin opened
  }

  togglePlugin() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.scanning) {
      setTimeout(() => this.analyzeAndDecide(), 2500);
    }
  }

  analyzeAndDecide() {
    this.scanning = false;
    const validCards = this.mockCards.filter(c => c.status !== 'Insufficient Funds' && c.balance >= this.transactionAmount);
    if (validCards.length > 0) {
      this.recommendedCard = validCards.sort((a, b) => b.successRate - a.successRate)[0];
    }
  }

  getDotClass(card: PaymentMethod) {
    if (card.status === 'Recommended') return 'green';
    if (card.status === 'Stable') return 'yellow';
    if (card.status === 'Congested') return 'red';
    return '';
  }
}
