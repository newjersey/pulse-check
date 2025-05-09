import PageTemplate from '../components/PageTemplate';
import { Project, useDataContext } from '../utils/DataContext';
import { useEffect, useState } from 'react';
import ProjectRow from '../components/ProjectRow';

export default function () {
  const { projects } = useDataContext();
  const [activeProjects, setActiveProjects] = useState<Project[]>([])
  // const [sunsetProjects, setSunsetProjects] = useState<Project[]>([])

  useEffect(() => {
    const active = projects.filter(p => p.Phase !== 'Sunset')
    // const inactive = projects.filter(p => p.Phase === 'Sunset')
    setActiveProjects(active)
    // setSunsetProjects(inactive)
  }, [projects])

  return <PageTemplate title="Projects">
    {activeProjects && activeProjects.map(project => <ProjectRow project={project} />)}
    {/* <h2>Sunset and handed-off projects</h2>
    {sunsetProjects && sunsetProjects.map(project => <ProjectRow project={project} />)} */}
  </PageTemplate>
}