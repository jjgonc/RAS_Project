
const axios = require('axios')
const Boletim = require('../models/boletim_model')
const Bet = require('../models/bet_model')
const User = require('../models/user_model')
const Event = require('../models/event_model')
const cron = require("node-cron");
const {notifyObserversUser} = require('./observer-users')
const Promotion = require('../models/promotion_model')
const ServerUrl = 'http://localhost:4000/api'
const {updateWinUserBalance} = require('./accounts')
const {getAllGamesAPI} = require('./rasbetAPIAdapter')
const {notifyObserversEvent} = require('./observer-events')
const { events } = require('../models/boletim_model')


const sync = async() => {

  cron.schedule("*/30 * * * * *", async () => {
    updateFootballGames()
    
  });
  
}


const updateFootballGames = async () => {
    try{
        
        const footbalEvents = await getAllGamesAPI()

        const res = await Promise.all(footbalEvents.map(async (event)=>{
          
          var eventDB = await Event.findOne({idEvent:event.idEvent})
          if(eventDB !== null){

            if(eventDB.adminUpdate == 0){
  
              if(eventDB.state === 1 && event.state !== 1)notifyObserversEvent(event,`O encontro ${event.homeTeam} VS ${event.awayTeam} ${event.state === 0 ? 'terminou' : 'foi suspenso'}`)
      
                
              if(event.homeGoals >= 0 && event.awayGoals >= 0){
  
                if(eventDB.homeGoals < event.homeGoals)notifyObserversEvent(event,`Um golo foi anulado à equipa ${event.homeTeam} frente a ${event.awayTeam}`)

                if(eventDB.homeGoals > event.homeGoals)notifyObserversEvent(event,`A equipa ${event.homeTeam} marcou frente a ${event.awayTeam}`)
        
                if(eventDB.awayGoals < event.awayGoals)notifyObserversEvent(event,`Um golo foi anulado à equipa ${event.awayTeam} frente a ${event.homeTeam}`)
        
                if(eventDB.awayGoals > event.awayGoals)notifyObserversEvent(event,`A equipa ${event.awayTeam} marcou frente a ${event.homeTeam}`)
    
            }
            
              eventDB.homeGoals = event.homeGoals
              eventDB.awayGoals = event.awayGoals
              for ( let ind=0; ind < eventDB.oddsBet.length; ind++) {
                if (eventDB.oddsBet[ind] != events.oddsBet[ind]) {
                  switch (ind){
                    case 0:
                      notifyObserversEvent(event,`A odd da vitória da equipa da casa no evento ${event.homeTeam}VS${event.awayTeam} foi alterada para ${events.oddsBet[ind]}`)
                      break;

                    case 1:
                      notifyObserversEvent(event,`A odd da vitória da equipa de fora no evento ${event.homeTeam}VS${event.awayTeam} foi alterada para ${events.oddsBet[ind]}`)
                      break;

                    case 2:
                      notifyObserversEvent(event,`A odd do empate no evento ${event.homeTeam}VS${event.awayTeam} foi alterada para ${events.oddsBet[ind]}`)
                      break;
                      
                    default:
                      break;
                  }
  
                } 
              }
              eventDB.oddsBet = event.oddsBet
              eventDB.state = event.state
            
              await eventDB.save()
              return eventDB
            }     
        }
          else{
              const eventNewDB = await Event.create({
                idEvent:event.idEvent,
                sportType: 'SportCollectiveDraw',
                sportName: 'Football',
                homeTeam:event.homeTeam,
                awayTeam:event.awayTeam,
                homeGoals:event.homeGoals,
                awayGoals:event.awayGoals,
                oddsBet:event.oddsBet,
                date:event.date,
                state:event.state,
                adminUpdate:0,
                observers:[]
  
          })
                return eventNewDB
          } 
        }))
        }catch(error){
          console.log(error)
        }     
}


const getAllEvents = async (req,res) => {
  
    try {
      const events = await Event.find()
  
      var allEvents = []
  
      events.map((event) => {
        
          allEvents.push(event)
      })
  
      res.status(201).json(allEvents)
    } catch (error) {
      res.status(500).json({msg: error}) //500 - generic server error
    } 
      
  }
  
  const getAllOn= async (req,res) => {
    
    try {
      const events = await Event.find()
  
      var eventsOn = []
  
      events.map((event) => {
        // evento aberto
        if(event.date > Date.now() && event.state){
          eventsOn.push(event)
        }
        
      })
  
      res.status(201).json(eventsOn)
    } catch (error) {
      res.status(500).json({msg: error}) //500 - generic server error
    } 
  }



