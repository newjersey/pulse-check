import { useParams } from "react-router";
import PageTemplate from "../../components/PageTemplate";
import { useDataContext } from "../../contexts/DataContext";
import { Fields, FormContextProvider } from "../../contexts/FormContext";
// import SubmitUpdateFields from "./SubmitUpdateFields";

export default function () {
  const { projects, loading } = useDataContext();
  const { projectId } = useParams();
  const project = projectId && projects ? projects[projectId] : undefined

  if (loading || !project) {
    return <PageTemplate title="Loading project...">
      <></>
    </PageTemplate>
  }

  const formFields: Fields = {
    updater: {
      name: 'updater',
      value: undefined,
      label: 'Updater',
      required: true,
      id: 'updater'
    }
  }

  // project.Deliverables?.forEach(m => {
  //   const mostRecent = m["Milestone updates"]?.[0]
  //   if (mostRecent?.Status === 'Done' || mostRecent?.Status === 'Canceled') { return }

  //   formFields[`${m.id}-description`] = {
  //     name: `${m.id}-description`,
  //     id: `${m.id}-description`,
  //     value: '',
  //     label: 'Update description',
  //     required: true
  //   }
  //   formFields[`${m.id}-status`] = {
  //     name: `${m.id}-status`,
  //     id: `${m.id}-status`,
  //     value: m["Milestone updates"]?.[0].Status,
  //     label: 'Status',
  //     required: true
  //   }
  // })

  return <PageTemplate title={`Submit an update for ${project.Name}`}>
    <FormContextProvider initialFields={formFields}>
      <form>
        <>Project details</>
        {/* <SubmitUpdateFields project={project}/> */}
      </form>
    </FormContextProvider>
  </PageTemplate>
}