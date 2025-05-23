import { Project } from "../utils/types";
import ProjectRow from "./ProjectRow";

export default function ({ projects }: { projects: Project[] }) {
  return <table className="usa-table usa-table--borderless usa-table--stacked usa-table--sticky-header">
    <thead>
      <tr>
        <th className="usa-sr-only">
          Project name
        </th>
        <th style={{ width: "23%" }} scope="col">
          Project
        </th>
        <th style={{ width: "17%" }} scope="col">
          Progress
        </th>
        <th style={{ width: "17%" }} scope="col">
          Status
        </th>
        <th style={{ width: "23%" }} scope="col">
          Needs
        </th>
        <th style={{ width: "23%" }} scope="col">
          Update
        </th>
      </tr>
    </thead>
    <tbody>
      {
        projects.map(p => {
          // return search === '?view=timeline' ? <ProjectMilestoneTimeline key={p.id} project={p} /> : <ProjectRow key={p.id} project={p} />
          return <ProjectRow key={p.id} project={p} />
        })
      }
    </tbody>
  </table>
}