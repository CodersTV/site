Package.describe({
    summary: "Chat with Github Flavored Markdown and social login using Meteor Streams"
});

Package.on_use(function (api, where) {
    var both = ['client', 'server'];
    // Client
    api.use([
            'deps',
            'session',
            'startup',
            'reactive-path'
    ], 'client');

    api.use([
            'collection-hooks'
    ], 'server');

    api.add_files([
            'both.js'
    ], both);


    api.add_files([
                  'client.js',
    ], 'client');

    // Server
    api.add_files([
                  'server.js'
    ], 'server');

    if (typeof api.export !== 'undefined') {
        api.export('Viewers');
    }
});
