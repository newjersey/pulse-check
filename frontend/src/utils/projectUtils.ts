import { Project, RecordByIdType, ProjectUpdate } from "./types"

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

// const usedStatusValues = {
//   "Done": {
//     class: 'usa-alert--success',
//     value: 0
//   },
//   "In progress": {
//     class: "usa-alert--info",
//     value: 0
//   },
//   "At risk": {
//     class: "usa-alert--warning",
//     value: 0
//   },
//   "Blocked": {
//     class: "usa-alert--error",
//     value: 0
//   }
// }