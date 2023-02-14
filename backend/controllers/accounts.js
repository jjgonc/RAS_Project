const User = require('../models/user_model')
const Bet = require('../models/bet_model')
const Boletim = require('../models/boletim_model')
const Event = require('../models/event_model')
const {exchangeCoins} = require('./coinExchangerAPIAdapter')
const Promotion = require('../models/promotion_model')
const axios = require('axios')
const ServerUrl = 'http://localhost:4000/api'

const getSymbol = (currency) => {
    const res = currency === 'EUR' ? ' €' : currency === 'BRL' ? ' R$' : currency === 'GBP' ? ' £' : ' $'
    
    return res
}


const updateWinUserBalance = async (userID,amount,coppied_from) => {
    try {
        if (coppied_from === 'none'){
            var user = await User.findOne({_id: userID})
            user.balance = (parseFloat(user.balance) + parseFloat(amount)).toFixed(2)
            user.transactions.push(`${new Date(Date.now()).toLocaleString()} | Ganho de aposta | +${parseFloat(amount).toFixed(2)} ${getSymbol(user.currency)} | ${user.balance} ${getSymbol(user.currency)} `)
            await user.save()
        } else {
            var user = await User.findOne({_id: userID})
            user.balance = (parseFloat(user.balance) + parseFloat(amount * 0.99)).toFixed(2)
            user.transactions.push(`${new Date(Date.now()).toLocaleString()} | Ganho de aposta com comissão | +${parseFloat(amount * 0.99).toFixed(2)} ${getSymbol(user.currency)} | ${user.balance} ${getSymbol(user.currency)} `)
            await user.save()

            var tipster = await User.findOne({username : coppied_from})
            tipster.balance = (parseFloat(tipster.balance) + parseFloat(amount * 0.01)).toFixed(2)
            tipster.transactions.push(`${new Date(Date.now()).toLocaleString()} | Ganho de comissão de Seguidor | +${parseFloat(amount * 0.01).toFixed(2)} ${getSymbol(tipster.currency)} | ${tipster.balance} ${getSymbol(tipster.currency)} `)
            await tipster.save()
        }

          
        
    } catch (error) {
        console.log(error)
    }
  }
  


const removeNotification = async (req,res) => {

    try{        
        var user = await User.findOne({_id: req.body.user})
        const index = req.body.index
        var nots = [...user.notifications]
        nots.splice(index,1)
        user.notifications = nots
        await user.save()

        res.status(200).json({msg: 'removido'})

    }catch(error){
        console.log(error)
        res.status(500).json({msg: 'falha ao remover'})
    }
}


const getCurrency = async (req,res) => {

    try{
        var user = await User.findOne({_id: req.body.id})
        res.status(200).json({currency: user.currency})
        

    } catch(error){
        console.log(error)
        res.status(500).json({msg: error}) //500 - generic server error
    
    }
}


const updateCurrency = async (req,res) => {

    try{

        if(req.body.currency != 'None'){
            var user = await User.findOne({_id: req.body.id})

            var newBalance = user.balance

            while(newBalance === user.balance){
                newBalance = await exchangeCoins(user.currency,req.body.currency, user.balance)
            }

            user.transactions.push(`${new Date(Date.now()).toLocaleString()} | Cambio Efetuado | ${user.currency} -> ${req.body.currency}| ${parseFloat(user.balance).toFixed(2)}${getSymbol(user.currency)} -> ${parseFloat(newBalance).toFixed(2)}${getSymbol(req.body.currency)}`)
            user.currency = req.body.currency
            user.balance = newBalance.toFixed(2)
            await user.save()
        }
        

        
        res.status(200).json({msg: 'sucess'})

    } catch(error) {
        console.log(error)
    }

}



const getBalance = async (req,res) => {
    try {
        var user = await User.findOne({_id: req.body.user})
        res.status(200).json({balance: user.balance})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: error}) //500 - generic server error
    }
}


const getTransactions = async (req,res) =>{

    try {
        var user = await User.findOne({_id: req.body.user})
        res.status(200).json({transactions : user.transactions, balance: user.balance})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: error}) //500 - generic server error
    }
}


const updateBalance = async (req,res) => {
    try {

        var user = await User.findOne({_id: req.body._id})
        user.balance = (parseFloat(user.balance) + parseFloat(req.body.amount)).toFixed(2)
            
        
        if(req.body.amount > 0){
             user.transactions.push(`${new Date(Date.now()).toLocaleString()} | Depósito | +${req.body.amount}${getSymbol(user.currency)} | ${user.balance}${getSymbol(user.currency)} `)
        }
        else {
            user.transactions.push(`${new Date(Date.now()).toLocaleString()} | Levantamento | -${Math.abs(req.body.amount)}${getSymbol(user.currency)} | ${user.balance}${getSymbol(user.currency)}`)
        }
        
        if (user.balance > 0 && Math.abs(parseFloat(req.body.amount)) >= 1 && parseFloat(req.body.amount) <= 10000){
            await user.save()
            res.status(200).json({msg: "success"})
        }
        else{
            res.status(401).json({msg: "not enough balance"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: error}) //500 - generic server error
    }
}


const updateUserData = async(req,res) => {
    try{
        if (req.body.mail){
            const user = await User.findOne({_id: req.body._id})
            user.mail = req.body.mail
            await user.save()
            res.status(200).json({msg: "success"})
        }

        else if (req.body.password) {
            const user = await User.findOne({_id: req.body._id})
            user.password = req.body.password
            await user.save()
            res.status(200).json({msg: "success"})
        }
        

    }
    catch(error){
        console.log(error)
        res.status(500).json({msg: error}) //500 - generic server error
    }

}

const getUser = async(req,res) => {
    try {
        const id = req.body._id
        const user = await User.findOne({_id: id})
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: error}) //500 - generic server error
    }
}


