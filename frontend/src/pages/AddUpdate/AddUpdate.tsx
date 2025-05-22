import PageTemplate from "../../components/PageTemplate";
import { useDataContext } from "../../contexts/DataContext";
import { FormContextProvider } from "../../contexts/FormContext";
import useProject from "../../utils/useProject";
import LayoutContainer from "../../components/LayoutContainer";
import UpdateForm from "./UpdateForm";

export default function () {
  const { loading } = useDataContext();
  const { project } = useProject()

  if (loading) {
    return <LayoutContainer>
      <PageTemplate title="Loading project...">
        <></>
      </PageTemplate>
    </LayoutContainer>
  }

  return (
    <LayoutContainer>
      <PageTemplate title={`Submit an update${project ? ` for ${project.Name}` : ''}`}>
        <FormContextProvider>
          <UpdateForm />
        </FormContextProvider>
      </PageTemplate>
    </LayoutContainer>
  )
}