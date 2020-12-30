const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const{ isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated,(req, res)=>{
    res.render('notes/new-notes');
});

router.post('/notes/new-notes', isAuthenticated,async(req, res) =>{
   // console.log(req.body);
    const {paisOrigen,paisDestino, fechaSalida,dias, description}=req.body;
    const errors =[];
    if(!paisOrigen){
        errors.push({text: 'Escriba su pais de origen'});
    }
    if(!paisDestino){
        errors.push({text: 'Escriba su paid de destino'});
    }
    if(!fechaSalida){
        errors.push({text: 'Escriba su fecha de salida'});
    }
    if(!dias){
        errors.push({text: 'Escriba su estancia'});
    }
    if(!description){
        errors.push({text: 'Please write a description'});
    }
    if(errors.length > 0){
        res.render('notes/new-notes', {
            errors,
            paisOrigen,
            paisDestino,
            fechaSalida,
            dias,
            description
        });
    }else{
        const newNote = new Note({paisOrigen,paisDestino,fechaSalida,dias,description });
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg','Anuncio añadido correctamente');
        //console.log(newNote); 
        //ojo aqui ahmed, aqui podemos hacer el paripe de mandarlo a la web del proveedor y tal
        res.redirect('/notes');
    }
    
});

router.get('/notes', isAuthenticated,async(req, res) => {
    //res.send('Notes from database');
    const notes = await Note.find({user: req.user.id}).lean().sort({date:'desc'});
    res.render('notes/all-notes', {notes});
});

router.delete('/notes/delete/:id',isAuthenticated, async(req,res) =>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Anuncio eliminado correctamente');
    //console.log(req.params.id);
    res.redirect('/notes');
});

module.exports =router;