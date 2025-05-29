import { ChangeEvent, createContext, ReactNode, useContext, useState } from 'react'
// import { ProjectAddForm, ProjectEditForm, UpdateForm } from '../utils/types';

type Field = {
  name: string;
  value: string | number | undefined;
  label: string;
  required: boolean | undefined;
  id: string;
  formKey: string; // TODO keyof ProjectAddForm | ProjectEditForm | UpdateForm;
  foreignKeys?: { [key: string]: any }; // TODO better typing here too
  isValid?: boolean;
}

export type Fields = {
  [id: string]: Field;
}

type FormContextType = {
  fields: Fields,
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void,
  addFields: (fields: Field[]) => void;
  deleteAField: Function;
  fieldsByFormKey: Function;
  isFormInvalid: Function;
  getForeignKeyHandler: Function;
}

const FormContext = createContext<FormContextType>({
  fields: {},
  handleInputChange: () => { },
  addFields: () => { },
  deleteAField: () => { },
  fieldsByFormKey: () => { },
  isFormInvalid: () => { },
  getForeignKeyHandler: () => {},
});

const { Provider } = FormContext;

export const useFormContext = () => useContext(FormContext)

export function FormContextProvider({ children }: { children: ReactNode }) {
  const [fields, setFields] = useState<Fields>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const field = fields[id]
    const isValid = !field.required || (field.required && !!value)
    setFields(_fields => ({
      ...fields,
      [id]: {
        ...field,
        value,
        isValid,
      },
    }));
  };

  const getForeignKeyHandler = (field: Field, foreignKey: string) => {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setFields(_fields => ({
        ...fields,
        [field.id]: {
          ...field,
          foreignKeys: {
            ...field.foreignKeys,
            [foreignKey]: value
          }
        },
      }));
    }
  }

  const addFields = (fieldsToAdd: Field[]) => {
    setFields(_fields => {
      const newFields = { ..._fields }
      fieldsToAdd.forEach(newField => {
        newFields[newField.id] = {
          ...newField,
          isValid: !newField.required || (newField.required && !!newField.value)
        }
      })
      return newFields
    })
  }

  const deleteAField = (id: keyof Fields) => {
    const newFields = Object.assign({}, fields)
    delete newFields[id]
    setFields(newFields)
  }

  const fieldsByFormKey = (formKey: string) => {
    const returnValues: { value: string | number | undefined; foreignKeys: object | undefined; }[] = []
    Object.values(fields).forEach(f => {
      if (f.formKey !== formKey) {
        return
      }
      const { value, foreignKeys } = f
      returnValues.push({ value, foreignKeys })
    })
    return returnValues
  }

  const isFormInvalid = () => {
    return Object.values(fields).some(f => f.isValid === false)
  }

  return <Provider value={{ fields, handleInputChange, addFields, deleteAField, fieldsByFormKey, isFormInvalid, getForeignKeyHandler }}>
    {children}
  </Provider>
}