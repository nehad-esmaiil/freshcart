function phoneKey(email: string) {
  return 'freshcart:account-phone:' + email.trim().toLowerCase();
}

export function getRememberedAccountPhone(email: string) {
  try {
    return localStorage.getItem(phoneKey(email));
  } catch {
    return null;
  }
}

export function rememberAccountPhone(email: string, phone: string) {
  try {
    localStorage.setItem(phoneKey(email), phone);
  } catch {
    // Storage may be unavailable in this browser.
  }
}
