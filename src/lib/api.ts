
import { User } from './types/user';

const BASE_URL = 'https://crazy-bakery-bk-835393530868.us-central1.run.app';

/**
 * Fetches all users from the backend.
 * @returns A promise that resolves to an array of users.
 */
export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/usuarios`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch users');
    throw new Error('Failed to fetch users');
  }

  // The API returns the users in the correct format, so we can return them directly.
  return response.json();
}

/**
 * Registers a new user in the backend database.
 * @param userData - The user's data for registration.
 * @returns The response from the server.
 */
export async function createUser(userData: any) {
  const response = await fetch(`${BASE_URL}/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred during registration.');
  }

  return response.json();
}

/**
 * Fetches user data from the backend by their Firebase UID.
 * @param uid The user's Firebase UID.
 * @returns The user's data from the backend.
 */
export async function getUserById(uid: string) {
  const response = await fetch(`${BASE_URL}/usuarios/${uid}`);

  if (!response.ok) {
    // This will catch 404s and other errors, indicating the user is not in the backend DB.
    throw new Error('User not found in database.');
  }

  return response.json();
}

/**
 * Deletes a user from the backend database.
 * @param userId - The ID of the user to delete.
 * @returns The response from the server.
 */
export async function deleteUser(userId: string) {
  const response = await fetch(`${BASE_URL}/usuarios/${userId}`,
  {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }

  return response.json();
}

/**
 * Updates a user in the backend database.
 * @param userId - The ID of the user to update.
 * @param userData - The user's data to update.
 * @returns The response from the server.
 */
export async function updateUser(userId: string, userData: Partial<User>) {
  const response = await fetch(`${BASE_URL}/usuarios/${userId}`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return response.json();
}
