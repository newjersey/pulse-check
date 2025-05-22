import LayoutContainer from "../../components/LayoutContainer";
import PageTemplate from "../../components/PageTemplate";

export default function({ title = "Edit project" }: { title?: string }) {
  return <LayoutContainer>
    <PageTemplate title={title}><></></PageTemplate>
  </LayoutContainer>
}