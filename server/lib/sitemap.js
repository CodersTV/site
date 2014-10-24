sitemaps.add('/sitemap.xml', function () {
    var channels = Channels.find({isLive: false}).fetch()
      , languages = Languages.find().fetch()
      , users = Meteor.users.find().fetch()
      , out = []
      , user = ''
      , username = '';

    _.each(languages, function (language) {
        out.push({
            page: 'language/' + encodeURIComponent(language.name)
        });
    });

    _.each(channels, function (channel) {
        user = _.findWhere(users, {_id: channel.owner});
        username = user && user.profile.username ? user.profile.username : channel.owner;

        out.push({
            page: 'video/' + username + '/' + channel._id
        });
    });

    return out;
});
