import { Link } from "react-router";
import { Milestone, MilestoneUpdate, MilestoneUpdateStatus, Project, statusValues } from "../utils/DataContext";

export default function ({ project }: { project: Project }) {
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
    delete statusCounts['Backlog/planning']
    return statusCounts
  }

  const statusCounts = getStatusCountForMostRecentMilestoneUpdates(project)

  return (<div className="grid-row margin-y-6">
    <div className="grid-col-3">
      <h2 className="margin-0">{project["Name"]}</h2>
      <p className="margin-0">{project["Phase"]}</p>
    </div>

    {Object.keys(statusCounts).map((s) => (
      <div className="grid-col-2" key={`${project.id}-${s}`}>
        <div className="font-body-xl">
          {statusCounts[s as MilestoneUpdateStatus]}
        </div>
        <div>{s}</div>
      </div>
    ))}
    <div className='display-flex flex-column grid-col-1'>
      <Link to={`/projects/${project["id"]}`}>
        <span className="usa-sr-only">
          {project["Name"]}
        </span>
        Details
      </Link>
      <Link to={`/projects/${project["id"]}/update`}>
        Update
        <span className="usa-sr-only">
          {project["Name"]}
        </span>
      </Link>
    </div>
  </div>)
}