import { useDataContext } from "../../contexts/DataContext";
import { useFormContext } from "../../contexts/FormContext";
import { ProjectField, UpdateDescription, UpdateStatus } from "../../components/FormFields";
import useProject from "../../utils/useProject";
import React, { useState } from "react";


export default function () {
  const { loadingResponse, postData } = useDataContext();
  const { fields } = useFormContext();
  const { projectId } = useProject();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: any) {
    e.preventDefault();
    try {
      const data = {
        updates: {
          projectId: fields.project.value,
          updateDetails: fields.updateDetails.value,
          projectStatus: fields.projectStatus.value,
        }
        // phase: ProjectPhase[number]String,
        // metricUpdates: {}[]String,
        // projectNeeds: {}[]String,
        // phaseChangeDate: String,
        // deliverables: {}[]String,
      }
      const response = await postData('update', data)
      const newUpdate = await response.json();
      if (response.status === 200) {
        // TODO ADD UPDATE TO UPDATES
        console.log(newUpdate)
        setSuccess(true)
        return
      }
      throw new Error("Response was not ok")
    } catch (e) {
      console.log(e)
      setError("Could not update project :(")
    }
  }

  if (loadingResponse) {
    return <>Loading...</>
  }

  if (success) {
    return <>Yay you did it!</>
  }

  return <form onSubmit={(e) => {e.preventDefault()}}>
    {/* TODO: ACTUAL ALERT COMPONENT */}
    {error && <p>Oh no, an error!</p>}
    <ProjectField />
    {projectId && <React.Fragment key={projectId}>
      <UpdateDescription />
      <UpdateStatus />
      {/* <MetricUpdates />
      <ProjectNeeds />
      <ProjectPhase />
      <PhaseChangeDate />
      <Deliverables /> */}
      <button className="usa-button margin-y-4" onClick={onSubmit}>Submit</button>
    </React.Fragment>}
  </form>
}