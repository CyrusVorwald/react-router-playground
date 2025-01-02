import { eq } from 'drizzle-orm';
import { db } from '~/db/db';
import { users, type User, type NewUser } from '~/db/schema';

/**
 * Gets an existing user by email or creates a new one if they don't exist
 */
export async function getOrCreateUser(email: string): Promise<User | undefined> {
  try {
    // First try to find existing user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return existingUser;
    }

    // If user doesn't exist, create new user
    const newUser: NewUser = {
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [createdUser] = await db.insert(users)
      .values(newUser)
      .returning();

    return createdUser;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
  }
}

/**
 * Safely deletes a user by their email
 * Returns true if user was found and deleted, false if user wasn't found
 */
export async function deleteUser(email: string): Promise<boolean> {
  try {
    const [deletedUser] = await db.delete(users)
      .where(eq(users.email, email))
      .returning();
    
    return !!deletedUser;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

/**
 * Safely deletes a user by their ID
 * Returns true if user was found and deleted, false if user wasn't found
 */
export async function deleteUserById(id: string): Promise<boolean> {
  try {
    const [deletedUser] = await db.delete(users)
      .where(eq(users.id, id))
      .returning();
    
    return !!deletedUser;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

/**
 * Gets a user by their email
 * Returns null if user doesn't exist
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return user || null;
}