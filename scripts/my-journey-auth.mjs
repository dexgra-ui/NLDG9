// Passwordless auth adapter for a future opt-in UI. Not imported by the live site.
// Inject an initialized Supabase client; never include service-role keys in a browser.
export const SITE_ORIGIN = 'https://nolabelsdesignedbygod.org';
export const CALLBACK_PATH = '/' + 'journey-auth.html';
export function redirectUrl(origin = SITE_ORIGIN) {
  const url = new URL(origin);
  if (url.protocol !== 'https:' || url.origin !== SITE_ORIGIN) {
    throw new Error('Unapproved authentication origin');
  }
  return new URL(CALLBACK_PATH, url.origin).href;
}
export async function sendMagicLink(client, email, origin = SITE_ORIGIN) {
  if (!client?.auth?.signInWithOtp) throw new TypeError('Supabase auth client required');
  const normalized = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || normalized.length > 254) {
    throw new Error('Enter a valid email address');
  }
  const { error } = await client.auth.signInWithOtp({
    email: normalized,
    options: { emailRedirectTo: redirectUrl(origin), shouldCreateUser: true }
  });
  if (error) throw error;
  return { message: 'If the email can receive a sign-in link, check your inbox.' };
}
export async function currentAccount(client) {
  if (!client?.auth?.getUser) throw new TypeError('Supabase auth client required');
  const { data, error } = await client.auth.getUser();
  if (error) throw error;
  return data?.user ?? null;
}
export async function signOutAccount(client) {
  if (!client?.auth?.signOut) throw new TypeError('Supabase auth client required');
  const { error } = await client.auth.signOut();
  if (error) throw error;
  // Intentionally do not clear existing My Journey localStorage data.
}
