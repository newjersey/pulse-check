import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [updates, setUpdates] = useState<Object[]>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/updates'); // Replace with your backend URL
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

  console.log(updates)
  return (
    <>
      <h1>Resx dashboard</h1>
      <ul>
        {updates && updates.map(u => (<li>{`Update ${u["ID"]} does ${ u["Needs intervention"] == 0 ? 'not ': ''}need attention`}</li>))}
      </ul>
    </>
  )
}

export default App
