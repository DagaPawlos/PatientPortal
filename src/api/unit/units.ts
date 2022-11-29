import mongoose from 'mongoose';

export const Unit = mongoose.model(
  'Unit',
  new mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: true,
    },
    floor: {
      type: Number,
      trim: true,
      required: true,
    },
  }),
);
