import PageTemplate from '../components/PageTemplate';
import { Link } from 'react-router';
import { Milestone, MilestoneUpdate, MilestoneUpdateStatus, Project, statusValues, useDataContext } from '../utils/DataContext';
import { useEffect, useState } from 'react';

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

  function getMostRecentMilestoneUpdates(project: Project): (Milestone & { mostRecentUpdate?: MilestoneUpdate})[] | undefined {
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
    <dl>
      {activeProjects && activeProjects.map(project => {
        const statusCounts = getStatusCountForMostRecentMilestoneUpdates(project)
        return (
        <div key={project["id"]} className='display-flex padding-y-2'>
          <dt className='flex-1'>{`${project["Name"]}`}</dt>
          <dd className='flex-2'>
            {Object.keys(statusCounts).map((s) => (
              <div>{s}: {statusCounts[s as MilestoneUpdateStatus]}</div>
            ))}
            <div className='display-flex flex-column'>
              <Link to={`/projects/${project["id"]}`}>View {project["Name"]} details</Link>
              <Link to={`/projects/${project["id"]}/update`}>Add an update for {project["Name"]}</Link>
            </div>
          </dd>
        </div>)
      })}
    </dl>
    <h2>Sunset and handed-off projects</h2>
    <dl>
      {sunsetProjects && sunsetProjects.map(project => {
        const statusCounts = getStatusCountForMostRecentMilestoneUpdates(project)
        return (
        <div key={project["id"]} className='display-flex padding-y-2'>
          <dt className='flex-1'>{`${project["Name"]}`}</dt>
          <dd className='flex-2'>
            {Object.keys(statusCounts).map((s) => (
              <div>{s}: {statusCounts[s as MilestoneUpdateStatus]}</div>
            ))}
            <div className='display-flex flex-column'>
              <Link to={`/projects/${project["id"]}`}>View {project["Name"]} details</Link>
              <Link to={`/projects/${project["id"]}/update`}>Add an update for {project["Name"]}</Link>
            </div>
          </dd>
        </div>)
      })}
    </dl>
  </PageTemplate>
}