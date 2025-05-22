import { useEffect } from "react";
import { useFormContext } from "../../contexts/FormContext"
import { statusValues } from "../../utils/types";

export default function() {
  const { handleInputChange, addFields } = useFormContext();

  const field = {
    name: 'update-status',
    value: '',
    label: 'Overall project status',
    required: true,
    id: 'update-status'
  }

  useEffect(() => {
    addFields([field])
  }, [])

  return <>
    <label className="usa-label" htmlFor={field.id}>{field.label}</label>
    <select className="usa-select" name={field.name} id={field.id} required={field.required} onChange={handleInputChange} defaultValue={field.value}>
      <option value={undefined}>- Choose a status -</option>
      {statusValues.map(value => (
        <option value={value} key={value}>{value}</option>
      ))}
    </select>
  </>
}