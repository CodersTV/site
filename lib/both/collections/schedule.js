Schedule = new Meteor.Collection('schedule');

Schedule.cancel = function (_id) {
  return Schedule.update({ _id: _id }, {
    $set: { isActive: false }
  });
};

Schedule.uncancel = function (_id) {
  return Schedule.update({ _id: _id }, {
    $set: { isActive: true }
  });
};
