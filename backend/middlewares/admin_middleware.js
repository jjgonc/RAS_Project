
const express = require('express')
const router = express.Router()

const{updateEvent,createPromotion} = require('../controllers/admin')



router.route('/updateEvent').post(updateEvent)
router.route('/createPromotion').post(createPromotion)

module.exports = router