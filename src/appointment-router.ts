import express from 'express';
import { Appointment } from './appointment';
import { parseTimestampMonthYear, getFirstDayOfMonth, getLastDayofMonth } from './dateUtilities';
import { Patient } from './patient';
import { Personel } from './personel';

export const router = express.Router();

router.post('/appointment', async (req, res) => {
  const posted = Object.keys(req.body);
  const allowedPosts = ['date', 'patient', 'personel'];
  const isValidOperation = posted.every((post) => allowedPosts.includes(post));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid properties present in request body' });
  }

  const patient = await Patient.findById(req.body.patient);
  if (!patient) return res.status(404).send({ error: 'Patient not found' });

  const personel = await Personel.findById(req.body.personel);
  if (!personel) return res.status(404).send({ error: 'Personel not found' });

  const { month, year } = parseTimestampMonthYear(req.body.date);
  const firstDayCurrentMonth = getFirstDayOfMonth(year, month);
  const lastDayCurrentMonth = getLastDayofMonth(year, month);

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

router.get('/appointment', async (req, res) => {
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

router.get('/appointment/:id', async (req, res) => {
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
router.patch('/appointment/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['date', 'personel', 'patient'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  const patient = await Patient.findById(req.body.patient);
  if (!patient) return res.status(404).send({ error: 'Patient not found' });

  const personel = await Personel.findById(req.body.personel);
  if (!personel) return res.status(404).send({ error: 'Personel not found' });

  const { year, month } = parseTimestampMonthYear(req.body.date);

  const firstDayCurrentMonth = getFirstDayOfMonth(year, month);

  const lastDayCurrentMonth = getLastDayofMonth(year, month);

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

router.delete('/appointment/:id', async (req, res) => {
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
