//router is where we define our endpoint path
import express from 'express'
import indexController from '../controller/index.js'
import StudentMentor from './StudentMentor.js'

const router = express.Router()

router.get('/',indexController.homePage)

router.use('/studentmentor',StudentMentor)

export default router