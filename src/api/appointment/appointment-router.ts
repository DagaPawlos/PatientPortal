import express from 'express';
import { Appointment } from './appointment';
import { DateUtilities } from '../../dateUtilities';
import { Patient } from '../patient/patient';
import { Personel } from '../personel/personel';
import { Validator } from '../../validator/validator';
import { APPOINTMENT_SCHEMA } from '../../validator/validationSchemas';
import { ROUTES_API, ROUTE_PARAMS } from '../../routes';

const validator = new Validator();
const dateUtilities = new DateUtilities();

export const router = express.Router();

router.post(ROUTES_API.APPOINTMENTS, async (req, res) => {
  const isValidOperation = validator.validate(req.body, APPOINTMENT_SCHEMA);

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid properties present in request body' });
  }

  const patient = await Patient.findById(req.body.patient);
  if (!patient) return res.status(404).send({ error: 'Patient not found' });

  const personel = await Personel.findById(req.body.personel);
  if (!personel) return res.status(404).send({ error: 'Personel not found' });

  const { month, year } = dateUtilities.parseTimestampMonthYear(req.body.date);
 
  const firstDayCurrentYear = dateUtilities.getFirstDayofYear(year);
  const lastDayCurrentYear = dateUtilities.getLastDayofYear(year);

  const visitInYear = await Appointment.find({
    $and: [
      { patient: patient._id },
      { date: { $gt: firstDayCurrentYear } },
      { date: { $lt: lastDayCurrentYear } },
    ],
  });

  if (visitInYear.length >= 5) {
    return res.status(400).send({ error: 'Too many visits in year' });
  }

  const firstDayCurrentMonth = dateUtilities.getFirstDayOfMonth(year, month);
  const lastDayCurrentMonth = dateUtilities.getLastDayofMonth(year, month);

  const visitsInMonth = await Appointment.find({
    $and: [
      { patient: patient._id },
      { date: { $gt: firstDayCurrentMonth } },
      { date: { $lt: lastDayCurrentMonth } },
    ],
  });

  if (visitsInMonth.length >= 3) {
    return res.status(400).send({ error: 'Too many visits in month' });
  }

  const appointment = new Appointment(req.body);

  try {
    await appointment.save();
    res.status(201).send(appointment);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.get(ROUTES_API.APPOINTMENTS, async (req, res) => {
  const query = req.query.name ? { name: req.query.name } : {};
  const limit = Number(req.query.limit);
  const skip = Number(req.query.skip);

  try {
    const appointment = await Appointment.find(query, {}, { skip, limit })
      .populate('personel')
      .populate('patient');
    res.send(appointment);
  } catch (e) {
    res.status(500).send();
  }
});

router.get(`${ROUTES_API.APPOINTMENTS}${ROUTE_PARAMS.ID}`, async (req, res) => {
  const _id = req.params.id;
  try {
    const appointment = await Appointment.findById(_id).populate('personel').populate('patient');
    if (!appointment) {
      return res.status(404).send();
    }
    res.send(appointment);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch(`${ROUTES_API.APPOINTMENTS}${ROUTE_PARAMS.ID}`, async (req, res) => {
  const isValidOperation = validator.validate(req.body, APPOINTMENT_SCHEMA);

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  const patient = await Patient.findById(req.body.patient);
  if (!patient) return res.status(404).send({ error: 'Patient not found' });

  const personel = await Personel.findById(req.body.personel);
  if (!personel) return res.status(404).send({ error: 'Personel not found' });

  const { year, month } = dateUtilities.parseTimestampMonthYear(req.body.date);

  const firstDayCurrentMonth = dateUtilities.getFirstDayOfMonth(year, month);

  const lastDayCurrentMonth = dateUtilities.getLastDayofMonth(year, month);

  const visitsInMonth = await Appointment.find({
    $and: [
      { patient: patient._id },
      { date: { $gt: firstDayCurrentMonth } },
      { date: { $lt: lastDayCurrentMonth } },
    ],
  });

  if (visitsInMonth.length >= 3) {
    return res.status(400).send({ error: 'Too many visits in month' });
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!appointment) {
      return res.status(404).send();
    }
    res.send(appointment);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete(`${ROUTES_API.APPOINTMENTS}${ROUTE_PARAMS.ID}`, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(44).send();
    }
    res.send(appointment);
  } catch (e) {
    res.status(500).send();
  }
});
