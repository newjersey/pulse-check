import { useParams } from "react-router";
import PageTemplate from "../components/PageTemplate";
import { useDataContext } from "../contexts/DataContext";
import imageUrl from "@newjersey/njwds/dist/img/sprite.svg";
import { useEffect, useState } from "react";

export default function () {
  const { projectId } = useParams();
  const { getProject, loading } = useDataContext();
  const project = getProject(projectId)
  const [milestonesToggled, setMilestonesToggled] = useState<{ [key: string]: { expanded: boolean } }>()

  useEffect(() => {
    const milestonesById = project?.Milestones?.reduce((o, { id, ...milestone }) => ({ ...o, [id]: { ...milestone, expanded: false } }), {})
    setMilestonesToggled(milestonesById)
  }, [project])

  if (loading || !project) {
    return <PageTemplate title="Loading project...">
      <></>
    </PageTemplate>
  }

  function toggleMilestone(id: string) {
    const milestone = milestonesToggled?.[id]
    if (!milestone) {
      return
    }
    setMilestonesToggled({ ...milestonesToggled, [id]: { ...milestone, expanded: !milestone.expanded } })
  }

  return <PageTemplate title={project.Name}>
    <p>{project.Description}</p>
    {project.Milestones ? (
      <table className="usa-table usa-table--borderless">
        <thead>
          <tr>
            <th scope="col">Milestone</th>
            <th scope="col">Date last updated</th>
            <th scope="col">Update</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {/* TODO https://dequeuniversity.com/class/semantic-structure-wcag-2.2/tables/complex */}
          {project.Milestones.map((m) => (
            m["Milestone updates"] || [{ Status: '', id: m.id, Created: '', Description: 'No updates yet' }]).map((u, idx, updates) => {
              const expanded = milestonesToggled?.[m.id]?.expanded
              let tdStyleOverride = {}
              if (idx > 0 && !expanded) {
                return
              }
              if (expanded && updates.length > 1) {
                tdStyleOverride = {
                  borderTop: 'none',
                  borderBottom: 'none',
                }
              }
              return (<tr key={u.id}>
                {idx === 0 && <th scope="row" rowSpan={expanded ? updates.length : 1} style={{ verticalAlign: 'top' }}>
                  <div className="display-flex flex-1">
                    {updates.length > 1 && <button
                      onClick={() => toggleMilestone(m.id)}
                      className="bg-transparent cursor-pointer text-black display-flex flex-align-center border-0 flex-column flex-justify-center margin-left-neg-6 margin-right-1"
                    >
                      <span className="usa-button usa-sr-only">
                        {m.Title} Details
                      </span>
                      {!expanded ?
                        (<svg className="usa-icon" aria-hidden="true" focusable="false" role="img">
                          <use href={`${imageUrl}#unfold_more`}></use>
                        </svg>) :
                        (<svg className="usa-icon" aria-hidden="true" focusable="false" role="img">
                          <use href={`${imageUrl}#unfold_less`}></use>
                        </svg>)
                      }
                    </button>}

                    <div className="display-flex flex-column">
                      <p className='text-bold margin-0'>
                        {m.Title}
                      </p>
                      <p className="margin-0">
                        {m.Description}
                      </p>
                    </div>
                  </div>
                </th>}
                <td style={tdStyleOverride}>
                  {u['Created']}
                </td>
                <td style={tdStyleOverride}>
                  {u['Description']}
                </td>
                <td style={tdStyleOverride}>
                  {u['Status']}
                </td>
              </tr>)
            }))}
        </tbody>
      </table>) : <p>No milestones added yet</p>}
  </PageTemplate>
}