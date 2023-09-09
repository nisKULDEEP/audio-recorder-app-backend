const mongoose = require('mongoose');

const recordingModel = new mongoose.Schema({
  audioData: { type: Buffer, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true },
  type: { type: String, required: true },
});

const Recording = mongoose.model('Recording', recordingModel);

module.exports = Recording;
