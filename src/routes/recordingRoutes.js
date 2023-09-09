const express = require('express');

const app = express();

const middleware = require('../middleware/middleware');

const {
  uploadRecording,
  getAllRecording,
  removeRecordingByRecordingId,
} = require('../controllers/recording.controller');

app.post('/upload', middleware.isValidToken, uploadRecording);
app.get('/listing', middleware.isValidToken, getAllRecording);
app.delete('/:recordingId', removeRecordingByRecordingId);

module.exports = app;
