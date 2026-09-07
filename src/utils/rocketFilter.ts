import type {
  Rocket,
} from '@/types/rocket'

import type {
  RocketFilters,
} from '@/types/rocketFilter'


function getLaunchCost(
  rocket: Rocket,
): number | null {

  if (
    rocket.launch_cost === null ||
    rocket.launch_cost === undefined ||
    rocket.launch_cost === ''
  ) {
    return null
  }


  const cost =
    Number(
      rocket.launch_cost,
    )


  if (
    Number.isNaN(cost)
  ) {
    return null
  }


  return cost
}


function getFirstFlightYear(
  rocket: Rocket,
): number | null {

  if (
    !rocket.maiden_flight
  ) {
    return null
  }


  const date =
    new Date(
      rocket.maiden_flight,
    )


  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return null
  }


  return date.getUTCFullYear()
}


function matchesSearch(
  rocket: Rocket,
  search: string,
) {

  const keyword =
    search
      .trim()
      .toLowerCase()


  if (!keyword) {
    return true
  }


  const name =
    rocket.full_name
      ?.toLowerCase()
    ?? ''


  const description =
    rocket.description
      ?.toLowerCase()
    ?? ''


  return (
    name.includes(keyword) ||
    description.includes(keyword)
  )
}


function matchesLaunchCost(
  rocket: Rocket,
  filter:
    RocketFilters['launchCost'],
) {

  if (
    filter === 'all'
  ) {
    return true
  }


  const cost =
    getLaunchCost(rocket)


  if (
    filter === 'unknown'
  ) {
    return cost === null
  }


  if (
    cost === null
  ) {
    return false
  }


  switch (filter) {

    case 'under-20':
      return (
        cost < 20_000_000
      )


    case '20-50':
      return (
        cost >= 20_000_000 &&
        cost < 50_000_000
      )


    case '50-100':
      return (
        cost >= 50_000_000 &&
        cost <= 100_000_000
      )


    case 'over-100':
      return (
        cost > 100_000_000
      )


    default:
      return true

  }
}


function matchesFirstFlight(
  rocket: Rocket,
  filter:
    RocketFilters['firstFlight'],
) {

  if (
    filter === 'all'
  ) {
    return true
  }


  const year =
    getFirstFlightYear(
      rocket,
    )


  if (
    filter === 'unknown'
  ) {
    return year === null
  }


  if (
    year === null
  ) {
    return false
  }


  switch (filter) {

    case 'before-2010':
      return year < 2010


    case '2010-2019':
      return (
        year >= 2010 &&
        year <= 2019
      )


    case '2020-plus':
      return year >= 2020


    default:
      return true

  }
}


export function filterRockets(
  rockets: Rocket[],
  filters: RocketFilters,
) {

  return rockets.filter(
    rocket => {

      return (
        matchesSearch(
          rocket,
          filters.search,
        )
        &&
        matchesLaunchCost(
          rocket,
          filters.launchCost,
        )
        &&
        matchesFirstFlight(
          rocket,
          filters.firstFlight,
        )
      )

    },
  )
}
