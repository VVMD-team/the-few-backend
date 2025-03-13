import dotenv from 'dotenv';

dotenv.config();

export const envVars = {
  PORT: process.env.PORT || 8000,
  WEBFLOW_API_KEY: process.env.WEBFLOW_API_KEY,
  WEBFLOW_PROJECTS_COLLECTION_ID: process.env.WEBFLOW_PROJECTS_COLLECTION_ID,
  WEBFLOW_FILES_COLLECTION_ID: process.env.WEBFLOW_FILES_COLLECTION_ID,
};
