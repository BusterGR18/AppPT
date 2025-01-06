// boardController.js
const Board = require('../models/Board');
const Telemetry = require('../models/Telemetry');

// Create a new board
//Initial
/*
exports.createBoard = async (req, res) => {
    console.log('Request Body:', req.body);
    const { boardId, name, mode, userId } = req.body;
  
    if (!boardId || !name || !mode || !userId) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const board = new Board({ boardId, name, mode, user: userId });
      await board.save();
      res.status(201).json({ message: 'Board created successfully', board });
    } catch (error) {
      console.error('Error creating board:', error);
      res.status(500).json({ error: 'Failed to create board' });
    }
  };
  */
 //V1.1
 exports.createBoard = async (req, res) => {
    try {
      const { boardId, name, mode, userId } = req.body;
  
      // Check if the board already exists
      const existingBoard = await Board.findOne({ boardId });
      if (existingBoard) {
        return res.status(400).json({ error: 'Board with this ID already exists' });
      }
  
      // Find the earliest telemetry event for the boardId
      const earliestTelemetry = await Telemetry.aggregate([
        { $match: { boardid: boardId } }, // Match the telemetry records for the boardId
        { $unwind: '$events' },           // Flatten the events array
        { $sort: { 'events.when': 1 } },  // Sort by the event's timestamp (ascending)
        { $limit: 1 },                    // Limit to the earliest event
        { $project: { 'events.when': 1 } } // Only keep the `when` field
      ]);
  
      // Use the earliest event timestamp or the current time as createdAt
      const createdAt = earliestTelemetry.length > 0 ? earliestTelemetry[0].events.when : new Date();
  
      // Create a new board
      const newBoard = new Board({
        boardId,
        user: userId,
        name,
        mode,
        createdAt, // Set the calculated createdAt date
      });
  
      await newBoard.save();
      res.status(201).json({ message: 'Board created successfully', board: newBoard });
    } catch (error) {
      console.error('Error creating board:', error);
      res.status(500).json({ error: 'Error creating board' });
    }
  };
  

// Get all boards for a user
exports.getBoards = async (req, res) => {
    try {
      const { userId } = req.params; // Extract userId from the route parameters
      const boards = await Board.find({ user: userId }).populate('user'); // Query using the userId
      res.status(200).json({ boards });
    } catch (error) {
      console.error('Error fetching boards:', error);
      res.status(500).json({ error: 'Error fetching boards' });
    }
  };
  
  
  

// Update a board
exports.updateBoard = async (req, res) => {
    try {
      const { boardId } = req.params; // Get boardId from params
      const updateData = req.body; // Get update data from request body
  
      const updatedBoard = await Board.findOneAndUpdate(
        { boardId }, // Query by boardId instead of _id
        updateData,
        { new: true } // Return the updated document
      );
  
      if (!updatedBoard) {
        return res.status(404).json({ error: 'Board not found' });
      }
  
      res.status(200).json({ message: 'Board updated successfully', board: updatedBoard });
    } catch (error) {
      console.error('Error updating board:', error);
      res.status(500).json({ error: 'Error updating board' });
    }
  };
  

// Delete a board
exports.deleteBoard = async (req, res) => {
    const { boardId } = req.params;
  
    try {
      // Find the board to ensure it exists
      const board = await Board.findOneAndDelete({ boardId });
      if (!board) {
        return res.status(404).json({ error: 'Board not found' });
      }
  
      // Delete telemetry data linked to the board
      const telemetryResult = await Telemetry.deleteMany({ boardid: boardId });
      console.log(`Deleted telemetry events for board ${boardId}:`, telemetryResult.deletedCount);
  
      res.status(200).json({ message: 'Board and associated telemetry deleted successfully.' });
    } catch (error) {
      console.error('Error deleting board:', error);
      res.status(500).json({ error: 'Failed to delete board.' });
    }
  };
  
  