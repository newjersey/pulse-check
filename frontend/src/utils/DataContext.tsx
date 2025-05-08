import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'

export const statusValues = [
  "Backlog/planning",
  "In progress",
  "Done",
  "Blocked",
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
}

export type DataContextType = {
  authToken: string | undefined;
  setAuthToken: Function;
  loading: Boolean;
  projects: Project[];
  getProject: (id: string | undefined) => Project | undefined;
}

const DataContext = createContext<DataContextType>({
  authToken: undefined,
  setAuthToken: () => {},
  loading: false,
  projects: [],
  getProject: () => undefined,
});

const { Provider } = DataContext;

export const useDataContext = () => useContext(DataContext)

const apiURL = import.meta.env.DEV ? import.meta.env.VITE_DEV_ENDPOINT : import.meta.env.VITE_ENDPOINT;

export function DataContextProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState();
  const [projects, setProjects] = useState<Project[]>([]) // consider setting by ID instead?
  
  useEffect(() => {
    const fetchData = async (endpoint: string, setData: SetStateAction<any>) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiURL}/api/${endpoint}`,
          { headers: { Authorization: 'Basic ' + authToken } }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (authToken) {
      fetchData('projects', setProjects);
    }
  }, [authToken, setLoading, setProjects])

  function getProject(id: string | undefined): Project | undefined {
    return projects?.find(p => p.id === id)
  }

  return <Provider value={{ authToken, setAuthToken, loading, projects, getProject }}>
    {children}
  </Provider>
}