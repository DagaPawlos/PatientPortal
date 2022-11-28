import express from 'express';
import { Appointment } from './appointment';
import { Patient } from './patient';
import { Validator } from './validator';
import { PATIENT_SCHEMA } from './validationSchemas';
import { ROUTES_API, ROUTE_PARAMS } from './routes';

const validator = new Validator();
export const router = express.Router();

router.post(ROUTES_API.PATIENTS, async (req, res) => {
const isValidOperation = validator.validate(req.body, PATIENT_SCHEMA);

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid properties present in request body' });
  }

  const findPesel = await Patient.findOne({ peselNumber: req.body.peselNumber });
  if (findPesel) {
    return res.status(409).send({ error: 'Patient with given pesel is already exist' });
  }

  const name = req.body.name;

  interface AgifyResponse {
    age: number;
    count: number;
    name: string;
  }

  const response = await fetch('https://api.agify.io?name=' + name, { method: 'GET' });
  const responseJson: AgifyResponse = await response.json();
  const patient = new Patient({ ...req.body, age: responseJson.age });

  try {
    await patient.save();
    res.status(201).send(patient);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.get(ROUTES_API.PATIENTS, async (req, res) => {
  const query = req.query.name ? { name: req.query.name } : {};

  const limit = Number(req.query.limit);
  const skip = Number(req.query.skip);

  try {
    const patient = await Patient.find(query, {}, { skip, limit });
    res.send(patient);
  } catch (e) {
    res.status(500).send();
  }
});

router.get(`${ROUTES_API.PATIENTS}${ROUTE_PARAMS.ID}`, async (req, res) => {
  const _id = req.params.id;
  try {
    const patient = await Patient.findById(_id);
    if (!patient) {
      return res.status(404).send();
    }
    res.send(patient);
  } catch (e) {
    res.status(500).send();
  }
});

router.get(`${ROUTES_API.PATIENTS}${ROUTE_PARAMS.ID}${ROUTES_API.APPOINTMENTS}`, async (req, res) => {
  const _id = req.params.id;

  try {
    const patient = await Patient.findById(_id);
    if (!patient) {
      return res.status(404).send({ error: 'Patient with given id doesnt exist' });
    }
    const appointments = await Appointment.find({ patient: patient._id });
    res.send(appointments);
  } catch (e) {
    res.status(500).send({ e: 'Error' });
  }
});

router.patch(`${ROUTES_API.PATIENTS}${ROUTE_PARAMS.ID}`, async (req, res) => {
  const isValidOperation = validator.validate(req.body, PATIENT_SCHEMA);

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) {
      return res.status(404).send();
    }
    res.send(patient);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete(`${ROUTES_API.PATIENTS}${ROUTE_PARAMS.ID}`, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(44).send();
    }
    res.send(patient);
  } catch (e) {
    res.status(500).send();
  }
});
