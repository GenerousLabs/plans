export const HOMEPAGE = process.env.PUBLIC_URL || "http://localhost:3000/";
export const GIT_PROTOCOL =
  process.env.NODE_ENV === "production" ? "https" : "http";
export const GIT_DOMAIN = process.env.REACT_APP_GIT_DOMAIN || "localhost:8000";
