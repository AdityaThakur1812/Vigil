import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext.jsx";

function Dashboard(){
  const {user, logout} = useAuth();
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold">Vigil Dashboard</h1>

      <p className="mt-4 text-slate-400">
        Welcome, {user?.name}!
      </p>

      <button
        onClick={() => logout()}
        className="mt-6 rounded-lg bg-red-600 px-5 py-2 hover:bg-red-700"
      >
        Logout
      </button>
    </main>

  );
}


function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path ="/register" element ={<Register/>}/>

      <Route element= {<ProtectedRoute/>}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="/" element= {<Navigate to ="/login"replace />}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;