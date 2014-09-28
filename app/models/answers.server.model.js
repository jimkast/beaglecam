'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Answer Schema
 */
var AnswerSchema = new Schema({
    description: {
        type: String,
        default: 'No Answerrr',
        required: 'Please fill Answer description'
    },
    video: {
        type: String,
        default: '',
        trim: true
    },
    thumbnail: {
        type: String,
        default: '',
        trim: true
    },
    youtubeUrl: {
        type: String,
        default: '',
        trim: true
    },
    localVideo: {
        type: String,
        default: '',
        trim: true
    },
    enabled:{
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    question: {
        type: Schema.ObjectId,
        ref: 'Question'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Answer', AnswerSchema);
