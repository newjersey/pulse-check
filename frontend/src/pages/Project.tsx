import { useParams } from "react-router";
import PageTemplate from "../components/PageTemplate";
import { useDataContext } from "../utils/DataContext";

export default function () {
  const { projectId } = useParams();
  const { getProject } = useDataContext();
  const project = getProject(projectId)

  console.log(projectId)

  return <PageTemplate title={project.Name}>
    <p>{project.Description}</p>
  </PageTemplate>
}