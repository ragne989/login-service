const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: true, required: true, minlength: 3, maxlength: 31, match: [/^[a-zA-Z0-9-.]+$/, 'is invalid']  },
    hash: { type: String, required: true },
    firstName: { type: String, required: true, minlength: 2, maxlength: 15 },
    lastName: { type: String, required: true, maxlength: 15 },
    company: {
        type:[String],  
        enum : ['faf','vev','adrem', 'lapi', 'plasmapro'], 
        required: true
    },
    userGroups: {
        type:[String],  
        enum : ['admin','manager','employee'], 
        required: true
    },
    theme: {
        type: String,  
        enum : ['dark','light'], 
        required: false
    }, 
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);