import { Link } from "react-router";
import { Milestone, MilestoneUpdate, MilestoneUpdateStatus, Project } from "../utils/DataContext";

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
    [key in MilestoneUpdateStatus]: {
      class: string,
      value: number
    }
  }
  const usedStatusValues = {
    "Done": {
      class: 'usa-alert--success',
      value: 0
    },
    "In progress": {
      class: "usa-alert--info",
      value: 0
    },
    "At risk": {
      class: "usa-alert--warning",
      value: 0
    },
    "Blocked": {
      class: "usa-alert--error",
      value: 0
    }
  }
  function getStatusCountForMostRecentMilestoneUpdates(project: Project): StatusCount {
    const statusCounts: StatusCount = Object.assign({}, usedStatusValues)
    const mostRecentUpdates = getMostRecentMilestoneUpdates(project);
    mostRecentUpdates?.forEach(milestone => {
      const update = milestone.mostRecentUpdate
      const udpateStatus = update?.Status
      if (!udpateStatus) {
        return
      }
      statusCounts[udpateStatus].value += 1
    })
    delete statusCounts['Backlog/planning']
    return statusCounts
  }

  const statusCounts = getStatusCountForMostRecentMilestoneUpdates(project)

  return (<div className="grid-row margin-y-6 grid-gap">
    <div className="grid-col-3">
      <h2 className="margin-0">{project["Name"]}</h2>
      <p className="margin-0">{project["Phase"]}</p>
    </div>

    <div className="grid-col-8 display-flex flex-justify flex-align-stretch">
      {Object.keys(statusCounts).map((s) => (
        <div className={`usa-alert flex-1 margin-x-1 margin-y-0 padding-2 ${statusCounts[s].class}`} key={`${project.id}-${s}`}>
          <div className="font-body-xl">
            {statusCounts[s].value}
          </div>
          <div>{s}</div>
        </div>
      ))}
    </div>
    
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