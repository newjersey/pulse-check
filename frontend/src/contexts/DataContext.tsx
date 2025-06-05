import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from 'react'
import { DataType, TableNameKeys, tableNames } from '../utils/types';

export type DataContextType = DataType & {
  authToken: string | null;
  setAuthToken: Function;
  loading: Boolean;
  loadingResponse: Boolean;
  postData: (endpoint: string, data: any) => any;
  fetchData: (endpoint: TableNameKeys[number][]) => void;
}

export const defaultDataContext = {
  authToken: null,
  setAuthToken: () => { },
  loading: false,
  loadingResponse: false,
  postData: () => { },
  fetchData: () => { },
}

const DataContext = createContext<DataContextType>(defaultDataContext);

const { Provider } = DataContext;

export const useDataContext = () => useContext(DataContext)

const apiURL = import.meta.env.DEV ? import.meta.env.VITE_DEV_ENDPOINT : import.meta.env.VITE_ENDPOINT;

export function DataContextProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [authToken, _setAuthToken] = useState<string | null>(sessionStorage.getItem("nj-ooi-pulse-check"));
  const [data, dispatchData] = useReducer<DataType, [updatedData: Partial<DataType>]>(dataReducer, {})

  function setAuthToken(input: string) {
    _setAuthToken(input)
    sessionStorage.setItem("nj-ooi-pulse-check", input);
  }

  function dataReducer(priorData: DataType, updatedData: Partial<DataType>) {
    return { ...priorData, ...updatedData}
  }

  async function fetchData(_tableNames: TableNameKeys[number][]) {
    setLoading(true);
    try {
      const dataUpdateFragments = await Promise.all(_tableNames.map(async tableName => {
        const response = await fetch(
          `${apiURL}/api/${tableName}`,
          { headers: { Authorization: 'Basic ' + authToken } }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return { [tableName]: result.data }
      }))
      const dataUpdate = dataUpdateFragments.reduce((prev, fragment) => ({...prev, ...fragment}), {})
      dispatchData(dataUpdate)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  async function postData(endpoint: string, inputData: any) {
    setLoadingResponse(true)
    try {
      const response = await fetch(
        `${apiURL}/api/${endpoint}`,
        {
          method: 'POST',
          headers: { Authorization: 'Basic ' + authToken },
          body: JSON.stringify(inputData)
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

  return <Provider value={{ authToken, setAuthToken, loading, loadingResponse, ...data, postData, fetchData }}>
    {children}
  </Provider>
}