
const express = require('express')
const router = express.Router()



const{cancelBet,removeNotification,createUser,login, updateBalance, updateUserData, getUser, getBoletins,getTransactions,getNotifications, getBalance, getCurrency, updateCurrency,getObserved} = require('../controllers/accounts')



router.route('/login').post(login)
router.route('/register').post(createUser)
router.route('/updateBalance').post(updateBalance)
router.route('/getBoletins').post(getBoletins)
router.route('/updateUserData').patch(updateUserData)
router.route('/getUser').post(getUser)
router.route('/getTransactions').post(getTransactions)
router.route('/getNotifications').post(getNotifications)
router.route('/cancelBet').post(cancelBet)
router.route('/getBalance').post(getBalance)
router.route('/getCurrency').post(getCurrency)
router.route('/updateCurrency').post(updateCurrency)
router.route('/getObserved').post(getObserved)
router.route('/removeNotification').post(removeNotification)


module.exports = router