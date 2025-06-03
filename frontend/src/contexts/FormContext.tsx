import { ChangeEvent, createContext, ReactNode, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import useProject from '../utils/useProject';
// import { ProjectAddForm, ProjectEditForm, UpdateForm } from '../utils/types';

export type Field = {
  name: string;
  value: string | number | undefined;
  label: string;
  required: boolean | undefined;
  id: string;
  formKey: string; // TODO keyof ProjectAddForm | ProjectEditForm | UpdateForm;
  action?: 'create' | 'update' | 'delete';
  airtableIds?: { [key: string]: any }; // TODO better typing here too
  isValid?: boolean;
  replace?: boolean;
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
  success: boolean;
  setSuccess: Function;
}

const FormContext = createContext<FormContextType>({
  fields: {},
  handleInputChange: () => { },
  addFields: () => { },
  deleteAField: () => { },
  fieldsByFormKey: () => { },
  isFormInvalid: () => { },
  getForeignKeyHandler: () => { },
  success: false,
  setSuccess: () => { }
});

const { Provider } = FormContext;

export const useFormContext = () => useContext(FormContext)

export function FormContextProvider({ type, children }: { type: 'create-update' | 'add-project' | 'update-project', children: ReactNode }) {
  const { projectId } = useProject()

  const sessionStorageId = useMemo(() => {
    if (!projectId) return
    return `${projectId}-${type}`
  }, [projectId])

  let defaultFields = {}
  let defaultSuccess = false
  const storedData = window.sessionStorage?.getItem(sessionStorageId || '')
  if (storedData) {
    const parsed = JSON.parse(storedData)
    defaultFields = parsed.fields
    defaultSuccess = parsed.success
  }
  const [fields, dispatchFields] = useReducer<Fields, [{ newFields: Partial<Fields>, replace?: boolean }]>(fieldsReducer, defaultFields);
  const [success, setSuccess] = useState(defaultSuccess);

  useEffect(() => {
    if (!sessionStorageId) return
    window.sessionStorage.setItem(sessionStorageId, JSON.stringify({ fields, success }))
  }, [fields, success])

  function fieldsReducer(priorFields: Fields, { newFields, replace }: { newFields: Partial<Fields>, replace?: boolean }) {
    if (replace) {
      return newFields as Fields
    }
    const fieldsToSet = { ...priorFields, ...newFields } as Fields
    return fieldsToSet
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const field = fields[id]
    const isValid = !field.required || (field.required && !!value)
    dispatchFields({
      replace: field.replace,
      newFields: {
        [id]: {
          ...field,
          value,
          isValid,
        },
      }
    })
  };

  const getForeignKeyHandler = (field: Field, foreignKey: string) => {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      dispatchFields({
        newFields: {
          [field.id]: {
            ...field,
            airtableIds: {
              ...field.airtableIds,
              [foreignKey]: value
            }
          },
        }
      })
    }
  }

  const addFields = (fieldsToAdd: Field[]) => {
    const newFields: Fields = {}
    fieldsToAdd.forEach(newField => {
      if (fields[newField.id]) return
      newFields[newField.id] = {
        ...newField,
        isValid: !newField.required || (newField.required && !!newField.value)
      }
    })
    dispatchFields({ newFields })
  }

  const deleteAField = (id: keyof Fields) => {
    const field = fields[id]
    dispatchFields({
      newFields: {
        [id]: {
          ...field,
          isValid: true,
          action: 'delete'
        } as Field
      }
    })
  }

  const fieldsByFormKey = (formKey: string) => {
    const returnValues: { value: string | number | undefined; airtableIds: object | undefined; action: string | undefined }[] = []
    Object.values(fields).forEach(f => {
      if (f.formKey !== formKey) {
        return
      }
      const { value, airtableIds, action } = f
      returnValues.push({ value, airtableIds, action })
    })
    return returnValues
  }

  const isFormInvalid = () => {
    return Object.values(fields).some(f => f.isValid === false)
  }

  return <Provider value={{ fields, handleInputChange, addFields, deleteAField, fieldsByFormKey, isFormInvalid, getForeignKeyHandler, success, setSuccess }}>
    {children}
  </Provider>
}