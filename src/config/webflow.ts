import { envVars } from '@/config/env';

export const webflowApiUrl = 'https://api.webflow.com/v2';
export const webflowApiToken = `Bearer ${envVars.WEBFLOW_API_KEY}`;
