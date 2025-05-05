import { useState } from "react";
import PageTemplate from "../components/PageTemplate";
import { useDataContext } from "../utils/DataContext";

export default function () {
  const { setAuthToken } = useDataContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function submit() {
    setAuthToken(btoa(`${username}:${password}`))
  }

  return <PageTemplate title="Authenticate">
    <form action={submit}>

      <label className="usa-label" htmlFor="username">Text input label</label>
      <input className="usa-input" id="username" name="username" onChange={(e) => setUsername(e.target.value)}/>

      <label className="usa-label" htmlFor="password">Password</label>
      <input className="usa-input" id="password" name="password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <input type="submit"/>

    </form>
  </PageTemplate>
}