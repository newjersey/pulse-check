import { useDataContext } from "../../contexts/DataContext";
import { useFormContext } from "../../contexts/FormContext";
import { MetricUpdates, PhaseChangeDate, ProjectField, ProjectNeeds, ProjectPhase, UpdateDescription, UpdateStatus } from "../../components/FormFields";
import useProject from "../../utils/useProject";
import React, { useState } from "react";

export default function () {
  const { loadingResponse, postData, setReloadTablesAfterNavigate } = useDataContext();
  const { fields, fieldsByFormKey, isFormInvalid } = useFormContext();
  const { projectId } = useProject();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: any) {
    setError(undefined);
    e.preventDefault();
    try {
      if (isFormInvalid()) {
        setError('Some fields are missing');
        return
      }
      const dataToPost = {
        updates: {
          projectId: fields.project.value,
          updateDetails: fields.updateDetails.value,
          projectStatus: fields.projectStatus.value,
          phase: fields.projectPhase.value,
          phaseChangeDate: fields.phaseChangeDate.value,
          metricUpdates: fieldsByFormKey('metricUpdates'),
          projectNeeds: fieldsByFormKey('projectNeeds'),
        }
        // deliverables: {}[]String,
      }
      const response = await postData('update', dataToPost)
      if (response.status == 200) {
        setSuccess(true)
        setReloadTablesAfterNavigate(['projects', 'updates', 'deliverables', 'needs', 'metricsUpdates'])
        return
      }
      throw new Error("Response was not ok")
    } catch (e) {
      console.log(e)
      setError("Could not update project")
    }
  }

  if (loadingResponse || !fields) {
    return <>Loading...</>
  }

  if (success) {
    return <>Yay you did it!</>
  }

  return <form onSubmit={(e) => { e.preventDefault() }}>
    {/* TODO: ACTUAL ALERT COMPONENT */}
    {error && <h1>Error: {error}</h1>}
    <ProjectField />
    {projectId && <React.Fragment key={projectId}>
      <UpdateDescription />
      <UpdateStatus />
      <ProjectPhase />
      <PhaseChangeDate />
      <MetricUpdates />
      <ProjectNeeds />
      {/*
        <Deliverables />
      */}
      <button className="usa-button margin-y-4" onClick={onSubmit}>Submit</button>
    </React.Fragment>}
  </form>
}