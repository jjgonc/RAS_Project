import './CopyBetter.css'
import { useEffect, useState } from 'react';
import {ServerUrl} from '../../ServerUrl'
import axios from 'axios';
import {Link} from 'react-router-dom'

const CopyBetter = () => {

    const [username_better, setUsernameBetter] = useState("");
    const [observed,setobserved] = useState([])
    const [refresh,setRefresh] = useState(1)

    const getObserved = async () => {
      
      const userID = window.localStorage.getItem("user")
      console.log(userID)
      
      const observed = await axios.post(ServerUrl + '/accounts/getObserved', {
        user:  userID
      })
            .then(response => {
                console.log("success");
                setobserved(response.data.observed)
            }).catch((exception) => {
                console.log(exception);
            });
      
    }

    useEffect(() => {
      getObserved()
    }, [refresh]);


    function subscribe (){
      console.log('subscribe')
      const userID = window.localStorage.getItem("user")
      
      axios.post(ServerUrl + '/observer/subscribe', {
        user:  userID,
        toFollow: username_better
      })
      .then(function (response) {
        console.log("sucesso");
        alert(response.data.msg)
        if (response.status = 200){
            setRefresh(refresh+1)
        }
        setUsernameBetter("")
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    function unsubscribe (){
      console.log('unsubscribe')
      const userID = window.localStorage.getItem("user")
      
      axios.post(ServerUrl + '/observer/unsubscribe', {
        user:  userID,
        toUnfollow: username_better
      })
      .then(function (response) {
        console.log("sucesso");
        alert(response.data.msg)
        if (response.status = 200){
          setRefresh(refresh+1)
        }
        setUsernameBetter("")
      })
      .catch(function (error) {
        console.log(error);
      });
    }



    return (
      <div className='CopyBetter'>
        <div className="CopyBetterHead"></div>
        <div className="CopyBetterBox">
          <div className="CopyBetterTitle">
            <Link to="/profile"><img className="CopyBetterButtomBack" alt="" src="buttom_back.png"/></Link>
            <h1>CopyBetter</h1> 
          </div> 
          <div className='CopyBetterList'>
            <div className='CopyBetterListName'>Lista de Copy Betters:</div>
            <div className='CopyBetterListScroll'>
              <ul>
                {observed.map((item => (
                  <li>{item}</li>
                )))}
              </ul>
            </div>
          </div>
          <div className='CopyBetterAction'>
            <div className='CopyBetterActionInput'>
              <input 
                    type="username_better" 
                    className="username_better"
                    placeholder="username_better"
                    autofocus
                    id="username_better" 
                    name="username_better"
                    value={username_better}
                    onChange={(e) => {setUsernameBetter(e.target.value)}}
              />
            </div>

            <div className='CopyBetterActionSubscribe'>
              <button block="true" size="lg" type="submit" className="SubscriveBetter" onClick={()=>subscribe()}>
                  Subscribe
              </button>
            </div>

            <div className='CopyBetterActionUnsubscribe'>
              <button block="true" size="lg" type="submit" className="UnsubscriveBetter" onClick={()=>unsubscribe()}>
                  Unsubscribe
              </button>
            </div>
            
          </div>        
        </div>
      </div>
    )
}
export default CopyBetter