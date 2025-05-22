import { useParams } from "react-router";
import PageTemplate from "../components/PageTemplate";
import { useDataContext } from "../contexts/DataContext";
import { useMemo } from "react";
import { getSortedProjectUpdates, hydrateIdList, updateStatusValues } from "../utils/projectUtils";
import TeamList from "../components/TeamList";

export default function () {
  const { projectId } = useParams();
  const { projects, deliverables, updates, loading } = useDataContext();

  const project = useMemo(() => projectId && projects ? projects[projectId] : undefined, [projectId, projects])
  const projectDeliverables = useMemo(() => hydrateIdList(project?.Deliverables, deliverables), [project, deliverables])

  const sortedUpdates = useMemo(() => updates && project ? getSortedProjectUpdates(project, updates) : [], [project, updates])
  const mostRecentUpdate = useMemo(() => sortedUpdates ? sortedUpdates[0] : undefined, [sortedUpdates])

  if (loading || !project) {
    return <PageTemplate title="Loading project...">
      <></>
    </PageTemplate>
  }

  return <PageTemplate title={project.Name}>
    <div className="grid-row">
      <div className="grid-col-4">
        <p>{project.Phase}</p>
        <TeamList project={project} />
      </div>
      <div className="grid-col-8">
        <p>{project.Description}</p>
      </div>
    </div>

    <div className="grid-row grid-gap">
      <div className="grid-col-2">
        <h2>Progress</h2>
        <div>
          Progress TBD
        </div>
      </div>
      <div className="grid-col-2">
        <h2>Status</h2>
        {mostRecentUpdate?.Status &&
          <div
            className={`usa-alert flex-1 margin-y-0 padding-2 ${updateStatusValues[mostRecentUpdate.Status]?.class}`}
            key={`${project.id}-${mostRecentUpdate.Status}`}
          >
            <div>{mostRecentUpdate.Status}</div>
          </div>}
      </div>
      <div className="grid-col-8">
        <h2>Deliverables</h2>
        {projectDeliverables ? (
          <table className="usa-table usa-table--borderless">
            <thead>
              <tr>
                <th scope="col">Deliverable</th>
                <th scope="col">Description</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* TODO https://dequeuniversity.com/class/semantic-structure-wcag-2.2/tables/complex */}
              {projectDeliverables.map((u) => (
                <tr key={u.id}>
                  <th scope="row" rowSpan={1} style={{ verticalAlign: 'top' }}>
                    {u.Title}
                  </th>
                  <td>
                    {u['Description']}
                  </td>
                  <td>
                    <div
                      className={`usa-alert flex-1 margin-y-0 padding-1 ${updateStatusValues[u.Status]?.class}`}
                      key={`${project.id}-${u.Status}`}
                    >
                      <div>{u.Status}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>) : <p>No milestones added yet</p>}
      </div>
    </div>

  </PageTemplate>
}