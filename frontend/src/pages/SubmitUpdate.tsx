import PageTemplate from "../components/PageTemplate";
import { useDataContext } from "../utils/DataContext";

export default function () {
  const { projects } = useDataContext();

  function submit() {
    console.log('submitted')
  }

  return <PageTemplate title="Submit an update">
    <form action={submit}>
      <label className="usa-label" htmlFor="projects">Project</label>
      <select className="usa-select" name="projects" id="projects">
        <option value="">- Select a project -</option>
        {projects && projects.map(p => (
          <option value={p["ID"]}>{p["Name"]}</option>
        ))}
      </select>
      {/* On project select, create an empty update? */}
      {/* Make that update store locally - make a person discard it? */}


      {/* Updater - dropdown of people on that project */}
      {/* Project phase change? */}
      {/* Add any blockers */}
      {/* Blocker description, status */}
      {/* Add any metrics */}
      {/* Add new metric type */}
      {/* Update description */}
      <input type="submit"  className="usa-button" />
    </form>
  </PageTemplate>
}