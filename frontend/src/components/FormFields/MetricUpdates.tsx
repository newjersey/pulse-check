import { useEffect, useMemo } from "react";
import { useFormContext } from "../../contexts/FormContext"
import { useDataContext } from "../../contexts/DataContext";
import useProject from "../../utils/useProject";
import { hydrateIdList } from "../../utils/projectUtils";
import React from "react";

export default function () {
  const { metricTypes } = useDataContext()
  const { handleInputChange, addFields } = useFormContext();
  const { project } = useProject();

  const fields = useMemo(() => {
    if (!project || !metricTypes) return
    const _metricTypes = hydrateIdList(project?.["Metric types"], metricTypes);
    return _metricTypes.map(m => ({
      name: `${m.id}-metric`,
      value: undefined,
      label: m.Name,
      required: true,
      id: `${m.id}-metric`,
      formKey: 'metricUpdates',
      foreignKeys: {
        'Metric type': m.id
      }
    }))
  }, [project, metricTypes])

  useEffect(() => {
    if (!fields) { return }
    addFields(fields)
  }, [fields])

  return <>
    {fields && fields.map(field => (
      <React.Fragment key={field.id}>
        <label className="usa-label" htmlFor={field.id}>{field.label}</label>
        <input className="usa-input" id={field.id} name={field.name} onChange={handleInputChange} defaultValue={field.value} type="number" pattern="[0-9]" />
      </React.Fragment>
    ))}
  </>
}