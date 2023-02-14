
const express = require('express')
const router = express.Router()


const{insertBoletim,getBoletim,getAllEvents,getAllOn} = require('../controllers/events')



router.route('/insertBoletim').post(insertBoletim)
router.route('/getBoletim').post(getBoletim)
router.route('/getAllEvents').get(getAllEvents)
router.route('/getAllOn').get(getAllOn)



module.exports = router