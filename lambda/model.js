const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NodeSchema = new Schema({
    Username: {//make username the primary key
        required: true,
        type: String
    },
    Nodename : {
        type: String,
        default: 'firstTime'
    }
});

const NodeModel = mongoose.model('lastNode', NodeSchema);

module.exports = NodeModel;