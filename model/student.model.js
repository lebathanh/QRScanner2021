const mongoose = require('mongoose');

var Schema = mongoose.Schema;
const studentSchema = new Schema(
    {
        studentID: String,
        name: String,
        birth: Date,
        gender: String,
        address: String,
        phone: String
    },
    {
        collection: 'student',
    },
);

module.exports = mongoose.model('student', studentSchema);