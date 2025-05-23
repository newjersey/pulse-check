import { useEffect, useMemo } from "react";
import { useFormContext } from "../../contexts/FormContext"
import { useDataContext } from "../../contexts/DataContext";
import useProject from "../../utils/useProject";
import { hydrateIdList } from "../../utils/projectUtils";
import imageUrl from "@newjersey/njwds/dist/img/sprite.svg";


export default function () {
  const { needs, needsTypes } = useDataContext()
  const { handleInputChange, addFields } = useFormContext();
  const { project } = useProject();

  const fieldSets = useMemo(() => {
    if (!project || !needs || !needsTypes) return
    const _needs = hydrateIdList(project["Current project needs"], needs);
    return _needs.map(n => ([
      {
        name: `${n.id}-type`,
        value: needsTypes[n["Project need type"][0]].id,
        label: "Need type",
        required: true,
        id: `${n.id}-type`,
        formKey: "projectNeeds"
      },
      {
        name: `${n.id}-desc`,
        value: n.Description,
        label: "Details",
        required: true,
        id: `${n.id}-desc`,
        formKey: "projectNeeds"
      }
    ]))
  }, [project, needs])

  useEffect(() => {
    if (!fieldSets) { return }
    addFields(fieldSets.flat())
  }, [fieldSets])

  return <>
    {fieldSets && fieldSets.map(([needField, needDescriptionField]) => (
      <fieldset className="usa-fieldset margin-y-4">
        <legend>Project need</legend>
        <div className="grid-row grid-gap">
          <div className="grid-col-4">
            <label className="usa-label" htmlFor={needField.id}>{needField.label}</label>
            <select className="usa-select" name={needField.name} id={needField.id} required={needField.required} onChange={handleInputChange} defaultValue={needField.value}>
              <option value={undefined}>- Choose a project -</option>
              {needsTypes && Object.keys(needsTypes).map(key => (
                <option value={key} key={key}>{needsTypes[key]?.Type}</option>
              ))}
            </select>
          </div>

          <div className="grid-col-6">
            <label className="usa-label" htmlFor={needDescriptionField.id}>{needDescriptionField.label}</label>
            <input className="usa-input" id={needDescriptionField.id} name={needDescriptionField.name} onChange={handleInputChange} defaultValue={needDescriptionField.value} />
          </div>

          <div className="grid-col-2 display-flex" style={{ marginTop: '3rem '}}>
            <button className="usa-button usa-button--secondary">
              <span className="usa-sr-only">Delete</span>
              <svg className="usa-icon" aria-hidden="true" focusable="false" role="img">
                <use href={`${imageUrl}#delete`}></use>
              </svg>
            </button>
            <button className="usa-button">
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