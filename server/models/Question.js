const mongoose=require('mongoose');

const questionSchema=new mongoose.Schema({
    topic: String,
    title: String,
    description: String,
    solution: String,
    testCases: [
        {
            input: String,
            output: String
        }
    ]
});

module.exports=mongoose.model('Question',questionSchema);