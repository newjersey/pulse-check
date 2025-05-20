export const statusValues = [
  "Backlog/planning",
  "In progress",
  "At risk",
  "Blocked",
  "Done",
  "Canceled"
]

type StatusValues = typeof statusValues;

export type MilestoneUpdateStatus = StatusValues[number]

export type MilestoneUpdate = {
  id: string;
  ID: string;
  Created: string;
  Description: string;
  Status: MilestoneUpdateStatus;
}

export type Milestone = {
  id: string;
  Title: string;
  Description: string;
  'Milestone updates'?: MilestoneUpdate[]
}

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
  Milestones?: Milestone[];
  Team: string[];
}

export type Person = {
  Name: string;
  id: string;
}

export type Update = {

}

export type Deliverable = {
  
}

export type Technology = {
  
}

export type Organization = {
  
}

export type MetricUpdate = {
  
}

export type MetricType = {
  
}

export type NeedType = {
  
}

export type Need = {
  
}

export type RecordByIdType<T> = {
  [key: string]: T
}

export type DataContextType = {
  authToken: string | undefined;
  setAuthToken: Function;
  loading: Boolean;
  projects: RecordByIdType<Project>;
  people: RecordByIdType<Person>;
  updates: RecordByIdType<Update>;
  deliverables: RecordByIdType<Deliverable>;
  technologies: RecordByIdType<Technology>;
  organizations: RecordByIdType<Organization>;
  metricsUpdates: RecordByIdType<MetricUpdate>;
  metricTypes: RecordByIdType<MetricType>;
  needsTypes: RecordByIdType<NeedType>;
  needs: RecordByIdType<Need>;
  postData: (endpoint: string, data: any) => any;
}