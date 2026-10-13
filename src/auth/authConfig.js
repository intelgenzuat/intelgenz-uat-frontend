import {
  PublicClientApplication,
  LogLevel,
} from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId:
      import.meta.env.VITE_AZURE_CLIENT_ID ||
      "0ce00821-8f52-4bd1-8966-fff333bfce0b",

    authority: `https://login.microsoftonline.com/${
      import.meta.env.VITE_AZURE_TENANT_ID ||
      "d31062d8-aba0-4856-aa00-e1c031927635"
    }`,

    redirectUri:
      import.meta.env.VITE_AZURE_REDIRECT_URI ||
      (typeof window !== "undefined"
        ? window.location.origin
        : ""),

    postLogoutRedirectUri:
      typeof window !== "undefined"
        ? `${window.location.origin}/login`
        : "",

    navigateToLoginRequestUrl: false,
  },

  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },

  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;

        switch (level) {
          case LogLevel.Error:
            console.error("[MSAL Error]", message);
            break;
          case LogLevel.Warning:
            console.warn("[MSAL Warning]", message);
            break;
          case LogLevel.Info:
            console.info("[MSAL Info]", message);
            break;
          default:
            break;
        }
      },
      logLevel: LogLevel.Warning,
      piiLoggingEnabled: false,
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
};

let msalInstance = null;
let msalInitPromise = null;
let redirectHandlingPromise = null;

export const getMsalInstance = async () => {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig);
    msalInitPromise = msalInstance.initialize();
  }

  if (msalInitPromise) {
    await msalInitPromise;
    msalInitPromise = null;
  }

  return msalInstance;
};

export const clearMsalStaleState = () => {
  try {
    sessionStorage.clear();
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("msal.") && key.includes("interaction_status")) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.warn("Could not clear MSAL state:", e);
  }
};

export const signInWithAzure = async () => {
  const instance = await getMsalInstance();

  await instance.loginRedirect({
    ...loginRequest,
    redirectUri:
      import.meta.env.VITE_AZURE_REDIRECT_URI ||
      window.location.origin,
    redirectStartPage:
      import.meta.env.VITE_AZURE_REDIRECT_URI ||
      window.location.origin,
  });
};

export const handleRedirectAuth = async () => {
  if (redirectHandlingPromise) {
    return redirectHandlingPromise;
  }

  redirectHandlingPromise = (async () => {
    const instance = await getMsalInstance();
    const response = await instance.handleRedirectPromise();

    if (response?.account) {
      instance.setActiveAccount(response.account);
      return response;
    }

    const accounts = instance.getAllAccounts();
    const activeAccount = instance.getActiveAccount();

    if (!activeAccount && accounts.length > 0) {
      instance.setActiveAccount(accounts[0]);
    }

    return null;
  })();

  try {
    return await redirectHandlingPromise;
  } catch (error) {
    redirectHandlingPromise = null;
    console.error("[MSAL] Redirect handling failed:", error);
    throw error;
  }
};

export const signOutAzure = async () => {
  const instance = await getMsalInstance();

  const account =
    instance.getActiveAccount() ||
    instance.getAllAccounts()[0];

  redirectHandlingPromise = null;

  const savedTheme = localStorage.getItem('theme');
  localStorage.clear();
  sessionStorage.clear();
  if (savedTheme) {
    localStorage.setItem('theme', savedTheme);
  }

  if (account) {
    await instance.logoutRedirect({
      account: account,
      postLogoutRedirectUri: `${window.location.origin}/login`,
    });
  } else {
    window.location.href = '/login';
  }
};
