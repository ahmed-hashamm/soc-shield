/**
 * SOC Browser Shield — Background Service Worker
 * 
 * Responsibilities:
 * 1. Synchronize threat intelligence (Snapshot API)
 * 2. Maintain Bloom Filter for zero-latency blocking
 * 3. Perform live API checks for cache misses
 * 4. Manage extension identity (JWT)
 */

const CONFIG = {
  API_BASE_URL: 'http://localhost:3000', // Update for production
  SYNC_ALARM_NAME: 'sync_threat_feeds',
  SYNC_INTERVAL_MINUTES: 360, // 6 hours
};

// ─── IDENTITY MANAGEMENT ───

async function getIdentity() {
  const data = await chrome.storage.local.get(['token', 'extension_id']);
  return data;
}

// ─── THREAT INTELLIGENCE SYNC ───

async function syncThreatFeeds() {
  const identity = await getIdentity();
  if (!identity.token) {
    console.warn('[Sync] No token found. Skipping sync.');
    return;
  }

  console.log('[Sync] Fetching latest snapshot...');
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/snapshot`, {
      headers: {
        'Authorization': `Bearer ${identity.token}`,
      }
    });

    if (!response.ok) throw new Error(`Sync failed: ${response.statusText}`);

    const snapshot = await response.json();
    
    // 1. Clear existing dynamic rules
    const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
    const oldRuleIds = oldRules.map(r => r.id);
    
    // 2. Map snapshot entries to DNR rules
    // Note: id must be >= 1. We'll use index + 1000 for dynamic rules
    const newRules = snapshot.entries.slice(0, 5000).map((entry, index) => ({
      id: index + 1000,
      priority: 1,
      action: { 
        type: 'redirect',
        redirect: { extensionPath: '/blocked/blocked.html' }
      },
      condition: {
        urlFilter: entry.value,
        resourceTypes: ['main_frame']
      }
    }));

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: oldRuleIds,
      addRules: newRules
    });

    await chrome.storage.local.set({ 
      last_sync: new Date().toISOString(),
      rule_count: snapshot.entries.length 
    });
  } catch (err) {
    console.error('[Sync] Error:', err);
  }
}

// ─── EVENT LISTENERS ───

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Init] SOC Browser Shield Installed.');
  
  // Set up sync alarm
  chrome.alarms.create(CONFIG.SYNC_ALARM_NAME, {
    periodInMinutes: CONFIG.SYNC_INTERVAL_MINUTES
  });

  // Initial sync
  syncThreatFeeds();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === CONFIG.SYNC_ALARM_NAME) {
    syncThreatFeeds();
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'sync') {
    syncThreatFeeds();
  } else if (request.action === 'toggle_protection') {
    if (request.enabled) {
      console.log('[Toggle] Protection enabled. Restoring threat feeds.');
      syncThreatFeeds();
    } else {
      console.log('[Toggle] Protection disabled. Clearing DNR rules.');
      // Remove all dynamic rules
      const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
      const oldRuleIds = oldRules.map(r => r.id);
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: oldRuleIds
      });
      // Optionally clear storage stats to reflect empty state, but keeping them is fine.
    }
  }
});

// ─── LIVE CHECK LOGIC (STUB) ───
if (chrome.webNavigation) {
  chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    if (details.frameId !== 0) return; // Only main frame

    const url = new URL(details.url);
    const hostname = url.hostname;

    // Skip internal/extension/browser pages
    if (
      hostname === 'localhost' || 
      details.url.startsWith('chrome-extension://') ||
      details.url.startsWith('chrome://') ||
      details.url.startsWith('about:') ||
      details.url.startsWith('edge://') ||
      details.url.startsWith('file://')
    ) {
      return;
    }

    // Store the URL for this tab ID so blocked.js can recover it if DNR blocks the request
    await chrome.storage.local.set({ [`last_url_${details.tabId}`]: details.url });

    // Check if protection is disabled
    const data = await chrome.storage.local.get(['token', 'protection_enabled']);
    if (data.protection_enabled === false) return; // Skip if explicitly turned off
    
    if (!data.token) return;

    // Perform live check for instant policy enforcement
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/check`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hostname, request_type: 'main_frame' })
      });
      const result = await response.json();
      
      if (result.decision === 'blocked') {
        chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL(`blocked/blocked.html?url=${encodeURIComponent(details.url)}`) });
      }
    } catch (err) {
      console.error('[Check] Failed:', err);
    }
  });
}
