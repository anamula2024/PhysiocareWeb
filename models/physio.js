const mongoose = require ('mongoose');

let physioSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 50
    },

    surname: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 50
    },

    specialty: {
        type: String,
        require: true,
        enum: ['Sports', 'Neurological', 'Pediatric', 'Geriatric', 'Oncological']
    },

    licenseNumber: {
        type: String,
        require: true,
        match: /^[a-zA-Z0-9]{8}$/,
        unique: true
    },

    image: {
        type: String,
        require: false
        
    }
});

let Physio = mongoose.model('physios', physioSchema);
module.exports = Physio;