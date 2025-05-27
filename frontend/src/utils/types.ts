export const projectPhase = [
  "Discovery",
  "Prototype ",
  "Launch",
  "Maintain",
  "Handoff",
  "Intake",
  "Sunset"
]
type ProjectPhase = typeof projectPhase;

export const initiatives = [
  "ResX",
  "BizX",
  "C+E Lab",
  "D+P",
  "General"
]
export type Initiative = typeof initiatives;

export type Project = {
  id: string;
  Name: string;
  Description: string;
  Phase: ProjectPhase[number];
  Initiative: Initiative[number];
  "Anticipated phase change": string;
  Team: string[];
  Partners: string[];
  Technologies: string[];
  Deliverables: string[];
  "Metric types": string[];
  "Metrics updates": string[];
  "Roadmap link": string;
  "Project updates": string[];
  "Current project needs": string[];
}

const functionalAreas = ["Content",
  "Design/research",
  "Engineering",
  "Product manager",
  "Policy",
  "Leadership",
  "C&E Lab"
]
type FunctionalAreas = typeof functionalAreas;
export type Person = {
  id: string;
  Name: string;
  "Functional area": FunctionalAreas[number];
  "Affiliation": string[];
}

export const statusValues = [
  "Blocked externally",
  "Blocked internally",
  "Planning",
  "On track",
  "Paused"
]
export type StatusValues = typeof statusValues;
export type ProjectUpdate = {
  id: string;
  Status: StatusValues[number];
  Description: string;
  Created: string;
}

export const deliverableStatusValues = [
  "Planning",
  "In progress",
  "Blocked internally",
  "Blocked externally",
  "Done",
  "Removed"
]
export type DeliverableStatusValues = typeof deliverableStatusValues;
export type Deliverable = {
  id: string;
  Title: string;
  Description: string;
  Project: string;
  Status: DeliverableStatusValues[number];
}

export type Technology = {
  id: string;
  Technology: string;
  Notes: string;
}

export type Organization = {
  id: string;
}

export type MetricUpdate = {
  id: string;
  "Metric type": string[];
  Value: string;
  Created: string;
}

export const metricValueTypes = [
  "Integer",
  "Money",
  "Percentage",
  "Decimal"
]
type MetricValueTypes = typeof metricValueTypes;
export type MetricType = {
  id: string;
  Name: string;
  "Value type": MetricValueTypes[number];
}

export type NeedType = {
  id: string;
  Type: string;
}

export type Need = {
  id: string;
  Project: string[];
  "Project need type": NeedType["id"][];
  Description: string;
}

export type RecordByIdType<T> = {
  [key: string]: T
}

export type DataContextType = {
  authToken: string | null;
  setAuthToken: Function;
  loading: Boolean;
  loadingResponse: Boolean;
  projects: RecordByIdType<Project> | undefined;
  people: RecordByIdType<Person> | undefined;
  updates: RecordByIdType<ProjectUpdate> | undefined;
  deliverables: RecordByIdType<Deliverable> | undefined;
  technologies: RecordByIdType<Technology> | undefined;
  organizations: RecordByIdType<Organization> | undefined;
  metricsUpdates: RecordByIdType<MetricUpdate> | undefined;
  metricTypes: RecordByIdType<MetricType> | undefined;
  needsTypes: RecordByIdType<NeedType> | undefined;
  needs: RecordByIdType<Need> | undefined;
  postData: (endpoint: string, data: any) => any;
}

// const tableNames = {
//   projects: 'Projects',
//   people: 'People',
//   updates: 'Project updates',
//   deliverables: 'Deliverables',
//   technologies: 'Technologies',
//   organizations: 'Organizations',
//   metrics_updates: 'Metrics updates',
//   metric_types: 'Metric types',
//   needs_types: 'Project needs types',
//   needs: 'Current project needs'
// }

export type ProjectEditForm = {
  projectId: string;
  projectName?: string;
  projectDesc?: string;
  initiative?: Initiative[number];
  team?: string[];
  partners?: string[];
  technologies?: string[];
  metricTypes?: string[];
  roadmapLink?: string;
  phase?: ProjectPhase[number];
  phaseChangeDate?: string;
  deliverables?: {
    [id: string]: Deliverable
  };
}

export type ProjectAddForm = {
  projectName: string;
  projectDesc: string;
  initiative: Initiative[number];
  team: string[];
  partners: string[];
  technologies: string[];
  metricTypes: string[];
  roadmapLink: string;
  phase: ProjectPhase[number];
  phaseChangeDate: string;
  deliverables?: {}[];
}

export type UpdateForm = {
  projectId: string;
  updateDetails: string;
  projectStatus: StatusValues[number];
  metricUpdates: {}[];
  projectNeeds: {}[];
  phase: ProjectPhase[number];
  phaseChangeDate: string;
  deliverables: {}[];
}
