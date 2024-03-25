import express from 'express'
import StudentMentorController from '../controller/StudentMentor.js'

const router = express.Router()


router.post('/creatementor',StudentMentorController.createMentor)
router.post('/createstudent',StudentMentorController.createStudent)
router.put('/assignmentor/:id',StudentMentorController.assignStudent)
router.put('/changementor/:id',StudentMentorController.changeMentor)
router.get('/mentorsstudents',StudentMentorController.showStudentsofMentor)
router.get('/previousmentors/:id',StudentMentorController.previousMentor)


export default router