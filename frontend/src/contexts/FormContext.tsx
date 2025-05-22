import { ChangeEvent, createContext, ReactNode, useContext, useState } from 'react'

type Field = {
  name: string;
  value: string | number | undefined;
  label: string;
  required: boolean | undefined;
  id: string;
}

export type Fields = {
  [id: string]: Field;
}

type FormContextType = {
  fields: Fields,
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void,
  addFields: Function;
  deleteAField: Function;
}

const FormContext = createContext<FormContextType>({
  fields: {},
  handleInputChange: () => {},
  addFields: () => {},
  deleteAField: () => {}
});

const { Provider } = FormContext;

export const useFormContext = () => useContext(FormContext)

export function FormContextProvider({ children }: { children: ReactNode }) {
  const [fields, setFields] = useState<Fields>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFields({
      ...fields,
      [id]: {
        ...fields[id],
        value
      },
    });
  };

  const addFields = (fieldsValues: Field[]) => {
    setFields(_fields => {
      const newFields = {..._fields}
      fieldsValues.forEach(val => {
        newFields[val.id] = val
      })
      return newFields
    })
  }

  const deleteAField = (id: keyof Fields) => {
    const newFields = Object.assign({}, fields)
    delete newFields[id]
    setFields(newFields)
  }

  return <Provider value={{ fields, handleInputChange, addFields, deleteAField }}>
    {children}
  </Provider>
}