const getSymbol = (currency) => {
  const res = currency === 'EUR' ? ' €' : currency === 'BRL' ? ' R$' : currency === 'GBP' ? ' £' : ' $'
  
  return res
}


const verifySportCollectiveDraw = (event,bet)=>{
  if(event.homeGoals > event.awayGoals & bet.winner == event.homeTeam){
    return true
  }else if(event.homeGoals < event.awayGoals & bet.winner == event.awayTeam){
    return true
  } else if(event.homeGoals === event.awayGoals & bet.winner == 'DRAW'){
    return true
  }else{
    return false
  }
}



const closeEvent = async (eventID) => {
  
  try{


  const event = await Event.findOne({_id :eventID})

  eventID = event.idEvent


  notifyObserversEvent(event,`O evento ${event.homeTeam} VS ${event.awayTeam} terminou`)

  const boletins = await Boletim.find()

  for(const boletim of boletins){
    if(boletim.finished != true){
    var finishedBets = 0
    var betsWon = 0

    for(const betID of boletim.BetsId){

      const bet = await Bet.findOne({_id : betID})
     
      if(bet.eventID == eventID){
        bet.finished = true

        if(event.sportType === 'SportCollectiveDraw'){

          if(verifySportCollectiveDraw(event,bet)){
            bet.won = true
            betsWon = betsWon + 1
          }else{
            bet.won = false
          }
        }
        await bet.save()
        finishedBets = finishedBets + 1
      
      }else{
        
        if(bet.finished){
          finishedBets = finishedBets + 1 
        }
        if(bet.won){
          betsWon = betsWon + 1
        }
      }
    }

    if(finishedBets === boletim.BetsId.length){

      boletim.finished = true
      await boletim.save()

    }

    if(betsWon === boletim.BetsId.length){

      boletim.won = true
      await boletim.save()

      amount = boletim.finalOdd * boletim.amountBet
  
      updateWinUserBalance(boletim.userId,amount,boletim.copied_from)

    }
  
  }
}

}
catch(error){
  console.log(error)
}
}


