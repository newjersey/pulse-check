import { useParams } from "react-router";
import PageTemplate from "../components/PageTemplate";
import { Milestone, statusValues, useDataContext } from "../utils/DataContext";
import { useEffect, useState } from "react";

export default function () {
  const { getProject, loading } = useDataContext();
  const { projectId } = useParams();
  const project = getProject(projectId)
  const [milestonesToUpdate, updateMilestonesToUpdate] = useState<Milestone[]>([])

  useEffect(() => {
    const notFinishedMilestones = project?.Milestones?.filter(m => {
      const mostRecent = m["Milestone updates"]?.[0]
      if (!mostRecent) {
        return true
      }
      return mostRecent.Status !== 'Done' && mostRecent.Status !== 'Canceled'
    })
    if (notFinishedMilestones) {
      updateMilestonesToUpdate(notFinishedMilestones)
    }
  }, [project])

  function addAMilestone() {
    const newMilestone = {
      id: `new-${milestonesToUpdate.length}`,
      Title: 'New milestone',
      Description: ''
    }
    updateMilestonesToUpdate([...milestonesToUpdate, newMilestone])
  }

  function submit({ entries }: FormData) {
    // For each milestone to update, add to update
    // assign updater to each one
    console.log(entries, 'submitted')
    // For new milestone, make a separate request
  }

  if (loading || !project) {
    return <PageTemplate title="Loading project...">
      <></>
    </PageTemplate>
  }

  return <PageTemplate title={`Submit an update for ${project.Name}`}>
    <form action={submit}>
      <div>
        <label className="usa-label" htmlFor={`updater`}>Updater</label>
        <select className="usa-select" name={`updater`} id={`updater`}>
          <option>- Choose a team member -</option>
          {statusValues.map(status => (
            <option value={status}>{status}</option>
          ))}
        </select>
      </div>
      {milestonesToUpdate.map((m) => (<fieldset key={m.id} className="usa-fieldset margin-y-4">
        <legend className="usa-legend usa-legend font-body-lg">
          Milestone: {m.Title}
        </legend>
        {/* TODO attach this text to the legend-- aria details? described? */}
        <p className="font-body-sm">{m.Description}</p>

        <div className="grid-row">
          <div className="grid-col-6">
            <label className="usa-label" htmlFor={`${m.id}-description`}>Update description</label>
            <input className="usa-input" id={`${m.id}-description`} name={`${m.id}-description`} onChange={(e) => console.log(e.target.value)} />
          </div>

          <div className="margin-x-2">
            <label className="usa-label" htmlFor={`${m.id}-status`}>Status</label>
            <select className="usa-select" name={`${m.id}-status`} id={`${m.id}-status`} defaultValue={m["Milestone updates"]?.[0].Status}>
              {statusValues.map(status => (
                <option value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>))}

      <div className="margin-y-4 display-flex flex-justify">
        <button className="usa-button usa-button--outline" onClick={addAMilestone}>Add a milestone</button>
        <input type="submit" className="usa-button" value="Submit" />
      </div>

    </form>
  </PageTemplate>
}