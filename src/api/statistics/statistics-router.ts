import express from 'express';
import { ROUTES_API, ROUTE_PARAMS } from '../../routes';
import { DateUtilities } from '../../dateUtilities';
import { Patient } from '../patient/patient';
import { Appointment } from '../appointment/appointment';

const dateUtilities = new DateUtilities();

export const router = express.Router();

router.get(
  `${ROUTES_API.STATISTICS}${ROUTES_API.PATIENTS}${ROUTE_PARAMS.ID}${ROUTE_PARAMS.YEAR}${ROUTE_PARAMS.MONTH}`,
  async (req, res) => {
    const _id = req.params.id;
    const patient = await Patient.findById(_id);
    if (!patient) {
      return res.status(400).send({ error: `Patient with given id doesn't exist in database` });
    }

    const year = Number(req.params.year);
    const month = Number(req.params.month) - 1;

    const firstDayOfMonth = dateUtilities.getFirstDayOfMonth(year, month);
    const lastDayOfMonth = dateUtilities.getLastDayofMonth(year, month);

    const visitsInMonth = await Appointment.find({
      $and: [
        { patient: patient._id },
        { date: { $gt: firstDayOfMonth } },
        { date: { $lt: lastDayOfMonth } },
      ],
    });

    try {
      res.status(200).send({ visits: visitsInMonth.length });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  },
);

router.get(
  `${ROUTES_API.STATISTICS}${ROUTES_API.PATIENTS}${ROUTE_PARAMS.ID}${ROUTE_PARAMS.YEAR}`,
  async (req, res) => {
    const _id = req.params.id;
    const patient = await Patient.findById(_id);
    if (!patient) {
      return res.status(400).send({ error: `Patient with given id doesn't exist in database` });
    }
    const year = Number(req.params.year);
    const firstDayOfYear = dateUtilities.getFirstDayofYear(year);
    const lastDayOfYear = dateUtilities.getLastDayofYear(year);

    const visitsInYear = await Appointment.find({
      $and: [
        { patient: patient._id },
        { date: { $gt: firstDayOfYear } },
        { date: { $lt: lastDayOfYear } },
      ],
    });

    const visitsPerMonth: { [k: number]: number } = {};
    for (let i = 1; i <= 12; i++) {
      const firtstDayOfMonth = dateUtilities.getFirstDayOfMonth(year, i);
      const lastDayOfMonth = dateUtilities.getLastDayofMonth(year, i);

      let visitsInMonth = 0;
      for (let j = 0; j < visitsInYear.length; j++) {
        const visit = visitsInYear[j];
        if (firtstDayOfMonth <= visit.date && lastDayOfMonth >= visit.date) {
          visitsInMonth++;
        }
      }

      visitsPerMonth[i] = visitsInMonth;
    }
    try {
      res.status(200).send(visitsPerMonth);
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  },
);
router.get(
  `${ROUTES_API.STATISTICS}${ROUTE_PARAMS.YEAR}${ROUTE_PARAMS.MONTH}`,
  async (req, res) => {
    const year = Number(req.params.year);
    const month = Number(req.params.month) - 1;

    const firstDayOfMonth = dateUtilities.getFirstDayOfMonth(year, month);
    const lastDayOfMonth = dateUtilities.getLastDayofMonth(year, month);

    const visitsInMonth = await Appointment.find({
      $and: [{ date: { $gt: firstDayOfMonth } }, { date: { $lt: lastDayOfMonth } }],
    });

    try {
      res.status(200).send({ visits: visitsInMonth.length });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  },
);
router.get(`${ROUTES_API.STATISTICS}${ROUTE_PARAMS.YEAR}`, async (req, res) => {
  const year = Number(req.params.year);
  const firstDayOfYear = dateUtilities.getFirstDayofYear(year);
  const lastDayOfYear = dateUtilities.getLastDayofYear(year);

  const visitsInYear = await Appointment.find({
    $and: [{ date: { $gt: firstDayOfYear } }, { date: { $lt: lastDayOfYear } }],
  });

  const visitsPerMonth: { [k: number]: number } = {};
  for (let i = 1; i <= 12; i++) {
    const firtstDayOfMonth = dateUtilities.getFirstDayOfMonth(year, i);
    const lastDayOfMonth = dateUtilities.getLastDayofMonth(year, i);

    let visitsInMonth = 0;
    for (let j = 0; j < visitsInYear.length; j++) {
      const visit = visitsInYear[j];
      if (firtstDayOfMonth <= visit.date && lastDayOfMonth >= visit.date) {
        visitsInMonth++;
      }
    }

    visitsPerMonth[i] = visitsInMonth;
  }
  try {
    res.status(200).send(visitsPerMonth);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});
