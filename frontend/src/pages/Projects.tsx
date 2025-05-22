import { useMemo } from 'react';
// import { useLocation } from 'react-router';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import PageTemplate from '../components/PageTemplate';
import { useDataContext } from '../contexts/DataContext';
import ProjectRow from '../components/ProjectRow';
// import ProjectMilestoneTimeline from '../components/ProjectMilestoneTimeline';
import { Initiative, Project } from '../utils/types';
import LayoutContainer from '../components/LayoutContainer';

export default function () {
  const { projects } = useDataContext();
  // const { search } = useLocation();

  const activeProjectsByInitiative = useMemo(() => {
    const _activeProjects = projects ? Object.values(projects) : []

    const tabValues: { [key: Initiative[number]]: { projects: Project[] } } = {
      "ResX": {
        projects: []
      },
      "BizX": {
        projects: []
      },
      "C+E Lab": {
        projects: []
      },
      "D+P": {
        projects: []
      },
      General: {
        projects: []
      },
    }

    _activeProjects.forEach(p => {
      tabValues[p.Initiative].projects.push(p)
    })
    return tabValues
  }, [projects])

  return <LayoutContainer>
    <PageTemplate title="Projects">
      <TabGroup defaultValue={Object.keys(activeProjectsByInitiative)[0]}>
        <TabList>
          {(Object.keys(activeProjectsByInitiative)).map(k => <Tab value={k} key={`trigger-${k}`}><div>{k}</div></Tab>)}
        </TabList>
        <TabPanels>
          {Object.keys(activeProjectsByInitiative).map(k =>
          (<TabPanel key={k}>
            {activeProjectsByInitiative[k].projects.map(p => {
              // return search === '?view=timeline' ? <ProjectMilestoneTimeline key={p.id} project={p} /> : <ProjectRow key={p.id} project={p} />
              return <ProjectRow key={p.id} project={p} />
            })}
            {activeProjectsByInitiative[k].projects.length === 0 && <p className='margin-y-4'>{`No projects for ${k} yet`}</p>}
          </TabPanel>)
          )}
        </TabPanels>
      </TabGroup>
    </PageTemplate>
  </LayoutContainer>
}