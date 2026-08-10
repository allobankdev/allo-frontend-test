// Measurement standard interface
export interface MeasurementDTO {
  readonly meters: number | null
  readonly feet: number | null
}

// Mass standard interface
export interface MassDTO {
  readonly kg: number
  readonly lb: number
}

// Engine specific details
export interface EngineDTO {
  readonly type: string
  readonly version: string
  readonly layout: string
  readonly propellant_1: string
  readonly propellant_2: string
  readonly thrust_to_weight: number
}

// Main Rocket interface mapping SpaceX v4 API
export interface RocketDTO {
  readonly id: string
  readonly name: string
  readonly type: string
  readonly active: boolean
  readonly country: string
  readonly company: string
  readonly description: string
  readonly flickr_images: readonly string[]
  readonly cost_per_launch: number
  readonly first_flight: string
  readonly success_rate_pct: number
  readonly height: MeasurementDTO
  readonly diameter: MeasurementDTO
  readonly mass: MassDTO
  readonly engines: EngineDTO
}
