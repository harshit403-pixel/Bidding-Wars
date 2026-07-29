import mongoose from "mongoose";

/**
 * Connect to MongoDB
 */
export async function connectDatabase(uri: string): Promise<void> {
  await mongoose.connect(uri);
}

/**
 * Remove all documents from every collection
 */
export async function clearDatabase(): Promise<void> {
  const { collections } = mongoose.connection;

  for (const collection of Object.values(collections)) {
    await collection.deleteMany({});
  }
}

/**
 * Drop the entire database
 */
export async function dropDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
  }
}

/**
 * Close MongoDB connection
 */
export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
}

/**
 * Reset database between tests
 */
export async function resetDatabase(): Promise<void> {
  await clearDatabase();
}

/**
 * Get current mongoose connection
 */
export function getConnection() {
  return mongoose.connection;
}