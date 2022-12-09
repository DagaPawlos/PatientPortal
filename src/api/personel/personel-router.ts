import express from 'express';
import { Personel } from './personel';
import { Unit } from '../unit/units';
import { Appointment } from '../appointment/appointment';
import { Validator } from '../../validator/validator';
import { PERSONEL_SCHEMA_CREATE } from '../../validator/validationSchemas';
import { PERSONEL_SCHEMA_UPDATE } from '../../validator/validationSchemas';
import { ROUTES_API, ROUTE_PARAMS } from '../../routes';

export const personelRouter = express.Router();
const validator = new Validator();

personelRouter.post(ROUTES_API.PERSONEL, async (req, res) => {
  const isValidOperation = validator.validate(req.body, PERSONEL_SCHEMA_CREATE);

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid properties present in request body' });
  }

  const findLicenseNumber = await Personel.findOne({ licenseNumber: req.body.licenseNumber });
  if (findLicenseNumber) {
    return res.status(409).send({ error: 'Somebody with given license number is already exist' });
  }

  const unit = await Unit.findById(req.body.unit);
  if (!unit) return res.status(404).send({ error: 'Unit not found' });

  const personel = new Personel(req.body);

  try {
    await personel.save();
    res.status(201).send(personel);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

personelRouter.get(ROUTES_API.PERSONEL, async (req, res) => {
  const query = req.query.name ? { name: req.query.name } : {};
  const limit = Number(req.query.limit);
  const skip = Number(req.query.skip);

  try {
    const personel = await Personel.find(query, {}, { skip, limit }).populate('unit');
    res.send(personel);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

personelRouter.get(`${ROUTES_API.PERSONEL}${ROUTE_PARAMS.ID}`, async (req, res) => {
  const _id = req.params.id;
  try {
    const personel = await Personel.findById(_id).populate('unit');
    if (!personel) {
      return res.status(404).send();
    }
    res.send(personel);
  } catch (e) {
    res.status(500).send();
  }
});

personelRouter.get(
  `${ROUTES_API.PERSONEL}${ROUTE_PARAMS.ID}${ROUTES_API.APPOINTMENTS}`,
  async (req, res) => {
    const _id = req.params.id;

    try {
      const personel = await Personel.findById(_id);
      if (!personel) {
        return res.status(404).send({ error: 'Personel with given id doesnt exist' });
      }
      const appointments = await Appointment.find({ personel: personel._id });
      res.send(appointments);
    } catch (e) {
      res.status(500).send({ e: 'Error' });
    }
  },
);

personelRouter.patch(`${ROUTES_API.PERSONEL}${ROUTE_PARAMS.ID}`, async (req, res) => {
  const isValidOperation = validator.validate(req.body, PERSONEL_SCHEMA_UPDATE);

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    const personel = await Personel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!personel) {
      return res.status(404).send();
    }
    res.send(personel);
  } catch (e) {
    res.status(400).send();
  }
});

personelRouter.delete(`${ROUTES_API.PERSONEL}${ROUTE_PARAMS.ID}`, async (req, res) => {
  try {
    const personel = await Personel.findByIdAndDelete(req.params.id);
    if (!personel) {
      return res.status(44).send();
    }
    res.send(personel);
  } catch (e) {
    res.status(500).send();
  }
});
