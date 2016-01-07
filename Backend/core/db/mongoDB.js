module.exports ={
    init: function(){
        var tungus = require('tungus'),
            mongoose = require('mongoose');


        //mongoose.connect('mongodb://192.168.2.113/sad');

        mongoose.connect('tingodb://'+__dirname+'/data.db', function (err) {
            // if we failed to connect, abort
            if (err) throw err;
            console.log(__dirname);
            console.log('TingoDB Connection Successful')

        })
    }
}
