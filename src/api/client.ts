// Small wrapper around fetch() that every API call goes through.
// It adds the JWT to the Authorization header and turns error
// responses from the backend into readable messages.

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')

const TOKEN_KEY = 'easyspot_token'

/** Where the JWT is kept between page reloads. */
export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

/** Fired when the backend says the token is no longer valid (401). */
export const LOGOUT_EVENT = 'easyspot:logout'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = tokenStorage.get()
  const headers: Record<string, string> = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the EasySpot API. Is the backend running?')
  }

  // 204 No Content (e.g. DELETE) has no body
  if (response.status === 204) {
    return undefined as T
  }

  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 && token) {
      // Expired or invalid token: log the user out everywhere
      tokenStorage.clear()
      window.dispatchEvent(new Event(LOGOUT_EVENT))
    }
    throw new ApiError(response.status, readErrorMessage(data, response.statusText))
  }

  return data as T
}

/** The backend sends { message: string | string[] } on errors. */
function readErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'message' in data) {
    const { message } = data as { message: unknown }
    if (Array.isArray(message)) return message.join('. ')
    if (typeof message === 'string') return message
  }
  return fallback || 'Something went wrong'
}
