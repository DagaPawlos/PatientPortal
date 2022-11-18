import mongoose from 'mongoose';
import validator from 'validator';

enum Occupation{
    doctor='doctor',
    midwife='midife',
    nurse='nurse',
    medical_analyst='medical analyst'
   }

export const Personel = mongoose.model('Personel', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    surname: {
        type: String,
        required: true,
        trim: true
    },
    occupation: {
        type: String,
        enum: ['doctor','nurse','midwife','medical analyst'],
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        validate(value:string){
            if (!validator.isMobilePhone(value)){
                throw new Error('Number is invalid')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value:string){
            if(!validator.isEmail(value)){
                throw new Error ('Email is invalid')
            }
        }
    },
    licenseNumber: {
        type:Number,
        lenght:9,
        trim: true,
        required:true
    }
}))