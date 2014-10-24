Package.describe({
  summary: 'A meteorite package that makes social sharing easy',
  git: 'https://github.com/Differential/shareit',
  version: '0.1.0'
});

Package.on_use(function(api) {
  api.use(['coffeescript', 'less', 'templating', 'underscore'], 'client');


  api.imply('spiderable', ['client', 'server']);
  api.add_files([
    'shareit.coffee',
    'client/views/social.html',
    'client/views/social.coffee',
    'client/views/social.less',
    'client/views/facebook/facebook.html',
    'client/views/facebook/facebook.coffee',
    'client/views/twitter/twitter.html',
    'client/views/twitter/twitter.coffee',
    'client/views/google/google.html',
    'client/views/google/google.coffee'
  ], 'client');

  //api.export('Shareit', 'client');
});
