Schedule.allow({
  insert: function (userId, doc) {
    var checkPattern = {
      title: String,
      description: String,
      date: Date
    };
    
    try {
      check(doc, checkPattern);
    } catch (err) {
      throw new Meteor.Error(406, 'Invalid input. Please check information again');
    }

    if (86400000 + +(doc.date) < +(new Date())) {
      throw new Meteor.Error(406, 'You can\'t create an event in the past');
    }

    return true;
  },
  update: function (userId, doc, fieldNames, modifier) {
    return doc.owner === userId;
  }
});

Schedule.before.insert(function (userId, doc) {
  doc.createdAt = new Date();
  doc.owner = userId;
  doc.isActive = true;
});