const createUser = async(req,res) => {

    try {

        var bonus = 0
        var balance = 0
        const promotions = await Promotion.find()
        var transactionslist = []

        for(const promotion of promotions){
            if(Date.now() < promotion.endDate) {
                bonus = promotion.balanceImprovement
                if (bonus > 0){
                    balance = parseFloat(balance) + parseFloat(bonus)
                    transactionslist.push(`${new Date(Date.now()).toLocaleString()} | Bónus Creditado | +${bonus}€ | ${balance}€ `)    
                }
            }
        }

        const newUser = {
            nif: req.body.nif,
            balance: balance,
            username: req.body.username,
            password: req.body.password,
            mail: req.body.mail,
            betsId : [],
            birth_date:req.body.birthdate,
            transactions :transactionslist,
            notifications : [],
            admin:false,
            currency:'EUR',
            observers:[],
            observed: [],
            observedEvents: [],
            nationality: req.body.nationality
        }
        const user = await User.create(newUser)
        
        res.status(201).json(user)

        
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: error}) //500 - generic server error
    }
}

const login = async(req,res) => {
    try {
        const mail = req.body.mail
        const pass = req.body.password

        const user  = await User.findOne({mail: mail})

        

        if(user){
            
            if(user.password == pass){

                if(!user.admin){
                    res.status(200).json({user})
                }else{
                    res.status(201).json({user})
                }
                

            }else{
                res.status(400).json({msg: "invalid password"})
            }

        }else{
            res.status(400).json({msg: "invalid mail"})
        }

    
    } catch (error) {
        console.log(error)

        res.status(500).json({msg: error}) //500 - generic server error
    }
}

const cancelBet = async (req,res) => {
    try{
      const boletimID = req.body.boletimID
  
      const boletim = await Boletim.findOne({_id : boletimID})

      var bets = []
  
      for(const betID of boletim.BetsId){
        const bet = await Bet.findOne({_id : betID})
        bets.push(bet)
      }
  
      var openBets = 0
  
      for(const bet of bets){
        if(!bet.finished || bet.won) openBets++
      }
  
      if(openBets === bets.length){


        for(const bet of bets){
            const res = await axios.post(ServerUrl + '/observer/unsubscribeEvent',{
                      event : bet.eventID,
                      user : boletim.userId
            })
          }
                    

        const user = await User.findOne({_id: boletim.userId})
        user.balance = (parseFloat(user.balance) + parseFloat(boletim.amountBet)).toFixed(2)
        user.transactions.push(`${new Date(Date.now()).toLocaleString()}| Reembolso | ${boletim.amountBet}${getSymbol(user.currency)} | ${user.balance.toString()} ${getSymbol(user.currency)}`)
        const boletins = [...user.boletinsID]
        const index = boletins.indexOf(boletim._id.toString())
        boletins.splice(index,1)
        user.boletinsID = [...boletins]
        
        await user.save()

        await Boletim.findOneAndRemove({_id : boletim._id})
  
        res.status(200).json({msg : 'Aposta Cancelada'})
      } 
      else res.status(200).json({msg : 'Impossivel Cancelar um boletim com apostas já finalizadas'})
      
    }catch(error){
      console.log(error)
    }
  }


const getBoletins = async(req, res) => {
    try{
        
        var listBoletins = []
        var user = await User.findOne({_id: req.body.user})
        for (const boletimID of user.boletinsID){ 
            var listBoletim = []
            var listBets = []
            var boletim  = await Boletim.findOne({_id: boletimID})

            for (const betID of boletim.BetsId){ 
                var listBet = []
                var bet = await Bet.findOne({_id: betID})
                var event = await Event.findOne({idEvent: bet.eventID})
                listBet.push(bet._id, event.homeTeam, event.awayTeam, bet.odd,bet.winner)
                
                
                listBets.push(listBet)
                
            }
            
            listBoletim.push(boletim._id, listBets, boletim.finalOdd, `${boletim.amountBet}`, `${(boletim.amountBet * boletim.finalOdd).toFixed(2)}`, boletim.date, boletim.copied_from, boletim.simples, boletim.userId, boletim.finished, boletim.won,boletim.currency)
            listBoletins.push(listBoletim)
            
        }
       

        res.status(200).json(listBoletins)

    }catch(error){
      console.log(error)
      res.status(500).json({msg: error}) //500 - generic server error
    }
   
} 


const getNotifications = async (req,res) =>{

    try {
        var user = await User.findOne({_id: req.body.user})
        res.status(200).json({notifications : user.notifications})
    }
        
     catch (error) {
    
        console.log(error)
        res.status(500).json({msg: error}) //500 - generic server error
    
    }

}


const getObserved = async (req,res) =>{

    try {
        var user = await User.findOne({_id: req.body.user})
        res.status(200).json({observed : user.observed})
    }
        
     catch (error) {
    
        console.log(error)
        res.status(500).json({msg: error}) //500 - generic server error
    
    }

}


module.exports = {
    getTransactions,
    createUser,
    login,
    updateBalance,
    getBoletins,
    updateUserData,
    getUser,
    getNotifications,
    cancelBet,
    getBalance,
    getCurrency,
    updateCurrency,
    removeNotification,
    getObserved,
    updateWinUserBalance
}