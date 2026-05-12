document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.local.get(['token', 'last_sync', 'rule_count', 'protection_enabled']);
  
  if (data.last_sync) {
    const date = new Date(data.last_sync);
    const lastSyncEl = document.getElementById('last-sync');
    if (lastSyncEl) lastSyncEl.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  if (data.rule_count) {
    const ruleCountEl = document.getElementById('rule-count');
    if (ruleCountEl) ruleCountEl.textContent = data.rule_count.toLocaleString();
  }

  const statusCard = document.getElementById('status-card');
  const authSection = document.getElementById('auth-section');

  if (data.token) {
    if (authSection) authSection.style.display = 'none';
    if (statusCard) statusCard.style.display = 'block';
  } else {
    if (statusCard) statusCard.style.display = 'none';
  }

  // Toggle Logic
  const toggle = document.getElementById('protection-toggle');
  const statusText = document.getElementById('status');

  if (toggle && statusText) {
    // Default to true if not set
    const isEnabled = data.protection_enabled !== false;
    toggle.checked = isEnabled;
    
    const updateStatusUI = (enabled) => {
      statusText.textContent = enabled ? 'Shield Enabled' : 'Shield Disabled';
      statusText.style.color = enabled ? 'var(--neon-blue)' : '#ef4444';
      statusText.classList.toggle('active', enabled);
    };

    updateStatusUI(isEnabled);

    toggle.addEventListener('change', async (e) => {
      const enabled = e.target.checked;
      await chrome.storage.local.set({ protection_enabled: enabled });
      updateStatusUI(enabled);
      
      // Notify background script
      chrome.runtime.sendMessage({ 
        action: 'toggle_protection', 
        enabled: enabled 
      });
    });
  }

  const connectBtn = document.getElementById('connect-btn');
  if (connectBtn) {
    connectBtn.addEventListener('click', async () => {
      const tokenInput = document.getElementById('token-input');
      const token = tokenInput ? tokenInput.value.trim() : '';
      if (!token) return;

      await chrome.storage.local.set({ token });
      chrome.runtime.sendMessage({ action: 'sync' });
      window.close();
    });
  }

  const dashboardLink = document.getElementById('dashboard-link');
  if (dashboardLink) {
    dashboardLink.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'http://localhost:3000/dashboard/tokens' });
    });
  }
});
