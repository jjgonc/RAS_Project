
const express = require('express')
const router = express.Router()


const{subscribeUser,unsubscribeUser} = require('../controllers/observer-users')
const{subscribeEvent, unsubscribeEvent} = require('../controllers/observer-events')


router.route('/subscribe').post(subscribeUser)
router.route('/unsubscribe').post(unsubscribeUser)
router.route('/subscribeEvent').post(subscribeEvent)
router.route('/unsubscribeEvent').post(unsubscribeEvent)


module.exports = router