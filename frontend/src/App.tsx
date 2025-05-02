import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [updates, setUpdates] = useState<{ ID: string, "Needs intervention": string | number}[]>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_ENDPOINT}/updates`); // Replace with your backend URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setUpdates(result);
      } catch (error) {
        console.error(error);
      } finally {
        // setLoading(false);
      }
    };
    // Call the async function
    fetchData();
  }, [setUpdates])

  return (
    <>
      <p>Resx dashboard</p>
      <nav>
        <ul>
          <li>Updates</li>
          <li>Submit update</li>
        </ul>
      </nav>
      <main>
        <h1>Updates</h1>
        <ul>
          {updates && updates.map(u => (<li>{`Update ${u["ID"]} does ${ u["Needs intervention"] == 0 ? 'not ': ''}need attention`}</li>))}
        </ul>
      </main>
    </>
  )
}

export default App
