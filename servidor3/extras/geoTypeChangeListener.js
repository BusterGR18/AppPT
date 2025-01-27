// geoTypeChangeListener.js
const GeoType = require('../models/GeoType');
const { publishGeoTypeForUser } = require('./geoTypePublisher');

// Watch for changes in the GeoType collection
const watchGeoTypeChanges = () => {
  const changeStream = GeoType.watch();

  changeStream.on('change', async (change) => {
    console.log('GeoType collection modified:', change);

    if (['insert', 'update', 'replace'].includes(change.operationType)) {
      const userEmail = change.fullDocument?.useremail || change.documentKey?.useremail;
      if (userEmail) {
        await publishGeoTypeForUser(userEmail);
      }
    }
  });
};

module.exports = { watchGeoTypeChanges };
