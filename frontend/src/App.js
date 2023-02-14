import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { ProtectedRoute } from './ProtectedRoute';
import Home from './components/Home/Home'
import Events from './components/Events/Events'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Admin from "./components/Admin/Admin";
import Deposit from './components/Deposit/Deposit'
import Transactions from './components/Transactions/Transactions'
import BetHistory from './components/BetHistory/BetHistory'
import Navbar from './components/Navbar/Navbar'
import Profile from './components/Profile/Profile'
import CopyBetter from "./components/CopyBetter/CopyBetter";
import NotificationsDropdown from "./components/NotificationsDropdown/NotificationsDropdown"

function App() {

  return (
    <BrowserRouter>
    <Routes>
      
      <Route exact path='/'  element={
      
          <>
            <Login/>
          </>
      } />

      <Route exact path='/admin'  element={
        <>
          <Navbar />
          <Admin/>
        </>

      } />

      
      <Route exact path='/events'  element={
        <>
          <ProtectedRoute>
            <Navbar />  
            <Events/>
          </ProtectedRoute>
        </>

      } />


      <Route exact path='/login'  element={
        <>
          
          <Login/>
        </>

      } />


      <Route exact path='/register'  element={
        <>

          <Register/>
        </>

      } />


      <Route exact path='/deposit'  element={
        <>
          <Navbar/>
          <Deposit/>
        </>

      } />

      <Route exact path='/transactions' element={
        <>
          <Navbar/>
          <Transactions/>
        </>
        
      } />

      <Route exact path='/bethistory' element={
        <>
          <Navbar/>
          <BetHistory/>
        </>
      }  />


      <Route exact path='/notifications'  element={
        <>
          <Navbar/>
          <NotificationsDropdown/>
        </>

      } />

      <Route exact path='/profile'  element={
        <>
          <Navbar />
          <Profile/>
        </>
      } />

      <Route exact path='/copyBetter'  element={
        <>
          <Navbar/>
          <CopyBetter/>
        </>

      } />
      
      <Route path='*' element={
        <p>Not Found</p>
      }/>
               
       

       
    </Routes>
 
</BrowserRouter>

  );
}

export default App;
