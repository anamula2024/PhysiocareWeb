const express = require('express');
const bcrypt = require('bcrypt');
const upload = require(__dirname + '/../utils/uploads.js');
let Patient = require(__dirname +'/../models/patient.js');
let User = require(__dirname+ '/../models/users.js');
const { autenticacion, rol } = require(__dirname+'/../utils/auth');



let router = express.Router();

router.get('/', rol('admin', 'physio'), (req, res) =>{
    Patient.find().then(resultado =>{
      res.render('patients_list', {patients: resultado});
    
    }).catch(error =>{
        res.render('error', {error: 'Error listando pacientes'});
    });
});

router.get('/new', autenticacion,rol('admin', 'physio'), (req, res)=>{
    res.render('patient_add');
});

router.get('/find', autenticacion,rol('admin', 'physio'), (req, res)=>{
    const { surname } = req.query;
   
    if (!surname) {
        Patient.find().then(resultado => {
            res.render('patients_list', { patients: resultado });
        }).catch(error => {
            res.render('error', { error: 'Hubo un problema al procesar la búsqueda. Inténtelo más tarde.' });
        });
    }else{
        const query =  { surname: { $regex: surname, $options: 'i'}} ;
        Patient.find(query).then(resultado => {
            if(resultado.length>0){
                res.render('patients_list', { patients: resultado });
            }else{
                res.render('error', {error: 'No se encontraron pacientes asociados al apellido ingresado' });  
            }
        }).catch(error =>{
            res.render('error', {error: 'Hubo un problema al procesar la búsqueda. Inténtelo más tarde.'});
        }); 

    }
});



router.get('/:id', autenticacion,rol('admin', 'physio', 'patient'), (req, res) => {
    Patient.findById(req.params.id).then(resultado =>{
        if(resultado)
            res.render('patient_detail',{patient: resultado});
            
        else
            res.render('error',{error: "Paciente no encontrado"});  
    }).catch(error =>{
        res.render('error',{error: "Error el paciente no se  ha encontrado"});

    });
});

router.get('/:id/edit', autenticacion,rol('admin', 'physio'), (req, res) =>{
    Patient.findById(req.params.id).then(resultado =>{
        res.render('patient_edit',{patient: resultado});
    }).catch(error =>{
        res.render('error',{error: "Error el paciente no se ha encontrado"});

    });

});

router.get('/:id/new', autenticacion,rol('admin', 'physio'), (req, res) =>{
    Patient.findById(req.params.id).then(resultado =>{
        res.render('record_add');
    });
});



router.post('/', upload.upload.single('image'), autenticacion,rol('admin', 'physio'),async (req, res) => {
    const { name, surname, birthDate,address,insuranceNumber,login, password } = req.body;
  
    try {
      const nuevoPaciente = new Patient({
        name,
        surname,
        birthDate,
        address,
        insuranceNumber
      });
      if(req.file)
        nuevoPaciente.image = req.file.filename;
      
       const pacienteGuardado = await nuevoPaciente.save();
       const passwordEncriptado = await bcrypt.hash(password, 10);
      
       const nuevoUsuario = new User({
        login,
        password: passwordEncriptado,
        rol: 'patient',  
        patient_id: pacienteGuardado._id, 
      });

      await nuevoUsuario.save();
  
      res.redirect(req.baseUrl);
    } catch (error) {
      console.error(error);
      res.render('error', {error: "Error añadiendo paciente"});
    }
  });

    
       
  router.delete('/:id/borrar', autenticacion,rol('admin', 'physio'), (req, res) =>{
        Patient.findByIdAndDelete(req.params.id).then(resultado => {
               res.redirect(req.baseUrl);  
       }).catch(error =>{
           res.render('error', {error: 'Error borrando al paciente.'});
       });
   });
 
   


router.post('/:id', upload.upload.single('image'), autenticacion,rol('admin', 'physio'), (req, res) =>{
      Patient.findById(req.params.id).then( resultado =>{
        if(resultado){
            resultado.name= req.body.name;
            resultado.surname= req.body.surname;
            resultado.birthDate= req.body.birthDate;
            resultado.address= req.body.address;
            resultado.insuranceNumber= req.body.insuranceNumber;
            if(req.file)
                resultado.image= req.file.filename;

            resultado.save().then( resultado2 =>{
                res.redirect(`/patients/${resultado.id}`);
            }).catch(error2 =>{
                res.render('error', {error: 'Error paciente no modificado'});
      });
    }else
    res.render('error', {error: 'Error editando paciente'});
}).catch (error => {
    res.render('error', {error: "Error no se pudo editar al paciente"});
});
});



module.exports = router;
