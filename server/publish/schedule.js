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

Meteor.publishComposite('OneScheduleWithProfile', function (_id) {
  return {
    find: function () {
      return Schedule.find({_id: _id});
    },
    children: [{
      find: function (schedule) {
        return Meteor.users.find({_id: schedule.owner}, {
          profile: 1,
          superchat: 1
        });
      }
    }]
  };
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
