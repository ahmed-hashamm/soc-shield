document.addEventListener('DOMContentLoaded', () => {
  // Extract URL if provided by Live Check
  const urlParams = new URLSearchParams(window.location.search);
  let blockedUrl = urlParams.get('url');

  const updateUI = (url) => {
    if (url) {
      try {
        const urlObj = new URL(url);
        document.getElementById('hostname-box').textContent = urlObj.hostname;
      } catch (e) {
        document.getElementById('hostname-box').textContent = url;
      }
    } else {
      document.getElementById('hostname-box').textContent = "Restricted Domain (DNR Block)";
    }
  };

  const logIncident = (url) => {
    chrome.storage.local.get(['token'], (data) => {
      if (!data.token) return;
      
      try {
        const urlObj = new URL(url);
        fetch('http://localhost:3000/api/incidents/log', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${data.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            hostname: urlObj.hostname,
            source: 'static_rules',
            decision: 'blocked'
          })
        }).catch(err => console.error('Log failed:', err));
      } catch (e) {
        // invalid URL format, ignore
      }
    });
  };

  if (blockedUrl) {
    updateUI(blockedUrl);
  } else {
    // Try to recover from storage (DNR blocks)
    chrome.tabs.getCurrent((tab) => {
      if (tab && tab.id) {
        chrome.storage.local.get([`last_url_${tab.id}`], (data) => {
          blockedUrl = data[`last_url_${tab.id}`];
          updateUI(blockedUrl);
          if (blockedUrl) {
            logIncident(blockedUrl);
          }
        });
      } else {
        updateUI(null);
      }
    });
  }

  // Safety Button: Go back or close tab
  const safetyBtn = document.getElementById('safety-btn');
  if (safetyBtn) {
    safetyBtn.addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'https://www.google.com';
      }
    });
  }

  // Proceed Button: Show instructional toast
  const proceedBtn = document.getElementById('proceed-btn');
  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      const toast = document.getElementById('toast');
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 4000);
      }
    });
  }
});
