import { useMemo } from "react";
import LayoutContainer from "../../components/LayoutContainer";
import PageTemplate from "../../components/PageTemplate";
import useProject from "../../utils/useProject";

type AddOrEdit = 'add' | 'edit'

export default function ({ addOrEdit = "edit" }: { addOrEdit?: AddOrEdit }) {
  const { project } = useProject();

  const title = useMemo(() => {
    if (addOrEdit === 'edit') {
      if (project) {
        return `Edit ${project.Name}`
      }
      return 'Edit project'
    }
    return 'Add a project'
  }, [project])

  return <LayoutContainer>
    <PageTemplate title={title}>
      {addOrEdit === 'add' ? <a href="https://airtable.com/appZvIfhhPO6oqFW8/shrKhsULJS6QXZBBk" rel="noopener noreferrer" target="_blank">Add a project (better form coming soon)</a> :
        <>Soon you'll be able to do that!</>
      }
    </PageTemplate>
  </LayoutContainer>
}