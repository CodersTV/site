Meteor.publishComposite('userPresenceWithProfile', function (coderUsername, coderId) {
  return {
    find: function () {
      var filter, presences;

      if (_.isEmpty(coderUsername) && _.isEmpty(coderId)) {
        this.ready();
        return;
      }

      if (coderUsername) {
        check(coderUsername, String);
      } else {
        check(coderId, String);
      }

      filter = {$or: [
        {'state.whereAt': '/coder/' + coderUsername},
        {'state.whereAt': '/coder/' + coderId}
      ]};
      return Presences.find(filter, {fields: {state: true, userId: true}});
    },
    children: [{
      find: function (presence) {
        if (presence.userId) {
          return Meteor.users.find({_id: presence.userId});
        }

        this.ready();
        return;
      }
    }]
  };
});

