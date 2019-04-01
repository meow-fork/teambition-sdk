import { Observable } from 'rxjs/Observable'

import { OrganizationId, ScenarioFieldConfigObjectType } from 'teambition-types'
import { SDK, CacheStrategy } from '../../SDK'
import { SDKFetch } from '../../SDKFetch'
import {
  ScenarioFieldConfigSchema,
  TaskScenarioFieldConfigSchema,
  EventScenarioFieldConfigSchema
} from '../../schemas'
import { ApiResult } from '../../Net'
import { OriginalResponse } from '../../Net/Pagination'
import { withCustomFields, WithCustomFieldsOptions } from './with-custom-fields'

export function getOrgScenarioFieldConfigsFetch(
  this: SDKFetch,
  organizationId: OrganizationId,
  objectType: 'task',
  query?: GetOrgScenarioFieldConfigsFetchOptions
): Observable<TaskScenarioFieldConfigSchema[]>

export function getOrgScenarioFieldConfigsFetch(
  this: SDKFetch,
  organizationId: OrganizationId,
  objectType: 'event',
  query?: GetOrgScenarioFieldConfigsFetchOptions
): Observable<EventScenarioFieldConfigSchema[]>

export function getOrgScenarioFieldConfigsFetch(
  this: SDKFetch,
  organizationId: OrganizationId,
  objectType: ScenarioFieldConfigObjectType,
  query?: GetOrgScenarioFieldConfigsFetchOptions
): Observable<ScenarioFieldConfigSchema[]>

export function getOrgScenarioFieldConfigsFetch(
  this: SDKFetch,
  organizationId: OrganizationId,
  objectType: ScenarioFieldConfigObjectType,
  { sort, withCustomfields = true }: GetOrgScenarioFieldConfigsFetchOptions = {}
) {
  const url = `organizations/${organizationId}/scenariofieldconfigs`
  const query = { sort, withCustomfields, objectType }

  return this.get<OriginalResponse<ScenarioFieldConfigSchema>>(url, query).map(
    (resp) => {
      return resp.result
    }
  )
}

declare module '../../SDKFetch' {
  interface SDKFetch {
    getOrgScenarioFieldConfigs: typeof getOrgScenarioFieldConfigsFetch
  }
}

SDKFetch.prototype.getOrgScenarioFieldConfigs = getOrgScenarioFieldConfigsFetch

export function getOrgScenarioFieldConfigs(
  this: SDK,
  organizationId: OrganizationId,
  objectType: 'task',
  query?: GetOrgScenarioFieldConfigsOptions
): Observable<TaskScenarioFieldConfigSchema[]>

export function getOrgScenarioFieldConfigs(
  this: SDK,
  organizationId: OrganizationId,
  objectType: 'event',
  query?: GetOrgScenarioFieldConfigsOptions
): Observable<EventScenarioFieldConfigSchema[]>

export function getOrgScenarioFieldConfigs(
  this: SDK,
  organizationId: OrganizationId,
  objectType: ScenarioFieldConfigObjectType,
  query?: GetOrgScenarioFieldConfigsOptions
): Observable<ScenarioFieldConfigSchema[]>

export function getOrgScenarioFieldConfigs(
  this: SDK,
  organizationId: OrganizationId,
  objectType: ScenarioFieldConfigObjectType,
  query: GetOrgScenarioFieldConfigsOptions = {}
): Observable<ScenarioFieldConfigSchema[]> {
  const token = this.lift({
    cacheValidate: CacheStrategy.Request,
    tableName: 'ScenarioFieldConfig',
    request: this.fetch.getOrgScenarioFieldConfigs(organizationId, objectType, {
      ...query,
      withCustomfields: true
    }),
    query: {
      where: [{ _boundToObjectId: organizationId }, { objectType }]
    },
    excludeFields: ['taskflowstatuses'] // 企业接口不关心该字段
  } as ApiResult<ScenarioFieldConfigSchema, CacheStrategy.Request>)

  return token.changes().pipe(withCustomFields(this, query))
}

declare module '../../SDK' {
  interface SDK {
    getOrgScenarioFieldConfigs: typeof getOrgScenarioFieldConfigs
  }
}

SDK.prototype.getOrgScenarioFieldConfigs = getOrgScenarioFieldConfigs

export interface GetOrgScenarioFieldConfigsOptions
  extends WithCustomFieldsOptions {
  sort?: string
}

export interface GetOrgScenarioFieldConfigsFetchOptions {
  sort?: string
  withCustomfields?: boolean
}
