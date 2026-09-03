declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'vue-router'

  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/rockets/[id]': RouteRecordInfo<'/rockets/[id]', '/rockets/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
  }
}
