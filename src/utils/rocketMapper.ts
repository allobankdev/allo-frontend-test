export function mapApiRocketToRocket(raw: {
  id: string
  image_url: string
  launcher_config: {
    full_name: string
    description: string
    launch_cost: string
    manufacturer: {
      country_code: string
    }
    maiden_flight: string
  }
}) {
  return {
    id: raw.id,
    name: raw.launcher_config.full_name ?? null,
    description: raw.launcher_config.description ?? null,
    imageUrl: raw.image_url ?? null,
    launchCost: raw.launcher_config.launch_cost ?? null,
    country: raw.launcher_config.manufacturer.country_code ?? null,
    firstFlight: raw.launcher_config.maiden_flight ?? null,
    source: 'api',
  }
}

export function mapFormToRocket(formValues: {
  name: string
  description: string
  imageUrl: string
  launchCost: string
  country: string
  firstFlight: string
}) {
  return {
    id: `custom-${Date.now()}`,
    name: formValues.name?.trim() || null,
    description: formValues.description?.trim() || null,
    imageUrl: formValues.imageUrl?.trim() || null,
    launchCost: formValues.launchCost?.trim() || null,
    country: formValues.country?.trim() || null,
    firstFlight: formValues.firstFlight || null,
    source: 'custom',
  }
}
