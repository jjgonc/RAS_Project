import React from "react";
import "./Modal_Deposit.css";
import { useState } from "react";
import {ServerUrl} from '../../ServerUrl'
import axios from 'axios';

function Modal_Withdraw({ setWithdrawOpenModal }) {

    const [method, setMethod] = useState('');
    const [amount, setAmount] = useState(0);


    const submitWithdraw = async() =>{
        const userID = window.localStorage.getItem("user")

        const res = await axios.post(ServerUrl + '/accounts/updateBalance', {
            _id : userID,    
            amount: -amount
        })
        .then(function (response) {
          console.log(response);
          alert("Withdraw successful");
        })
        .catch(function (error) {
          console.log(error);
          alert("You don't have enough money to withdraw that amount");
        })

    }


  return (
    <div className="modalBackground">
      <div className="modalContainer">
        
        

        <div className="withdraw">            
            <div className="row">
                <h2>Withdraw Method</h2>
                <div className='column'>
                    <button id='paypalButton' onClick={() => setMethod('paypal')}>
                        <img src='paypal.png'></img>
                    </button>
                </div>
                <div className='column'>
                    <button id='mbwayButton' onClick={() => setMethod('mbway')}>
                        <img src='mbway.png'></img>
                    </button> 
                </div>
                <div className='column'>
                    <button id='bitcoinButton' onClick={() => setMethod('bitcoin')}>
                        <img src='bitcoin.png'></img>
                    </button>
                </div>
            {/* meter uma imagem que fique nas fucking dimensoes corretas que eu nao arranjei xD */}
                <div className='column'>            
                    <button id='bankTransferButton' onClick={() => setMethod('bankTransfer')}>
                        <img src='banktransfer.png'></img>
                    </button>
                </div>
            </div>

            <div className='submitBalance'>
                <label>
                  Amount:
                  <input type='number' placeholder="Enter amount" name={amount} onInput={(e) => setAmount(e.target.value)} />
                </label>
            </div>
        </div>




        <div className="footer">
          <button
            onClick={() => {
              setWithdrawOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button type="button" onClick={()=>submitWithdraw()}>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default Modal_Withdraw;