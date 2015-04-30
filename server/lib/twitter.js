var options = {
    consumer_key: Meteor.settings.twitter.twitter_consumer_key,
    consumer_secret: Meteor.settings.twitter.twitter_consumer_secret,
    access_token_key: Meteor.settings.twitter.twitter_access_token_key,
    access_token_secret: Meteor.settings.twitter.twitter_access_token_secret
}

TwitterClient = new Twitter(options);
