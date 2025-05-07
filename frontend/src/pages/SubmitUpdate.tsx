import { useParams } from "react-router";
import PageTemplate from "../components/PageTemplate";
import { useDataContext } from "../utils/DataContext";

export default function () {
  const { projects, getProject, loading } = useDataContext();
  const { projectId } = useParams();
  const project = getProject(projectId)

  function submit() {
    console.log('submitted')
  }

  if (loading || !project) {
    return <PageTemplate title="Loading project...">
      <></>
    </PageTemplate>
  }

  return <PageTemplate title={`Submit an update for ${project.Name}`}>
    <form action={submit}>
      <label className="usa-label" htmlFor="projects">Project</label>
      <select className="usa-select" name="projects" id="projects">
        <option value="">- Select a project -</option>
        {projects && projects.map(p => (
          <option value={p["id"]}>{p["Name"]}</option>
        ))}
      </select>
      {/* Updater - dropdown of people on that project */}
      {/* Project phase change? */}
      {/* Add any blockers */}
      {/* Blocker description, status */}
      {/* Add any metrics */}
      {/* Add new metric type */}
      {/* Update description */}
      <input type="submit" className="usa-button" />
    </form>
  </PageTemplate>
}