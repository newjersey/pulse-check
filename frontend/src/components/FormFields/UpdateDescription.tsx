import { useEffect, useMemo } from "react";
import { useFormContext } from "../../contexts/FormContext"

export default function () {
  const { handleInputChange, addFields, fields } = useFormContext();

  const field = useMemo(() => fields['updateDetails'], [fields])

  useEffect(() => {
    addFields([{
      name: 'updateDetails',
      value: '',
      label: 'Update',
      required: true,
      id: 'updateDetails',
      formKey: "updateDetails"
    }])
  }, [])

  if (!field) return <></>

  return <>
    <label className="usa-label" htmlFor={field.id}>{field.label}</label>
    <textarea className="usa-input" id={field.id} name={field.name} onChange={handleInputChange} defaultValue={field.value} style={{ minHeight: '6em' }} />
  </>
}