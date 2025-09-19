import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
     },
    title: { 
        type: String,
        required: true },
    location: {
        type: String,
        required: true },
    date: {
        type: Date,
        required: true },
    description: {
        type: String,
        required: true },
    imageUrl: {
        type: String,
        default: '',
    }
},
{ timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

export default Event;