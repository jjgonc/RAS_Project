
const axios = require('axios')


const getAllGamesAPI = async() => {

    try{

    

      const data = await axios.get('http://ucras.di.uminho.pt/v1/games/')
    
      
      var games = []


      for( const footballEvent of data.data){

            const event = {idEvent:footballEvent.id,
                           homeTeam: footballEvent.homeTeam,
                           awayTeam:footballEvent.awayTeam,
                           homeGoals:footballEvent.scores !== null ? footballEvent.scores.split('x')[0] : 0,
                           awayGoals:footballEvent.scores !== null ? footballEvent.scores.split('x')[1] : 0,
                           oddsBet:[footballEvent.bookmakers[0].markets[0].outcomes[1].price,footballEvent.bookmakers[0].markets[0].outcomes[0].price,footballEvent.bookmakers[0].markets[0].outcomes[2].price],
                           date:footballEvent.commenceTime,
                           state:footballEvent.completed ? 0 : 1,
                           observers:[]
            }

            games.push(event)
      }
      

      return games

    }catch(error){
      console.log(error)
    }
   
}


module.exports = {
    getAllGamesAPI
}