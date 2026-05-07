export async function login(password: string) {
  const response = await fetch('/admin/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
}

export async function logout() {
  const response = await fetch('/functions/auth/logout', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  return response.json();
}

export function getSessionFromCookie() {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find((c) => c.trim().startsWith('session='));
  return sessionCookie ? sessionCookie.split('=')[1] : null;
}

export async function isAuthenticated() {
  const session = getSessionFromCookie();
  return !!session;
}
