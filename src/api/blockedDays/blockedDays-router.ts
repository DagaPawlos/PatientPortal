import { ROUTES_API } from '../../routes';
import express from 'express';
import { BlockedDays } from './blockedDays';
import { BLOCKED_DAYS_SCHEMA_CREATE } from '../../validator/validationSchemas';
import { Validator } from '../../validator/validator';
import { Personel } from '../personel/personel';

export const blockedDaysRouter = express.Router();
const validator = new Validator();

blockedDaysRouter.post(ROUTES_API.BLOCKED_DAYS, async (req, res) => {
  const isValidOperation = validator.validate(req.body, BLOCKED_DAYS_SCHEMA_CREATE);

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid properties present in request body' });
  }

  const personel = await Personel.findById(req.body.personel);
  if (!personel) return res.status(404).send({ error: 'Personel not found' });

  const blocked_days = new BlockedDays(req.body);

  try {
    await blocked_days.save();
    res.status(201).send(blocked_days);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});
