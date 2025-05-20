import PageTemplate from '../components/PageTemplate';
import { useDataContext } from '../contexts/DataContext';
import { useMemo } from 'react';
import ProjectRow from '../components/ProjectRow';
import { useLocation } from 'react-router';
import ProjectMilestoneTimeline from '../components/ProjectMilestoneTimeline';

export default function () {
  const { projects } = useDataContext();
  // const [sunsetProjects, setSunsetProjects] = useState<Project[]>([])

  const { search } = useLocation();


  const activeProjects = useMemo(() => projects ? Object.values(projects).filter(p => p.Phase !== 'Sunset') : [], [projects])

  return <PageTemplate title="Projects">
    {activeProjects && activeProjects.map(project =>
      search === '?view=timeline' ? <ProjectMilestoneTimeline key={project.id} project={project} /> : <ProjectRow key={project.id} project={project} />
    )}
    {/* <h2>Sunset and handed-off projects</h2>
    {sunsetProjects && sunsetProjects.map(project => <ProjectRow project={project} />)} */}
  </PageTemplate>
}