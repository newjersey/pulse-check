import { Project, RecordByIdType, ProjectUpdate, StatusValues } from "./types"

export function hydrateIdList<T>(idList: string[] | undefined, records: RecordByIdType<T> | undefined): T[] {
  if (!records || !idList) {
    return []
  }
  return idList.map(id => {
    return records[id]
  })
}

export function getSortedProjectUpdates(project: Project, allUpdates: RecordByIdType<ProjectUpdate>) {
  const projectUpdates = hydrateIdList(project["Project updates"], allUpdates)
  return projectUpdates.sort((a, b) => {
    return new Date(b.Created).valueOf() - new Date(a.Created).valueOf();
  })
}

export const updateStatusValues: { [key: StatusValues[number]] : { class: string }} = {
  "On track": {
    class: 'usa-alert--success',
  },
  "Planning": {
    class: "usa-alert--info",
  },
  "Blocked internally": {
    class: "usa-alert--warning",
  },
  "Blocked externally": {
    class: "usa-alert--error",
  }
}