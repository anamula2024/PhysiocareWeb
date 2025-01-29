const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    login: {
        type: String,
        minlength: 4,
        require: true,
        unique:true
    },
    password: {
        type: String,
        minlength: 7,
        require: true
    },
    rol: {
        type: String,
        require: true,
        enum: ['admin', 'physio', 'patient']
    },
    patient_id: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'patient' }
});

let User = mongoose.model('users', userSchema);
module.exports = User;