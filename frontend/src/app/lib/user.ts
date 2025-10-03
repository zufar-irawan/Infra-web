export interface User {
    name: string;
    email: string;
    role: string;
}

/**
 * Fetch user data dari API lms/auth/me
 * @param token Bearer token authentication
 */
export async function getCurrenUser(token: string): Promise<User> {
    const res = await fetch("https://your-lms-domain.com/lms/auth/me", {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user");
    }

    return res.json();
}
