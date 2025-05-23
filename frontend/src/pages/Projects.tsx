import { useMemo } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import PageTemplate from '../components/PageTemplate';
import { useDataContext } from '../contexts/DataContext';
import { Initiative, Project } from '../utils/types';
import LayoutContainer from '../components/LayoutContainer';
import ProjectTable from '../components/ProjectTable';

export default function () {
  const { projects } = useDataContext();

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
    <PageTemplate title="Project overview">
      <TabGroup defaultValue={Object.keys(activeProjectsByInitiative)[0]}>
        <TabList>
          {(Object.keys(activeProjectsByInitiative)).map(k => <Tab value={k} key={`trigger-${k}`}><div>{k}</div></Tab>)}
        </TabList>
        <TabPanels>
          {Object.keys(activeProjectsByInitiative).map(k =>
          (<TabPanel key={k}>
            {activeProjectsByInitiative[k].projects.length === 0 ?
            <p className='margin-y-4'>{`No projects for ${k} yet`}</p> :
            <ProjectTable projects={activeProjectsByInitiative[k].projects}/>}
          </TabPanel>)
          )}
        </TabPanels>
      </TabGroup>
    </PageTemplate>
  </LayoutContainer>
}