import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'

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

export type DataContextType = {
  authToken: string | undefined;
  setAuthToken: Function;
  loading: Boolean;
  projects: Project[];
  getProject: (id: string | undefined) => Project | undefined;
  getPerson: (id: string | undefined) => Person | undefined;
  people: Person[];
  postData: (endpoint: string, data: any) => any;
}

const DataContext = createContext<DataContextType>({
  authToken: undefined,
  setAuthToken: () => {},
  loading: false,
  projects: [],
  getProject: () => undefined,
  people: [],
  getPerson: () => undefined,
  postData: () => {}
});

const { Provider } = DataContext;

export const useDataContext = () => useContext(DataContext)

const apiURL = import.meta.env.DEV ? import.meta.env.VITE_DEV_ENDPOINT : import.meta.env.VITE_ENDPOINT;

export function DataContextProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState();
  const [projects, setProjects] = useState<Project[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [refreshData, setRefreshData] = useState(false)
  
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
        setRefreshData(false);
        setLoading(false);
      }
    };
    if (authToken) {
      fetchData('projects', setProjects);
      fetchData('people', setPeople);
    }
  }, [authToken, refreshData])

  async function postData(endpoint: string, data: any) {
    setLoading(true)
    try {
      const response = await fetch(
        `${apiURL}/api/${endpoint}`,
        {
          method: 'POST',
          headers: { Authorization: 'Basic ' + authToken },
          body: JSON.stringify(data)
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setRefreshData(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function getProject(id: string | undefined): Project | undefined {
    return projects?.find(p => p.id === id)
  }

  function getPerson(id: string | undefined): Person | undefined {
    return people?.find(p => p.id === id)
  }

  return <Provider value={{ authToken, setAuthToken, loading, projects, getProject, people, getPerson, postData }}>
    {children}
  </Provider>
}