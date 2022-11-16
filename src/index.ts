import express from 'express';
import { router as patientRouter } from './patient-router'
import mongoose from 'mongoose'

mongoose.connect('mongodb://127.0.0.1:27017/patient-portal', {})

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(patientRouter);

app.listen(port,()=>{
    console.log('Server is up on port '+ port)
})

