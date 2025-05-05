import PageTemplate from "../components/PageTemplate";

export default function () {
  return <PageTemplate title="Authenticate">
    <label className="usa-label" htmlFor="input-type-text">Text input label</label>
    <input className="usa-input" id="input-type-text" name="input-type-text" />
    <label className="usa-label" htmlFor="input-type-text">Text input label</label>
    <input className="usa-input" id="input-type-text" name="input-type-text" />
  </PageTemplate>
}