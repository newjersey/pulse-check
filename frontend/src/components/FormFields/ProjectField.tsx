import { useEffect } from "react";
import { useFormContext } from "../../contexts/FormContext"
import { useDataContext } from "../../contexts/DataContext";
import useProject from "../../utils/useProject";

export default function () {
  const { projects } = useDataContext()
  const { handleInputChange, addFields } = useFormContext();
  const { projectId } = useProject();

  const field = {
    name: 'project',
    value: projectId || undefined,
    label: 'Project',
    required: true,
    id: 'project'
  }

  useEffect(() => {
    addFields([field])
  }, [])

  return <>
    <label className="usa-label" htmlFor={field.id}>{field.label}</label>
    <select className="usa-select" name={field.name} id={field.id} required={field.required} onChange={handleInputChange} defaultValue={field.value}>
      <option value={undefined}>- Choose a project -</option>
      {projects && Object.keys(projects).map(key => (
        <option value={key} key={key}>{projects[key]?.Name}</option>
      ))}
    </select>
  </>
}