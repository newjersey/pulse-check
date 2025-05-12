import { Milestone, MilestoneUpdate } from "../contexts/DataContext";

export default function Tooltip({ update, milestone }: { update: MilestoneUpdate, milestone: Milestone }) {
  return <div id="tooltip" style={{
    backgroundColor: 'white',
    padding: '0.5em',
    border: '1px solid #CCCCCC',
    width: 'fit-content',
    overflow: 'visible'
  }}>
    <p className="margin-0 text-bold">
      {milestone.Title}
    </p>
    <p className="margin-0">
      Status: {update.Status}
    </p>
    <p className="margin-0">
      Date: {update.Created}
    </p>
  </div>
}