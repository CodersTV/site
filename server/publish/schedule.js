Meteor.publish('schedule', function (_id, activeOnly) {
  var query = {};

  if (_id) {
    query._id = _id;
  }

  if (activeOnly) {
    query.$or = [{ 
      owner: this.userId,
      isActive: false
    }, {
      isActive: true
    }];
  }

  return Schedule.find(query);
});
