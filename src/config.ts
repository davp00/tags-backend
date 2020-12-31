import { resolve } from 'path';
import * as dotenv from 'dotenv';

// Get environment variables
/* istanbul ignore next */
const envFileName =
  process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env';

dotenv.config({ path: resolve(__dirname, envFileName) });

/**
 * Provides the app port
 */
/* istanbul ignore next */
export const PORT = process.env.PORT || 3000;

/**
 * Used to provide access to the Mongoose module
 */
export const MONGO_DB_URI = process.env.MONGO_DB_URI;
