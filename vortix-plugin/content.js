const VORTIX_MOCK_CARDS = [
  { id: 'pp', name: 'PayPal Balance', last4: 'BAL', icon: 'PP', status: 'Insufficient Funds', balance: 5000.00, successRate: 0 },
  { id: 'c3', name: 'Credit Union 1', last4: '8328', icon: 'BANK', status: 'Congested', balance: 10.00, successRate: 45 },
  { id: 'c4', name: 'Amex', last4: '6753', icon: 'AMEX', status: 'Stable', balance: 500.00, successRate: 92 },
  { id: 'c1', name: 'Visa', last4: '4550', icon: 'VISA', status: 'Recommended', balance: 150.00, successRate: 99 }
];

const VORTIX_STORAGE_KEY = 'vortix_user_data';

async function getUserData() {
  return new Promise((resolve) => {
    chrome.storage.local.get([VORTIX_STORAGE_KEY], (result) => {
      resolve(result[VORTIX_STORAGE_KEY] || null);
    });
  });
}

async function saveUserData(data) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [VORTIX_STORAGE_KEY]: data }, () => {
      resolve();
    });
  });
}

function initVortix() {
  const root = document.createElement('div');
  root.id = 'vortix-root';
  const shadow = root.attachShadow({ mode: 'open' });

  // Styles
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('styles.css');
  shadow.appendChild(link);

  // Container
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="plugin-trigger" id="v-trigger">
      <div class="orb mini"></div>
      <span class="trigger-text">VORTIX</span>
    </div>

    <div class="plugin-sidebar" id="v-sidebar">
      <div class="plugin-header">
        <div class="header-left">
          <div class="orb"></div>
          <div class="title">VORTIX PRO <span class="badge">PLUGIN</span></div>
        </div>
        <button class="close-btn" id="v-close">×</button>
      </div>
      
      <div class="plugin-content" id="v-content">
        <!-- Dynamic Content -->
      </div>

      <div class="plugin-footer">
        VORTIX INTELLIGENCE NODE v2.4
      </div>
    </div>
  `;
  shadow.appendChild(container);

  document.body.appendChild(root);

  // Elements
  const trigger = shadow.getElementById('v-trigger');
  const sidebar = shadow.getElementById('v-sidebar');
  const closeBtn = shadow.getElementById('v-close');
  const content = shadow.getElementById('v-content');

  let isOpen = false;

  trigger.addEventListener('click', async () => {
    isOpen = true;
    sidebar.classList.add('open');
    trigger.style.display = 'none';

    const userData = await getUserData();
    if (!userData) {
      showOnboarding();
    } else if (!userData.card) {
      showCardEntry(userData);
    } else {
      showMainAssistant(userData);
    }
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    sidebar.classList.remove('open');
    trigger.style.display = 'flex';
  });

  function showOnboarding() {
    content.innerHTML = `
      <div class="view-onboarding">
        <div class="section-title">USER ONBOARDING</div>
        <p class="onboarding-desc">Welcome to VORTIX. Let's setup your secure intelligence node.</p>
        <div class="input-group">
          <label>Full Name</label>
          <input type="text" id="v-name" placeholder="John Doe">
        </div>
        <div class="input-group">
          <label>Email Address</label>
          <input type="email" id="v-email" placeholder="john@example.com">
        </div>
        <button class="action-btn" id="v-next">CONTINUE</button>
      </div>
    `;

    shadow.getElementById('v-next').onclick = async () => {
      const name = shadow.getElementById('v-name').value;
      const email = shadow.getElementById('v-email').value;
      if (name && email) {
        const data = { name, email };
        await saveUserData(data);
        showCardEntry(data);
      }
    };
  }

  function showCardEntry(userData) {
    content.innerHTML = `
      <div class="view-card-entry">
        <div class="section-title">SECURE TOKENIZATION</div>
        <div class="rbi-notice">
          <strong>RBI COMPLIANCE NOTICE:</strong>
          VORTIX uses Card-on-File Tokenization (CoFT) for enhanced security. Your actual card details are never stored directly on merchants. We tokenize these via authorized networks to be stored in VORTIX Blockchain Ledger.
        </div>
        <div class="input-group">
          <label>Card Number</label>
          <input type="text" id="v-card-num" placeholder="XXXX XXXX XXXX XXXX">
        </div>
        <div class="row">
          <div class="input-group">
            <label>Expiry</label>
            <input type="text" id="v-expiry" placeholder="MM/YY">
          </div>
          <div class="input-group">
            <label>CVV</label>
            <input type="password" id="v-cvv" placeholder="***">
          </div>
        </div>
        <button class="action-btn" id="v-tokenize">TOKENIZE & SAVE</button>
      </div>
    `;

    shadow.getElementById('v-tokenize').onclick = async () => {
      const cardNum = shadow.getElementById('v-card-num').value;
      if (cardNum.length > 4) {
        userData.card = {
          last4: cardNum.slice(-4),
          type: 'Visa', // Mock detection
          token: 'VORTIX_' + Math.random().toString(36).substr(2, 9).toUpperCase()
        };
        await saveUserData(userData);
        showMainAssistant(userData);
      }
    };
  }

  function showMainAssistant(userData) {
    content.innerHTML = `
      <div class="analysis-text" id="v-scanner">
        <div class="scanner-line"></div>
        Analyzing Network Nodes for ${userData.name.split(' ')[0]}...
        <span class="blinking-cursor">|</span>
      </div>
    `;

    setTimeout(() => {
      const recommended = { name: userData.card.type, last4: userData.card.last4, balance: 1250, successRate: 98, icon: 'VISA' };
      content.innerHTML = `
        <div class="recommendation">
          <div class="section-title">OPTIMAL ROUTE</div>
          <div class="card-item glow">
            <div class="card-icon">${recommended.icon}</div>
            <div class="card-details">
              <div class="card-name">${recommended.name} •••• ${recommended.last4}</div>
              <div class="card-stats">
                <span class="stat success">🚀 ${recommended.successRate}% Uptime</span>
                <span class="stat balance">💰 $${recommended.balance}</span>
              </div>
            </div>
          </div>

          <div class="reason">
             "Hello ${userData.name.split(' ')[0]}, your tokenized ${recommended.name} is the clear winner for this session. Low latency routing detected via RBI-compliant nodes."
          </div>

          <div class="comparison-view">
            <div class="section-title">TOKENIZED VAULT</div>
            <div class="comp-row active">
              <div class="comp-left">
                <span class="dot green"></span>
                <span class="comp-name">${recommended.name} (${recommended.last4})</span>
              </div>
              <span class="comp-balance">TOKENIZED</span>
            </div>
          </div>

          <div class="plugin-actions">
            <button class="action-btn" id="v-pay">PAY VIA TOKENIZED GATEWAY</button>
            <div class="action-hint">One-click secure checkout active</div>
          </div>
        </div>
      `;
    }, 2000);
  }
}

// Only init if we are on a checkout page or localhost demo
if (window.location.href.includes('checkout') || window.location.hostname === 'localhost') {
  initVortix();
}
