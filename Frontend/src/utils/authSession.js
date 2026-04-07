const TOKEN_KEY = 'token';
const AUTH_USER_KEY = 'authUser';

export function setAuthSession(token, user) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem('profileData');
  localStorage.removeItem('cartItems');
  localStorage.removeItem('savedAddresses');
  localStorage.removeItem('fullAddress');
  localStorage.removeItem('bookingDetails');
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function getAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Unable to parse auth user', error);
    return null;
  }
}

export function getCurrentUserId() {
  const user = getAuthUser();
  return user?.id || user?._id || 'guest_user';
}

export function isAuthenticated() {
  return Boolean(getAuthToken() && getCurrentUserId() !== 'guest_user');
}
