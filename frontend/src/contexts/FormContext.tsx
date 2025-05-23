import { ChangeEvent, createContext, ReactNode, useContext, useState } from 'react'
// import { ProjectAddForm, ProjectEditForm, UpdateForm } from '../utils/types';

type Field = {
  name: string;
  value: string | number | undefined;
  label: string;
  required: boolean | undefined;
  id: string;
  formKey: string; // TODO keyof ProjectAddForm | ProjectEditForm | UpdateForm;
}

export type Fields = {
  [id: string]: Field;
}

type FormContextType = {
  fields: Fields,
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void,
  addFields: (fields: Field[]) => void;
  deleteAField: Function;
}

const FormContext = createContext<FormContextType>({
  fields: {},
  handleInputChange: () => { },
  addFields: () => { },
  deleteAField: () => { },
});

const { Provider } = FormContext;

export const useFormContext = () => useContext(FormContext)

export function FormContextProvider({ children }: { children: ReactNode }) {
  const [fields, setFields] = useState<Fields>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const field = fields[id]
    setFields(_fields => ({
      ...fields,
      [id]: {
        ...field,
        value
      },
    }));
  };

  const addFields = (fieldsToAdd: Field[]) => {
    setFields(_fields => {
      const newFields = { ..._fields }
      fieldsToAdd.forEach(newField => {
        newFields[newField.id] = newField
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