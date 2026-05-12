document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.local.get(['token', 'last_sync', 'rule_count', 'protection_enabled']);
  
  const statusCard = document.getElementById('status-card');
  const authSection = document.getElementById('auth-section');
  const syncIndicator = document.getElementById('sync-indicator');

  // Handle Initial State
  if (data.token) {
    if (authSection) authSection.style.display = 'none';
    if (statusCard) statusCard.style.display = 'block';
    if (syncIndicator) syncIndicator.style.display = 'block';
  } else {
    if (statusCard) statusCard.style.display = 'none';
    if (authSection) authSection.style.display = 'block';
    if (syncIndicator) syncIndicator.style.display = 'none';
  }

  // Sync Stats
  if (data.last_sync) {
    const date = new Date(data.last_sync);
    const lastSyncEl = document.getElementById('last-sync');
    if (lastSyncEl) lastSyncEl.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  if (data.rule_count !== undefined) {
    const ruleCountEl = document.getElementById('rule-count');
    if (ruleCountEl) ruleCountEl.textContent = data.rule_count.toLocaleString();
  }


  // Toggle Logic
  const toggleBtn = document.getElementById('protection-toggle-btn');
  const statusValue = document.getElementById('status-value');

  if (toggleBtn && statusValue) {
    let isEnabled = data.protection_enabled !== false;
    
    const updateUI = (enabled) => {
      if (enabled) {
        toggleBtn.classList.add('active');
        toggleBtn.classList.add('pulse-active');
        statusValue.textContent = 'Shield Active';
        statusValue.classList.add('active');
      } else {
        toggleBtn.classList.remove('active');
        toggleBtn.classList.remove('pulse-active');
        statusValue.textContent = 'Shield Inactive';
        statusValue.classList.remove('active');
      }
    };


    updateUI(isEnabled);

    toggleBtn.addEventListener('click', async () => {
      isEnabled = !isEnabled;
      await chrome.storage.local.set({ protection_enabled: isEnabled });
      updateUI(isEnabled);
      
      // Notify background script
      chrome.runtime.sendMessage({ 
        action: 'toggle_protection', 
        enabled: isEnabled 
      });
    });
  }

  // Connect Logic
  const connectBtn = document.getElementById('connect-btn');
  if (connectBtn) {
    connectBtn.addEventListener('click', async () => {
      const tokenInput = document.getElementById('token-input');
      const token = tokenInput ? tokenInput.value.trim() : '';
      if (!token) return;

      await chrome.storage.local.set({ token });
      chrome.runtime.sendMessage({ action: 'sync' });
      
      // Visual feedback before closing
      connectBtn.textContent = 'Connecting...';
      connectBtn.style.background = '#10b981';
      
      setTimeout(() => {
        window.close();
      }, 500);
    });
  }

  const dashboardLink = document.getElementById('dashboard-link');
  if (dashboardLink) {
    dashboardLink.addEventListener('click', (e) => {
      e.preventDefault();
      // Use the actual domain or fallback to localhost
      chrome.tabs.create({ url: 'http://localhost:3000/dashboard/tokens' });
    });
  }
});

