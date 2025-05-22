import PageTemplate from "../../components/PageTemplate";
import { useDataContext } from "../../contexts/DataContext";
import { FormContextProvider } from "../../contexts/FormContext";
import { UpdateDescription } from "../../components/FormFields";
import useProject from "../../utils/useProject";
import LayoutContainer from "../../components/LayoutContainer";

export default function () {
  const { loading } = useDataContext();
  const { project } = useProject()

  if (loading || !project) {
    return <LayoutContainer>
      <PageTemplate title="Loading project...">
        <></>
      </PageTemplate>
    </LayoutContainer>
  }

  return (
    <LayoutContainer>
      <PageTemplate title={`Submit an update for ${project.Name}`}>
        <FormContextProvider>
          <form>
            <>Project details</>
            <UpdateDescription />
          </form>
        </FormContextProvider>
      </PageTemplate>
    </LayoutContainer>
  )
}