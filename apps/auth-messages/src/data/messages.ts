// All current (jargon) vs proposed (user-friendly) copy, organized by screen + scenario

export const AUTH_LOADING_STEPS = {
  current: [
    'Validating app access...',
    'Loading app configuration...',
    'Saving session data...',
    'Managing authentication tokens...',
    'Identifying user...',
    'Synchronizing timezone...',
    'Downloading objects metadata...',
    'Populating resources...',
  ],
  proposed: [
    'Checking your access...',
    'Setting up your workspace...',
    'Saving your sign-in...',
    'Securing your connection...',
    'Loading your profile...',
    'Syncing your settings...',
    'Downloading your data...',
    'Preparing your workspace...',
  ],
};

export const AUTH_LOADING_SUBTITLES = {
  current: 'Please wait while we sync your data. This may take a few moments depending on your data size.',
  proposed: {
    early: "We're getting things ready for you.",
    medium: 'This usually takes a minute or two.',
    long: 'Still working — large teams take a bit longer.',
    veryLong: 'Almost there. Thanks for your patience.',
    tooLong: 'This is taking longer than usual. You can keep waiting or try again on a stronger connection.',
  },
};

export const AUTH_LOADING_INFO_TIP = {
  current: 'Keep the app open during the sync process. You can use the app once sync is complete.',
  proposed: 'Keep the app open during this process.',
};

export const OFFLINE_SYNC_PHASES = {
  current: [
    'Calendar Events and Jobs',
    'Job Assignments',
    'Widgets Offline Support',
    'Production Tracking',
    'Punch List',
    'RFI',
    'Download Time Entries',
    'Save Records Offline',
    'Hazards',
    'Site Check-In',
    'PT Associated Services',
    'Attachments',
  ],
  proposed: [
    'Your Schedule',
    'Your Assignments',
    'Offline Forms',
    'Production Data',
    'Punch List Items',
    'Questions & RFIs',
    'Your Time Entries',
    'Offline Records',
    'Safety Hazards',
    'Site Check-In',
    'Related Services',
    'Photos & Documents',
  ],
};

export const RESET_SCREEN = {
  current: { title: 'Loading...' },
  proposed: {
    returning: 'Checking your session...',
    firstTime: 'Getting ready...',
    corrupted: 'We need to sign you in again',
  },
};

export const DOMAIN_SELECT = {
  current: {
    title: 'Connect to an account to get started',
    offlineBanner: 'You are offline. You will only be able to use accounts that you are already logged into.',
    offlineNoAccounts: '',
    helpText: '',
  },
  proposed: {
    title: 'Choose your Sitetracker environment',
    helpText: 'Select the environment your team uses. Not sure? Ask your admin.',
    adminLink: 'Need help? Contact your administrator',
    offlineBanner: "You're offline. You can only access accounts you've used before.",
    offlineNoAccounts: 'No saved accounts. Connect to Wi-Fi or mobile data to sign in for the first time.',
  },
};

export const SALESFORCE_LOGIN = {
  current: {
    loading: '',
    slow: '',
    networkDrop: '',
    oauthDenied: 'This Connected App is restricted to admin-approved users. Please contact your administrator for access.',
    autoLogin: '',
  },
  proposed: {
    loading: 'Connecting to Salesforce...',
    slow: 'Slow connection — still loading the sign-in page...',
    networkDrop: "Connection lost. You'll need to reconnect to sign in.",
    oauthDenied: "Your account isn't set up for Sitetracker Mobile yet.\n\nShow this to your admin:\n\"Enable the Sitetracker Mobile connected app for this user.\"",
    autoLogin: 'Signing you in...',
  },
};

