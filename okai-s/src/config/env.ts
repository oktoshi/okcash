// Environment configuration with type safety
interface Config {
  openRouterApiKey: string;
  siteUrl: string;
  appName: string;
}

export const config: Config = {
  openRouterApiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  siteUrl: import.meta.env.VITE_SITE_URL,
  appName: import.meta.env.VITE_APP_NAME
};