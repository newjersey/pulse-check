import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

export type Project = {
  ID: string;
  Name: string;
}

export type DataContextType = {
  setAuthToken: Function;
  loading: Boolean;
  projects: Project[];
  milestones: any[];
  milestoneUpdates: any[];
}

const DataContext = createContext<DataContextType>({
  setAuthToken: () => {},
  loading: false,
  projects: [],
  milestones: [],
  milestoneUpdates: [],
});

const { Provider } = DataContext;

export const useDataContext = () => useContext(DataContext)

export function DataContextProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [projects, setProjects] = useState<Project[]>([])
  const [milestones, setMilestones] = useState<any[]>([])
  const [milestoneUpdates, setMilestoneUpdates] = useState<any[]>([])
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_ENDPOINT}/projects`, { headers: { Authorization: 'Basic ' + authToken }});
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
    fetchData();
  }, [setProjects])

  return <Provider value={{ setAuthToken, loading, projects, milestones, milestoneUpdates }}>
    {children}
  </Provider>
}