const Boletim = require('../models/boletim_model')
const Bet = require('../models/bet_model')
const Event = require('../models/event_model')
const User = require('../models/user_model')
const Promotion = require('../models/promotion_model')
const {notifyObserversEvent} = require('./observer-events')
const {closeEvent} = require('./events')


  const updateEvent = async (req,res) => {
  
    try {
      var event = await Event.findOne({_id: req.body.event._id})
      
      

      if(req.body.event.state === 0 && event.state != 0) closeEvent(req.body.event._id)
      event.adminUpdate = req.body.event.adminUpdate
      event.state = req.body.event.state
      
      if(req.body.event.homeGoals >= 0 && req.body.event.awayGoals >= 0){
      
        if(req.body.event.homeGoals < event.homeGoals)notifyObserversEvent(event,`Um golo foi anulado à equipa ${event.homeTeam} frente a ${event.awayTeam}`)

        if(req.body.event.homeGoals > event.homeGoals)notifyObserversEvent(event,`A equipa ${event.homeTeam} marcou frente a ${event.awayTeam}`)

        if(req.body.event.awayGoals < event.awayGoals)notifyObserversEvent(event,`Um golo foi anulado à equipa ${event.awayTeam} frente a ${event.homeTeam}`)

        if(req.body.event.awayGoals > event.awayGoals)notifyObserversEvent(event,`A equipa ${event.awayTeam} marcou frente a ${event.homeTeam}`)

        event.homeGoals = req.body.event.homeGoals
        event.awayGoals = req.body.event.awayGoals

        if (req.body.event.oddsBet[0] != event.oddsBet[0]) {
            notifyObserversEvent(event,`A odd da vitória da equipa da casa no evento ${event.homeTeam}VS${event.awayTeam} foi alterada para ${req.body.event.oddsBet[0]}`)
            event.oddsBet[0] = req.body.event.oddsBet[0]
        }

        if (req.body.event.oddsBet[1] != event.oddsBet[1]) {
            notifyObserversEvent(event,`A odd da vitória da equipa de fora no evento ${event.homeTeam}VS${event.awayTeam} foi alterada para ${req.body.event.oddsBet[1]}`)
            event.oddsBet[1] = req.body.event.oddsBet[1]
        }

        if (req.body.event.oddsBet[2] != event.oddsBet[2]) {
            notifyObserversEvent(event,`A odd do empate no evento ${event.homeTeam}VS${event.awayTeam} foi alterada para ${req.body.event.oddsBet[2]}`)
            event.oddsBet[2] = req.body.event.oddsBet[2]
        }
      }
      
      await event.save()
  
      res.status(200).json({msg:'updated'})
      
      
     
  } catch (error) {
      console.log(error)
      res.status(500).json({msg: error}) //500 - generic server error
  }
}

const createPromotion = async (req,res) => {

    try{
        const promo = await Promotion.create({
            promotionType : req.body.promotionType,
            oddsImprovement : req.body.odd,
            initialDate : req.body.initialDate,
            endDate : req.body.endDate,
            balanceImprovement : req.body.balanceImprovement
        })

        //adicionar amount Promoção

        if(req.body.promotionType === 'balance'){
            const users = await User.find()

            for(const user of users){

                if(user.boletinsID.length < 1){
                    user.balance = parseFloat(user.balance) + parseFloat(req.body.balanceImprovement)
                    await user.save()
                }
            }
        }
        console.log(promo)
        res.status(200).json({msg:'created'})
    }catch(error){
        console.log(error)
        res.status(500).json({msg: error})
    }    
}

module.exports = {
    updateEvent,
    createPromotion
}
