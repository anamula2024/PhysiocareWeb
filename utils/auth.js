let autenticacion = (req, res, next) => {
    if (req.session && req.session.login)
        return next();
    else
        res.redirect('/auth/login');
};
let rol = (...roles) => {
    return (req, res, next) => {
        if (roles.includes(req.session.rol))
            next();
        else
            res.render('login');
    }
};

module.exports = {
    autenticacion: autenticacion,
    rol: rol
};