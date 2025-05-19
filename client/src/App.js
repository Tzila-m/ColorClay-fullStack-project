
import { Routes, Route } from 'react-router-dom'
import './App.css';
import Login from './components/Login';
import Layout from './components/Layout';
import Register from './components/Register'


function App() {
  return (
    <div >
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route path = "/login" element={<Login/>}/>
          <Route path ='/register' element={<Register/>}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
