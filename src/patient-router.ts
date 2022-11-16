//const express2 = require ('express')
import express from 'express';
//const Patient1 = require ('./patient')
import { Patient } from './patient';

export const router = express.Router();

router.post('/patients', async (req, res)=>{
    const patient = new Patient(req.body)

    try {
        await patient.save()
        res.status(201).send(patient)
    } catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

router.get('/patients',async(req,res)=>{
    let query = req.query.name ? {name: req.query.name} : {};

    let limit=Number(req.query.limit)
    let skip=Number(req.query.skip)
 
    
    try{
        const patient = await Patient.find(query,{}, {skip,limit})
        res.send(patient)
    }catch (e){
        res.status(500).send()
    }
})

router.get('/patients/:id', async (req,res)=>{
    const _id = req.params.id
    try{
        const patient = await Patient.findById(_id)
        if(!patient){
            return res.status(404).send()
        }
        res.send(patient)
    }catch(e){
        res.status(500).send()
    }
   
})

router.patch('/patients/:id',async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
    
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'})
    }
    
    try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
    if(!patient){
        return res.status(404).send();
    }
    res.send(patient)
    } catch(e){
       res.status(400).send() 
    }
})

router.delete('/patients/:id',async(req,res)=>{
    try{
    const patient = await Patient.findByIdAndDelete(req.params.id)
    if(!patient){
        return res.status(44).send()
    }
    res.send(patient)
    }catch(e){
    res.status(500).send()
    }
})