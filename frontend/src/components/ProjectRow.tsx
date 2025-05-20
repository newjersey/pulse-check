import { Link } from "react-router";
import { Project } from "../utils/types";
import { useDataContext } from "../contexts/DataContext";
import { getSortedProjectUpdates, hydrateIdList, updateStatusValues } from "../utils/projectUtils";
import { useMemo } from "react";

export default function ({ project }: { project: Project }) {
  const { people, updates, needs, needsTypes } = useDataContext();

  const sortedUpdates = useMemo(() => updates ? getSortedProjectUpdates(project, updates) : [], [updates])
  const mostRecentUpdate = useMemo(() => sortedUpdates ? sortedUpdates[0] : undefined, [sortedUpdates])
  const team = useMemo(() => hydrateIdList(project.Team, people), [people])
  const currentNeeds = useMemo(() => {
    if (!needs || !needsTypes) { return [] }
    return hydrateIdList(project["Current project needs"], needs)
      .map(n => ({...n, "Project need type": needsTypes[n["Project need type"][0]]}))
  }, [needs, needsTypes])

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
      {mostRecentUpdate?.Status &&
      <div
        className={`usa-alert flex-1 margin-x-1 margin-y-0 padding-2 ${updateStatusValues[mostRecentUpdate.Status]?.class}`}
        key={`${project.id}-${mostRecentUpdate.Status}`}
      >
        <div>{mostRecentUpdate.Status}</div>
      </div>}
    </div>

    <div className="grid-col-2">
      {currentNeeds && <dl className="margin-0">
        {currentNeeds.map(n => <>
          <dt className="text-bold">{n["Project need type"].Need}</dt>
          <dd className="margin-0">{n.Description}</dd>
        </>)}
        </dl>}
    </div>

    <div className="grid-col-3">
      {mostRecentUpdate?.Description}
    </div>
  </div>)
}