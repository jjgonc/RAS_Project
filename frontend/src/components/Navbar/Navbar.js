import React, {useState} from 'react'
import {MenuItems} from './MenuItems'
import {Link} from 'react-router-dom'
import './Navbar.css'
import axios from 'axios'
import { ServerUrl } from '../../ServerUrl'
import { useEffect } from 'react'
import NotificationsDropDown from '../NotificationsDropdown/NotificationsDropdown'


const Navbar = () => {
    
    const [showLinks, setShowLinks] = useState(false)
    const [balance,setbalance] = useState(0)
    const [currency,setCurrency] = useState('')
    const [showNotifications,setShowNotifications] = useState(false)

    function setIndex (index){
        document.documentElement.style.setProperty('--z-index', index);
    }
    


    const getCurrency = async () => {

        const userID = window.localStorage.getItem("user")
        if (userID != null){
            const res = await axios.post(ServerUrl + '/accounts/getCurrency', {
                id: userID
            })
            setCurrency(res.data.currency)
        }else {
            setCurrency('€')
        }
    }

    const getBalance = async () => {
      
        const userID = window.localStorage.getItem("user")
        console.log(userID)
        if (userID != null){
            const balance = await axios.post(ServerUrl + '/accounts/getBalance', {
                user:  userID
              })
                    .then(response => {
                        console.log("success");
                        setbalance(response.data.balance.$numberDecimal)
                    }).catch((exception) => {
                        console.log(exception);
                    });
        } else {
            setbalance(0)
        }
        
    
      }


      const logout = async () => {
      
        window.localStorage.setItem("user", null);
        window.localStorage.setItem("logged", 'false');
        window.sessionStorage.setItem("admin",'false');
    
      }


      useEffect(() => {
        getBalance()
        getCurrency()
      }, []);

    
    return (
        

        
        <div className="my-navbar">
            <div className="left-side">
                <Link to="/events"><img alt="" src="logoMini.png"/></Link>
            </div>

            <div className="right-side">
                <div className="nav-links">

                    
                    <button onClick={()=>{
                        const index = getComputedStyle(document.documentElement).getPropertyValue('--z-index');
                        setShowNotifications(!showNotifications)
                        if(index == 1 && !showNotifications) setIndex(-1)
                        else setIndex(1)
                    }}>
                    <div className='notifications'>
                        <img src='notifications.png'></img>
                    </div>
                    </button>  

                    {showNotifications ? <NotificationsDropDown/> : <h1></h1>}
                    
                    
                    <Link className='links' to='/profile'>
                    <div className='profile'>
                        <img src='profile.png'></img>
                    </div>
                    </Link>  
                    
                    <Link className='links' to='/deposit'>
                    <div className='balance'>
                        <img src='cash.png'></img>
                        <p>{parseFloat(balance).toFixed(2)}{currency === 'EUR' ? ' €' : currency === 'BRL' ? ' R$' : currency === 'GBP' ? ' £' : ' $'}</p>

                    </div>
                    </Link>

                    
                    
                    <Link className='links' to='/login'>
                        <div className='logout'>
                            <img alt="" src="logout_icon.png" className="logout" onClick={()=>logout()}/>
                        </div>
                    </Link>


                                        
                </div>
            
                <img alt="" src="burguer.png" className="menu-icon" onClick={()=> setShowLinks(!showLinks)}/>
            
            </div>
        </div>

    
    )
}


export default Navbar