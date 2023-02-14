const User = require('../models/user_model.js')
const Event = require('../models/event_model.js')


const subscribeEvent = async (req, res) => {
    try{

        const event = await Event.findOne({idEvent: req.body.event})

        if(event.observers.indexOf(req.body.user) === -1) event.observers.push(req.body.user)
        await event.save()

        res.status(200).json({msg:"Começou a seguir o evento com sucesso"})
    

    }catch(error){
        console.log(error)
    } 
}

const unsubscribeEvent = async (req, res) => {
    
    try{
        const event = await Event.findOne({idEvent: req.body.event})
    
    if (event != null){
        var following = event.observers
        if ((index = following.indexOf(req.body.user)) > -1) {
            following.splice(index, 1)
        }
        event.observers = [...following]
        await event.save()

        res.status(201).json({msg:"O evento já não está subscrito"})
    }else{
        res.status(201).json({msg:"O evento que indicou não existe"})
    }
    } catch(error){
        console.log(error)
    }
    

}


const notifyObserversEvent = async (event, notification) => {
   try{ 
    for(const observerID of event.observers){
        console.log(notification)
        const observer = await User.findOne({_id : observerID})
        observer.notifications.push(notification)
        await observer.save()
    }

   }catch(error){
    console.log(error)
   }
   
}

module.exports = {
    subscribeEvent,
    unsubscribeEvent,
    notifyObserversEvent
}