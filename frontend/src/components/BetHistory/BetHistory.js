import './BetHistory.css'
import { useEffect, useState } from 'react';
import {ServerUrl} from '../../ServerUrl'
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { get } from 'ajax';
import {Link} from 'react-router-dom'


const BetHistory = () => {

const [boletins,setboletins] = useState([])
const [update,setUpdate] = useState(0)
const [currency,setCurrency] = useState('')
const [simples,setSimples] = useState(true)

const handleChange = () => {
  setSimples(!simples)
}

const getSymbol = (currency) => {
  const res = currency === 'EUR' ? ' €' : currency === 'BRL' ? ' R$' : currency === 'GBP' ? ' £' : ' $'
  console.log(currency)
  
  return res
}


const getCurrency = async () => {

    const userID = window.localStorage.getItem("user")


    const res = await axios.post(ServerUrl + '/accounts/getCurrency', {
        id: userID
    })

    setCurrency(res.data.currency)


}


const  cancelBet = async (boletim) => {
  const res = await axios.post(ServerUrl + '/accounts/cancelBet', {
    boletimID:  boletim[0]
})

alert(res.data.msg)
setUpdate(update + 1)

}

const getBoletins = async () => {

  const userID = window.localStorage.getItem("user")

  console.log(userID)

  const boletins = await axios.post(ServerUrl + '/accounts/getBoletins', {
      user:  userID
  })
          .then(response => {
              console.log("success");
              setboletins(response.data)
              console.log(response.data)
          }).catch((exception) => {
              console.log(exception);
          });
}


useEffect(() => {
    getBoletins()
    getCurrency()
}, [update]);

console.log(boletins)

    return (
      <div className='BetHistory'>
        <div className="BetHistoryHead"></div>
        <div className="BetHistoryBox">
            <div className="BetHistoryTitle">
              <Link to="/profile"><img className="BetHistoryButtomBack" alt="" src="buttom_back.png"/></Link>
              <h2>Histórico de Apostas</h2>  
            </div>
            <div className="BetHistoryType">
                  <div className="BetHistoryTypeLeft">
                    <input className="BetHistoryCheckbox" id="toggleSimples" type="checkbox" checked={simples} onChange={handleChange} />
                    <label for="toggleSimples" className="BetHistoryToggleLeft">SIMPLES</label>
                  </div>  
                  <div className="BetHistoryTypeRight">
                    <input className="BetHistoryCheckbox" id="toggleMult" type="checkbox" checked={!simples} onChange={handleChange} />
                    <label for="toggleMult" className="BetHistoryToggleRight">MÚLTIPLAS</label>
                  </div>
            </div>
            <ul className="BetHistoryList">
            {boletins.map((boletim,index) => (
                (boletim[7]===simples) ?
                  
                  
                  <li className="BetHistorySingle" key={index}>
                      <div className='bethistorysingle-container'>
                        <div className='BetHistoryUp'>
                          <div className='BetHistoryBetLeft'>
                            <div className='BetHistoryBets'>
                              {boletim[1].map(( bet => {
                                return (
                                <div className='BetHistoryBet'>
                                  <div className='BetHistoryResultadoSelecionado'>{bet[4]} @{parseFloat(bet[3]).toFixed(2)} </div>
                                  <div className='BetHistoryJogo'>{bet[1]} - {bet[2]}</div>
                                </div>)
                              }))}
                            </div>
                          </div>

                          <div className='BetHistoryBetRight'>
                            <div className='BetHistoryBetAmmount'>Montante Apostado: {boletim[3]}{boletim[11] === 'EUR' ? ' €' : boletim[11] === 'BRL' ? ' R$' : boletim[11] === 'GBP' ? ' £' : ' $'}</div>
                            <div className='BetHistoryOdd'>Odd: {parseFloat(boletim[2]).toFixed(2)}</div>
                            <div className='BetHistoryTotalEarnings' state={boletim[9] ? (boletim[10] ? 'ganha' : 'perdida') : 'pendente'}>
                                  {boletim[9] ? (boletim[10] ? 
                                    (boletim[6]==='none' ? 
                                      <h6>{boletim[4]}{boletim[11] === 'EUR' ? ' €' : boletim[11] === 'BRL' ? ' R$' : boletim[11] === 'GBP' ? ' £' : ' $'}</h6> 
                                    : <h6>{(parseFloat(boletim[4])*0.99).toFixed(2)}{boletim[11] === 'EUR' ? ' €' : boletim[11] === 'BRL' ? ' R$' : boletim[11] === 'GBP' ? ' £' : ' $'}</h6> )
                                  : <h6>0,00</h6> ) : <h6>Pendente</h6>}
                            </div>
                            
                          
                          </div>
                        </div> 


                      <div className='BetHistoryDown'>
                        <div className='BetHistoryDate'>{new Date(boletim[5]).toLocaleString()}</div>
                        {boletim[6]==='none' ?  <div className='BetHistoryCoppiedFrom'></div> : <div className='BetHistoryCoppiedFrom'>Coppied by:{boletim[6]}</div>}
                        <button className='BetHistoryCancelButton' state={boletim[9] ? 'desativo' : 'ativo'} onClick={() => cancelBet(boletim)}>Cancelar aposta</button>
                      </div>
                        
                      </div>
                     


                  </li>
                  
                : <li className='Lixo'></li>
                  
              ))}

          </ul>

            </div>
        </div>
    )
}





export default BetHistory

