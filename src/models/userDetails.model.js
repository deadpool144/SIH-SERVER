import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    avatarUrl: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    socialLinks: {              // can be mapped to array or other ideas
       type:String ,
         default:''
    },
    batch: {
        type: String,
        default: '',
    },
    department: {
        type: String,
        default: '',
    },
    uniqueId: {
        type: String,
        unique: true,
    },
    skills: {
        type: [String],
        default: [],
    }
},
    {
        timestamps: true,
    }
)