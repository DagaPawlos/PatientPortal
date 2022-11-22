import express from 'express';
import {Personel} from './personel';
import { Unit } from './units';

export const router = express.Router();

router.post('/personel',async(req,res)=>{
    const posted = Object.keys(req.body)
    const allowedPosts = ['name','surname','occupation','phoneNumber','email','licenseNumber','unit']//dodac 
    const isValidOperation = posted.every((post)=>allowedPosts.includes(post))
    
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid properties present in request body'})
    }

    const findLicenseNumber= await Personel.findOne({licenseNumber:req.body.licenseNumber})
    if (findLicenseNumber){
        return res.status(409).send({error:'Somebody with given license number is already exist'})   
    }

    const unit = await Unit.findById(req.body.unit); // szukam unitu przez id
    if (!unit) return res.status(404).send({error: "Unit not found"}) //error

    const personel = new Personel(req.body);

    try {
        await personel.save()
    res.status(201).send(personel)
    } catch(e){
    console.log(e)
    res.status(400).send(e)
}
})

router.get('/personel',async(req,res)=>{
    let query= req.query.name ? {name: req.query.name} : {};
    let limit= Number(req.query.limit)
    let skip= Number(req.query.skip)
    
    try{
        const personel= await Personel.find(query,{},{skip, limit}).populate('unit') // dodac tu i do get by id
        res.send(personel)
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

    router.get('/personel/:id', async (req,res)=>{
        const _id = req.params.id
        try{
            const personel = await Personel.findById(_id).populate('unit')
            if(!personel){
                return res.status(404).send()
            }
            res.send(personel)
        }catch(e){
            res.status(500).send()
        }
    })
    router.patch('/personel/:id',async(req,res)=>{
        const updates = Object.keys(req.body)
        const allowedUpdates = ['surname','email','phoneNumber']
        const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
        
        if(!isValidOperation){
            return res.status(400).send({error: 'Invalid updates'})
        }
        
        try {
        const personel = await Personel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!personel){
            return res.status(404).send();
        }
        res.send(personel)
        } catch(e){
           res.status(400).send() 
        }
    })
    
router.delete('/personel/:id',async(req,res)=>{
    try{
    const personel = await Personel.findByIdAndDelete(req.params.id)
    if(!personel){
        return res.status(44).send()
    }
    res.send(personel)
    }catch(e){
    res.status(500).send()
    }


})

//tzreba bedzie stworzyc router i model wizyty
//do tego modelu trzeba bedzie zaczytac model pacjenta i personelu analogicznie do tego 
