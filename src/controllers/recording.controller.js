const multer = require('multer');
const Recording = require('../models/recordingModel');

// Configure multer to handle audio file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

const uploadRecording = async (req, res) => {
  try {
    upload.single('audioFile')(req, res, async (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ message: 'Error uploading audio file' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No audio file uploaded' });
      }

      const audioData = req.file.buffer; // Uploaded audio data

      // Create a new recording document in the database
      const recording = new Recording({
        audioData,
        userId: req.userId,
        type: req.body.type,
      });

      await recording.save();

      res
        .status(201)
        .json({ message: 'Recording saved successfully', recording });
    });
  } catch (error) {
    console.error('Error saving recording:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while saving the recording' });
  }
};

const getAllRecording = async (req, res) => {
  try {
    const recordings = await Recording.find({ userId: req.userId });
    if (!recordings || recordings.length === 0) {
      return res
        .status(404)
        .json({ message: 'No recordings found for the user' });
    }

    // Return the recordings as a JSON response
    return res.status(200).json(recordings);
  } catch (error) {
    console.error('Error getting recordings:', error);
    res.status(500).json({ message: 'Error getting recordings' });
  }
};

const removeRecordingByRecordingId = async (req, res) => {
  console.log('REMOVING');
  try {
    const { recordingId } = req.params; // Assuming recordingId is part of the URL params

    // Use your Recording model to find and delete the recording by its ID
    const deletedRecording = await Recording.findByIdAndRemove(recordingId);

    // Check if a recording with the specified ID exists
    if (!deletedRecording) {
      return res.status(404).json({ message: 'Recording not found' });
    }

    // Return a success message
    return res.status(200).json({ message: 'Recording removed successfully' });
  } catch (error) {
    console.error('Error removing recording:', error);
    return res.status(500).json({ message: 'Error removing recording' });
  }
};

module.exports = {
  uploadRecording,
  getAllRecording,
  removeRecordingByRecordingId,
};
