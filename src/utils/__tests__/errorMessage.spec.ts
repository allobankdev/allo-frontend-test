import { describe, expect, it } from 'vitest'
import { getErrorMessage } from '../errorMessage'
import { ApiError } from '@/services/rocketApi'

describe('getErrorMessage', () => {
  it('memberi pesan khusus untuk 404 dan 429', () => {
    expect(getErrorMessage(new ApiError(404))).toBe('Rocket tidak ditemukan.')
    expect(getErrorMessage(new ApiError(429))).toContain('Batas request API')
  })

  it('menyertakan status HTTP untuk error server lain', () => {
    expect(getErrorMessage(new ApiError(500))).toContain('HTTP 500')
  })

  it('memberi pesan data tidak valid jika respons bukan JSON', () => {
    expect(getErrorMessage(new SyntaxError('Unexpected token <'))).toContain('Data dari server tidak valid')
  })

  it('menganggap error non-API sebagai masalah koneksi', () => {
    expect(getErrorMessage(new TypeError('Failed to fetch'))).toContain('koneksi')
  })
})
