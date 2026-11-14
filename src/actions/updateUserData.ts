'use server';
import { readRouteJson } from '@/api/routeResponse';
import { UpdatePersonalDetailsSchemaType } from '@/schemas/auth.schema';
import { getAccessToken } from '@/utilities';

export async function updateUserDetails(data: Partial<UpdatePersonalDetailsSchemaType>) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { ok: false, error: 'Your session expired. Sign in again to save your profile.' };
    }
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/users/updateMe/', {
      method: 'PUT',
      headers: { token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
      }),
    });
    const result = await readRouteJson(res);
    const validationError = Array.isArray(result?.errors) ? result.errors[0] : result?.errors;
    return {
      ok: res.ok && result !== null,
      error: res.status === 401
        ? 'Your session expired. Sign in again to save your profile.'
        : validationError?.msg || validationError?.message || result?.message || `Route returned HTTP ${res.status}.`,
    };
  } catch {
    return {
      ok: false,
      error: 'Could not reach Route. Please try again.',
    };
  }
}
