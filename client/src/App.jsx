import { useEffect, useState } from "react";

function App() {
  const [apiMessage, setApiMessage] = useState("Connecting to backend...");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5002/api/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("API request failed");
        }

        return response.json();
      })
      .then((data) => setApiMessage(data.message))
      .catch(() => {
        setError("Could not connect to the backend.");
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight text-white">Vigil</h1>

        <p className="mt-2 text-slate-400">
          Uptime Monitoring & Incident Management
        </p>

        <section className="mt-10 max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <h2 className="text-lg font-semibold">Backend Status</h2>

          <p className="mt-3 text-sm text-slate-300">{error || apiMessage}</p>
        </section>
      </div>
    </main>
  );
}

export default App;