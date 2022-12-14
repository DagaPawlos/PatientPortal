import { Appointment } from '../appointment/appointment';
import express from 'express';
import { ROUTES_API, ROUTE_PARAMS } from '../../routes';
import { DateUtilities } from '../../dateUtilities';
import { Unit } from '../unit/units';
import { Types } from 'mongoose';

const dateUtilities = new DateUtilities();

export const reportsRouter = express.Router();

reportsRouter.get(
  `${ROUTES_API.REPORTS}${ROUTES_API.PERSONEL}${ROUTE_PARAMS.MONTH}${ROUTE_PARAMS.YEAR}`,
  async (req, res) => {
    const year = Number(req.params.year);
    const month = Number(req.params.month) - 1;

    const firstDayOfMonth = dateUtilities.getFirstDayOfMonth(year, month);
    const lastDayOfMonth = dateUtilities.getLastDayofMonth(year, month);

    const appointments = (await Appointment.find({
      $and: [{ date: { $gt: firstDayOfMonth } }, { date: { $lt: lastDayOfMonth } }],
    })
      .populate({
        path: 'personel',
        select: ['name', 'surname', 'unit'],
      })
      .populate({
        path: 'patient',
        select: ['name', 'surname'],
      })
      .sort({ date: -1 })) as any[];

    const unitsIds: Types.ObjectId[] = [];

    for (let i = 0; i < appointments.length; i++) {
      const unit = appointments[i];
      if (unit.personel.unit !== undefined && !unitsIds.includes(unit.personel.unit)) {
        unitsIds.push(unit.personel.unit);
      }
    }

    const units = await Unit.find({ _id: { $in: unitsIds } });

    const appointmentReports = [];

    for (let i = 0; i < appointments.length; i++) {
      const appointment = appointments[i];

      const unit = units.find((unit) => {
        if (appointment.personel.unit) {
          return unit._id.toString() == appointment.personel?.unit.toString();
        }
        return false;
      });
      const unitName = unit?.name;

      const appointmentReport = {
        date: dateUtilities.getDateString(appointment.date),
        time: dateUtilities.getTimeString(appointment.date),
        personel: appointment.personel.name + ' ' + appointment.personel.surname,
        patient: appointment.patient.name + ' ' + appointment.patient.surname,
        unit: unitName,
      };

      appointmentReports.push(appointmentReport);
    }

    try {
      res.status(200).send({ appointmentReports });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  },
);
