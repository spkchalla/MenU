const mongoose = require('mongoose');

const suggestionsSchema =new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: [true, 'User id is required'],
        index: true
    },
    suggestion:{
        type: String,
        required: [true, 'Suggestion field cannot be empty'],
        trim:true,
        minLength:[10, 'Minimum length is 10 characters'],
        maxLength: [500, 'Maximum length is 500 characters'],
    },
    type:{
        type:String,
        enum:{
            values: ['bug', 'feature request','suggestion regarding food' ],
            message:`{VALUE} is not a valid suggestion type`
        },
        required:[true, 'Suggestion type is required']
    },

    wantToContribute:{
        type:Boolean,
        default: false
    }

},{
    timestamps:true
})

// Useful for admin sorting
suggestionsSchema.index({ createdAt: -1 });


const SuggestionModel = mongoose.model('SuggestionModel', suggestionsSchema);

module.exports = SuggestionModel;