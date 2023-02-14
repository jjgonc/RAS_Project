import './Login.css'
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {ServerUrl} from '../../ServerUrl'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const Login = () => {

  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectPasswordWarning, setIncorrectPasswordWarning] = useState(false);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  const userLogin = async (cb) => {

    try{
      const user = await axios.post(ServerUrl + '/accounts/login', {
        mail: email,
        password: password
    }).catch((error) => {
      console.log(error);
      setIncorrectPasswordWarning(true);
    });


    if(user.status === 200){
      setIncorrectPasswordWarning(false);
      window.localStorage.setItem("user", user.data.user._id);
      window.localStorage.setItem("logged", 'true');
      window.sessionStorage.setItem("admin",'false');

      console.log(JSON.parse(window.sessionStorage.getItem("logged")))
      return cb(0)


    }else if (user.status === 201){
      console.log('admin')
      window.localStorage.setItem("user", user.data.user._id);
      window.localStorage.setItem("logged", 'true');
      
      window.sessionStorage.setItem("admin",'true');
      console.log(JSON.parse(window.sessionStorage.getItem("logged")))
      return cb(1)
    }else {
      alert(user.data.msg)

      setIncorrectPasswordWarning(true);
    }

    

    }catch(error) {
        console.log(error);
    }
  }



  const handleSubmit = async (event) => {
    event.preventDefault();
    await userLogin((t)=>{
      console.log(t)
      if (t) 
        return navigate('/admin')
      else 
        return navigate('/events')
    });
  }


  return (
    <div className="Login">
      <div className="LoginHead"></div>
      <div className="LoginBox">
        <div className="LoginLeft">
          <div className="LoginLeftLogo">
            <img alt="" src="logoGreen.png" className="LoginLeftImage"/>
          </div>
          <div className="LoginLeftTitle">
            <div className="LoginTitle">BEM VINDO</div>          
          </div>
          <div className="LoginLeftFormEmail">
            <input 
              type="email"
              className="LoginFormEmail"
              placeholder="E-Mail" 
              autoFocus
              id ="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="LoginLeftFormPassword">
            <input 
              type="password"
              className="LoginFormPassword"
              placeholder="Palavra-Passe" 
              autoFocus
              id ="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          <a href="naosei" className="LoginLeftPasswordReset">Esqueci-me da palavra-passe</a>
          </div>

          {incorrectPasswordWarning &&
            <div className='IncorrectPasswordWarning'>
              <p>Password is incorrect or email does not exist! Please try again...</p>
            </div>
          }


          <button block="true" size="lg" type="submit" disabled={!validateForm()} onClick={handleSubmit} className="LoginFormButton">
            Aceder
          </button>
          <div className="LoginLeftFooter">
            Não tem conta?
            <br/>
            <a href="register" className="LoginLeftRegisterLink">Registe-se já!</a>
          </div>  
        </div>
        <div className="LoginRight">
          <img alt="" src="betman.png" className="LoginImage"/>
        </div>
      </div>
      <div className="LoginHead"></div>
    </div>
    )
}
export default Login