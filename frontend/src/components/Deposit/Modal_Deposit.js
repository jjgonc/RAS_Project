import React from "react";
import "./Modal_Deposit.css";
import { useState } from "react";
import {ServerUrl} from '../../ServerUrl'
import axios from 'axios';

function Modal_Deposit({ setDepositOpenModal }) {

    const [method, setMethod] = useState('');
    const [amount, setAmount] = useState(0);


    const submitDeposit = async() =>{

        const userID = window.localStorage.getItem("user")


        const res = await axios.post(ServerUrl + '/accounts/updateBalance', {
            _id : userID,
            amount: amount
        })
        .then(function (response) {
            alert("Deposit successful");
            console.log(response);
        })
        .catch(function (error) {
            alert("You must deposit an amount between 1 and 10000")
            console.log(error);
        });
    }


  return (
    <div className="modalBackground">
      <div className="modalContainer">
        
        

        <div className="row">
            <h2>Deposit Method</h2>
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




        <div className="footer">
          <button
            onClick={() => {
              setDepositOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button type="button" onClick={()=>submitDeposit()}>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default Modal_Deposit;