import { useEffect } from "react";
import { useFormContext } from "../../contexts/FormContext"
import useProject from "../../utils/useProject";

export default function() {
  const { handleInputChange, addFields } = useFormContext();
  const { project } = useProject();

  const currentPhaseDate = project?.["Anticipated phase change"]
  const value = currentPhaseDate ?? ''

  const field = {
    name: 'phaseChangeDate',
    value,
    label: 'Anticipated phase change date',
    required: true,
    id: 'phaseChangeDate',
    formKey: "phaseChangeDate"
  }

  useEffect(() => {
    addFields([field])
  }, [])

  return <>
    <label className="usa-label" htmlFor={field.id}>{field.label}</label>
    <input className="usa-input" id={field.id} name={field.name} onChange={handleInputChange} defaultValue={field.value} type="date"/>
  </>
}