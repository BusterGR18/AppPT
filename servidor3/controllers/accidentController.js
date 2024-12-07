// controllers/accidentController.js
const Accident = require('../models/Accident');
const User = require('../models/user');
const GuestProfile = require('../models/GuestProfile');
const UserSettings = require('../models/UserSettings');

exports.getAccidents = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (!user) {
      return res.status(404).json({ error: `User with email ${email} not found` });
    }

    // Fetch accidents associated with the user's ObjectId
    const accidents = await Accident.find({ user: user._id }).populate('notifiedContacts');

    res.status(200).json(accidents);
  } catch (error) {
    console.error('Error fetching accidents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createAccident = async (req, res) => {
  const { accidentType, email, boardId, isGuestMode, guestProfileId, location, timeOfAccident } = req.body;

  try {
    console.log('Request Body:', req.body); // Debugging

    // Find the user by email
    const user = await User.findOne({ email }); 
    if (!user) {
      console.error(`User with email ${email} not found.`);
      return res.status(404).json({ error: `User with email ${email} not found.` });
    }

    // Determine notified contacts based on guest mode
    const notifiedContacts = isGuestMode
      ? await GuestProfile.findById(guestProfileId).select('contacts') // Fetch guest profile contacts
      : user.contacts.filter(contact => !contact.excludeFromNotifications); // User contacts excluding notifications

    // Create the new accident document
    const newAccident = new Accident({
      accidentType,
      user: user._id, // Reference the user's `_id`
      boardId,
      isGuestMode,
      guestProfileId,
      location,
      timeOfAccident,
      notifiedContacts,
    });

    // Save the accident to the database
    await newAccident.save();
    console.log('Accident saved successfully:', newAccident);

    res.status(201).json(newAccident);
  } catch (error) {
    console.error('Error creating accident:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAccidentCount = async (req, res) => {
  const { boardId, isGuestMode } = req.query;

  if (!boardId) {
    return res.status(400).json({ error: "Board ID is required" });
  }

  try {
    const filter = { boardId, isGuestMode: isGuestMode === "true" }; // Convert string to boolean
    const count = await Accident.countDocuments(filter);
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching accident count:", error);
    res.status(500).json({ error: "Failed to fetch accident count" });
  }
};

exports.getGuestAccidentHistory = async (req, res) => {
  const { email } = req.query; // Fetch the user's email from the query parameters

  try {
    if (!email) {
      return res.status(400).json({ message: 'User email is required' });
    }

    // Find the user ID based on the email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the user settings to retrieve the selected guest profile ID
    const userSettings = await UserSettings.findOne({ username: email });
    if (!userSettings || !userSettings.settings.selectedGuestProfile) {
      return res.status(404).json({ message: 'No guest profile selected for this user' });
    }

    const guestProfileId = userSettings.settings.selectedGuestProfile;

    // Fetch all accidents in guest mode for the specified user and guest profile
    const guestAccidents = await Accident.find({
      user: user._id,
      isGuestMode: true,
      guestProfileId: guestProfileId,
    })
      .populate('guestProfileId', 'name email phoneNumber contacts') // Populate guest profile details
      .exec();

    if (!guestAccidents || guestAccidents.length === 0) {
      return res.status(404).json({ message: 'No guest accidents found for this user' });
    }

    res.status(200).json(guestAccidents);
  } catch (error) {
    console.error('Error fetching guest accident history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};