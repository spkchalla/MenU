const mongoose =require ('mongoose');

const menuSchema = new mongoose.Schema({
    day:{
        type: String,
        required: true
    },
    breakfast:{
        type:[String],
        default: [],
    },
    lunch:{
        type:[String],
        default:[],
    },
    snacks:{
        type:[String],
        default:[],
    },
    dinner:{
        type:[String],
        dafault:[],
    }
});
const Menu = mongoose.model('Menu', menuSchema);
module.exports= Menu;