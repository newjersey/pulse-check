export const projectPhaseValues = [
  "Discovery",
  "Prototype ",
  "Launch",
  "Maintain",
  "Handoff",
  "Intake",
  "Sunset"
]
type ProjectPhaseValues = typeof projectPhaseValues;

export type Project = {
  id: string;
  Name: string;
  Description: string;
  Phase: ProjectPhaseValues[number];
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
  "On track"
]
type StatusValues = typeof statusValues;
export type ProjectUpdate = {
  id: string;
  Status: StatusValues[number];
  Description: string;
  Created: string;
}

export type Deliverable = {
  id: string;
  Title: string;
  Project: string;
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
  "Metric Type": string[];
  Value: string;
}

export const metricValueTypes = [
  "Blocked externally",
  "Blocked internally",
  "Planning",
  "On track"
]
type MetricValueTypes = typeof metricValueTypes;
export type MetricType = {
  id: string;
  Name: string;
  "Value type": MetricValueTypes[number];
}

export type NeedType = {
  id: string;
  Need: string;
}

export type Need = {
  id: string;
  Project: string[];
  "Project need type": string[];
  Description: string;
}

export type RecordByIdType<T> = {
  [key: string]: T
}

export type DataContextType = {
  authToken: string | undefined;
  setAuthToken: Function;
  loading: Boolean;
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