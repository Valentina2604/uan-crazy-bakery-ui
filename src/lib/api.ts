const BASE_URL = 'https://crazy-bakery-bk-835393530868.us-central1.run.app';

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
