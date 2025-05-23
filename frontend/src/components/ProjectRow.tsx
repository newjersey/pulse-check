import { Link } from "react-router";
import { Project } from "../utils/types";
import { useDataContext } from "../contexts/DataContext";
import { getSortedProjectUpdates, hydrateIdList, updateStatusValues } from "../utils/projectUtils";
import { useMemo } from "react";
import TeamList from "./TeamList";
import React from "react";

export default function ({ project }: { project: Project }) {
  const { updates, needs, needsTypes } = useDataContext();

  const sortedUpdates = useMemo(() => updates ? getSortedProjectUpdates(project, updates) : [], [updates])
  const mostRecentUpdate = useMemo(() => sortedUpdates ? sortedUpdates[0] : undefined, [sortedUpdates])
  const currentNeeds = useMemo(() => {
    if (!needs || !needsTypes) { return [] }
    return hydrateIdList(project["Current project needs"], needs)
      .map(n => ({ ...n, "Project need type": needsTypes[n["Project need type"][0]] }))
  }, [needs, needsTypes])

  return (<tr>
    <th scope="row" className="usa-sr-only">
      {project.Name}
    </th>

    <td style={{ padding: '1.5rem 1rem' }}>
      <div>
        <Link className="margin-0 font-heading-lg" to={`/projects/${project["id"]}`}>{project["Name"]}</Link>
        <p className="margin-0">{project["Phase"]}</p>
        <TeamList project={project} />
      </div>
    </td>

    <td style={{ padding: '1.5rem 1rem' }}>
      Progress TBD
    </td>

    <td style={{ padding: '1.5rem 1rem' }}>
      {mostRecentUpdate?.Status &&
        <div
          className={`usa-alert flex-1 margin-y-0 padding-2 ${updateStatusValues[mostRecentUpdate.Status]?.class}`}
          key={`${project.id}-${mostRecentUpdate.Status}`}
        >
          <div>{mostRecentUpdate.Status}</div>
        </div>}
    </td>

    <td style={{ padding: '1.5rem 1rem' }}>
      {currentNeeds && <dl className="margin-0">
        {currentNeeds.map(n => <React.Fragment key={n.id}>
          <dt className="text-bold">{n["Project need type"].Type}</dt>
          <dd className="margin-0">{n.Description}</dd>
        </React.Fragment>)}
      </dl>}
    </td>

    <td style={{ padding: '1.5rem 1rem' }}>
      {mostRecentUpdate && <>
        <p>
          {mostRecentUpdate?.Description}
        </p>
        <p className="text-italic font-body-xs">
          Updated {mostRecentUpdate?.Created}
        </p>
      </>
      }
    </td>
  </tr>)
}