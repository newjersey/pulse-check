import { useDataContext } from "../../contexts/DataContext";
import { useFormContext } from "../../contexts/FormContext";
import { UpdateDescription } from "../../components/FormFields";
import ProjectField from "../../components/FormFields/ProjectField";
import UpdateStatus from "../../components/FormFields/UpdateStatus";


export default function () {
  const { postData } = useDataContext();
  const { fields } = useFormContext();

  function onSubmit(e: any) {
    e.preventDefault();
    console.log(fields)
    postData('update', fields)
  }

  return <form>
    <ProjectField />
    <UpdateDescription />
    <UpdateStatus/>
    <input type="submit" className="usa-button margin-y-4" value="Submit" onClick={onSubmit} />
  </form>
}