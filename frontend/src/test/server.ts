import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import type { UserProfile } from '@/types/user'
import { API_BASE_URL } from '@/api/client'

export const sampleProfile: UserProfile = {
  id: 1,
  email: 'user@example.com',
  username: 'user',
  first_name: 'Test',
  last_name: 'User',
  is_verified: true,
  created_at: '2026-01-01T00:00:00Z',
  gender: 'male',
  sexual_preference: 'woman',
  age: 25,
  bio: 'hi',
  is_profile_completed: true,
}

// Base "happy path" handlers. Individual tests override with server.use(...).
export const handlers = [
  http.get(`${API_BASE_URL}/users/me`, () => HttpResponse.json(sampleProfile)),
]

export const server = setupServer(...handlers)
