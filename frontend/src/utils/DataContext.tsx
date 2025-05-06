import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

export type Project = {
  ID: string;
  Name: string;
}

export type DataContextType = {
  authToken: string | undefined;
  setAuthToken: Function;
  loading: Boolean;
  projects: Project[];
  milestones: any[];
  milestoneUpdates: any[];
}

const DataContext = createContext<DataContextType>({
  authToken: undefined,
  setAuthToken: () => {},
  loading: false,
  projects: [],
  milestones: [],
  milestoneUpdates: [],
});

const { Provider } = DataContext;

export const useDataContext = () => useContext(DataContext)

const apiURL = import.meta.env.DEV ? import.meta.env.VITE_DEV_ENDPOINT : import.meta.env.VITE_ENDPOINT;

export function DataContextProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState();
  const [projects, setProjects] = useState<Project[]>([]) // consider setting by ID instead?
  const [milestones] = useState<any[]>([])
  const [milestoneUpdates] = useState<any[]>([])
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiURL}/projects`,
          { headers: { Authorization: 'Basic ' + authToken } }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setProjects(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (authToken) {
      fetchData();
    }
  }, [authToken, setLoading, setProjects])

  return <Provider value={{ authToken, setAuthToken, loading, projects, milestones, milestoneUpdates }}>
    {children}
  </Provider>
}