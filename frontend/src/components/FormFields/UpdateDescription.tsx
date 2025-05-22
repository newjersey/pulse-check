import { useEffect } from "react";
import { useFormContext } from "../../contexts/FormContext"

export default function() {
  const { fields, handleInputChange, addFields } = useFormContext();

  const field = {
    name: '',
    value: '',
    label: '',
    required: true,
    id: ''
  }

  useEffect(() => {
    addFields(field)
  }, [])

  return <>
    <label className="usa-label" htmlFor={field.id}>{field.label}</label>
    <input className="usa-input" id={field.id} name={field.name} onChange={handleInputChange} value={fields[field.id].value} />
  </>
}