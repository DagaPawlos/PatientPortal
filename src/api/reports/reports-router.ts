import { Appointment } from '../appointment/appointment';
import express from 'express';
import { ROUTES_API, ROUTE_PARAMS } from '../../routes';
import { DateUtilities } from '../../dateUtilities';
import { Unit } from '../unit/units';

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
      })) as any[];

    const appointmentReports = [];

    for (let i = 0; i < appointments.length; i++) {
      const appointment = appointments[i];
      const unit = await Unit.findById(appointment.personel.unit);

      const appointmentReport = {
        date: new Date(appointment.date).toJSON().slice(0, 10).replace(/-/g, '/'),
        time: new Date(appointment.date).toLocaleTimeString(),
        personel: appointment.personel.name + ' ' + appointment.personel.surname,
        patient: appointment.patient.name + ' ' + appointment.patient.surname,
        unit: unit?.name,
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
