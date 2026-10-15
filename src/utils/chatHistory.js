/**
 * Chat History management utilities with localStorage persistence
 * and cross-component event syncing.
 */

const STORAGE_KEY = 'intelgenz_chat_history';
const ACTIVE_SESSION_KEY = 'intelgenz_active_session_id';
const EVENT_NAME = 'intelgenz-chat-history-updated';

export const INITIAL_CHAT_HISTORY = [
  {
    id: 'history-session-1',
    title: 'Active Ransomware in Middle East Hospitality',
    updatedAt: Date.now() - 1000 * 60 * 35, // 35 minutes ago
    createdAt: Date.now() - 1000 * 60 * 45,
    messages: [
      {
        sender: 'user',
        text: 'What are the active ransomware campaigns targeting the hospitality sector in the Middle East?'
      },
      {
        sender: 'ai',
        text: `### Active Ransomware Campaigns — Middle East Hospitality Sector

Recent intelligence and telemetry indicate accelerated adversary operations targeting regional hotel chains and luxury resort infrastructure:

* **Akira Ransomware Group**: Primary initial access vector remains unpatched VPN concentrators and perimeter firewalls (exploiting **CVE-2023-20269** and **CVE-2024-3400**).
* **Conti-lineage & BlackCat/ALPHV Affiliates**: Observed pivoting through third-party concierge booking APIs and compromised vendor credentials to deploy secondary encryptors.
* **AI-Augmented Spear-Phishing**: Highly personalized spear-phishing lures in Arabic and English impersonating VIP guests, containing weaponized SVG/PDF attachments with infostealer loaders.

#### Recommended Countermeasures:
1. **Enforce FIDO2 Hardware MFA** across all remote access, PMS, and reservation systems.
2. **Network Micro-segmentation**: Isolate operational hotel networks and guest Wi-Fi from payment terminal enclaves.
3. **Audit Active Directory Delegation**: Revoke obsolete service accounts and enforce restricted admin mode for domain controllers.`
      }
    ]
  },
  {
    id: 'history-session-2',
    title: 'CVE-2024-38856 Apache OFBiz RCE Analysis',
    updatedAt: Date.now() - 1000 * 60 * 180, // 3 hours ago
    createdAt: Date.now() - 1000 * 60 * 190,
    messages: [
      {
        sender: 'user',
        text: 'Analyze CVE-2024-38856 and its exploitation impact on enterprise ERPs.'
      },
      {
        sender: 'ai',
        text: `### Threat Advisory: CVE-2024-38856 Critical RCE

* **CVSS Score**: 9.8 (Critical)
* **Affected Component**: Apache OFBiz versions up to 18.12.14
* **Vulnerability Class**: Pre-authentication Remote Code Execution via Filter Bypass

#### Exploitation Mechanics:
Attackers bypass authentication filters via crafted URI path manipulation targeting the \`ProgramExport\` endpoint, allowing arbitrary Groovy expression evaluation under the web server daemon context.

#### Remediation:
* Patch immediately to **Apache OFBiz 18.12.15**.
* Deploy perimeter WAF rules inspecting HTTP POST requests to \`/control/ProgramExport*\`.`
      }
    ]
  },
  {
    id: 'history-session-3',
    title: 'LockBit 3.0 IOCs & Defense Convergence',
    updatedAt: Date.now() - 1000 * 60 * 60 * 26, // Yesterday
    createdAt: Date.now() - 1000 * 60 * 60 * 27,
    messages: [
      {
        sender: 'user',
        text: 'Provide current LockBit 3.0 IOCs and MITRE ATT&CK convergence.'
      },
      {
        sender: 'ai',
        text: `### LockBit 3.0 (LockBit Black) Tactical Overview

* **MITRE ATT&CK Mapping**:
  * **T1059.001**: PowerShell execution for defensive posture discovery.
  * **T1486**: Multi-threaded encryption using AES-256 and RSA-4096.
  * **T1562.001**: Disabling Windows Defender and shadow copy termination (\`vssadmin delete shadows\`).
* **Telemetry Indicators**: Identified command-and-control communication utilizing encrypted DNS tunneling and TOR proxy nodes.`
      }
    ]
  },
  {
    id: 'history-session-4',
    title: 'Phishing Trends & Zero-Day Mitigations',
    updatedAt: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
    createdAt: Date.now() - 1000 * 60 * 60 * 74,
    messages: [
      {
        sender: 'user',
        text: 'What are the top phishing trends and zero-day mitigations for edge gateways?'
      },
      {
        sender: 'ai',
        text: `### Perimeter & Phishing Threat Intelligence Summary

1. **Quishing (QR Code Phishing)**: 40% rise in QR code-embedded PDF lures designed to bypass traditional OCR email filters.
2. **Edge Gateway Zero-Days**: Adversaries weaponizing edge appliances without EDR visibility. Enforce out-of-band management and terminate public WAN interfaces.`
      }
    ]
  },
  {
    id: 'history-session-5',
    title: 'APT29 Stealth Persistence TTPs',
    updatedAt: Date.now() - 1000 * 60 * 60 * 120, // 5 days ago
    createdAt: Date.now() - 1000 * 60 * 60 * 122,
    messages: [
      {
        sender: 'user',
        text: 'Summarize APT29 stealth persistence mechanisms.'
      },
      {
        sender: 'ai',
        text: `### APT29 (Cozy Bear) Threat Profile

Observed utilizing OAuth application impersonation and dormant cloud tenant credentials for long-term stealth persistence without triggering endpoint EDR alarms.`
      }
    ]
  }
];