const insertBoletim = async(req,res) => {

    
    
    try{

      const data = req.body

      console.log(data)
      var betIds = []

      var finalOdd = 1

      const user = await User.findOne({_id : data.userId})
      
      const promotions = await Promotion.find()


      for(const promotion of promotions){
        if(promotion.endDate > Date.now()) finalOdd = finalOdd * (1 + promotion.oddsImprovement/100)
      }
      
    //criar boletim

      for (const betBoletim of data.bets) {
        betamount += parseFloat(betBoletim.value)
      }

      //verificar se todos os eventos tao abertos
      var eventsOpen = true

      for (const betinfo of data.bets){
        const event = await Event.findOne({idEvent : betinfo.eventID})
        if (event.state != 1)
          eventsOpen = false
      }

      if (eventsOpen){
          //criar boletim
          if(data.simples){
            // verificar se tem saldo 
            var betamount = 0
            for (const betBoletim of data.bets) {
              betamount += parseFloat(betBoletim.value)
            }
      
            if (betamount <= parseFloat(user.balance)) {
            
              for (const betBoletim of data.bets) {
                finalOdd = finalOdd * betBoletim.Price
                
    
                const res = await axios.post(ServerUrl + '/observer/subscribeEvent',{
                  event : betBoletim.eventID,
                  user : data.userId
                })

                const bet = await Bet.create({
                  eventID:betBoletim.eventID,
                  winner:betBoletim.winner,
                  odd:betBoletim.Price,
                  finished:false,
                  won:false
                })
                
                betIds.push(bet._id)


                const boletim = await Boletim.create({
                  BetsId: betIds,
                  finalOdd: finalOdd.toFixed(2),
                  amountBet: betBoletim.value,
                  date: data.date,
                  state: 'registed',
                  simples: data.simples,
                  userId : data.userId,
                  finished : false,
                  won:false,
                  currency:user.currency,
                  copied_from: data.copied_from
                })

                console.log(boletim)
                user.boletinsID.push(boletim._id)
                user.balance = (parseFloat(user.balance) - boletim.amountBet).toFixed(2)
                user.transactions.push(`${new Date(Date.now()).toLocaleString()}| Aposta | -${boletim.amountBet}${getSymbol(user.currency)} | ${user.balance}${getSymbol(user.currency)}`)
                await user.save() 

                if (data.copied_from === 'none') {
                  const notification = 'User:' + user._id + '|' + 'Bet:' + boletim._id
                  notifyObserversUser(user, notification)
                }
                

                betIds = []
                finalOdd = 1

              }

              res.status(201).json({msg:"Aposta Registada"})
            }else {
              res.status(200).json({msg: "Não tem saldo suficiente"})
            }
          }else{
            //Aposta multipla 
            // verificar se tem saldo 
            if (data.amountBet <= parseFloat(user.balance)){

                // verificar q todos os eventos na multipla sao diferentes
                const idEvents = []
                for (const betBoletim of data.bets) {
                  idEvents.push(betBoletim.eventID)
                }

                if (new Set(idEvents).size == idEvents.length) {
                  //inserir bets na base de dados
                  await Promise.all(data.bets.map(async (betBoletim)=>{

                    finalOdd = finalOdd * betBoletim.Price

                    const event = await Event.findOne({idEvent : betBoletim.eventID})

                    const res = await axios.post(ServerUrl + '/observer/subscribeEvent',{
                      event : betBoletim.eventID,
                      user : data.userId
                    })

                    const bet = await Bet.create({
                      eventID:betBoletim.eventID,
                      winner:betBoletim.winner,
                      odd:betBoletim.Price,
                      finished:false,
                      won:false
                    })
                    
                    betIds.push(bet._id)
                  }))

          
        
                  const boletim = await Boletim.create({
                    BetsId: betIds,
                    finalOdd: finalOdd.toFixed(2),
                    amountBet: data.amountBet,
                    date: data.date,
                    state: 'registed',
                    simples: data.simples,
                    userId : data.userId,
                    finished : false,
                    won:false,
                    currency:user.currency,
                    copied_from: data.copied_from
                  })

                  console.log(boletim)
        
                  user.boletinsID.push(boletim._id)
              
                  user.balance = (parseFloat(user.balance) - boletim.amountBet).toFixed(2)
                  user.transactions.push(`${new Date(Date.now()).toLocaleString()}| Aposta | -${boletim.amountBet} ${getSymbol(user.currency)} | ${user.balance} ${getSymbol(user.currency)}`)
                  await user.save()
                  
                  const notification = 'User:' + user._id + '|' + 'Bet:' + boletim._id
                  notifyObserversUser(user, notification)
        
                  res.status(201).json({msg:"Aposta Registada"})
                }else {
                  res.status(200).json({msg:"Não é possível ter várias seleções no mesmo evento"})
                }
    
            } else {
              res.status(200).json({msg: "Não tem saldo suficiente"})
            }
          }
      }else {
        res.status(200).json({msg: "Um dos jogos encontra-se Suspenso/Fechado"})
      }
  
  }catch(error){
    console.log(error)
    res.status(500).json({msg: "Aposta Inválida"})
  }

}


const getBoletim = async (req,res) =>{

  try {

      var listBets = []
      const boletim = await Boletim.findOne({_id: req.body.boletimID})
      for (const betid of boletim.BetsId){
        var singlebet = {}
        const bet = await Bet.findOne({_id: betid})
        const event = await Event.findOne({idEvent : bet.eventID})

    
          singlebet = {eventID: event.idEvent, homeTeam : event.homeTeam,awayTeam : event.awayTeam,odd: bet.odd,result: event.homeTeam, winner: bet.winner, value : 0, Price:bet.odd}
        
        
        listBets.push(singlebet)
      }
      res.status(200).json({finalOdd: boletim.finalOdd, bets: listBets, simples: boletim.simples })
  }
      
   catch (error) {
      console.log(error)
      res.status(500).json({msg: error}) //500 - generic server error
  }

}



module.exports = {
    insertBoletim,
    sync,
    getBoletim,
    closeEvent,
    getAllEvents,
    getAllOn
}
