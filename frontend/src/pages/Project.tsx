import { useParams } from "react-router";
import PageTemplate from "../components/PageTemplate";
import { useDataContext } from "../utils/DataContext";

export default function () {
  const { projectId } = useParams();
  const { getProject, loading } = useDataContext();
  const project = getProject(projectId)

  if (loading || !project) {
    return <PageTemplate title="Loading project...">
      <></>
    </PageTemplate>
  }

  return <PageTemplate title={project.Name}>
    <p>{project.Description}</p>
    <table className="usa-table usa-table--borderless">
      <thead>
        <tr>
          <th>Milestone</th>
          <th>Date last updated</th>
          <th>Update</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {project.Milestones?.map((m) => (
          m["Milestone updates"] || [{ Status: '', id: m.id, Created: '', Description: 'No updates found' }]).map((u, idx) => (
            <tr key={u.id}>
              <td>
                <p className={idx === 0 ? 'text-bold margin-0' : 'usa-sr-only'}>
                  {m.Title}
                </p>
                {idx === 0 && <p className="margin-0">
                  {m.Description}
                </p>}
              </td>
              <td>
                {u['Created']}
              </td>
              <td>
                {u['Description']}
              </td>
              <td>
                {u['Status']}
              </td>
            </tr>
          )
          ))}
      </tbody>
    </table>
  </PageTemplate>
}