/**
 * Retrieve chat history list from localStorage or initialize with seed data.
 */
export function getChatHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CHAT_HISTORY));
      return INITIAL_CHAT_HISTORY;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CHAT_HISTORY));
    return INITIAL_CHAT_HISTORY;
  } catch (err) {
    console.warn('Error reading chat history from localStorage:', err);
    return INITIAL_CHAT_HISTORY;
  }
}

/**
 * Save or update a chat session in localStorage.
 */
export function saveChatSession(session) {
  if (!session || !session.id) return;
  try {
    const history = getChatHistory();
    const existingIndex = history.findIndex(item => item.id === session.id);

    const updatedSession = {
      ...session,
      updatedAt: Date.now(),
      title: session.title || deriveTitle(session.messages) || 'New Conversation'
    };

    let newHistory;
    if (existingIndex >= 0) {
      newHistory = [...history];
      newHistory[existingIndex] = {
        ...newHistory[existingIndex],
        ...updatedSession
      };
      // Move to top of list
      const [item] = newHistory.splice(existingIndex, 1);
      newHistory.unshift(item);
    } else {
      newHistory = [
        {
          ...updatedSession,
          createdAt: session.createdAt || Date.now()
        },
        ...history
      ];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    dispatchHistoryChange();
    return newHistory;
  } catch (err) {
    console.warn('Error saving chat session to localStorage:', err);
  }
}

/**
 * Delete a chat session by ID.
 */
export function deleteChatSession(id) {
  try {
    const history = getChatHistory();
    const newHistory = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    dispatchHistoryChange();
    return newHistory;
  } catch (err) {
    console.warn('Error deleting chat session from localStorage:', err);
    return [];
  }
}

/**
 * Clear all chat history.
 */
export function clearAllChatHistory() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    dispatchHistoryChange();
    return [];
  } catch (err) {
    console.warn('Error clearing chat history:', err);
    return [];
  }
}

/**
 * Active session tracking
 */
export function getActiveSessionId() {
  return localStorage.getItem(ACTIVE_SESSION_KEY) || null;
}

export function setActiveSessionId(id) {
  if (id) {
    localStorage.setItem(ACTIVE_SESSION_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  }
}

/**
 * Custom event dispatcher so all components sync on history updates.
 */
function dispatchHistoryChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }
}

export function subscribeToChatHistory(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    callback(getChatHistory());
  };
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}

/**
 * Helper to derive a clean human-readable title from the first user message.
 */
export function deriveTitle(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return 'New Conversation';
  const firstUserMsg = messages.find(m => m.sender === 'user');
  if (!firstUserMsg || !firstUserMsg.text) return 'New Conversation';
  const clean = firstUserMsg.text.replace(/^[#\s*_-]+/, '').trim();
  if (clean.length <= 42) return clean;
  return clean.slice(0, 42).trim() + '...';
}

/**
 * Group chats by relative timeline: Today, Yesterday, Previous 7 Days, Older
 */
export function groupChatsByTimeline(chats = []) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
  const startOf7Days = startOfToday - 7 * 24 * 60 * 60 * 1000;
  const startOf30Days = startOfToday - 30 * 24 * 60 * 60 * 1000;

  const groups = {
    today: [],
    yesterday: [],
    last7Days: [],
    older: []
  };

  chats.forEach(chat => {
    const t = chat.updatedAt || chat.createdAt || 0;
    if (t >= startOfToday) {
      groups.today.push(chat);
    } else if (t >= startOfYesterday) {
      groups.yesterday.push(chat);
    } else if (t >= startOf7Days) {
      groups.last7Days.push(chat);
    } else {
      groups.older.push(chat);
    }
  });

  return groups;
}

/**
 * Format relative time or timestamp
 */
export function formatChatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
