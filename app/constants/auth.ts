export const AUTH_ERRORS = {
    REQUIRED_EMAIL: "Please enter your email address to continue.",
    INVALID_EMAIL: "That doesn't look like a valid email address. Please check and try again.",
    INVALID_TOTP: "That code didn't work. Please check and try again, or request a new code.",
    EXPIRED_TOTP: "That code has expired. Please request a new one.",
    MISSING_SESSION_EMAIL: "We couldn't find an email to verify. Please restart from your original browser or try again.",
    MISSING_SESSION_TOTP: "We couldn't find an active verification session. Please request a new code.",
    RATE_LIMIT_EXCEEDED: "Too many incorrect attempts. Please request a new code.",
    INVALID_MAGIC_LINK: "This verification link is invalid or has been modified.",
  } as const;
  
  export type AuthError = keyof typeof AUTH_ERRORS;