import { useEffect } from "react";
import { useFormContext } from "../../contexts/FormContext"
import { projectPhase } from "../../utils/types";
import useProject from "../../utils/useProject";

export default function() {
  const { project } = useProject();
  const { handleInputChange, addFields } = useFormContext();

  const field = {
    name: 'projectPhase',
    value: project?.Phase,
    label: 'Project phase',
    required: true,
    id: 'projectPhase',
    formKey: "projectPhase"
  }

  useEffect(() => {
    addFields([field])
  }, [])

  return <>
    <label className="usa-label" htmlFor={field.id}>{field.label}</label>
    <select className="usa-select" name={field.name} id={field.id} required={field.required} onChange={handleInputChange} defaultValue={field.value}>
      <option value={undefined}>- Choose a phase -</option>
      {projectPhase.map(value => (
        <option value={value} key={value}>{value}</option>
      ))}
    </select>
  </>
}