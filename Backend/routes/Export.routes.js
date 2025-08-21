import express from 'express'
import {createExportJob,getExportJob} from "../controller/Export.controller.js"
import ProtectRoutes from '../middleware/Auth.middleware.js'
const router=express.Router()

router.post("/create",ProtectRoutes,createExportJob)
router.get("/:id",ProtectRoutes,getExportJob)
export default router;
