import express from 'express'
import {Register,Login,Logout} from "../controller/Auth.controller.js"
const router=express.Router()

router.post("/Register",Register)
router.post("/Login",Login)
router.post("/logout",Logout)

export default router
