Meteor.publish('userPresence', function (whereAt) {
  if (_.isEmpty(whereAt)) {
    this.ready();
    return;
  }

  check(whereAt, String);
  var filter = {'state.whereAt': whereAt};

  var presences = Presences.find(filter, {fields: {state: true, userId: true}});

  return presences;
});

