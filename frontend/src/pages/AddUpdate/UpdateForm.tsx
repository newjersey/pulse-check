import { useDataContext } from "../../contexts/DataContext";
import { useFormContext } from "../../contexts/FormContext";
import { UpdateDescription } from "../../components/FormFields";
import ProjectField from "../../components/FormFields/ProjectField";
import UpdateStatus from "../../components/FormFields/UpdateStatus";
import MetricUpdates from "../../components/FormFields/MetricUpdates";
import ProjectNeeds from "../../components/FormFields/ProjectNeeds";
import useProject from "../../utils/useProject";
import React from "react";


export default function () {
  const { postData } = useDataContext();
  const { fields } = useFormContext();
  const { projectId } = useProject();

  function onSubmit(e: any) {
    e.preventDefault();
    postData('update', fields)
  }

  return <form onSubmit={() => { }}>
    <ProjectField />
    {projectId && <React.Fragment key={projectId}>
      <UpdateDescription />
      <UpdateStatus />
      <MetricUpdates />
      <ProjectNeeds />
    </React.Fragment>}
    <input type="submit" className="usa-button margin-y-4" value="Submit" onClick={onSubmit} />
  </form>
}