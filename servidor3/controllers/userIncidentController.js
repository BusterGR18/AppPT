const Incident = require('../models/Incident');
const User = require('../models/user');
const GuestProfile = require('../models/GuestProfile');
const UserSettings = require('../models/UserSettings');

/**
 * Get all incidents for a specific user.
 */
exports.getIncidents = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (!user) {
      return res.status(404).json({ error: `User with email ${email} not found` });
    }

    const incidents = await Incident.find({ user: user._id });
    res.status(200).json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Create a new incident.
 */
exports.createIncident = async (req, res) => {
  const { incidentType, email, boardId, isGuestMode, guestProfileId, details, timeOfIncident } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: `User with email ${email} not found.` });
    }

    let phoneNumber;
    if (isGuestMode) {
      const guestProfile = await GuestProfile.findById(guestProfileId);
      if (!guestProfile) {
        return res.status(404).json({ error: 'Guest profile not found.' });
      }
      phoneNumber = guestProfile.phoneNumber;
    } else {
      phoneNumber = user.numtel;
    }

    const newIncident = new Incident({
      incidentType,
      user: user._id,
      boardId,
      isGuestMode,
      guestProfileId,
      phoneNumber,
      details,
      timeOfIncident,
    });

    await newIncident.save();
    console.log('Incident saved successfully:', newIncident);

    res.status(201).json(newIncident);
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get the count of incidents for a specific board.
 */
exports.getIncidentCount = async (req, res) => {
  const { boardId, isGuestMode } = req.query;

  if (!boardId) {
    return res.status(400).json({ error: 'Board ID is required' });
  }

  try {
    const filter = { boardId, isGuestMode: isGuestMode === 'true' };
    const count = await Incident.countDocuments(filter);
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching incident count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get the incident history for a guest profile.
 */
exports.getGuestIncidentHistory = async (req, res) => {
  const { email } = req.query;

  try {
    if (!email) {
      return res.status(400).json({ error: 'User email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userSettings = await UserSettings.findOne({ username: email });
    if (!userSettings || !userSettings.settings.selectedGuestProfile) {
      return res.status(404).json({ error: 'No guest profile selected for this user' });
    }

    const guestProfileId = userSettings.settings.selectedGuestProfile;
    const guestIncidents = await Incident.find({
      user: user._id,
      isGuestMode: true,
      guestProfileId: guestProfileId,
    }).exec();

    if (!guestIncidents || guestIncidents.length === 0) {
      return res.status(404).json({ error: 'No guest incidents found for this user' });
    }

    res.status(200).json(guestIncidents);
  } catch (error) {
    console.error('Error fetching guest incident history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
