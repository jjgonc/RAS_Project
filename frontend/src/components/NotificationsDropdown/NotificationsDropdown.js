import './NotificationDropdown.css'
import { ServerUrl } from '../../ServerUrl'
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import { ReactComponent as ChevronIcon } from './icons/chevron.svg';
import { ReactComponent as ArrowIcon } from './icons/arrow.svg';
import { useState, useEffect, useRef } from "react";



const DropdownMenu = () => {

  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);
  const [notifications, setnotifications] = useState([])
  const [boletins, setBoletins] = useState([])
  const [users, setUsers] = useState([])
  const [index, setIndex] = useState(0)
  const [value, setValue] = useState();
  const [userID,setUserID] = useState(window.localStorage.getItem("user"))
  const [load, setLoad] = useState(false)



  const getNotifications = async () => {

    const userID = window.localStorage.getItem("user")

    const notifications = await axios.post(ServerUrl + '/accounts/getNotifications', {
      user: userID
    })

    setnotifications(notifications.data.notifications)
  }


  const removeNotification = async (index) => {


    const userID = window.localStorage.getItem("user")

    try{
      const res = await axios.post(ServerUrl + '/accounts/removeNotification', {
        user: userID,
        index : index
      })
  
      var nots = []
      nots = [...notifications]
      nots.splice(index,1)
      setnotifications(nots)
    }catch(error){

    }

  }

  const getBoletins = async () => {

    var boletins = []
    var users = []

    for (const notification of notifications) {

      if (notification.includes('|')) {
        const id = notification.split('Bet:')[1].split('.')[0]
        const userID = notification.split('User:')[1].split('|')[0]
      
        const boletim = await axios.post(ServerUrl + '/events/getBoletim', {
          boletimID: id
        })

        const user = await axios.post(ServerUrl + '/accounts/getUser',{
          _id : userID
        })

        boletins.push(boletim.data)
        users.push(user.data.username)
      } else {
        boletins.push(null)
        users.push(null)
      }


    }

    console.log(boletins)

    setBoletins([...boletins])
    setUsers([...users])

    setLoad(true)

  }


  const confirmBet = async(index) => {
    

      var b = [...boletins]
      b[index].bets[0].value = 5

      console.log(b)
      
    

      const data =  {
        bets: b[index].bets,
        amountBet: value,
        date: Date.now(),
        simples:boletins[index].simples,
        userId: userID,
        copied_from:users[index]
      }
    
  
      const res = await axios.post(ServerUrl + '/events/insertBoletim',data)  
      alert(res.data.msg)
      
   
  }



  useEffect(() => {
    console.log(value)
  }, [value]);


  useEffect(() => {
    getNotifications()
  }, []);

  useEffect(() => {
    getBoletins()
  }, [notifications]);

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
  }, [])

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }


  function DropdownItem(props) {
    return (
      <a href="#" className={props.className} onClick={() => {
        props.goToMenu && setActiveMenu(props.goToMenu)
        props.index && setIndex(props.index)
      }}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  if(load)
  return (

      <div className="dropdown" ref={dropdownRef}>

        <CSSTransition
          in={activeMenu === 'main'}
          timeout={500}
          classNames="menu-primary"
          unmountOnExit
          onEnter={calcHeight}>
          <div className="menu">

            {notifications.map(((item, index) => (
              
              <div className='notification-container'>
                <div className='notification'>
                {item.includes('|') ? 
                <DropdownItem
                  leftIcon={<img src='boletim.png' style={{width:30 + 'px'}}></img>}
                  rightIcon={<ChevronIcon />}
                  goToMenu="copy"
                  index={index}
                  className='menu-item'>
                  {users[index]} efectuou uma aposta
              </DropdownItem>:
              <DropdownItem
                leftIcon={<img src='football.png' style={{width:30 + 'px'}}></img>}
                className='menu-item'>
                {item}
              </DropdownItem>
              }
              </div>

              <button onClick={()=>removeNotification(index)}><img src='cancel.png'></img></button>

              </div>
            )))}

          </div>
        </CSSTransition>



        <CSSTransition
          in={activeMenu === 'copy'}
          timeout={500}
          classNames="menu-secondary"
          unmountOnExit
          onEnter={calcHeight}>
          <div className="menu">
            <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
              <h2>Boletim</h2>
            </DropdownItem>
            {boletins.length > 0 && boletins[index] ?
            <DropdownItem className='menu-item-bet'>
              {boletins[index].bets.map((bet) => {
                return (
                  <ul>
                    <li>Equipa Casa : {bet.homeTeam}</li>
                    <li>Equipa Fora {bet.awayTeam}</li>
                    <li>Odd: {bet.odd}</li>
                    <li>Resultado: {bet.result}</li>
                    <hr></hr>
                  </ul>
                )
              })}

              <h5>Odd Final: {boletins[index].finalOdd}</h5>
              <h5>Tipo de Aposta : {boletins[index].simples ? 'Simples' : 'Múltipla'}</h5>
              <label >Valor a apostar:</label>
                <input type='number' value={value} onInput={e=>{
                  setValue(e.target.value)}}/>
              <button onClick={()=>{confirmBet(index)}}>Copiar</button>
            </DropdownItem> 
            :<h1></h1>}



          </div>
        </CSSTransition>
      </div>
  );
}

export default DropdownMenu