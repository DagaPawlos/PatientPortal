import express from 'express';
import { router as patientRouter } from './patient-router';
import { router as personelRouter } from './personel-router';
import {router as unitsRouter} from './units-router';
import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/patient-portal', {})

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(patientRouter);
app.use(personelRouter);
app.use(unitsRouter);

app.listen(port,()=>{
    console.log('Server is up on port '+ port)
})

