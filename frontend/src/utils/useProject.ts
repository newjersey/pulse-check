import { useParams, useSearchParams } from "react-router";
import { useDataContext } from "../contexts/DataContext";
import { useMemo } from "react";

export default function() {
  let { projectId: paramProjectId } = useParams();
  const [searchParams] = useSearchParams()
  const projectId = useMemo(() => {
    const searchParamProjectId = searchParams.get('projectId')
    return paramProjectId || searchParamProjectId
  }, [paramProjectId, searchParams])
  
  const { projects } = useDataContext()
  const project = useMemo(() => (projectId && projects ? projects[projectId] : undefined), [projectId, projects])
  return { project, projectId }
}