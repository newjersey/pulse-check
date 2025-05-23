import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { DataContextType, RecordByIdType, Project, Person, Deliverable, Technology, Organization, MetricUpdate, MetricType, NeedType, Need, ProjectUpdate } from '../utils/types';

const DataContext = createContext<DataContextType>({
  authToken: null,
  setAuthToken: () => {},
  loading: false,
  loadingResponse: false,
  projects: undefined,
  people: undefined,
  updates: undefined,
  deliverables: undefined,
  technologies: undefined,
  organizations: undefined,
  metricsUpdates: undefined,
  metricTypes: undefined,
  needsTypes: undefined,
  needs: undefined,
  postData: () => {}
});

const { Provider } = DataContext;

export const useDataContext = () => useContext(DataContext)

const apiURL = import.meta.env.DEV ? import.meta.env.VITE_DEV_ENDPOINT : import.meta.env.VITE_ENDPOINT;

export function DataContextProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [authToken, _setAuthToken] = useState<string | null>(sessionStorage.getItem("nj-ooi-pulse-check"));
  const [refreshData, setRefreshData] = useState(false)
  function setAuthToken(input: string) {
    _setAuthToken(input)
    sessionStorage.setItem("nj-ooi-pulse-check", input);
  }

  const [projects, setProjects] = useState<RecordByIdType<Project>>()
  const [people, setPeople] = useState<RecordByIdType<Person>>()
  const [updates, setUpdates] = useState<RecordByIdType<ProjectUpdate>>()
  const [deliverables, setDeliverables] = useState<RecordByIdType<Deliverable>>()
  const [technologies, setTechnologies] = useState<RecordByIdType<Technology>>()
  const [organizations, setOrganizations] = useState<RecordByIdType<Organization>>()
  const [metricsUpdates, setMetricsUpdates] = useState<RecordByIdType<MetricUpdate>>()
  const [metricTypes, setMetricTypes] = useState<RecordByIdType<MetricType>>()
  const [needsTypes, setNeedsTypes] = useState<RecordByIdType<NeedType>>()
  const [needs, setNeeds] = useState<RecordByIdType<Need>>()

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
  
  useEffect(() => {
    if (authToken) {
      fetchData('projects', setProjects);
      fetchData('people', setPeople);
      fetchData('updates', setUpdates);
      fetchData('deliverables', setDeliverables);
      fetchData('technologies', setTechnologies);
      fetchData('organizations', setOrganizations);
      fetchData('metrics_updates', setMetricsUpdates);
      fetchData('metric_types', setMetricTypes);
      fetchData('needs_types', setNeedsTypes);
      fetchData('needs', setNeeds);
    }
  }, [authToken, refreshData])

  async function postData(endpoint: string, data: any) {
    setLoadingResponse(true)
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
      // setRefreshData(true); TODO FIGURE THIS OUT
      return response
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingResponse(false);
    }
  }

  return <Provider value={{ authToken, setAuthToken, loading, loadingResponse, projects, people, updates, deliverables, technologies, organizations, metricsUpdates, metricTypes, needsTypes, needs, postData }}>
    {children}
  </Provider>
}