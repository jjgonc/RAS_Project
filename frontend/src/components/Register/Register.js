import './Register.css'
import React, { useState, useMemo } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {ServerUrl} from '../../ServerUrl'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'
import countryList from 'react-select-country-list'

const Register = () => {
  let navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [nif, setNif] = useState("");
  const [nationality, setNationality] = useState('')
  const nationalityOptions = useMemo(() => countryList().getData(), [])


  const changeNationality = nationality => {
    setNationality(nationality)
  }

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

  function userRegister(){
    axios.post(ServerUrl + '/accounts/register', {
      nif: nif,
      username: username,
      mail: email,
      password: password,
      birthdate: birthdate,
      followers: [],
      nationality: nationality.label
    })
    .then(function (response) {
      console.log(response);
      window.localStorage.setItem("user", response.data._id);
      window.localStorage.setItem("logged", 'true');
      window.sessionStorage.setItem("admin",'false');

      //console.log(JSON.parse(window.sessionStorage.getItem("logged")))
      navigate('/events')
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  function validateForm() {
    const date18YrsAgo = new Date();
    date18YrsAgo.setFullYear(date18YrsAgo.getFullYear() - 18);

    if (birthdate <= date18YrsAgo){
        alert("You must be 18 years old to register");
    }
    else if (email.length <= 0 || !hasAt(email)){
        alert("Email must be valid");
    }
    else if (password.length < 10 || !hasLowerCase(password) || !hasUpperCase(password) || !hasNumber(password)){
        alert("Password must be at least 10 characters long and contain at least one lowercase letter, one uppercase letter and one number");
    }
    else {
        userRegister();
        alert("OK!\nEmail: " + email + " Password: " + password + " Birthdate: " + birthdate);
    }
  }

  return (
    <div className="Register">
      <div className="RegisterHead"></div>
      <div className="RegisterBox">
        <div className="RegisterLeft">
          <div className="RegisterLeftLogo">
            <img alt="" src="logoGreen.png" className="LoginLeftImage"/>
          </div>
          <div className="RegisterLeftTitle">
            <div className="RegisterTitle">REGISTO</div>
          </div>
          <div className="RegisterLeftFormEmail">
            <input 
              type="text" 
              className="RegisterFormUser"
              placeholder="Nome de Utilizador"
              autofocus
              id="text" 
              name="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="RegisterLeftFormEmail">
            <input 
              type="email" 
              className="RegisterFormEmail"
              placeholder="E-Mail"
              autofocus
              id="email" 
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="RegisterLeftFormPassword">
            <input 
              type="password" 
              className="RegisterFormPassword"
              placeholder="Palavra-passe"
              autofocus
              id="password" 
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="RegisterLeftFormDate">
            <input 
              type="date" 
              className="RegisterFormDate"
              placeholder="Data de Nascimento"
              autofocus
              id="birthdate" 
              name="birthdate"
              value={birthdate}
              onChange={(e) => {setBirthdate(e.target.value)}}
            />
          </div>
          <div className="RegisterLeftFormNif">
            <input 
              type="number" 
              className="RegisterFormNif"
              placeholder="NIF"
              autofocus
              id="nif" 
              name="nif"
              value={nif}
              onChange={(e) => {setNif(e.target.value)}}
            />
          </div>
          <div className="RegisterLeftSelectNationality">
              <Select placeholder='Select your nationality' options={nationalityOptions} value={nationality} onChange={changeNationality} />
          </div>
          <button block="true" size="lg" type="submit" className="RegisterFormButton" onClick={()=>validateForm()}>
            Register
          </button>
        </div>
        <div className="RegisterRight">
            <img alt="" src="betman.png" className="RegisterImage"/>
        </div>
      </div>
      <div className="RegisterHead"></div>
    </div>
    )
}
export default Register