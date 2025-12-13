import type { RocketEntity } from "@/core/entities/rocket.entity";
import { type EntityMapper, type DtoMapper } from "@/data/mapper";
import type { RocketDtoSpaceX } from "./rocket.dto.spacex";

export class RocketMapper
  implements
    EntityMapper<RocketDtoSpaceX, RocketEntity>,
    DtoMapper<RocketDtoSpaceX, RocketEntity>
{
  toEntity(dto: RocketDtoSpaceX): RocketEntity {
    return {
      height: dto.height,
      diameter: dto.diameter,
      mass: dto.mass,
      firstStage: {
        thrustSeaLevel: dto.first_stage.thrust_sea_level,
        thrustVacuum: dto.first_stage.thrust_vacuum,
        isReusable: dto.first_stage.reusable,
        engines: dto.first_stage.engines,
        fuelAmountTons: dto.first_stage.fuel_amount_tons,
        burnTimeSec: dto.first_stage.burn_time_sec,
      },
      secondStage: {
        thrust: dto.second_stage.thrust,
        payloads: {
          compositeFairing: dto.second_stage.payloads.composite_fairing,
          option1: dto.second_stage.payloads.option_1,
        },
        isReusable: dto.second_stage.reusable,
        engines: dto.second_stage.engines,
        fuelAmountTons: dto.second_stage.fuel_amount_tons,
        burnTimeSec: dto.second_stage.burn_time_sec,
      },
      engines: {
        isp: {
          seaLevel: dto.engines.isp.sea_level,
          vacuum: dto.engines.isp.vacuum,
        },
        thrustSeaLevel: dto.engines.thrust_sea_level,
        thrustVacuum: dto.engines.thrust_vacuum,
        number: dto.engines.number,
        type: dto.engines.type,
        version: dto.engines.version,
        layout: dto.engines.layout,
        engineLossMax: dto.engines.engine_loss_max,
        propellant1: dto.engines.propellant_1,
        propellant2: dto.engines.propellant_2,
        thrustToWeight: dto.engines.thrust_to_weight,
      },
      landingLegs: dto.landing_legs,
      payloadWeights: dto.payload_weights,
      flickrImages: dto.flickr_images,
      name: dto.name,
      type: dto.type,
      isActive: dto.active,
      stages: dto.stages,
      boosters: dto.boosters,
      costPerLaunch: dto.cost_per_launch,
      successRatePct: dto.success_rate_pct,
      firstFlight: dto.first_flight,
      country: dto.country,
      company: dto.company,
      wikipedia: dto.wikipedia,
      description: dto.description,
      id: dto.id,
    };
  }

  toDto(entity: RocketEntity): RocketDtoSpaceX {
    return {
      height: entity.height,
      diameter: entity.diameter,
      mass: entity.mass,
      first_stage: {
        thrust_sea_level: entity.firstStage.thrustSeaLevel,
        thrust_vacuum: entity.firstStage.thrustVacuum,
        reusable: entity.firstStage.isReusable,
        engines: entity.firstStage.engines,
        fuel_amount_tons: entity.firstStage.fuelAmountTons,
        burn_time_sec: entity.firstStage.burnTimeSec,
      },
      second_stage: {
        thrust: entity.secondStage.thrust,
        payloads: {
          composite_fairing: entity.secondStage.payloads.compositeFairing,
          option_1: entity.secondStage.payloads.option1,
        },
        reusable: entity.secondStage.isReusable,
        engines: entity.secondStage.engines,
        fuel_amount_tons: entity.secondStage.fuelAmountTons,
        burn_time_sec: entity.secondStage.burnTimeSec,
      },
      engines: {
        isp: {
          sea_level: entity.engines.isp.seaLevel,
          vacuum: entity.engines.isp.vacuum,
        },
        thrust_sea_level: entity.engines.thrustSeaLevel,
        thrust_vacuum: entity.engines.thrustVacuum,
        number: entity.engines.number,
        type: entity.engines.type,
        version: entity.engines.version,
        layout: entity.engines.layout,
        engine_loss_max: entity.engines.engineLossMax,
        propellant_1: entity.engines.propellant1,
        propellant_2: entity.engines.propellant2,
        thrust_to_weight: entity.engines.thrustToWeight,
      },
      landing_legs: entity.landingLegs,
      payload_weights: entity.payloadWeights,
      flickr_images: entity.flickrImages,
      name: entity.name,
      type: entity.type,
      active: entity.isActive,
      stages: entity.stages,
      boosters: entity.boosters,
      cost_per_launch: entity.costPerLaunch,
      success_rate_pct: entity.successRatePct,
      first_flight: entity.firstFlight,
      country: entity.country,
      company: entity.company,
      wikipedia: entity.wikipedia,
      description: entity.description,
      id: entity.id,
    };
  }
}
