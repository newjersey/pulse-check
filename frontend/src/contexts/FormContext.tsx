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
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
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

export function FormContextProvider({ children, initialFields }: { children: ReactNode; initialFields: Fields }) {
  const [fields, setFields] = useState(initialFields);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    const newFields = {...fields}
    fieldsValues.forEach(val => {
      newFields[val.id] = val
    })
    setFields(newFields)
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