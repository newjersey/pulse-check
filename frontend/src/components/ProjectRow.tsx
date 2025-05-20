import { Link } from "react-router";
import { Project } from "../utils/types";
import { useDataContext } from "../contexts/DataContext";
import { getSortedProjectUpdates, hydrateIdList } from "../utils/projectUtils";
import { useMemo } from "react";

export default function ({ project }: { project: Project }) {
  const { people, updates } = useDataContext();

  const sortedUpdates = useMemo(() => updates ? getSortedProjectUpdates(project, updates) : [], [updates])
  const mostRecentUpdate = useMemo(() => sortedUpdates ? sortedUpdates[0] : undefined, [sortedUpdates])
  const team = useMemo(() => hydrateIdList(project.Team, people), [people])

  return (<div className="grid-row margin-y-6 grid-gap">
    <div className="grid-col-3">
      <Link className="margin-0" to={`/projects/${project["id"]}`}>{project["Name"]}</Link>
      <p className="margin-0">{project["Phase"]}</p>
      <ul>
        {team.map(person => {
          return <li>{person.Name}</li>
        })}
      </ul>
    </div>

    <div className="grid-col-2">
      Progress TBD
    </div>
    <div className="grid-col-2">
      {mostRecentUpdate?.Status}
    </div>
    <div className="grid-col-2">
      Progress TBD
    </div>

    <div className="grid-col-8 display-flex flex-justify flex-align-stretch">

    </div>
  </div>)
}