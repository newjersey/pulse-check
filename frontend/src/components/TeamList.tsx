import { useMemo } from "react";
import { useDataContext } from "../contexts/DataContext";
import { hydrateIdList } from "../utils/projectUtils";
import { Project } from "../utils/types";

export default function ({ project }: { project: Project }) {
  const { people } = useDataContext();
  const team = useMemo(() => hydrateIdList(project.Team, people), [people])

  if (!team?.length) {
    return <></>
  }

  return <ul>
    {team.map(person => {
      return <li key={person.id}>{person.Name}</li>
    })}
  </ul>

}