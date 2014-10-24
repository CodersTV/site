Meteor.publish('Channels', function (searchText) {
  if (_.isEmpty(searchText)) {
    return Channels.find({}, {sort: {finishedAt: 1, createdAt: 1}});
  }
  check(searchText, String);

  var regex = '.*' + searchText + '.*';

  return Channels.find({$or : [
    {title: {$regex: regex, $options: 'i'}},
    {language: {$regex: regex, $options: 'i'}}
  ]}, {
    sort: {finishedAt: 1, createdAt: 1}
  });
});
