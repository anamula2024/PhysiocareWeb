const express = require('express');
const bcrypt = require('bcrypt');
const upload = require(__dirname + '/../utils/uploads.js');
const Physio = require(__dirname +'/../models/physio.js');
const { autenticacion, rol } = require(__dirname+'/../utils/auth');
let User = require(__dirname+ '/../models/users.js');


let router = express.Router();

router.get('/', autenticacion,rol('admin', 'physio'), (req, res) => {
    Physio.find().then(resultado =>{
        
      res.render('physios_list', {physios: resultado});
  
   }).catch(error=>{
        res.res.render('error', { error: "Error en el sistema"});   
    });
});

router.get('/new', autenticacion,rol('admin', 'physio'), (req, res)=> {
    res.render('physio_add');
});

router.get('/find', autenticacion,rol('admin', 'physio'), (req, res)=> {
    const { specialty } = req.query;
    if (!specialty) {
        Physio.find().then(resultado => {
            res.render('physios_list', { physios: resultado });
        }).catch(error => {
            res.render('error', { error: 'Hubo un problema al procesar la búsqueda. Inténtelo más tarde.' });
        });
    }else{
        const query =  {specialty: { $regex: specialty, $options: 'i'}} ;
        Physio.find(query).then(resultado => {
            if(resultado.length>0){
                res.render('physios_list', { physios: resultado });
            }else{
                res.render('error', {error: 'No se encontraron fisioterapeutas con la especialidad indicada. ' });  
            }
        }).catch(error =>{
            res.render('error', {error: 'Hubo un problema al procesar la búsqueda. Inténtelo más tarde.'});
        }); 

    }
});



router.get('/:id', autenticacion,rol('admin', 'physio'), (req, res)=>{
    Physio.findById(req.params.id).then(resultado =>{
        if(resultado)
            res.render('physio_detail',{physio: resultado});
        else
          res.render('error', { error: "Fisio no encontrado"});    
    }).catch(error=>{
        res.render('error', { error: "Error en el servidor"});
    });
});

router.get('/:id/edit', autenticacion,rol('admin', 'physio'), (req, res) =>{
    Physio.findById(req.params.id).then(resultado =>{
        res.render('physio_edit',{physio: resultado});
    }).catch(error =>{
        res.render('error',{error: "Error el fisioterapeuta no se ha encontrado"});

    });

});

router.post('/', upload.upload.single('image'), autenticacion,rol('admin'), async (req, res)=>{
    const {name,surname,specialty,licenseNumber, login, password} = req.body;

    try{
        const nuevoFisio = new Physio({
            name: req.body.name,
            surname: req.body.surname,
            specialty: req.body.specialty,
            licenseNumber: req.body.licenseNumber
        });
        if(req.file)
            nuevoFisio.image = req.file.filename;

        const fisioGuardado= await nuevoFisio.save();
        const passwordEncriptado = await bcrypt.hash(password, 10);
        const nuevoUsuario = new User({
            login,
            password: passwordEncriptado,
            rol: 'physio',  
            physio_id: fisioGuardado._id, 
          });
    
          await nuevoUsuario.save();
      
          res.redirect(req.baseUrl);
        } catch (error) {
            console.error(error);
            res.render('error', {error: "Error añadiendo paciente"});
          }
        });

    
    
router.post('/:id', upload.upload.single('image'), autenticacion,rol('admin'), (req,res)=>{
    Physio.findById(req.params.id).then(resultado =>{
          if(resultado){
           resultado.name = req.body.name,
            resultado.surname = req.body.surname,
            resultado.specialty = req.body.specialty,
            resultado.lisenseNumber = req.body.lisenseNumber
            if(req.file)
                resultado.image= req.file.filename;
            
            resultado.save().then( resultado2 =>{
                res.redirect(`/physios/${resultado.id}`);
            }).catch(error2 =>{
                res.render('error', {error: 'Error fisioterapeuta no modificado'});
            });
            }else
               res.render('error', {error: 'Error editando al fisioterapeuta'});
            }).catch (error => {
            res.render('error', {error: "Error interno del serviidor"});
   });
});

        

router.delete('/:id', autenticacion, rol('admin'), (req, res)=>{
    Physio.findByIdAndDelete(req.params.id).then(resultado=>{
        res.redirect(req.baseUrl);  
    }).catch(error =>{
        res.render('error', {error: 'Error borrando al fisioterapeuta.'});
    });
});

module.exports = router;