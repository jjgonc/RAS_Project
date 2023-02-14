const User = require('../models/user_model.js')


const subscribeUser = async (req, res) => {
    const toFollow = await User.findOne({username : req.body.toFollow})
    if (toFollow != null){
        const user = await User.findOne({_id : req.body.user})
        
        if ((index = user.observed.indexOf(req.body.toFollow)) > -1) {
            res.status(201).json({msg:"Já segue o user que pretende seguir"})
            
        }else {
            toFollow.observers.push(req.body.user)
            await toFollow.save()
    
            user.observed.push(req.body.toFollow)
            await user.save()
            res.status(200).json({msg:"Começou a seguir o user com sucesso"})
        }
    } else{
        res.status(201).json({msg:"O username que indicou não existe"})
    }
    
}






const unsubscribeUser = async (req, res) => {
    const toUnfollow = await User.findOne({username : req.body.toUnfollow})
    if (toUnfollow != null){
        var following = toUnfollow.observers
        if ((index = following.indexOf(req.body.user)) > -1) {
            following.splice(index, 1)
        }
        toUnfollow.observers = [...following]
        await toUnfollow.save()

        const user = await User.findOne({_id : req.body.user})
        var observeds = user.observed
        if ((index = observeds.indexOf(toUnfollow.username)) > -1) {
            observeds.splice(index, 1)
            user.observed = [...observeds]
            await user.save()
            res.status(200).json({msg:"Deixou de seguir o user com sucesso"})
        } else {
            res.status(201).json({msg:"Não segue o user que pretende deixar de seguir"})
        }
    }else{
        res.status(201).json({msg:"O username que indicou não existe"})
    }

}


const notifyObserversUser = async (user, notification) => {
    for(const observerID of user.observers){
        const observer = await User.findOne({_id : observerID})
        observer.notifications.push(notification)
        await observer.save()
    }
}

module.exports = {
    subscribeUser,
    unsubscribeUser,
    notifyObserversUser
}