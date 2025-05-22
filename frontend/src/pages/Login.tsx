import { useState } from "react";
import PageTemplate from "../components/PageTemplate";
import { useDataContext } from "../contexts/DataContext";
import { useLocation, useNavigate } from "react-router";
import LayoutContainer from "../components/LayoutContainer";

export default function () {
  const { setAuthToken } = useDataContext();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function submit() {
    setAuthToken(btoa(`${username}:${password}`))
    navigate(state?.pathname || '/')
  }

  return <LayoutContainer>
    <PageTemplate title="Authenticate" useAuthWrapper={false}>
      <form action={submit}>

        <label className="usa-label" htmlFor="username">Username</label>
        <input className="usa-input" id="username" name="username" onChange={(e) => setUsername(e.target.value)} />

        <label className="usa-label" htmlFor="password">Password</label>
        <input className="usa-input" id="password" name="password" type="password" onChange={(e) => setPassword(e.target.value)} />

        <input type="submit" value="Submit" className="usa-button margin-y-4" />

      </form>
    </PageTemplate>
  </LayoutContainer>
}