import { useEffect, useState } from "react";
import PageTemplate from "../components/PageTemplate";

export default function () {
  // Make form elements
  // Post to backend
  const [projects, setProjects] = useState<{ ID: string, "Needs intervention": string | number }[]>()

  function submit() {
    console.log('submitted')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_ENDPOINT}/projects`, { headers: { Authorization: 'Basic ' + btoa(`username:password`) }});
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setProjects(result);
      } catch (error) {
        console.error(error);
      } finally {
        // setLoading(false);
      }
    };
    // Call the async function
    fetchData();
  }, [setProjects])

  console.log(projects)

  return <PageTemplate title="Submit an update">
    <form action={submit}>
      <label className="usa-label" htmlFor="projects">Project</label>
      <select className="usa-select" name="projects" id="projects">
        <option value="">- Select a project -</option>
        {projects && projects.map(p => (
          <option value={p.id}>{p["Name"]}</option>
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