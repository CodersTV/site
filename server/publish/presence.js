Meteor.publishRelations('userPresenceWithProfile', function (coderUsername, coderId) {
  var filter, presences;

  if (_.isEmpty(coderUsername) && _.isEmpty(coderId)) {
    return this.ready();
  }

  check(coderUsername || coderId, String);
  filter = {$or: [
    {'state.whereAt': '/coder/' + coderUsername},
    {'state.whereAt': '/coder/' + coderId}
  ]};

  this.cursor(Presences.find(filter, {fields: {state: true, userId: true}}), function (_id, presence) {
    if (presence.userId) {
      this.cursor(Meteor.users.find({_id: presence.userId}));
    }
  });

  return this.ready();
});

