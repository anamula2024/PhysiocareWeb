const express = require('express');
const Record = require(__dirname +'/../models/record.js');
const Patient = require(__dirname +'/../models/patient.js');
const { autenticacion, rol } = require(__dirname+'/../utils/auth');


let router = express.Router();


router.get('/', autenticacion,rol('admin', 'physio'),(req, res)=>{
    Record.find().populate('patient').then(resultado=>{
        if(resultado)
            res.render('records_list',{ records: resultado});
        else
          res.render('error', { error: "No se han encontrado expedientes en el sistema"});    
    }).catch(error=>{
        res.render('error',{ error: "Error interno del servidor"});
    });
});

router.get('/new', autenticacion,rol('admin', 'physio'),(req, res)=>{
    Record.find().populate('patient').then(resultado=>{
        if(resultado)
             res.render('record_add');
    });
});

router.get('/find ', autenticacion,rol('admin', 'physio'),(req, res)=>{
    const { surname } = req.query;
        const query =  { surname: { $regex: surname, $options: 'i'}} ;
        Record.find(query).then(resultado => {
            if(resultado.length>0){
                res.render('records_list', { records: resultado });
            }else{
                res.render('error', {error: 'No se encontraron expedientes asociados al apellido ingresado' });  
            }
        }).catch(error =>{
            res.render('error', {error: 'Hubo un problema al procesar la búsqueda. Inténtelo más tarde.'});
        }); 

    }
);


router.get('/:id', autenticacion,rol('admin', 'physio'),(req, res)=>{
    const recordId = req.params.id;
   
    Record.findById(recordId).populate('patient').populate('medicalRecord').populate('appointments.physio').then(resultado =>{
        if(resultado)
            res.render('record_detail',{ records: resultado});
        else
           res.render('error',{ error: "Expediente no encontrado"});    
    }).catch(error=>{
        res.render('error',{ error: "Error interno del servidor"});
    
    });
});

router.post('/', autenticacion,rol('admin', 'physio'), async(req, res)=>{
    const {patient, medicalRecord, appointments} =req.body;
    try {
        const pacienteExistente = await Patient.findById(patient);
        
        const nuevoExpediente = new Record({
            patient,
            medicalRecord,
            appointments
        });

        const expedienteGuardado = await nuevoExpediente.save();
        res.render({ok: true, resultado: resultado });

    } catch (error) {
         res.render('error',{ error: 'Error al insertar expediente.'});
    }
});

router.delete('/:id', autenticacion,rol('admin', 'physio'),(req, res)=>{
    Record.findByIdAndDelete(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);  
}).catch(error =>{
    res.render('error', {error: 'Error borrando el expediente.'});
});
});
module.exports = router;