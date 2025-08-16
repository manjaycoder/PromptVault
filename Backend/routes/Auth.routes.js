import express from 'express'
import {Register,Login,logout} from "../controller/Auth.controller.js"
const router=express.Router()

router.post("/Register",Register)
router.post("/Login",Login)
router.post("/logout",logout)

export default router
