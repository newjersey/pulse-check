import { useEffect, useMemo } from "react";
import { useFormContext } from "../../contexts/FormContext"
import useProject from "../../utils/useProject";

export default function () {
  const { handleInputChange, addFields, fields } = useFormContext();
  const { project } = useProject();

  const field = useMemo(() => fields['phaseChangeDate'], [fields])

  useEffect(() => {
    const currentPhaseDate = project?.["Anticipated phase change"]
    const value = currentPhaseDate ?? ''
    addFields([{
      name: 'phaseChangeDate',
      value,
      label: 'Anticipated phase change date',
      required: true,
      id: 'phaseChangeDate',
      formKey: "phaseChangeDate"
    }])
  }, [])

  if (!field) return <></>

  return <>
    <label className="usa-label" htmlFor={field.id}>{field.label}</label>
    <input className="usa-input" id={field.id} name={field.name} onChange={handleInputChange} defaultValue={field.value} type="date" />
  </>
}