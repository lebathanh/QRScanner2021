var mongoose = require('mongoose');

function connect() {
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
    mongoose.connect(
        'mongodb+srv://weffty:thanh2208@cluster0.rzzh1.mongodb.net/QRscanner2021?authSource=admin&replicaSet=atlas-i7aa56-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true',
        { useNewUrlParser: true, useUnifiedTopology: true },
        function (err) {
            if (err) {
                console.log('mongo connected erro: ' + err);
            } else {
                console.log('mongo connected succesfull.');
            }
        },
    );
}
module.exports = { connect };