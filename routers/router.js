import express from 'express';
import { addSchool, listSchool } from '../controller/schoolcontroller.js';


const router = express.Router();

router.post("/addSchool", addSchool);
router.get("/listSchools", listSchool); 

export default router;
