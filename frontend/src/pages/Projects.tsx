import PageTemplate from '../components/PageTemplate';
import { Link } from 'react-router';
import { useDataContext } from '../utils/DataContext';

export default function () {
  const { projects } = useDataContext();

  return <PageTemplate title="Projects">
    <dl>
      {projects && projects.map(u => (<div>
        <dt key={u["ID"]}>{`${u["Name"]}`}</dt>
        <dd>
          <div className='display-flex flex-column padding-y-2'>
            <Link to={`/projects/${u["ID"]}/update`}>View {u["Name"]} details</Link>
            <Link to={`/projects/${u["ID"]}/update`}>Add an update for {u["Name"]}</Link>
          </div>
          </dd>
      </div>))}
    </dl>
  </PageTemplate>
}