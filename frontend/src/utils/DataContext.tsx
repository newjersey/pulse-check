import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'

export type Project = {
  id: string;
  Name: string;
  Description: string;
}

export type DataContextType = {
  authToken: string | undefined;
  setAuthToken: Function;
  loading: Boolean;
  projects: Project[];
  milestones: any[];
  milestoneUpdates: any[];
  getProject: Function;
}

const DataContext = createContext<DataContextType>({
  authToken: undefined,
  setAuthToken: () => {},
  loading: false,
  projects: [],
  milestones: [],
  milestoneUpdates: [],
  getProject: () => {},
});

const { Provider } = DataContext;

export const useDataContext = () => useContext(DataContext)

const apiURL = import.meta.env.DEV ? import.meta.env.VITE_DEV_ENDPOINT : import.meta.env.VITE_ENDPOINT;

export function DataContextProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState();
  const [projects, setProjects] = useState<Project[]>([]) // consider setting by ID instead?
  const [milestones, setMilestones] = useState<any[]>([])
  const [milestoneUpdates] = useState<any[]>([])
  
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
      fetchData('milestones', setMilestones);
    }
  }, [authToken, setLoading, setProjects])

  function getProject(id: string) {
    return projects.find(p => p.id === id)
  }

  return <Provider value={{ authToken, setAuthToken, loading, projects, milestones, milestoneUpdates, getProject }}>
    {children}
  </Provider>
}