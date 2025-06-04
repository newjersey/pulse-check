import { useDataContext } from "../../contexts/DataContext";
import { useFormContext } from "../../contexts/FormContext";
import { MetricUpdates, PhaseChangeDate, ProjectField, ProjectNeeds, ProjectPhase, UpdateDescription, UpdateStatus } from "../../components/FormFields";
import useProject from "../../utils/useProject";
import React, { useEffect, useState } from "react";

export default function () {
  const { loadingResponse, postData, fetchData } = useDataContext();
  const { fields, fieldsByFormKey, isFormInvalid, error, setError, clearFormData } = useFormContext();
  const { projectId } = useProject();
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
        return
      }
      throw new Error("Response was not ok")
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error(e)
      }
      setError("Could not update project")
      // Refresh to refetch data, because airtable doesn't have a rollback capability
      window.location.reload()
    }
  }

  useEffect(() => {
    if (success) {
      return () => {
        clearFormData();
        fetchData(['projects', 'updates', 'deliverables', 'needs', 'metricsUpdates'])
      }
    }
  }, [success])

  if (loadingResponse || !fields) {
    return <>Loading...</>
  }

  if (success) {
    return <>Yay you did it!</>
  }

  return <form onSubmit={(e) => { e.preventDefault() }}>
    {error && <h1 key={projectId + '-error'}>Error: {error}</h1>}
    <ProjectField />
    {projectId && <React.Fragment key={projectId + '-fields'}>
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