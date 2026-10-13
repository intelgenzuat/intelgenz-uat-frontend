import { PublicClientApplication, LogLevel } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || '0ce00821-8f52-4bd1-8966-fff333bfce0b',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || 'd31062d8-aba0-4856-aa00-e1c031927635'}`,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || (typeof window !== 'undefined' ? window.location.origin : ''),
    postLogoutRedirectUri: typeof window !== 'undefined' ? `${window.location.origin}/login` : '',
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error('[MSAL Error]', message);
            return;
          case LogLevel.Warning:
            console.warn('[MSAL Warning]', message);
            return;
          default:
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
};

let msalInstance = null;
let msalInitPromise = null;

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

export const signInWithAzure = async () => {
  const instance = await getMsalInstance();
  try {
    const loginResponse = await instance.loginPopup(loginRequest);
    return loginResponse;
  } catch (error) {
    console.warn('Popup login error, attempting redirect fallback:', error);
    if (
      error.errorCode === 'popup_window_error' ||
      error.name === 'BrowserAuthError' ||
      error.errorCode === 'empty_window_error'
    ) {
      await instance.loginRedirect(loginRequest);
      return null;
    }
    throw error;
  }
};

export const handleRedirectAuth = async () => {
  const instance = await getMsalInstance();
  return await instance.handleRedirectPromise();
};

export const signOutAzure = async () => {
  try {
    const instance = await getMsalInstance();
    const currentAccount = instance.getActiveAccount() || instance.getAllAccounts()[0];
    if (currentAccount) {
      await instance.logoutPopup({
        account: currentAccount,
        postLogoutRedirectUri: `${window.location.origin}/login`,
      });
    }
  } catch (err) {
    console.warn('MSAL logout error:', err);
  }
};
