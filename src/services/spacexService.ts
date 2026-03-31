export async function fetchRockets() {
    const res = await fetch('https://api.spacexdata.com/v4/rockets')
    if (!res.ok) throw new Error('Failed fetch')
    return res.json()
  }
  
  export async function fetchRocketById(id: string) {
    const res = await fetch(`https://api.spacexdata.com/v4/rockets/${id}`)
    if (!res.ok) throw new Error('Failed fetch detail')
    return res.json()
  }