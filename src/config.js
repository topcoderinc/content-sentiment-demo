import dotenv from 'dotenv';

// Handles .env enviroment variables
dotenv.config();

export const server = {
  port: process.env.PORT || 3000,
};

export default {
  server,
};
