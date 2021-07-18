const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

function connect(){
    mongoose.connect('', { useNewUrlParser: true , useUnifiedTopology: true });
    mongoose.connection.once('open', function(){
        console.log('Connection has been made! yay');
    }).on('error',function(error){
        console.log('Connection error', error);
    });
};

beforeEach(function(done){
    mongoose.connection.collections.lastNode.drop(function(){
        done();
    });
});

exports = {"connect": connect, "beforeEach": beforeEach};