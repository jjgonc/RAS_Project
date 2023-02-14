import './Admin.css'
import { useEffect, useState } from 'react';
import {ServerUrl} from '../../ServerUrl'
import axios from 'axios'


const Admin = () => {
  
    const [events,setEvents] = useState([])
    const [load, setLoad] = useState(false)
    const [it,setIt] = useState(0)
    const [odd,setOdd] = useState()
    const [amount,setAmount] = useState()
    const [endDate,setEndDate] = useState()
    const [increaseOdds, setIncreaseOdds] = useState(true)
    const [admin, setAdmin] = useState(false)
    const [odd_casa,set_odd_casa] = useState(0)
    const [odd_fora,set_odd_fora] = useState(0)
    const [odd_emapte,set_odd_emapte] = useState(0)

  const createPromotion = async () => {

    const res = await axios.post(ServerUrl + '/admin/createPromotion',{
      promotionType : increaseOdds ? 'odd' : 'balance',
      odd : increaseOdds ? odd : 0,
      initialDate : Date.now(),
      endDate : endDate,
      balanceImprovement :  increaseOdds ? 0 : amount
    })

  }

    const handleChange = () => {
      setIncreaseOdds(!increaseOdds)
    }


    const getEvents = async() => {
        const url = ServerUrl + '/events/getAllEvents'
        const response = await fetch(url)
        const events = await response.json()
        setEvents(events)
    }

    const updateEvent = async (event) => {
      try{
        const res = await axios.post(ServerUrl + '/admin/updateEvent',{
          event:event
        })
        console.log(res.data.msg)
      }
      catch(error){
        console.log(error)
      }
    }

    useEffect(() => {
        if(it === 0)getEvents()
        setIt(it + 1)
        setAdmin(window.sessionStorage.getItem("admin"))
      }, [load]);

    const addGoal = async (casa,index) => {
      
      var newEvents = events
      
      if(casa){
        newEvents[index].homeGoals = events[index].homeGoals + 1
      }else{
        newEvents[index].awayGoals = events[index].awayGoals + 1
      }
    
      updateEvent(newEvents[index])
      setEvents(newEvents)
      setLoad(!load)
    
    
    }

    const removeGoal = async (casa,index) => {
      
      var newEvents = events
      
      if(casa){
        newEvents[index].homeGoals = events[index].homeGoals - 1
      }else{
        newEvents[index].awayGoals = events[index].awayGoals - 1
      }
    
      updateEvent(newEvents[index])
      setEvents(newEvents)
      setLoad(!load)
    
    
    }

    const changeUpdate = (index)=>{

      var newEvents = events
      newEvents[index].adminUpdate = !newEvents[index].adminUpdate
      updateEvent(newEvents[index])
      setEvents(newEvents)
      setLoad(!load)

    }

    const changeOdd = (index,newOdd) => {
      try{
        var newEvents = events
        newEvents[index].oddsBet = newOdd
        updateEvent(newEvents[index])
        setEvents(newEvents)
        setLoad(!load)
      }
      catch(error){

      }
    }


    const closeEvent = async(index)=>{


      console.log(events[index].idEvent)
      try{
        const res = await axios.post(ServerUrl + '/admin/closeEvent',{
          eventID:events[index].idEvent
        })

      }
      catch(error){
        console.log(error)
      }

      var newEvents = events
      newEvents[index].state = 0
      updateEvent(newEvents[index])
      setEvents(newEvents)
      setLoad(!load)

    }

    const openEvent = (index)=>{

      var newEvents = events
      events[index].state = 1
      updateEvent(newEvents[index])
      setEvents(newEvents)
      setLoad(!load)

    }

   


    const suspendEvent = (index)=>{

      var newEvents = events
      events[index].state = 2
      updateEvent(newEvents[index])
      setEvents(newEvents)
      setLoad(!load)

    }

    if (admin != 'true'){
      console.log(admin)
        return (<div>
          <h2>nao é admin</h2>
        </div>)

    } else {
        console.log(admin)
        return (
          <div className='admin-container'>
            <div className='events-settings'>
                <h1>Events Settings</h1>
                <ul>

                {events.map((event,index) =>{
                  
                    return(
                        <li key={index}>
                        <div className='boletim-container-admin'>
                          <div className="adminLeft">
                            <h3>{event.homeTeam} - {event.awayTeam}</h3>
                            <h5>Estado -> {(event.state==2) ? 'Suspenso' : event.state ? 'Aberto' : 'Fechado'}</h5>
                            <h5>Resultado -> {event.homeGoals} - {event.awayGoals}</h5>
                          </div>
                          <div className="adminRight">
                          {event.adminUpdate ?
                          <div className='adminUpdate'>
                            <button className="updateButton" onClick={()=>closeEvent(index)}>Fechar Evento</button>
                            <button className="updateButton" onClick={()=>suspendEvent(index)}>Suspender Evento</button>
                            <button className="updateButton" onClick={()=>openEvent(index)}>Abrir Evento</button>
                            <button className="updateButton" onClick={()=>addGoal(true,index)}>Adicionar Golo Casa</button>
                            <button className="updateButton" onClick={()=>addGoal(false,index)}>Adicionar Golo Fora</button>
                            <button className="updateButton" onClick={()=>removeGoal(true,index)}>Remover Golo Casa</button>
                            <button className="updateButton" onClick={()=>removeGoal(false,index)}>Remover Golo Fora</button>
                            
                            <h5>Antiga Odd Casa - {event.oddsBet[0]}</h5>
                            <input 
                            type="decimal" 
                            className="username_better"
                            placeholder="odd"
                            autofocus
                            id="odd_casa" 
                            name="odd_casa"
                            value={odd_casa}
                            onChange={(e) => {set_odd_casa(e.target.value)}}
                            />

                            <h5>Antiga Odd Fora - {event.oddsBet[1]}</h5>
                            <input 
                            type="decimal" 
                            className="username_better"
                            placeholder="odd"
                            autofocus
                            id="username_better" 
                            name="username_better"
                            value={odd_fora}
                            onChange={(e) => {set_odd_fora(e.target.value)}}
                            />


                            <h5>Antiga Odd Empate- {event.oddsBet[2]}</h5>
                            <input 
                            type="decimal" 
                            className="username_better"
                            placeholder="odd"
                            autofocus
                            id="username_better" 
                            name="username_better"
                            value={odd_emapte}
                            onChange={(e) => {set_odd_emapte(e.target.value)}}
                            />

                            <button className="updateButton" onClick={()=>{
                              
                              var newOdds = [odd_casa,odd_fora,odd_emapte]

                              changeOdd(index,newOdds)}}>
                                Mudar Odds</button>
                            <button className="changeButton" onClick={()=>changeUpdate(index)}>Parar de atualizar</button>
                          </div>
                          : <div className='adminNotUpdate'>
                            <button className="changeButton" onClick={()=>changeUpdate(index)}>Começar a atualizar</button>
                          </div>}
                          </div>
                        </div>

                      </li>
                      )
                      
                  })}
                </ul>
                
            </div> 

                <div className='promotions'>
                  <h1>Promotions</h1>
                  <div className="promotionsBox">
                  <div className='selection'>
                    <div className="selectionTypeLeft">
                      <input 
                        className="selectionCheckbox" 
                        id="toggleIncrease" 
                        type="checkbox" 
                        checked={increaseOdds} 
                        onChange={() => {
                          handleChange()
                          setAmount(odd)
                        }} 
                      />
                      <label for="toggleIncrease" className="selectionToggleLeft">Increase Odds</label>
                    </div>  
                    <div className="selectionTypeRight">
                      <input 
                        className="selectionCheckbox" 
                        id="toggleRegister" 
                        type="checkbox" 
                        checked={!increaseOdds} 
                        onChange={() => {
                          handleChange()
                          setOdd(amount)
                        }}
                      />
                      <label for="toggleRegister" className="selectionToggleRight">Register Bonus</label>
                    </div>

                    {/*
                    <label>
                    <input type="radio" checked={increaseOdds} onChange={() => {
                      handleChange()
                      setAmount(odd)
                      
                      
                      }} />
                    Increase Odds
                  </label>

                  <label>
                    <input type="radio" checked={!increaseOdds} onChange={()=>{
                      handleChange()
                      setOdd(amount)
                      }} />
                    Register Bonus
                  </label>
                    */}
                </div>

                  {increaseOdds ? 
                <div className='increaseOdds'>
                  <div className="LoginLeftFormEmail">
                  <h5>Improvment porcentage</h5>
                  <input 
                    type="text"
                    className="LoginFormEmail"
                    placeholder="% improvment" 
                    autoFocus
                    id ="% porcentage"
                    name="improvment"
                    value={odd}
                    onChange={(e) => setOdd(e.target.value)}
                  />
                </div>
                <div className="LoginLeftFormPassword">
                  <h5>Data de Fim</h5>
                <input 
                  type="date" 
                  className="RegisterFormDate"
                  autofocus
                  id="birthdate" 
                  name="birthdate"
                  value={endDate}
                  onChange={(e) => {setEndDate(e.target.value)}}
                />
                </div>
                <button block="true" size="lg" type="submit" onClick={()=>createPromotion()}  className="LoginFormButton">
                Criar Promocão
                </button>
                </div> : 
                
                
                <div className='registerBonus'>
                <div className="LoginLeftFormEmail">
                <h5>Valor de Bónus</h5>
                <input 
                  type="text"
                  className="LoginFormEmail"
                  placeholder="bonus" 
                  autoFocus
                  id ="% porcentage"
                  name="improvment"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="LoginLeftFormPassword">
                <h5>Data de Fim</h5>
              <input 
                type="date" 
                className="RegisterFormDate"
                autofocus
                id="birthdate" 
                name="birthdate"
                value={endDate}
                onChange={(e) => {setEndDate(e.target.value)}}
              />
              </div>
              <button block="true" size="lg" type="submit" onClick={()=>createPromotion()}  className="LoginFormButton">
                Criar Promocão
              </button>
              </div>}
              
              
              
              
              </div>
              </div>
                



          </div>
        )
  }
}
export default Admin