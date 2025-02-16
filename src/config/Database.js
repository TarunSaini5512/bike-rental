const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Connect to the database
 */
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

/**
 * Disconnect from the database
 */
const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('Database disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from the database:', error);
    throw error;
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  prisma
};
