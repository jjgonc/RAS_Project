import './Events.css'
import { useEffect, useState } from 'react';
import {ServerUrl} from '../../ServerUrl'
import axios from 'axios'


const Events = () => {
  
    const [events,setEvents] = useState([])
    const [boletim,setBoletim] = useState([])
    const [simples,setSimples] = useState(true)
    const [value,setValue] = useState(0)
    const [userID,setUserID] = useState(window.localStorage.getItem("user"))
    const [notificationState, setNotificationState] = useState([])
    const [finalOdd,setFinalOdd] = useState(0)
    const [finalGains,setFinalGains] = useState(0)
    const [trigger,setTrigger] = useState(true)
    
    const subscribe = async (index,event) => {
      
    
      const userID = window.localStorage.getItem("user")

      const res = await axios.post(ServerUrl + '/observer/subscribeEvent',{
        event : event.idEvent,
        user : userID
      })

      var aux = [...notificationState]
      aux[index] = !aux[index]
      setNotificationState(aux)
    }

    const unsubscribe = async (index,event) => {

      console.log('unsubscribe')
      const userID = window.localStorage.getItem("user")

      const res = await axios.post(ServerUrl + '/observer/unsubscribeEvent',{
        event : event.idEvent,
        user : userID
      })

      var aux = [...notificationState]
      aux[index] = false
      setNotificationState(aux)

    }

    const handleChange = () => {
      setSimples(!simples)
    }

    const handleClickLeft = (dicBet,ID,winner) => {
      const elemID = ID + winner
      const elem = document.getElementById(elemID)
      if(elem.getAttribute("data-checked") == "true"){
        elem.setAttribute("data-checked","false")
        removeFromBoletimById(ID,winner)
      }
      else{
        elem.setAttribute("data-checked","true")
        putOnBoletim(dicBet)
      }
    }

    const handleClickRight = (index,elemID) => {
      removeFromBoletim(index)
      const elem = document.getElementById(elemID)
      elem.setAttribute("data-checked","false")
    }

    const putOnBoletim = (dicBet) => {
      setBoletim([...boletim,dicBet])
    }

    const removeFromBoletim = (index) => {
      setBoletim([...boletim.slice(0,index), ...boletim.slice(index+1, boletim.length)])
    }

    const removeFromBoletimById = (eventID,winner) => {
      for (let ind = 0; ind < boletim.length; ind++) {
        if (boletim[ind].eventID == eventID && boletim[ind].winner == winner){
          removeFromBoletim(ind)
        }
      }
    }

    const confirmBet = async() => {

      if(boletim.length > 0 && (value > 0 || simples)){
        const data =  {
          bets: boletim,
          amountBet: value,
          date: Date.now(),
          state: 'registed',
          simples:simples,
          userId: userID,
          copied_from: 'none'
        }
      
    
        const res = await axios.post(ServerUrl + '/events/insertBoletim',data)  
        alert(res.data.msg)
        if (res.status == 201) { // SE FOR APOSTA REGISTADA
          setBoletim([])
          setValue(0)
        }  
      }else{
        alert('erro')
      }
    }

    const handleConfirm = () => {
      for (let ind = 0; ind < boletim.length; ind++) {
          var elem = document.getElementById(boletim[ind].eventID+boletim[ind].winner)
          elem.setAttribute("data-checked","false")
      }
      confirmBet()
    }
    
    const getEvents = async () => {
      try{

        const userID = window.localStorage.getItem('user')
        const url = ServerUrl + '/events/getAllOn'
        const response = await fetch(url)
        const events = await response.json()


        setEvents(events)
        

        //verificar se o user segue determinado evento
        
        var nots = []
        for(const event of events){
          if(event.observers.includes(userID)) nots.push(true)
          else nots.push(false)
        }
        setNotificationState([...nots])

      }catch(err){
        console.log(err)
      }
      };
    
      useEffect(() => {
        getEvents()
      }, [boletim]);


      useEffect(() => {
        updateFinalOdd()
      }, [boletim]);


      useEffect(() => {
        updateFinalGains()
      }, [boletim]);


      useEffect(() => {
        updateFinalGains()
      }, [simples]);


      useEffect(() => {
        updateFinalGains()
      }, [value]);


      useEffect(() => {
        updateFinalGains()
      }, [trigger]);


      useEffect(() => {
        updateBetButton()
      }, [boletim]);


      const updateFinalOdd = () => {
        var newOdd = 1
        for (let ind = 0; ind < boletim.length; ind++) {
          newOdd = newOdd * boletim[ind].Price
        }
        if(newOdd==1){
          setFinalOdd(0)
        }
        else{
          setFinalOdd(newOdd)
        }
      }


      const updateFinalGains = () => {
        var newGains = 0
        if(simples){
          for (let ind = 0; ind < boletim.length; ind++) {
            newGains = newGains + (boletim[ind].value * boletim[ind].Price)
          }
        }
        else{
          newGains = value * finalOdd
        }
        setFinalGains(newGains)
      }


      const updateBetButton = () => {
        const elem = document.getElementById("confirmbutton")
        if(simples){
          if(boletim.length>0){
            elem.setAttribute("state","on")
          }
          else{
            elem.setAttribute("state","off")  
          }
        }
        else{
          if(boletim.length>1 && boletim.length<21){
            elem.setAttribute("state","on")
          }
          else{
            elem.setAttribute("state","off")  
          }
        }
      }
     
    
    return (
      <div className='bets-container'>
      <div className='events-container'>
          <div className="EventsHeader">
          </div>          
         
          <ul className="EventsList">
              {events.map((eventX,index) =>{
                  
                  return(
                      <li className="EventsSingle" state={eventX.state} key={index}>
                      <div className='place-container'>
                          <div className="EventSingleTitle">{eventX.homeTeam} - {eventX.awayTeam}</div>
                          <div className='notification'>
                            {!notificationState[index] ? 
                            <button onClick={() => subscribe(index,eventX)}><img src='notification-of.png'></img></button> :
                            <button onClick={() => unsubscribe(index,eventX)}><img src='notification-on.png'></img></button>}
                          </div>
                          <button 
                            id={eventX.idEvent + eventX.homeTeam} 
                            data-checked="false"
                            className="EventSingleHomeButton" 
                            onClick={()=>handleClickLeft({'eventID': eventX.idEvent, value:0 ,HomeTeam: eventX.homeTeam, 'AwayTeam': eventX.awayTeam, 'Price' : eventX.oddsBet[0], 'winner' : eventX.homeTeam},eventX.idEvent,eventX.homeTeam)}>
                              <div className="EventSingleButtonTitle">{eventX.homeTeam}</div>
                              <div className="EventSingleButtonOdd">{parseFloat(eventX.oddsBet[0]).toFixed(2)}</div>  
                          </button>
                          <button
                            id={eventX.idEvent + eventX.awayTeam} 
                            data-checked="false" 
                            className="EventSingleAwayButton" 
                            onClick={()=>handleClickLeft({'eventID': eventX.idEvent, value:0 ,HomeTeam: eventX.homeTeam, 'AwayTeam': eventX.awayTeam, 'Price' : eventX.oddsBet[1], 'winner' : eventX.awayTeam},eventX.idEvent,eventX.awayTeam)}>
                              <div className="EventSingleButtonTitle">{eventX.awayTeam}</div>
                              <div className="EventSingleButtonOdd">{parseFloat(eventX.oddsBet[1]).toFixed(2)}</div>
                          </button>
                          <button
                            id={eventX.idEvent + 'DRAW'} 
                            data-checked="false"  
                            className="EventSingleDrawButton" 
                            onClick={()=>handleClickLeft({'eventID': eventX.idEvent, value:0 ,HomeTeam: eventX.homeTeam, 'AwayTeam': eventX.awayTeam, 'Price' : eventX.oddsBet[2], 'winner' : 'DRAW'},eventX.idEvent,"DRAW")}>
                              <div className="EventSingleButtonTitle">Empate</div>
                              <div className="EventSingleButtonOdd">{parseFloat(eventX.oddsBet[2]).toFixed(2)}</div> 
                          </button>
                      </div>

                  </li>
                  )
                  
              })}

          </ul>
        </div>

        <div className='boletim-container'>            
            <div className="BoletimTitle">BOLETIM</div>
            <div className="BoletimType">
              <div className="BoletimTypeLeft">
                <input className="BoletimCheckbox" id="toggleSimples" type="checkbox" checked={simples} onChange={handleChange} />
                <label for="toggleSimples" className="BoletimToggleLeft">SIMPLES</label>
              </div>  
              <div className="BoletimTypeRight">
                <input className="BoletimCheckbox" id="toggleMult" type="checkbox" checked={!simples} onChange={handleChange} />
                <label for="toggleMult" className="BoletimToggleRight">MÚLTIPLAS</label>
              </div>
          </div>

            <ul className="BoletimBets">
              {boletim.map(({eventID,value,HomeTeam,AwayTeam,Price,winner},index) => {
                return(
                <li className="BoletimSingleBet" key={index}>
                  <div className="BoletimSingleBetTop">
                    <div className="BoletimSingleBetTopLeft">
                      {HomeTeam} - {AwayTeam}
                    </div> 
                    <div className="BoletimSingleBetTopRight">
                      <img alt="" src="cancelbutton.png" className="BoletimRemoveButton" onClick={()=>handleClickRight(index,eventID+winner)}/>
                    </div>
                  </div>
                    <div className="BoletimSingleBetBottom">
                    <div className="BoletimSingleBetBottomLeft">
                      <div className="BoletimSingleBetBottomLeftWinner">Aposta - {winner==='DRAW' ? 'Empate' : winner}</div>
                      {simples ? <input 
                                    className="BoletimSingleBetBottomLeftAmmount"
                                    type="montante"
                                    placeholder="Montante" 
                                    onInput={e=>{boletim[index].value = e.target.value;setTrigger(!trigger);}}
                                 /> : <p></p> }
                    </div>
                    <div className="BoletimSingleBetBottomRight">
                      <div className="BoletimSingleBetBottomRightBox">Cota : {parseFloat(Price).toFixed(2)}</div>
                    </div>
                  </div>
                </li>)
              })}
            </ul>
            <div className="BoletimFooter">  
              {!simples ? <div className="BoletimFooterTop">

                <div className="BoletimFooterTopOdd">
                  <div className="BoletimFooterTopOddBox">Cota : {parseFloat(finalOdd).toFixed(2)}</div>
                </div>
                
                <input
                  className="BoletimFooterTopInput"
                  placeholder="Montante" 
                  value={value} 
                  onInput={e=>setValue(e.target.value)}
                />
              </div>: <p></p> }
              <div className="BoletimFooterBottom">

                <div className="BoletimFooterGains">
                  <div className="BoletimFooterGainsTitle">Total de Ganhos</div>
                  <div className="BoletimFooterGainsBox">{parseFloat(finalGains).toFixed(2)}</div>
                </div>
                <button className="BoletimFooterButton" id="confirmbutton" state="off" onClick={()=>handleConfirm()}>Apostar</button>
              </div>  
            </div>
        </div>
      </div>
    )
}
export default Events