import express from 'express';
import { patientRouter } from './api/patient/patient-router';
import { personelRouter } from './api/personel/personel-router';
import { unitsRouter } from './api/unit/units-router';
import { appointmentRouter } from './api/appointment/appointment-router';
import mongoose from 'mongoose';
import { staticticsRouter } from './api/statistics/statistics-router';
import {blockedDaysRouter} from './api/blockedDays/blockedDays-router'

mongoose.connect('mongodb://127.0.0.1:27017/patient-portal', {});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(patientRouter);
app.use(personelRouter);
app.use(unitsRouter);
app.use(appointmentRouter);
app.use(statisticsRouter);
app.use(blockedDaysRouter);

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
