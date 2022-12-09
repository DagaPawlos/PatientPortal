import mongoose from "mongoose";

export const Blocked_days = mongoose.model(
    'Blocked_days',
    new mongoose.Schema({
        personel_id:{
         type: mongoose.Schema.Types.ObjectId, ref: 'Personel'},
         date:{
            type:Number,
            required:true,
         }
        }))