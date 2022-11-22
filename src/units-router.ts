import express from 'express';
import { Unit } from './units';

export const router = express.Router();

router.post('/units', async (req, res) => {
  const posted = Object.keys(req.body);
  const allowedPosts = ['name', 'floor'];
  const isValidOperation = posted.every((post) => allowedPosts.includes(post));

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

router.get('/units', async (req, res) => {
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

router.get('/unit/:id', async (req, res) => {
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
router.patch('/unit/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'floor'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

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

router.delete('/unit/:id', async (req, res) => {
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
