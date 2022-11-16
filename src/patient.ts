import mongoose from 'mongoose';
import validator from 'validator';

export const Patient = mongoose.model('Patient', new mongoose.Schema({
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
    dateOfBirth: {
        type: String,
        required: true,
        trim: true
    },
    peselNumber: {
        type: Number,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        trim:true
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
    }
}))
