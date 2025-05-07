import PageTemplate from '../components/PageTemplate';
import { Link } from 'react-router';
import { useDataContext } from '../utils/DataContext';

export default function () {
  const { projects } = useDataContext();
  console.log(projects)

  return <PageTemplate title="Projects">
    <dl>
      {projects && projects.map(u => (<div key={u["id"]}>
        <dt>{`${u["Name"]}`}</dt>
        <dd>
          <div className='display-flex flex-column padding-y-2'>
            <Link to={`/projects/${u["id"]}`}>View {u["Name"]} details</Link>
            <Link to={`/projects/${u["id"]}/update`}>Add an update for {u["Name"]}</Link>
          </div>
          </dd>
      </div>))}
    </dl>
  </PageTemplate>
}