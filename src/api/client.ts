// Typed fetch wrapper for the Vote-R backend. All requests send the
// session cookie so the admin login works through the Vite dev proxy.

export interface Category {
  id: number
  name: string
  code_letter: string
  description: string | null
  is_active: boolean
  created_at: string
}

export interface Nomination {
  id: number
  category_id: number
  nominator_name: string
  nominator_phone: string
  nominee_name: string
  nominee_phone: string
  nominee_id: number | null
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason: string | null
  reviewed_at: string | null
  created_at: string
}

export interface NomineeSummary {
  id: number
  code: string
  full_name: string
  category_id: number
}

export interface Nominee extends NomineeSummary {
  phone: string
  is_active: boolean
  deactivation_reason: string | null
  created_at: string
}

export interface Admin {
  name: string
  email: string
}

export interface AuditLogEntry {
  id: number
  admin_id: number
  action: string
  entity_type: string
  entity_id: number
  details: Record<string, unknown> | null
  created_at: string
}

export interface NominationInput {
  category_id: number
  nominee_name: string
  nominee_phone: string
  nominator_name: string
  nominator_phone: string
}

// Thrown for any non-OK response. `status` lets callers special-case 401s.
export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    credentials: 'include',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    ...options,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const body = await response.json()
      if (body && typeof body.error === 'string') {
        message = body.error
      }
    } catch {
      // Body wasn't JSON - fall back to the generic message above.
    }
    throw new ApiError(message, response.status)
  }

  // Some endpoints (e.g. logout) may return no content.
  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

// --- Public ---

export function getCategories(): Promise<Category[]> {
  return request('/api/categories')
}

// --- Admin: categories ---

export function getAllCategories(): Promise<Category[]> {
  return request('/api/admin/categories')
}

export interface CategoryInput {
  name: string
  code_letter: string
  description?: string
}

export function createCategory(input: CategoryInput): Promise<Category> {
  return request('/api/categories', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateCategory(
  id: number,
  input: Partial<{ name: string; code_letter: string; description: string; is_active: boolean }>,
): Promise<Category> {
  return request(`/api/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export function createNomination(input: NominationInput): Promise<Nomination> {
  return request('/api/nominations', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function getNominees(categoryId: number): Promise<NomineeSummary[]> {
  return request(`/api/nominees?category_id=${categoryId}`)
}

// --- Auth ---

export function login(email: string, password: string): Promise<Admin> {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function logout(): Promise<void> {
  return request('/api/auth/logout', { method: 'POST' })
}

export function getCurrentAdmin(): Promise<Admin> {
  return request('/api/auth/me')
}

// --- Admin: nominations ---

export function getNominations(params: { status?: string; category_id?: number } = {}): Promise<Nomination[]> {
  const query = new URLSearchParams()
  if (params.status) query.set('status', params.status)
  if (params.category_id) query.set('category_id', String(params.category_id))
  const queryString = query.toString()
  return request(`/api/nominations${queryString ? `?${queryString}` : ''}`)
}

export function approveNomination(id: number): Promise<Nominee> {
  return request(`/api/nominations/${id}/approve`, { method: 'POST' })
}

export function rejectNomination(id: number, reason: string): Promise<Nomination> {
  return request(`/api/nominations/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
}

export function mergeNomination(id: number, nomineeId: number): Promise<Nomination> {
  return request(`/api/nominations/${id}/merge`, {
    method: 'POST',
    body: JSON.stringify({ nominee_id: nomineeId }),
  })
}

// --- Admin: nominees ---

export function getNominee(id: number): Promise<Nominee> {
  return request(`/api/nominees/${id}`)
}

export function updateNominee(id: number, input: { full_name?: string; phone?: string }): Promise<Nominee> {
  return request(`/api/nominees/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export function deactivateNominee(id: number, reason: string): Promise<Nominee> {
  return request(`/api/nominees/${id}/deactivate`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
}

// --- Admin: audit log ---

export function getAuditLog(action?: string): Promise<AuditLogEntry[]> {
  const query = action ? `?action=${encodeURIComponent(action)}` : ''
  return request(`/api/audit-log${query}`)
}
