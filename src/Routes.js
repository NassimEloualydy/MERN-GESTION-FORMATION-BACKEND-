import React from 'react'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Dashbord from './Component/Dahbord/Dashbord'
import Login from './Component/Login';
import PravetRoute from "./Component/PravetRoute";
import Filier from './Component/Dahbord/Filier';
import Group from './Component/Dahbord/Group';
import Etudient from './Component/Dahbord/Etudient';
import Formateur from './Component/Dahbord/Formateur';
import Module from './Component/Dahbord/Module';
import Vacation from './Component/Dahbord/Vacation';
import Compt from './Component/Dahbord/Compt';
const RoutesSystem=()=>{
  return (
    <Router>
        <>
        <Routes>
            {/* <Route path="/Dashbord" element={<Dashbord/>}/> */}
            <Route path="/Login" element={<Login/>}/>
            <Route element={<PravetRoute/>}>
            <Route path="/Filier" element={<Filier/>}/>
            </Route>
            <Route element={<PravetRoute/>}>
              <Route path="/Group" element={<Group/>}/>
            </Route>
            <Route element={<PravetRoute/>}>
              <Route path="/Etudient" element={<Etudient/>}/>
            </Route>
            <Route element={<PravetRoute/>}>
              <Route path="/Formateur" element={<Formateur/>}/>
            </Route>
            <Route element={<PravetRoute/>}>
              <Route path="/Module" element={<Module/>}/>
            </Route>
            <Route element={<PravetRoute/>}>
              <Route path="/Vacation" element={<Vacation/>}/>
            </Route>
            <Route element={<PravetRoute/>}>
              <Route path="/Compt" element={<Compt/>}/>
            </Route>

        </Routes>
        </>
    </Router>
  )
}

export default RoutesSystem