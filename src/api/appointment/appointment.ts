import mongoose from 'mongoose';

export const Appointment = mongoose.model(
  'Appointment',
  new mongoose.Schema({
    date: {
      type: Number,
      required: true,
    },
    personel: { type: mongoose.Schema.Types.ObjectId, ref: 'Personel' },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  }),
);
