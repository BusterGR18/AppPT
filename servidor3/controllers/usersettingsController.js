{/** 
// settingsController.js
const UserSettings = require('../models/UserSettings');

// Get user settings
exports.getSettings = async (req, res) => {
    const { useremail } = req.query;
    try {
      let user = await UserSettings.findOne({ username: useremail });
      
      // If no document exists for this user, create one with default settings
      if (!user) {
        user = new UserSettings({
          username: useremail,
          settings: {
            enableStatistics: false,
            enableGuestMode: false,
            enableCustomNotificationMessage: false,
            customNotificationMessage: "",
            notifications: { whatsapp: false, sms: false, telegram: false },
            selectedGuestProfile: "" // Default value for selectedGuestProfile
          }
        });
        await user.save(); // Save the new user document to the database
      }
  
      res.json(user.settings); // Send the settings to the client
    } catch (error) {
      console.error('Error fetching or creating settings:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

// Update user settings and notifications
exports.updateSettings = async (req, res) => {
  const { useremail } = req.query;
  const {
    enableStatistics,
    enableGuestMode,
    enableCustomNotificationMessage,
    customNotificationMessage,
    notifications, // expect { whatsapp, sms, telegram }
    selectedGuestProfile // Add this to handle selected profile
  } = req.body;

  try {
    const user = await UserSettings.findOne({ username: useremail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update settings fields
    user.settings.enableStatistics = enableStatistics ?? user.settings.enableStatistics;
    user.settings.enableGuestMode = enableGuestMode ?? user.settings.enableGuestMode;
    user.settings.enableCustomNotificationMessage = enableCustomNotificationMessage ?? user.settings.enableCustomNotificationMessage;
    user.settings.customNotificationMessage = customNotificationMessage ?? user.settings.customNotificationMessage;
    user.settings.selectedGuestProfile = selectedGuestProfile ?? user.settings.selectedGuestProfile; // Update selected guest profile

    // Update notifications if provided
    if (notifications) {
      user.settings.notifications.whatsapp = notifications.whatsapp ?? user.settings.notifications.whatsapp;
      user.settings.notifications.sms = notifications.sms ?? user.settings.notifications.sms;
      user.settings.notifications.telegram = notifications.telegram ?? user.settings.notifications.telegram;
    }

    await user.save();
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
*/}

//V2
// settingsController.js
const UserSettings = require('../models/UserSettings');
// Get user settings
exports.getSettings = async (req, res) => {
  const { useremail } = req.query;
  try {
    let user = await UserSettings.findOne({ username: useremail });

    // If no document exists for this user, create one with default settings
    if (!user) {
      user = new UserSettings({
        username: useremail,
        settings: {
          enableStatistics: false,
          enableGuestMode: false,
          enableCustomNotificationMessage: false,
          customNotificationMessage: "",
          notifications: { whatsapp: false, sms: false, telegram: false },
          selectedGuestProfile: "", // Default value for selectedGuestProfile
          guestModeLogs: [], // Initialize empty array for guest mode logs
          displayStatistics: [] // Initialize empty array for display statistics
        }
      });
      await user.save(); // Save the new user document to the database
    }

    // Log user settings to verify data before sending
    //console.log("User settings retrieved successfully:", user.settings);

    // Ensure the settings object is fully populated to prevent undefined issues on the frontend
    res.json(user.settings); // Send the settings to the client
  } catch (error) {
    console.error('Error fetching or creating settings:', error); // Log the specific server error
    res.status(500).json({ error: 'Server error' }); // Send an error response to the client
  }
};

// Update user settings and notifications
// Update user settings and notifications
exports.updateSettings = async (req, res) => {
  const { useremail } = req.query;
  const {
    enableStatistics,
    enableGuestMode,
    enableCustomNotificationMessage,
    customNotificationMessage,
    notifications,
    selectedGuestProfile,
    displayStatistics
  } = req.body;

  try {
    const user = await UserSettings.findOne({ username: useremail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update settings fields
    user.settings.enableStatistics = enableStatistics ?? user.settings.enableStatistics;
    user.settings.enableCustomNotificationMessage = enableCustomNotificationMessage ?? user.settings.enableCustomNotificationMessage;
    user.settings.customNotificationMessage = customNotificationMessage ?? user.settings.customNotificationMessage;
    user.settings.selectedGuestProfile = selectedGuestProfile ?? user.settings.selectedGuestProfile;
    user.settings.displayStatistics = displayStatistics ?? user.settings.displayStatistics;

    // Update notifications if provided
    if (notifications) {
      user.settings.notifications.whatsapp = notifications.whatsapp ?? user.settings.notifications.whatsapp;
      user.settings.notifications.sms = notifications.sms ?? user.settings.notifications.sms;
      user.settings.notifications.telegram = notifications.telegram ?? user.settings.notifications.telegram;
    }

    // Handle guest mode activation and deactivation logs
    if (enableGuestMode !== undefined) {
      user.settings.enableGuestMode = enableGuestMode;

      if (enableGuestMode) {
        // If activating guest mode, add a new log entry with activationTime
        user.settings.guestModeLogs.push({ activationTime: new Date() });
      } else {
        // If deactivating guest mode, set deactivationTime for the latest entry
        const latestLog = user.settings.guestModeLogs.slice(-1)[0];
        if (latestLog && !latestLog.deactivationTime) {
          latestLog.deactivationTime = new Date();
        }
      }
    }

    await user.save();
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



// Update Display Statistics
exports.updateDisplayStatistics = async (req, res) => {
  const { useremail, statistics } = req.body; // statistics is an array of statistic names
  try {
    const user = await UserSettings.findOneAndUpdate(
      { username: useremail },
      { 'settings.displayStatistics': statistics },
      { new: true }
    );

    res.status(200).json({ message: 'Display statistics updated.', settings: user.settings });
  } catch (error) {
    console.error('Error updating display statistics:', error);
    res.status(500).json({ error: 'Error updating display statistics.' });
  }
};
