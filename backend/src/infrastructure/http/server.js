import express from 'express';
import { routes } from './routes.js';

const app = express();

app.use(express.json());

app.use(routes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export { app };
