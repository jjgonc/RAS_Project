const axios = require('axios')


const exchangeCoins = async (from,to,amount) => {

    var headers = {
        "apikey": "cUp3LWlvdThBd3t505tErLDRj9Pz0Obt"
      }


    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: headers
      
    };
    
    const res = await axios.get(`https://api.apilayer.com/fixer/convert?to=${to}&from=${from}&amount=${amount}`,requestOptions)
    
    return res.data.result

}


module.exports = {
    exchangeCoins
}