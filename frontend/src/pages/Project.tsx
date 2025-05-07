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
    <ul>
      {project.milestones?.map((m) => (<li key={m.id}>
        {m.Title}
      </li>))}
    </ul>
  </PageTemplate>
}