import { useEffect } from "react";
import { useFormContext } from "../../contexts/FormContext"

export default function() {
  const { handleInputChange, addFields } = useFormContext();

  const field = {
    name: 'updateDetails',
    value: '',
    label: 'Update',
    required: true,
    id: 'updateDetails',
    formKey: "updateDetails"
  }

  useEffect(() => {
    addFields([field])
  }, [])

  return <>
    <label className="usa-label" htmlFor={field.id}>{field.label}</label>
    <textarea className="usa-input" id={field.id} name={field.name} onChange={handleInputChange} defaultValue={field.value} style={{ minHeight: '6em' }}/>
  </>
}