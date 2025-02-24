import express, { Express } from 'express';
import routes from './app/server';
import { CONFIG } from './global_config';
import { db } from './utils/db';  // Import the singleton instance
import logger from './utils/logger';

const app: Express = express();
const port = CONFIG.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the routes
app.use(`${CONFIG.API_PREFIX}/`, routes);

// Initialize database with sample data in sqlite
async function startServer() {
  try {
    // Initialize database with sample data
    await db.initializeWithDump();
    
    // ... rest of your server setup
    app.listen(port, () => {
      logger.info(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', { error });
    process.exit(1);
  }
}

startServer();

