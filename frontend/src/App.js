import React from 'react';
import { BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import LandingPage from './Component/LandingPage/LandingPage';
import Login from './Component/Login/Login';
import Signup from './Component/Signup/Signup';
import Main from './Component/Main/Main';
import './App.css';

function App() {
  return <div className='App'>
    <Router>
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path='/Login' element={<Login/>}/>
      <Route path='/Signup' element={<Signup/>}/>
      <Route path="/Main" element={<Main/>}/>
    </Routes>
  </Router>
  </div>
}

export default App;
