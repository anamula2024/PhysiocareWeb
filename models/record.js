const mongoose = require('mongoose');

let appointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        require: true
    },
    physio: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'physios',
        require: true
    },
    diagnosis:{
        type: String,
        require: true,
        minlength: 10,
        maxlength: 500
    },
    treatment: {
        type: String,
        require: true
    },
    observations: {
        type: String,
        maxlength: 500
    }
});



let recordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patients',
        required: true
    },

    medicalRecord: {
        type: String,
        maxlength: 1000
    },

    appointments: [appointmentSchema],

});

recordSchema.index({ patient: 1 }, { unique: true });

let Record = mongoose.model('records', recordSchema);
module.exports = Record;