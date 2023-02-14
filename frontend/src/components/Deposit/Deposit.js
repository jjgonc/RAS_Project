import './Deposit.css'
import React, { useState } from "react";
import {ServerUrl} from '../../ServerUrl'
import axios from 'axios';
import Modal_Deposit from './Modal_Deposit';
import Modal_Withdraw from './Modal_Withdraw';




const Deposit = () => {

    const [method, setMethod] = useState('');
    const [amount, setAmount] = useState(0);
    const [showPaymentData, setShowPaymentData] = useState(false);

    const [successfulOperation, setSuccessfulOperation] = useState(false);

    
    const [paypalSelected, setPaypalSelected] = useState(false);
    const [bitcoinSelected, setBitcoinSelected] = useState(false);
    const [mbWaySelected, setMBWaySelected] = useState(false);
    const [bankTransferSelected, setBankTransferSelected] = useState(false);


    function selectMethod(method){
        setShowPaymentData(true);
        // console.log("Deposit method is: " + method)
        if (method === 'paypal'){
            if(paypalSelected === true){
                setPaypalSelected(false);
                setShowPaymentData(false);
            }else{
                setPaypalSelected(true);
            }
            // setPaypalSelected(!paypalSelected) 
            setBitcoinSelected(false)
            setMBWaySelected(false)
            setBankTransferSelected(false)
        }
        else if (method === 'bitcoin'){
            if(bitcoinSelected === true){
                setBitcoinSelected(false);
                setShowPaymentData(false);
            }else{
                setBitcoinSelected(true);
            }
            // setBitcoinSelected(!bitcoinSelected)
            setPaypalSelected(false)
            setMBWaySelected(false)
            setBankTransferSelected(false)
        }
        else if (method === 'mbway'){
            if(mbWaySelected === true){
                setMBWaySelected(false);
                setShowPaymentData(false);
            }else{
                setMBWaySelected(true);
            }
            // setMBWaySelected(!mbWaySelected)
            setPaypalSelected(false)
            setBitcoinSelected(false)
            setBankTransferSelected(false)
        }
        else if (method === 'bankTransfer'){
            if(bankTransferSelected === true){
                setBankTransferSelected(false);
                setShowPaymentData(false);
            }else{
                setBankTransferSelected(true);
            }
            // setBankTransferSelected(!bankTransferSelected)
            setMBWaySelected(false)
            setPaypalSelected(false)
            setBitcoinSelected(false)
        }
        else{
            console.log("no method selected")
        }

    }



    const submitDeposit = async() =>{
        if(paypalSelected || bitcoinSelected || mbWaySelected || bankTransferSelected){
            const userID = window.localStorage.getItem("user")


            const res = await axios.post(ServerUrl + '/accounts/updateBalance', {
                _id : userID,
                amount: amount
            })
            .then(function (response) {
                alert("Deposit successful");
                setSuccessfulOperation(true);
                console.log(response);
            })
            .catch(function (error) {
                alert("You must deposit an amount between 1 and 10000")
                console.log(error);
            });
        }
        else{
            alert("You must select a payment method")
        }
    }



    const submitWithdraw = async() =>{
        if (paypalSelected || bitcoinSelected || mbWaySelected || bankTransferSelected){
            const userID = window.localStorage.getItem("user")

            const res = await axios.post(ServerUrl + '/accounts/updateBalance', {
                _id : userID,    
                amount: -amount
            })
            .then(function (response) {
              console.log(response);
              setSuccessfulOperation(true);
              alert("Withdraw successful");
            })
            .catch(function (error) {
              console.log(error);
              alert("You don't have enough money to withdraw that amount");
            })
        }
        else{
            alert("You must select a payment method")
        }
    }
    
    return (
        <div className='account-movements'>
            <div className="DepositBox">

                <div className="deposit">
                    <h1>Movimentar Conta</h1>
                    <div className='submitBalance'>
                            <input type='number' placeholder='Insert amount...' name={amount} onInput={(e) => setAmount(e.target.value)} />
                    </div>


                    <div className="row">
                        <h4>Método</h4>
                        <div className='column'>
                            <button id='paypalButton' onClick={() => {setMethod('paypal'); selectMethod('paypal');}} style={{backgroundColor : paypalSelected ? "#739e5f" : "#b4c9aa"}}>
                                <img src='paypal.png'></img>
                            </button>
                        </div>

                        <div className='column'>
                            <button id='mbwayButton' onClick={() => {setMethod('mbway'); selectMethod('mbway');}} style={{backgroundColor : mbWaySelected ? "#739e5f" : "#b4c9aa"}}>
                                <img src='mbway.png'></img>
                            </button> 
                        </div>

                        <div className='column'>
                            <button id='bitcoinButton' onClick={() => {setMethod('bitcoin'); selectMethod('bitcoin');}} style={{backgroundColor : bitcoinSelected ? "#739e5f" : "#b4c9aa"}}>
                                <img src='bitcoin.png'></img>
                            </button>
                        </div>

                        <div className='column'>            
                            <button id='bankTransferButton' onClick={() => {setMethod('bankTransfer'); selectMethod('bankTransfer');}} style={{backgroundColor : bankTransferSelected ? "#739e5f" : "#b4c9aa"}}>
                                <img src='banktransfer.png'></img>
                            </button>
                        </div>
                    </div>
                </div>

                {successfulOperation &&
                        <div className='successfulOperation'>
                            <p>Operation completed with success!</p>
                        </div>
                }


                {showPaymentData &&
                    <div className='paymentData'>
                        {paypalSelected &&
                        // <input placeholder='Enter MbWay contact...' type='text' ></input>
                        <p>Redirecting to paypal...</p>
                        }
                        {mbWaySelected &&
                            <input placeholder='Enter MbWay contact...' type='text' ></input>
                        }
                        {bitcoinSelected &&
                            <input placeholder='Enter Bitcoin address...' type='text' ></input>
                        }
                        {bankTransferSelected &&
                            <input placeholder='Enter NIB...' type='text' ></input>
                        }
                        <div className='TwoButtons'>
                            <div className='depositButton'>
                            <button type="button" onClick={()=>submitDeposit()}>Deposit</button>
                            </div>
                            <div className='withdrawButton'>
                            <button type="button" onClick={()=>submitWithdraw()}>Withdraw</button>
                            </div>
                        </div>
                    
                    </div>
                }
                
                {/* <div className='TwoButtons'>
                    <div className='depositButton'>
                    <button type="button" onClick={()=>submitDeposit()}>Deposit</button>
                    </div>
                    <div className='withdrawButton'>
                    <button type="button" onClick={()=>submitWithdraw()}>Withdraw</button>
                    </div>
                </div> */}
            </div>
        </div>
    )

}


export default Deposit 