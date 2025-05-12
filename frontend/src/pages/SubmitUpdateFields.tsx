import { Milestone, Project, statusValues, useDataContext } from "../contexts/DataContext";
import { useState } from "react";
import { useFormContext } from "../contexts/FormContext";


export default function ({ project }: { project: Project }) {
  const { getPerson } = useDataContext();
  const { fields, handleInputChange, addFields } = useFormContext();
  const [milestonesToUpdate, updateMilestonesToUpdate] = useState<Milestone[]>(project.Milestones || [])

  function addAMilestone(e: any) {
    e.preventDefault();
    const id = `new-${milestonesToUpdate.length}`
    const newMilestone = {
      id,
      Title: 'New milestone',
      Description: ''
    }
    const newFields = [];

    const titleId = `${id}-milestone-title`
    newFields.push({
      name: titleId,
      value: '',
      label: 'New milestone title',
      required: true,
      id: titleId
    })
    const descId = `${id}-milestone-description`
    newFields.push({
      name: descId,
      value: '',
      label: 'New milestone description',
      required: true,
      id: descId
    })
    const updateDescId = `${id}-description`;
    newFields.push({
      name: updateDescId,
      value: '',
      label: 'First update description',
      required: true,
      id: updateDescId
    })
    const updateStatusId = `${id}-status`;
    newFields.push({
      name: updateStatusId,
      value: '',
      label: 'First update status',
      required: true,
      id: updateStatusId
    })

    addFields(newFields)
    updateMilestonesToUpdate([...milestonesToUpdate, newMilestone])
  }

  function onSubmit(e: any) {
    e.preventDefault();
    console.log(fields)
  }

  return <>
    {project.Team && <div>
      <label className="usa-label" htmlFor={fields.updater.id}>{fields.updater.label}</label>
      <select className="usa-select" name={fields.updater.name} id={fields.updater.id} required={fields.updater.required}>
        <option>- Choose a team member -</option>
        {project.Team.map(id => (
          <option value={id}>{getPerson(id)?.Name}</option>
        ))}
      </select>
    </div>}
    {milestonesToUpdate?.map((m) => {
      const descField = fields[`${m.id}-description`];
      const statusField = fields[`${m.id}-status`];

      if (!descField || !statusField) {
        return
      }

      let newTitle, newDesc;
      if (m.id.split('-')[0] === 'new') {
        newTitle = fields[`${m.id}-milestone-title`]
        newDesc = fields[`${m.id}-milestone-description`];
      }

      return (<fieldset key={m.id} className="usa-fieldset margin-y-4">
        <legend className="usa-legend usa-legend font-body-lg">
          Milestone: {m.Title}
        </legend>
        {/* TODO attach this text to the legend-- aria details? described? */}
        <p className="font-body-sm">{m.Description}</p>

        {newTitle && newDesc && <>
          <div className="grid-row grid-gap">
            <div className="grid-col-4">
              <label className="usa-label" htmlFor={newTitle.id}>{newTitle.label}</label>
              <input className="usa-input" id={newTitle.id} name={newTitle.name} onChange={handleInputChange} value={newTitle.value} />
            </div>

            <div className="grid-col-8">
              <label className="usa-label" htmlFor={newDesc.id}>{newDesc.label}</label>
              <input className="usa-input" id={newDesc.id} name={newDesc.name} onChange={handleInputChange} value={newDesc.value} />
            </div>
          </div>
        </>}

        <div className="grid-row">
          <div className="grid-col-6">
            <label className="usa-label" htmlFor={descField.id}>{descField.label}</label>
            <input className="usa-input" id={descField.id} name={descField.name} onChange={handleInputChange} value={descField.value} />
          </div>

          <div className="margin-x-2">
            <label className="usa-label" htmlFor={statusField.id}>{statusField.label}</label>
            <select className="usa-select" name={statusField.name} id={statusField.id} value={statusField.value} onChange={handleInputChange}>
              {statusValues.map(status => (
                <option value={status} key={`${statusField.id}-${status}`}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>)
    })}

    <div className="margin-y-4 display-flex flex-justify">
      <button className="usa-button usa-button--outline" onClick={addAMilestone}>Add a milestone</button>
      <input type="submit" className="usa-button" value="Submit" onClick={onSubmit} />
    </div>
  </>
}