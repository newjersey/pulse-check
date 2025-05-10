import { Link } from "react-router";
import { Project } from "../utils/DataContext";
import { scaleTime } from "d3-scale";

export default function ({ project }: { project: Project }) {
  const currentDate = new Date();
  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(currentDate.getMonth() - 1)
  

  const getX = scaleTime([oneMonthAgo, currentDate], [200, 600]);


  return (<div className="grid-row margin-y-6 grid-gap">
    <div className="grid-col-3">
      <h2 className="margin-0">{project["Name"]}</h2>
      <p className="margin-0">{project["Phase"]}</p>
    </div>

    <div className="grid-col-8 display-flex flex-justify flex-align-stretch flex-column">
      <svg height={`${(project.Milestones?.length || 0) * 40}px`} width="600" viewBox={`0 0 600 ${20 + 40 * (project.Milestones?.length || 0)}`}>
        {project.Milestones?.map((m, idx, milestones) => {
          const y = 10 + (idx + 1) * 40
          return (<g>
            <text y={y} x={0}>{m.Title}</text>
            {m["Milestone updates"] && m["Milestone updates"]?.map((u, idx) => {
              const x = getX(new Date(u.Created))
              return <rect fill="red" y={y - 10} width={10} height={10} x={x}></rect>
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