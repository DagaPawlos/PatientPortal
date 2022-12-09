import express from 'express';
import { router as patientRouter } from './api/patient/patient-router';
import { router as personelRouter } from './api/personel/personel-router';
import { router as unitsRouter } from './api/unit/units-router';
import { router as appointmentRouter } from './api/appointment/appointment-router';
import mongoose from 'mongoose';
import { router as statisticsRouter } from './api/statistics/statistics-router';
import { router as blocked_daysRouter } from './api/blocked_days/blockedDays-router';

mongoose.connect('mongodb://127.0.0.1:27017/patient-portal', {});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(patientRouter);
app.use(personelRouter);
app.use(unitsRouter);
app.use(appointmentRouter);
app.use(statisticsRouter);
app.use(blocked_daysRouter);

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
