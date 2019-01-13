import { Observable } from 'rxjs/Observable'

import { ProjectId, ScenarioFieldConfigObjectType } from 'teambition-types'
import { SDK, CacheStrategy } from '../../SDK'
import { SDKFetch } from '../../SDKFetch'
import {
  ScenarioFieldConfigSchema,
  TaskScenarioFieldConfigSchema,
  EventScenarioFieldConfigSchema
} from '../../schemas'
import { ApiResult } from '../../Net'
import { withCustomFields } from './with-custom-fields'

export function getScenarioFieldConfigsFetch(
  this: SDKFetch,
  projectId: ProjectId,
  objectType: 'task',
  options?: GetScenarioFieldConfigsOptions
): Observable<TaskScenarioFieldConfigSchema[]>

export function getScenarioFieldConfigsFetch(
  this: SDKFetch,
  projectId: ProjectId,
  objectType: 'event',
  options?: GetScenarioFieldConfigsOptions
): Observable<EventScenarioFieldConfigSchema[]>

export function getScenarioFieldConfigsFetch(
  this: SDKFetch,
  projectId: ProjectId,
  objectType: ScenarioFieldConfigObjectType,
  options?: GetScenarioFieldConfigsOptions
): Observable<ScenarioFieldConfigSchema[]>

export function getScenarioFieldConfigsFetch(
  this: SDKFetch,
  projectId: ProjectId,
  objectType: ScenarioFieldConfigObjectType,
  options: GetScenarioFieldConfigsOptions = {}
) {
  const url = `projects/${projectId}/scenariofieldconfigs`
  const { withTaskflowstatus, withCustomfields } = options
  const query = { objectType, withTaskflowstatus, withCustomfields }

  return this.get<ScenarioFieldConfigSchema[]>(url, query)
}

declare module '../../SDKFetch' {
  // tslint:disable-next-line:no-shadowed-variable
  interface SDKFetch {
    getScenarioFieldConfigs: typeof getScenarioFieldConfigsFetch
  }
}

SDKFetch.prototype.getScenarioFieldConfigs = getScenarioFieldConfigsFetch

export function getScenarioFieldConfigs(
  this: SDK,
  projectId: ProjectId,
  objectType: 'task',
  options?: GetScenarioFieldConfigsOptions
): Observable<TaskScenarioFieldConfigSchema[]>

export function getScenarioFieldConfigs(
  this: SDK,
  projectId: ProjectId,
  objectType: 'event',
  options?: GetScenarioFieldConfigsOptions
): Observable<EventScenarioFieldConfigSchema[]>

export function getScenarioFieldConfigs(
  this: SDK,
  projectId: ProjectId,
  objectType: ScenarioFieldConfigObjectType,
  options?: GetScenarioFieldConfigsOptions
): Observable<ScenarioFieldConfigSchema[]>

export function getScenarioFieldConfigs(
  this: SDK,
  projectId: ProjectId,
  objectType: ScenarioFieldConfigObjectType,
  options: GetScenarioFieldConfigsOptions = {}
): Observable<ScenarioFieldConfigSchema[]> {
  const token = this.lift({
    cacheValidate: CacheStrategy.Request,
    tableName: 'ScenarioFieldConfig',
    request: this.fetch.getScenarioFieldConfigs(projectId, objectType, options),
    query: {
      where: [{ _boundToObjectId: projectId }, { objectType }]
    },
    assocFields: {
      ...(options.withTaskflowstatus
        ? {
            taskflowstatuses: [
              '_id',
              '_taskflowId',
              'name',
              'kind',
              'rejectStatusIds',
              'pos'
            ]
          }
        : {})
    }
  } as ApiResult<ScenarioFieldConfigSchema, CacheStrategy.Request>)

  if (!options.withCustomfields) {
    return token.changes()
  }

  return token.changes().pipe(withCustomFields(this))
}

declare module '../../SDK' {
  // tslint:disable-next-line:no-shadowed-variable
  interface SDK {
    getScenarioFieldConfigs: typeof getScenarioFieldConfigs
  }
}

SDK.prototype.getScenarioFieldConfigs = getScenarioFieldConfigs

export interface GetScenarioFieldConfigsOptions {
  withTaskflowstatus?: boolean
  withCustomfields?: boolean
}
