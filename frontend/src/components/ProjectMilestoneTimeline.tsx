import { Link } from "react-router";
import { MilestoneUpdateStatus, Project } from "../utils/DataContext";
import { scaleTime } from "d3-scale";

export default function ({ project }: { project: Project }) {
  const currentDate = new Date();
  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(currentDate.getMonth() - 1)

  const svgWidth = 650
  const getX = scaleTime([oneMonthAgo, currentDate], [200, svgWidth]);

  type StatusColor = {
    [key in MilestoneUpdateStatus]: {
      class: string,
      value: string
    }
  }
  const statusColors: StatusColor = {
    "Done": {
      class: 'usa-alert--success',
      value: ' #00a91c'
    },
    "In progress": {
      class: "usa-alert--info",
      value: '#00bde3'
    },
    "At risk": {
      class: "usa-alert--warning",
      value: '#ffbe2e'
    },
    "Blocked": {
      class: "usa-alert--error",
      value: '#d54309'
    }
  }


  return (<div className="grid-row margin-y-6 grid-gap">
    <div className="grid-col-2">
      <h2 className="margin-0">{project["Name"]}</h2>
      <p className="margin-0">{project["Phase"]}</p>
    </div>

    <div className="grid-col-9 display-flex flex-justify flex-align-stretch flex-column">
      <svg height={`${(project.Milestones?.length || 0) * 30}px`} width={svgWidth} viewBox={`0 0 ${svgWidth} ${20 + 30 * (project.Milestones?.length || 0)}`}>
        {project.Milestones?.map((m, idx) => {
          const y = 10 + (idx + 1) * 30
          const updates = m["Milestone updates"]
          updates?.sort((a, b) => new Date(a.Created).getUTCDate() - new Date(b.Created).getUTCDate())
          return (<g>
            <text y={y} x={0}>{m.Title}</text>
            {m["Milestone updates"] && m["Milestone updates"]?.map((u, idx, _updates) => {
              const x = getX(new Date(u.Created))
              const statuscolor = statusColors[u.Status]
              let nextX = Math.max(getX(new Date()), x + 10)
              const nextUpdate = idx === _updates.length - 1 ? null : _updates[idx + 1]
              if (nextUpdate) {
                nextX = getX(new Date(nextUpdate.Created))
              }
              return <rect fill={statuscolor.value} y={y - 10} width={nextX - x - 2} height={12} x={x}></rect>
            })}
          </g>)
        })}
      </svg>
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