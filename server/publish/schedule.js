Meteor.publish('Schedule', function (_id, activeOnly) {
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

Meteor.publishRelations('OneScheduleWithProfile', function (_id) {
  this.cursor(Schedule.find({_id: _id}), function (_id, schedule) {
    this.cursor(Meteor.users.find({_id: schedule.owner}, {
      profile: 1,
      superchat: 1
    }));
  });
  return this.ready();
});

Meteor.publishRelations('AgendaWithProfiles', function () {
  this.cursor(Schedule.find({
    $or: [{
      owner: this.userId,
      isActive: false
    }, {
      isActive: true
    }]
  }, {sort: {date: -1}}), function (_id, schedule) {
    this.cursor(Meteor.users.find({_id: schedule.owner}, {
      profile: 1,
      superchat: 1
    }));
  });

  return this.ready();
});
