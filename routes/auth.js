const express = require('express');
const bcrypt = require('bcrypt');

let User = require(__dirname +'/../models/users.js');

let router = express.Router();

router.get('/login', (req, res)=>{
    res.render('login');
});


router.post('/login', async(req, res) => {
    let login = req.body.login;
    let password = req.body.password;

    try{
       const usuario = await User.findOne({login: login});
       if(usuario){
        const match = await bcrypt.compare(password, usuario.password);
        if(match){
            req.session.login = usuario.login;
            req.session.rol = usuario.rol;
            res.redirect('/patients');
        } else {
            res.render('error', {error: "Usuario o contraseña incorrectos"});
        }
       }else{
        res.render('error', { error: "Error al procesar la solicitud" });
       }
    }catch(error) {
        res.render('error', {error: "Error "})
    }
            
    });



router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});




module.exports = router;