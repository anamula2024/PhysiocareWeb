const mongoose = require ('mongoose');

let patientSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        minlength:[2, 'El nombre es demasiado corto'],
        maxlength: 50
    },

    surname: {
        type: String,
        require:[ true, 'El apellido es obligatorio'],
        minlength: [2, 'El apellido es demasiado corto'],
        maxlength: 50
    },

    birthDate: {
        type: Date,
        get: (date) => date ? date.toLocaleDateString('es-ES') : null,
        require: [true, 'La fecha de nacimiento es obligatoria']
    },
    
    address: {
        type: String,
        maxlength: 100
    },

    insuranceNumber: {
        type: String,
        require: [true, 'El número de la seguridad social es obligatorio'],
        unique: true,
        match: [ /^[A-Za-z0-9]{9}$/, 'El numero de la seguridad social debe ser de 9 caracteres alfanuméricos']

    },

    image: {
        type: String,
        require: false
        
    }
   

});

let Patient = mongoose.model('patients', patientSchema);
module.exports = Patient;
 