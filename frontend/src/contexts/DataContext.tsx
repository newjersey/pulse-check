import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { DataType, TableNameKeys, tableNames } from '../utils/types';
import { useLocation } from 'react-router';

export type DataContextType = DataType & {
  authToken: string | null;
  setAuthToken: Function;
  loading: Boolean;
  loadingResponse: Boolean;
  postData: (endpoint: string, data: any) => any;
  fetchData: (endpoint: TableNameKeys[number][]) => void;
  setReloadTablesAfterNavigate: Function;
}

const DataContext = createContext<DataContextType>({
  authToken: null,
  setAuthToken: () => {},
  loading: false,
  loadingResponse: false,
  postData: () => {},
  fetchData: () => {},
  setReloadTablesAfterNavigate: () => {}
});

const { Provider } = DataContext;

export const useDataContext = () => useContext(DataContext)

const apiURL = import.meta.env.DEV ? import.meta.env.VITE_DEV_ENDPOINT : import.meta.env.VITE_ENDPOINT;

export function DataContextProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [authToken, _setAuthToken] = useState<string | null>(sessionStorage.getItem("nj-ooi-pulse-check"));
  const [reloadTablesAfterNavigate, setReloadTablesAfterNavigate] = useState<TableNameKeys[number][] | undefined>()
  const [data, setData] = useState<DataType>({})
  const { pathname } = useLocation();

  function setAuthToken (input: string) {
    _setAuthToken(input)
    sessionStorage.setItem("nj-ooi-pulse-check", input);
  }

  async function fetchData (_tableNames: TableNameKeys[number][]) {
    setLoading(true);
    try {
      await Promise.all(_tableNames.map(async tableName => {
        const response = await fetch(
          `${apiURL}/api/${tableName}`,
          { headers: { Authorization: 'Basic ' + authToken } }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(priorData => ({...priorData, [tableName]: result.data }));
      }))
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
      return response
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingResponse(false);
    }
  }
  
  useEffect(() => {
    if (authToken) {
      fetchData(Object.keys(tableNames))
    }
  }, [authToken])

  useEffect(() => {
    if (reloadTablesAfterNavigate?.length) {
      fetchData(reloadTablesAfterNavigate)
    }
  }, [pathname])

  return <Provider value={{ authToken, setAuthToken, loading, loadingResponse, ...data, postData, fetchData, setReloadTablesAfterNavigate }}>
    {children}
  </Provider>
}