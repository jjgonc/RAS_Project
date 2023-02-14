import './Profile.css'
import axios from 'axios';
import React, { useState, useEffect } from "react";
import {ServerUrl} from '../../ServerUrl'
import {Routes, Route, useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleChevronRight} from '@fortawesome/free-solid-svg-icons'


const Profile = () => { 

    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [userInfo, setUserInfo] = useState({});
    // const [depositModalOpen, setDepositModalOpen] = useState(false);
    const [currency,setCurrency] = useState('None')
    const [load,setLoad] = useState(0)
    const [confirmarPassword, setConfirmarPassword] = useState(false);
    

    const options = [
        { label: "Euro", value: 'EUR' },
        { label: "Dólar", value: 'USD' },
        { label: "Real", value:'BRL'},
        { label: "Libra", value:'GBP'},
        { label: "None", value:'None'}
      ];

      const updateCurrency = async (currency) => {

        const userID = window.localStorage.getItem("user")

        const res = await axios.post(ServerUrl + '/accounts/updateCurrency', {
            id: userID,
            currency : currency
        })

        window.location.reload(false);
    }


    const navigate = useNavigate();
    const navigateToDeposit = () => {
      // 👇️ navigate to /deposit
      navigate('/deposit');
    };

    const navigateToCopyBetter = () => {
        // 👇️ navigate to /copybetter
        navigate('/copybetter');
      };

    function hasLowerCase(str) {
        return (/[a-z]/.test(str));
    }
    
    function hasUpperCase(str) {
      return (/[A-Z]/.test(str));
    }

    function hasNumber(str) {
      return (/[0-9]/.test(str));
    }

    function hasAt(str) {
      return (/@/.test(str));
    }

    const getUser = async () => {
        const userID = window.localStorage.getItem("user")
        const user = await axios.post(ServerUrl + '/accounts/getUser', {
            _id: userID
        })
                .then(response => {
                    console.log("success");
                    setNewEmail(response.data.mail);
                    setNewPassword(response.data.password);
                    setUserInfo(response.data);
                    console.log(response);
                }).catch((exception) => {
                    console.log(exception);
                });           
    }

    useEffect(() => {
        getUser()
    }, []);

    useEffect(() => {
        
        if(load !== 0){
            
            updateCurrency(currency)
            
        }

        setLoad(load + 1)
        
        
      }, [currency]);


    const updateProfilePassword = async () => {
        if (confirmarPassword === false){
            setConfirmarPassword(true)
        }
        else{
            if (newPassword.length <= 10 || !hasLowerCase(newPassword) || !hasUpperCase(newPassword) || !hasNumber(newPassword)){
                alert("Password must be at least 10 characters long and contain at least one lowercase letter, one uppercase letter and one number");
            }
            else{
               const user = await axios.patch(ServerUrl + '/accounts/updateUserData', {
                            _id: userInfo._id,
                            password: newPassword
                    })
                    .then(response => {
                        console.log("success");
                        console.log(response);
                        window.location.reload(false);
                    }).catch((exception) => {
                        console.log(exception);
                    });  
            }
        }     
    }

    // ----------------------------------------

    const updateProfileEmail= async () => {
        if (confirmarPassword === false){
            setConfirmarPassword(true)
        }
        else{
            if (!hasAt(newEmail)){
                alert("Please enter a valid email");
            }
            else{
               const user = await axios.patch(ServerUrl + '/accounts/updateUserData', {
                            _id: userInfo._id,
                            mail: newEmail
                    })
                    .then(response => {
                        console.log("success");
                        console.log(response);
                        window.location.reload(false);
                    }).catch((exception) => {
                        console.log(exception);
                    });  
            }
        }     
    }

    const applyChanges = async () => {
        if (newPassword != "" && newEmail != ""){
            updateProfilePassword()
            updateProfileEmail()
        }
        else if (newPassword != ""){
            updateProfilePassword()
        }
        else if (newEmail != ""){
            updateProfileEmail()
        }
        else {
            console.log("Nothing to update")
            alert("Nothing to update")
        }
    }


    return (
        <div className="Profile">
            <div className="ProfileBox">
                <div className="Username">
                    <h2>{userInfo.username}</h2>
                </div>
                <div className='Nationality'>
                    <p>{userInfo.nationality}</p>
                </div>
                <div className='exchange'>
                    <img src='exchange.png'></img>
                    <select value={currency} onChange={(e)=>{
                        setCurrency(e.target.value)
                    }}>
                        {options.map((option) => (
                    <option value={option.value}>{option.label}</option>
                    ))}
                    </select>
                </div>
                <hr></hr>
                <div className='ProfileButtonsCopyBetterMovimentos'>
                    <div className='ProfileCopyBetter'>
                        {/* <button className='deposit' onClick={() => setDepositModalOpen(true)}>Deposit</button>
                        {depositModalOpen && <Modal_Deposit setDepositOpenModal={setDepositModalOpen} />} */}
                        <button className='copybetter' onClick={navigateToCopyBetter}>CopyBetter</button>
                    </div>
                    

                    <div className='Movimentos'>
                        {/* <button className='deposit' onClick={() => setDepositModalOpen(true)}>Deposit</button>
                        {depositModalOpen && <Modal_Deposit setDepositOpenModal={setDepositModalOpen} />} */}
                        <button className='movimentar' onClick={navigateToDeposit}>Movimentar</button>
                    </div>
                </div>

                <div className='ConsultaHistoricos'>
                    {/* <button className='historicoApostas'>Consultar histórico de apostas</button> */}
                    {/* <button className='historicoTransacoes'>Consultar histórico de transações</button> */}
                    <Link className='consultarApostas' to="/bethistory"><img alt=""/><b>Consultar histórico de apostas </b><FontAwesomeIcon icon={faCircleChevronRight}></FontAwesomeIcon></Link>
                    <Link className='consultarTransacoes' to="/transactions"><img alt=""/><b>Consultar histórico de transações </b><FontAwesomeIcon icon={faCircleChevronRight}></FontAwesomeIcon></Link>
                </div>

                <div className='LeftInfoMail'>
                    <h5>Alterar email</h5>
                </div>

                <div className='RightInfoMail'>
                    <input id='inputMail' type='text' name={newEmail} onInput={(e) => setNewEmail(e.target.value)}/>
                </div>


                <div className='LeftInfoPassword'>
                    <h5>Alterar palavra passe</h5>
                </div>

                <div className='RightInfoPassword'>
                    <input id='inputPassword' type='password' name={newPassword} minLength="10" onInput={(e) => setNewPassword(e.target.value)}/>
                </div>


                <br/>

                <div className='ConfirmPassword'>
                    {confirmarPassword && <div className='confirmPasswordDiv'>
                                                <input type='password' placeholder='Type current password...' name={oldPassword} ></input>
                                            </div>
                    }
                </div>


                <div className='UpdateChangesButton'>
                    <button type='button' onClick={() => applyChanges()}>Guardar Alterações</button>
                </div>

            </div>
        </div>
    )
}
export default Profile
