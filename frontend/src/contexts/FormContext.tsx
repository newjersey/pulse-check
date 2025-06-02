import { ChangeEvent, createContext, ReactNode, useContext, useReducer } from 'react'
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
  getForeignKeyHandler: () => { },
});

const { Provider } = FormContext;

export const useFormContext = () => useContext(FormContext)

export function FormContextProvider({ children }: { children: ReactNode }) {
  const [fields, dispatchFields] = useReducer<Fields, [newFields: Partial<Fields>]>(fieldsReducer, {});
  function fieldsReducer (priorFields: Fields, newFields: Partial<Fields>) {
    return {...priorFields, ...newFields } as Fields
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const field = fields[id]
    const isValid = !field.required || (field.required && !!value)
    dispatchFields({
      [id]: {
        ...field,
        value,
        isValid,
      },
    })
  };

  const getForeignKeyHandler = (field: Field, foreignKey: string) => {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      dispatchFields({
        [field.id]: {
          ...field,
          airtableIds: {
            ...field.airtableIds,
            [foreignKey]: value
          }
        },
      })
    }
  }

  const addFields = (fieldsToAdd: Field[]) => {
    const newFields: Fields = {}
    fieldsToAdd.forEach(newField => {
      newFields[newField.id] = {
        ...newField,
        isValid: !newField.required || (newField.required && !!newField.value)
      }
    })
    dispatchFields(newFields)
  }

  const deleteAField = (id: keyof Fields) => {
    const field = fields[id]
    dispatchFields({
      [id]: {
        ...field,
        isValid: true,
        action: 'delete'
      } as Field
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

  return <Provider value={{ fields, handleInputChange, addFields, deleteAField, fieldsByFormKey, isFormInvalid, getForeignKeyHandler }}>
    {children}
  </Provider>
}