export const VAULT_MODAL = {
  current: {
    savePrompt: 'Would you like to save your password for this account?',
    deviceNotSecure: 'Your device is not secured with a passcode, pattern, or biometric authentication. To save your password securely, you need to set up a passcode, Face ID, Touch ID, or other biometric authentication on your device. Go to Settings > Face ID & Passcode (or Touch ID & Passcode) to set this up.',
    cancelled: '',
    error: 'An unknown error occurred while trying to authenticate you to save the password.',
  },
  proposed: {
    savePrompt: "Save your password?\nYou'll be able to sign in with Face ID next time.",
    deviceNotSecure: 'Set up Face ID or a passcode to save your password.',
    cancelled: 'Password not saved. You can save it later in Settings.',
    error: "Couldn't save your password right now. You can try again later in Settings.",
  },
};

export const LOGIN_SUCCESS = {
  current: {
    title: 'You have successfully logged in',
    subtitle: 'Welcome back',
    validationHangs: '',
  },
  proposed: {
    returning: { title: 'Welcome back', subtitle: '' },
    firstTime: { title: 'Welcome to Sitetracker', subtitle: '' },
    validationHangs: 'Verifying your access...',
  },
};

export const ACCESS_MODAL = {
  current: {
    namespace: 'It looks like you are not set up to use Sitetracker Mobile. To continue, please contact your administrator to ensure the necessary permissions are assigned to your user account.',
    apiDisabled: 'API is disabled for this User.',
    appAccess: 'To continue, please contact your administrator to assign the Sitetracker Mobile permission set or Sitetracker Mobile Access custom permission to your user account.',
    serverError: 'An unknown error has occurred. Please try again.',
    networkError: 'An unknown error has occurred. Please try again.',
  },
  proposed: {
    namespace: "Your account isn't set up for mobile access yet.",
    apiDisabled: "Mobile access isn't turned on for your account.",
    appAccess: 'Your admin needs to enable Sitetracker Mobile for you.',
    serverError: 'Something went wrong on our end. Try again in a few minutes.',
    networkError: "Can't connect right now. Check your signal and try again.",
    adminCard: 'Show this to your admin:\n"This user needs the Sitetracker Mobile permission set enabled in Salesforce Setup."',
  },
};

export const BIOMETRIC = {
  current: {
    autoLogin: '',
    notEnrolled: 'Your device is not secured with a passcode, pattern, or biometric authentication. To save your password securely, you need to set up a passcode, Face ID, Touch ID, or other biometric authentication on your device.',
    cancelled: '',
    error: 'An unknown error occurred while trying to authenticate you to retrieve your information.',
    slowNetwork: '',
  },
  proposed: {
    autoLogin: 'Signing you in...',
    notEnrolled: 'Set up Face ID or a passcode to use quick sign-in.',
    cancelled: 'You can also enter your password to sign in.',
    error: "Couldn't verify your identity. Enter your password instead.",
    slowNetwork: 'Connecting to Salesforce...',
  },
};

export const LOGOUT = {
  current: {
    voluntary: 'Removing location services...',
    pendingUploads: 'Some uploads will not be available until you sign back in to continue uploads.',
    sessionExpired: 'Your current session is invalid. You will need to log back in.',
    preWarning: '',
    afterLogout: '',
    offlineChanges: '',
  },
  proposed: {
    voluntary: 'Signing you out...',
    pendingUploads: "You have uploads in progress. They'll continue when you sign back in.",
    sessionExpired: "Your session has ended. Don't worry — any changes you made are saved and will sync when you sign back in.",
    preWarning: 'Your session is ending soon. Save your work and sign in again to continue.',
    afterLogout: "You've been signed out.",
    offlineChanges: 'Your recent changes are safely stored and will upload when you sign back in.',
  },
};

export const DEEP_LINK = {
  current: {
    loading: 'Loading...',
    needsLogin: 'Loading...',
    authFails: '',
    expired: '',
  },
  proposed: {
    loading: 'Opening your link...',
    needsLogin: "Sign in to open this link. We'll take you there after.",
    authFails: "Couldn't open your link. Sign in and try again.",
    expired: 'Your session ended. Sign in to open this link.',
  },
};
