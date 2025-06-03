import { useEffect, useMemo } from "react";
import { useFormContext } from "../../contexts/FormContext"
import { useDataContext } from "../../contexts/DataContext";
import useProject from "../../utils/useProject";
import { useLocation, useNavigate } from "react-router";

export default function () {
  const { projects } = useDataContext()
  const { handleInputChange, addFields, fields } = useFormContext();
  const { projectId } = useProject();
  const navigate = useNavigate()
  const location = useLocation()

  const field = useMemo(() => fields['project'], [fields])

  useEffect(() => {
    addFields([{
      name: 'project',
      value: projectId || undefined,
      label: 'Project',
      required: true,
      id: 'project',
      formKey: 'project',
      replace: true
    }])
  }, [])

  useEffect(() => {
    if (!field?.value) return
    navigate({ ...location, search: `?projectId=${field.value}` }, { replace: true })
  }, [field])

  if (!field) return <></>

  return <>
    <label className="usa-label" htmlFor={field.id}>{field.label}</label>
    <select className="usa-select" name={field.name} id={field.id} required={field.required} onChange={handleInputChange} defaultValue={field.value}>
      <option value="">- Choose a project -</option>
      {projects && Object.keys(projects).map(key => (
        <option value={key} key={key}>{projects[key]?.Name}</option>
      ))}
    </select>
  </>
}