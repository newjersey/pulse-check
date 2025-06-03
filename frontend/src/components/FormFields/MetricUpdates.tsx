import { useEffect, useMemo } from "react";
import { useFormContext } from "../../contexts/FormContext"
import { useDataContext } from "../../contexts/DataContext";
import useProject from "../../utils/useProject";
import { hydrateIdList } from "../../utils/projectUtils";
import React from "react";

export default function () {
  const { metricTypes, loading } = useDataContext()
  const { handleInputChange, addFields, fields } = useFormContext();
  const { project } = useProject();

  useEffect(() => {
    if (loading || !project || !metricTypes) { return }
    const _metricTypes = hydrateIdList(project?.["Metric types"], metricTypes);
    const fieldsToAdd = _metricTypes.map(m => ({
      name: `${m.id}-metric`,
      value: undefined,
      label: m.Name,
      required: true,
      id: `${m.id}-metric`,
      formKey: 'metricUpdates',
      airtableIds: {
        'Metric type': m.id
      }
    }))
    addFields(fieldsToAdd)
  }, [loading, project, metricTypes])


  const displayFields = useMemo(() => {
    return Object.values(fields).filter(f => f.formKey === 'metricUpdates')
  }, [fields])

  return <>
    {displayFields && displayFields.map(field => (
      <React.Fragment key={field.id}>
        <label className="usa-label" htmlFor={field.id}>{field.label}</label>
        <input className="usa-input" id={field.id} name={field.name} onChange={handleInputChange} defaultValue={field.value} type="number" pattern="[0-9]" />
      </React.Fragment>
    ))}
  </>
}