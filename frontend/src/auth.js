import axios from "axios";
import { ServerUrl } from "./ServerUrl";


   async function login(username,password,cb) {

      
        var res = await axios.post(ServerUrl + '/login', {
        username: username,
        password: password
        })
        .then((response) => {
            
            if(response.data.msg === 'success'){
                localStorage.setItem('logged' , JSON.stringify({logged : true}))
                window.sessionStorage.setItem("logged", JSON.stringify({logged : true}));
                return cb()
            }

            return response.data.msg
            
            }, (error) => {
            console.log(error);
            });

            return res;
        
    
  }




export default login;
