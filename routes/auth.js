const express = require('express');
let User = require(__dirname +'/../models/users.js');

let router = express.Router();

router.get('/login', (req, res)=>{
    res.render('login');
});


router.post('/login', (req, res) => {
    let login = req.body.login;
    let password = req.body.password;

    User.findOne({login: login, password: password }).then((usuario) => {
           if(usuario){
            req.session.login = usuario.login;
            req.session.rol = usuario.rol;
            console.log('Usuario logueado:', req.session); 
            res.redirect('/patients');
           } else  {
            console.log('Usuario encontrado:', usuario);
            res.render('error', {error: "Usuario o contraseña incorrectos"});
           }   
        }).catch((error) =>{
            res.render('error', { error: "Error al procesar la solicitud" });
        });
    });   


router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});




module.exports = router;