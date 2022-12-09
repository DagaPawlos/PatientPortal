import express from 'express';
import { Unit } from './units';
import { Validator } from '../../validator/validator';
import { UNITS_SCHEMA } from '../../validator/validationSchemas';
import { ROUTES_API, ROUTE_PARAMS } from '../../routes';

const validator = new Validator();

export const unitsRouter = express.Router();

unitsRouter.post(ROUTES_API.UNITS, async (req, res) => {
  const isValidOperation = validator.validate(req.body, UNITS_SCHEMA);

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid properties present in request body' });
  }

  const findUnitName = await Unit.findOne({ name: req.body.name });
  if (findUnitName) {
    return res.status(409).send({ error: 'Given  name of unit is already exist' });
  }

  const unit = new Unit(req.body);

  try {
    await unit.save();
    res.status(201).send(unit);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

unitsRouter.get(ROUTES_API.UNITS, async (req, res) => {
  const query = req.query.name ? { name: req.query.name } : {};
  const limit = Number(req.query.limit);
  const skip = Number(req.query.skip);

  try {
    const units = await Unit.find(query, {}, { skip, limit });
    res.send(units);
  } catch (e) {
    res.status(500).send();
  }
});

unitsRouter.get(`${ROUTES_API.UNITS}${ROUTE_PARAMS.ID}`, async (req, res) => {
  const _id = req.params.id;
  try {
    const unit = await Unit.findById(_id);
    if (!unit) {
      return res.status(404).send();
    }
    res.send(unit);
  } catch (e) {
    res.status(500).send();
  }
});

unitsRouter.patch(`${ROUTES_API.UNITS}${ROUTE_PARAMS.ID}`, async (req, res) => {
  const isValidOperation = validator.validate(req.body, UNITS_SCHEMA);

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!unit) {
      return res.status(404).send();
    }
    res.send(unit);
  } catch (e) {
    res.status(400).send();
  }
});

unitsRouter.delete(`${ROUTES_API.UNITS}${ROUTE_PARAMS.ID}`, async (req, res) => {
  try {
    const unit = await Unit.findByIdAndDelete(req.params.id);
    if (!unit) {
      return res.status(44).send();
    }
    res.send(unit);
  } catch (e) {
    res.status(500).send();
  }
});
