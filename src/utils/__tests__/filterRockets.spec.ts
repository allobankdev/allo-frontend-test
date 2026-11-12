import { describe, expect, it } from 'vitest'
import { filterRockets } from '../filterRockets'
import type { Rocket } from '@/types/rocket'

function makeRocket (id: string, name: string, description: string | null): Rocket {
  return {
    id,
    name,
    description,
    imageUrl: null,
    launchCost: null,
    countryCode: null,
    maidenFlight: null,
  }
}

const rockets = [
  makeRocket('1', 'Falcon 9 Block 5', 'Roket yang dapat digunakan ulang.'),
  makeRocket('2', 'Falcon Heavy', null),
  makeRocket('3', 'Starship', 'Kendaraan super berat yang dapat digunakan ulang.'),
]

describe('filterRockets', () => {
  it('mengembalikan semua rocket jika kata kunci kosong atau spasi', () => {
    expect(filterRockets(rockets, '')).toHaveLength(3)
    expect(filterRockets(rockets, '   ')).toHaveLength(3)
  })

  it('mencocokkan nama tanpa peka huruf besar/kecil', () => {
    expect(filterRockets(rockets, 'FALCON').map(r => r.id)).toEqual(['1', '2'])
  })

  it('mencocokkan deskripsi dan mengabaikan deskripsi null', () => {
    expect(filterRockets(rockets, 'super berat').map(r => r.id)).toEqual(['3'])
  })

  it('mengembalikan array kosong jika tidak ada yang cocok', () => {
    expect(filterRockets(rockets, 'saturn')).toEqual([])
  })
})
