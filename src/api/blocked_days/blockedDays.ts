import mongoose from 'mongoose';

export const BlockedDays = mongoose.model(
  'blockeddays',
  new mongoose.Schema({
    personel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Personel',
    },
    date: {
      type: Number,
      required: true,
    },
  }),
);
