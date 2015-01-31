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
        if (presence.state.userId) {
          return Meteor.users.find({_id: presence.state.userId});
        }

        this.ready();
        return;
      }
    }]
  };
});

