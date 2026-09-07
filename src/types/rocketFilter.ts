export type LaunchCostFilter =
  | 'all'
  | 'under-20'
  | '20-50'
  | '50-100'
  | 'over-100'
  | 'unknown'


export type FirstFlightFilter =
  | 'all'
  | 'before-2010'
  | '2010-2019'
  | '2020-plus'
  | 'unknown'


export interface RocketFilters {
  search: string

  launchCost:
    LaunchCostFilter

  firstFlight:
    FirstFlightFilter
}
