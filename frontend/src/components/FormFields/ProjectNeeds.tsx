import { useEffect, useMemo } from "react";
import { Field, useFormContext } from "../../contexts/FormContext"
import { useDataContext } from "../../contexts/DataContext";
import useProject from "../../utils/useProject";
import { hydrateIdList } from "../../utils/projectUtils";
import imageUrl from "@newjersey/njwds/dist/img/sprite.svg";


export default function () {
  const { needs, needsTypes, loading } = useDataContext()
  const { handleInputChange, addFields, deleteAField, getForeignKeyHandler, fields } = useFormContext();
  const { project } = useProject();

  useEffect(() => {
    if (loading) { return }
    if (!project || !needs || !needsTypes) return;

    const _needs = hydrateIdList(project["Current project needs"], needs);

    const initialFields: Field[] = _needs.map(n => (
      {
        name: `${n.id}-desc`,
        value: n.Description,
        label: "Details",
        required: true,
        id: `${n.id}-desc`,
        formKey: "projectNeeds",
        action: 'update',
        airtableIds: {
          id: n.id,
          'Need type': needsTypes[n["Project need type"][0]].id
        },
      }
    ))
    addFields(initialFields)
  }, [loading, project, needs, needsTypes])

  const displayFields = useMemo(() => {
    return Object.values(fields).filter(f => f.formKey === 'projectNeeds' && f.action !== 'delete')
  }, [fields])

  function handleDeleteClick(fieldId: string) {
    return () => {
      deleteAField(fieldId);
    }
  }

  function handleAddClick() {
    addFields([{
      name: `${displayFields.length}-desc`,
      value: '',
      label: "Details",
      required: true,
      id: `${displayFields.length}-desc`,
      formKey: "projectNeeds",
      action: 'create',
      airtableIds: {
        'Need type': undefined
      },
    }])
  }

  return <>
    {!displayFields?.length && <button className="usa-button" onClick={handleAddClick}>Add a project need</button>}
    {displayFields.map((field) => (
      <fieldset className="usa-fieldset">
        <legend className="usa-sr-only">Project need</legend>
        <div className="grid-row grid-gap">
          <div className="grid-col-4">
            <label className="usa-label" htmlFor={`${field.id}-type`}>Need type</label>
            <select className="usa-select" name={`${field.id}-type`} id={`${field.id}-type`} required onChange={getForeignKeyHandler(field, 'Need type')} defaultValue={field.airtableIds?.['Need type'] || undefined}>
              <option value={undefined}>- Choose a project -</option>
              {needsTypes && Object.keys(needsTypes).map(key => (
                <option value={key} key={key}>{needsTypes[key]?.Type}</option>
              ))}
            </select>
          </div>

          <div className="grid-col-6">
            <label className="usa-label" htmlFor={field.id}>{field.label}</label>
            <input className="usa-input" id={field.id} name={field.name} onChange={handleInputChange} defaultValue={field.value} />
          </div>

          <div className="grid-col-2 display-flex" style={{ marginTop: '3rem ' }}>
            <button className="usa-button usa-button--secondary" onClick={handleDeleteClick(field.id)}>
              <span className="usa-sr-only">Delete</span>
              <svg className="usa-icon" aria-hidden="true" focusable="false" role="img">
                <use href={`${imageUrl}#delete`}></use>
              </svg>
            </button>
            <button className="usa-button" onClick={handleAddClick}>
              <span className="usa-sr-only">Add another</span>
              <svg className="usa-icon" aria-hidden="true" focusable="false" role="img">
                <use href={`${imageUrl}#add`}></use>
              </svg>
            </button>
          </div>
        </div>
      </fieldset>
    ))}
  </>
}