Package.describe({
    summary: "Chat with Github Flavored Markdown and social login using Meteor Streams"
});

Package.on_use(function (api, where) {
    var both = ['client', 'server'];
    api.use([
            'meteor',
            'standard-app-packages',
            'presence', 
            'streams'
    ], both);

    api.use([
            'deps',
            'startup',
            'session',
            'templating',
            'less',
            'jquery',
            'marked',
    ], 'client');

    api.add_files([
                  'lib/common.js'
    ], both);

    api.add_files([
                  'client/lib/startup.js',
                  'client/lib/helpers.js',
                  'client/stylesheets/superchat.less',
                  'client/views/chatroom.html',
                  'client/views/chatroom.js'
    ], 'client');
    api.add_files([
                  'client/compatibility/jquery.nicescroll.min.js',
                  'client/compatibility/keyboard.js'
    ], 'client', {raw: true});

    api.add_files([
                  'server/publications.js',
                  'server/unban.js'
    ], 'server');

    if (typeof api.export !== 'undefined') {
        api.imply('reactive-path');
        api.export('Superchat', both);
    }

});
