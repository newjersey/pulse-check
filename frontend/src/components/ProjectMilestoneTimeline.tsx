import { Link } from "react-router";
import { Milestone, MilestoneUpdate, MilestoneUpdateStatus, Project } from "../utils/DataContext";
import { scaleTime } from "d3-scale";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Tooltip from "./Tooltip";

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

export default function ({ project }: { project: Project }) {
  const currentDate = new Date();
  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(currentDate.getMonth() - 1)

  function svgHeight(project: Project) {
    return 20 + (project.Milestones?.length || 0) * 30
  }
  const svgContainer = useRef<SVGSVGElement>(null);
  const [boundingClientRect, setBoundingClientRect] = useState<DOMRect>(new DOMRect());
  const getX = useMemo(() => {
    return scaleTime([oneMonthAgo, currentDate], [200, boundingClientRect.width]);
  }, [boundingClientRect])

  const [highlightedUpdate, setHighlightedUpdate] = useState<{ update: MilestoneUpdate | undefined, milestone: Milestone, x1: number, x2: number, y: number }>();

  useLayoutEffect(() => {
    function handleResize() {
      if (!svgContainer.current) { return; }
      setBoundingClientRect(svgContainer.current.getBoundingClientRect())
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  return (<div className="grid-row margin-y-6 grid-gap">
    <div className="grid-col-3">
      <h2 className="margin-0">{project["Name"]}</h2>
      <p className="margin-0">{project["Phase"]}</p>
    </div>

    <div className="grid-col-8 display-flex flex-justify flex-align-stretch flex-column">
      <svg height={`${svgHeight(project)}px`} width="100%" viewBox={`0 0 ${boundingClientRect.width} ${svgHeight(project)}`} ref={svgContainer} overflow={'visible'} style={{ zIndex: 99 }}>
        {project.Milestones?.map((m, idx) => {
          const y = (1 + idx) * 30
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
              return (<rect
                fill={statuscolor.value}
                y={y - 15}
                width={nextX - x - 2}
                height={25}
                x={x}
                tabIndex={0}
                onFocus={() => setHighlightedUpdate({ update: u, milestone: m, x1: x, x2: nextX, y })}
                onBlur={() => setHighlightedUpdate(undefined)}
                onMouseEnter={() => setHighlightedUpdate({ update: u, milestone: m, x1: x, x2: nextX, y })}
                onMouseLeave={() => setHighlightedUpdate(undefined)}></rect>)
            })}
          </g>)
        })}
        {highlightedUpdate?.update && <foreignObject x={(highlightedUpdate?.x1 + highlightedUpdate?.x2) / 2} y={highlightedUpdate.y} height="10rem" width="20rem">
          <Tooltip update={highlightedUpdate?.update} milestone={highlightedUpdate?.milestone} />
        </foreignObject>}
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