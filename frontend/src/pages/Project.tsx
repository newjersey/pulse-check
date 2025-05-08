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
    <h2>Milestones</h2>
    <table>
      <thead>
        <tr>
          <th>Milestone</th>
          <th>Date last updated</th>
          <th>Update</th>
          <th>Status</th>
        </tr>
      </thead>
      {project.Milestones?.map((m) => (
        m["Milestone updates"] || [{ Status: '' }]).map((u, idx) => (
          <tr key={u.id}>
            <td>
              <span className={idx === 0 ? undefined : 'usa-sr-only'}>
                {m.Title}
              </span>
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
    </table>
  </PageTemplate>
}