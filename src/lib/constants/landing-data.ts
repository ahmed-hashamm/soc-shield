export const features = [
  {
    icon: "⚡",
    title: "Bloom Filter Engine",
    desc: "Sub-2 ms checks against millions of known-malicious indicators using an in-memory probabilistic data structure rebuilt every 6 hours.",
  },
  {
    icon: "🌍",
    title: "Global Threat Intel",
    desc: "Automated ingestion from CISA KEV, Abuse.ch URLhaus, Firehol Level 1, and Emerging Threats — updated nightly, zero manual effort.",
  },
  {
    icon: "🔒",
    title: "SHA-256 Privacy",
    desc: "Every hostname is cryptographically hashed before logging. We never see, store, or transmit your browsing history in plain text.",
  },
  {
    icon: "🛡️",
    title: "declarativeNetRequest",
    desc: "Critical rules execute at the browser network layer via Chrome's native API — blocking happens before the page even starts loading.",
  },
  {
    icon: "📊",
    title: "Live Dashboard",
    desc: "Real-time incident feed, threat category breakdowns, latency metrics, and feed health monitoring from your personal SOC dashboard.",
  },
  {
    icon: "🔑",
    title: "Multi-Tenant Isolation",
    desc: "Row-level security ensures every user sees only their own data. Personal allow/block lists layer on top of global intelligence.",
  },
];

export const steps = [
  {
    step: "01",
    title: "Browser intercepts request",
    desc: "The Chrome extension hooks into every outbound navigation using declarativeNetRequest (static rules) and the webRequest API (dynamic checks).",
  },
  {
    step: "02",
    title: "Local Bloom filter check",
    desc: "An in-memory Bloom filter containing millions of threat indicators returns a result in under 2 ms. Known threats are blocked instantly.",
  },
  {
    step: "03",
    title: "Cache lookup",
    desc: "If the Bloom filter misses, chrome.storage.local is checked for a cached decision. Cache hits resolve in under 5 ms with no network call.",
  },
  {
    step: "04",
    title: "API reputation check",
    desc: "On cache miss, the extension calls /api/check — which evaluates personal lists, global feeds, and optionally AbuseIPDB.",
  },
  {
    step: "05",
    title: "Incident logged & cached",
    desc: "The decision is cached locally (up to 24h) and asynchronously logged to your dashboard with SHA-256 hashed hostnames.",
  },
];

export const feeds = [
  {
    name: "Abuse.ch URLhaus",
    type: "Malware Distribution",
    format: "Plain Text",
    desc: "Active malware distribution URLs and domains tracked by the security research community.",
  },
  {
    name: "Firehol Level 1",
    type: "Malicious IPs",
    format: "CIDR Netset",
    desc: "Highest-confidence aggregated IP blocklist — the most dangerous addresses on the internet.",
  },
  {
    name: "Emerging Threats",
    type: "IDS Confirmed",
    format: "IP List",
    desc: "IPs confirmed as threats by intrusion detection systems across global honeypot networks.",
  },
  {
    name: "CISA KEV",
    type: "Gov Confirmed",
    format: "JSON",
    desc: "Known Exploited Vulnerabilities catalog — government-verified actively exploited infrastructure.",
  },
];

export const trustSignals = [
  "100% Open Source",
  "Zero browsing data stored",
  "< 2 ms latency"
];
