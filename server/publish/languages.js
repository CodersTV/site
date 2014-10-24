Meteor.publish('Languages', function (searchText) {
  if (_.isEmpty(searchText)) {
    return Languages.find({}, {sort: {videos: -1}});
  }
  check(searchText, String);

  var regex = '.*' + searchText + '.*';

  return Languages.find({
    name: {$regex: regex, $options: 'i'}
  }, {
    sort: {name: 1}
  });
});
