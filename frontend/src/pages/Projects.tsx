import PageTemplate from '../components/PageTemplate';
import { Link } from 'react-router';
import { Milestone, MilestoneUpdate, MilestoneUpdateStatus, Project, statusValues, useDataContext } from '../utils/DataContext';
import { useEffect, useState } from 'react';
import ProjectRow from '../components/ProjectRow';

export default function () {
  const { projects } = useDataContext();
  const [activeProjects, setActiveProjects] = useState<Project[]>([])
  const [sunsetProjects, setSunsetProjects] = useState<Project[]>([])

  useEffect(() => {
    const active = projects.filter(p => p.Phase !== 'Sunset')
    const inactive = projects.filter(p => p.Phase === 'Sunset')
    setActiveProjects(active)
    setSunsetProjects(inactive)
  }, [projects])

  function getMostRecentMilestoneUpdates(project: Project): (Milestone & { mostRecentUpdate?: MilestoneUpdate })[] | undefined {
    return project.Milestones?.map(m => {
      const mostRecentUpdate = m['Milestone updates']?.[0];
      if (!mostRecentUpdate) {
        return m
      }
      return ({
        ...m,
        mostRecentUpdate, // sorted server side
      })
    })
  }

  type StatusCount = {
    [key in MilestoneUpdateStatus]: number
  }
  function getStatusCountForMostRecentMilestoneUpdates(project: Project): StatusCount {
    const statusCounts: StatusCount = Object.fromEntries(statusValues.map((_, i) => [statusValues[i], 0]))
    const mostRecentUpdates = getMostRecentMilestoneUpdates(project);
    mostRecentUpdates?.forEach(milestone => {
      const update = milestone.mostRecentUpdate
      const udpateStatus = update?.Status
      if (!udpateStatus) {
        return
      }
      statusCounts[udpateStatus] += 1
    })
    return statusCounts
  }

  return <PageTemplate title="Projects">
    {activeProjects && activeProjects.map(project => <ProjectRow project={project} />)}
    {/* <h2>Sunset and handed-off projects</h2>
    {sunsetProjects && sunsetProjects.map(project => <ProjectRow project={project} />)} */}
  </PageTemplate>
}