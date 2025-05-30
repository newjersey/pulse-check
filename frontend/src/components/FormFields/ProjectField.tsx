import { ChangeEvent, useEffect } from "react";
import { useFormContext } from "../../contexts/FormContext"
import { useDataContext } from "../../contexts/DataContext";
import useProject from "../../utils/useProject";
import { useLocation, useNavigate } from "react-router";

export default function () {
  const { projects } = useDataContext()
  const { handleInputChange, addFields } = useFormContext();
  const { projectId } = useProject();
  const navigate = useNavigate()
  const location = useLocation()

  const field = {
    name: 'project',
    value: projectId || undefined,
    label: 'Project',
    required: true,
    id: 'project',
    formKey: 'project'
  }

  useEffect(() => {
    addFields([field])
  }, [])

  function handleProjectChange(e: ChangeEvent<HTMLSelectElement>) {
    handleInputChange(e)
    navigate({...location, search: `?projectId=${e.target.value}`}, { replace: true })
  }

  return <>
    <label className="usa-label" htmlFor={field.id}>{field.label}</label>
    <select className="usa-select" name={field.name} id={field.id} required={field.required} onChange={handleProjectChange} defaultValue={field.value}>
      <option value="">- Choose a project -</option>
      {projects && Object.keys(projects).map(key => (
        <option value={key} key={key}>{projects[key]?.Name}</option>
      ))}
    </select>
  </>
}