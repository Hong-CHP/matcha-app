import { describe, it, expect } from 'vitest'
import { server } from './server'
import { http, HttpResponse } from 'msw'
import { API_BASE_URL } from '../api/client'
import { renderHook, waitFor } from '@testing-library/react'
import { authWrapper, makeAuthValue } from './renderWithAuth'
import { useVisitTracker } from '../social/useVisitTracker'

const VISIT_URL = `${API_BASE_URL}/social/visits/:id`

describe('useVisitTracker', ()=>{
    it('Post only single visit', async () => {
        let callCount = 0
        server.use(
            http.post(VISIT_URL, () => {
                callCount++
                return HttpResponse.json({ ok: true })
            })
        )

        const { rerender } = renderHook(
            ({ id }) => useVisitTracker(id),
            {
                wrapper: authWrapper(makeAuthValue()),
                initialProps: { id: 5 },
            }
        )

        await waitFor(() => expect(callCount).toBe(1))

        rerender({ id: 5 })
        await new Promise((r) => setTimeout(r, 50))
        expect(callCount).toBe(1)
    })
})