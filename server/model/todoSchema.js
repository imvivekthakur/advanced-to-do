const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    user_id: {
        type: Object,
        required: true
    },
    todos : [
        {
            todo : {
                type : String,
                required : true
            }, state : {
                type : String,
                required : true
            }, category : {
                type : String
            }
        }
    ]
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;