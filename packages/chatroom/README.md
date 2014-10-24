Meteor SuperChat with Meteor Streams
================

Smart package for SuperChat Streams. It is a chat that includes Social Login and Github Flavored Markdown and do not use MongoDB for persistence, but uses Meteor Streams for direct messaging between clients.

Works with Meteor release 0.6.4.1 and below only.

If you want persistence see
[SuperChat](https://github.com/gabrielhpugliese/meteor_superchat) instead.

## Demo

http://superchat-streams.meteor.com

### Mantained by CodersTV

This package is used and mantained by [CodersTV](http://coderstv.com)

## Install

To install in a new project:
```bash
> mrt add superchat-streams
```

To update an existing project:
```bash
> mrt update superchat-streams
```

## Quick Start

You need to configure at least one kind of account. Supported social plataforms now are:
* Facebook
* Google
* ~~Twitter~~ (Twitter API v1.1 requires OAuth authenticated requests to
  get profile picture)

For example, with Google:

```bash
meteor add accounts-google
```

```html
<template name="index">
  {{> chatroom}}
  {{loginButtons}}
</template>
```

## Configuration

If you don't want to have a global chat for entire website, you can set a Path so you can have a different chat box for each Path you set.
What's needed to do on javascript part is set a Path. Path is a reactive source of current page path (like window.location.pathname).
So, whenever it changes, it must be updated calling ```Path.set(path)```

I've removed loginButtons from it and the popover that shows up to tell
people to login, because loginButtons frag has an id on its div. And if
you have another button on your site, it blows up your code. **So add them
to your site!**

### Example with iron-router
```javascript
Router.map(function () {
    this.route('index', {
        path: '/',
        before: function () {
            Path.set(Router.current().path);
        }
    });
});
```

### Example with mini-pages
```javascript
Meteor.pages({
  '/': {to: 'index', before: setPath}
});

function setPath () {
  Path.set(Meteor.router.path());
}
```

### Example with router
```javascript
Meteor.Router.add({
  '/': { to: 'index', and: setPath}
});

function setPath () {
  Path.set(Meteor.Router.page());
}
```

### Making height responsive
```
Template.parentTemplate.rendered = function() {
	$(window).resize(function () {
		var height = $(this).height(); // you can set a value you want here
		$('#chat-wrapper').height(height);
	});
	$(window).resize(); // trigger the resize
}
```

### Tracking users online

You will have to set up the Meteor-presence publication and
subscription:

```javascript
/* On Server */
Meteor.publish('superChatUserPresence', function (whereAt) {
    var filter = whereAt ? {'state.whereAt': whereAt} : {}; 

    return Meteor.presences.find(filter, {fields: {state: true, userId: true}});
});

/* On Client */
Meteor.Presence.state = function() {
    return {
        online: true,
        whereAt: Path()
    };
}

Deps.autorun(function () {
    Meteor.subscribe('superChatUserPresence', Path());
});
```

### Number of messages on chat area

Just put on the client, on startup (if you override the default object,
make sure you put all those params):

```javascript
Superchat = {
    messageLimitOnScreen: 50,
    defaultProfilePicture: 'http://i.imgur.com/HKSh9X9.png'
};
```

## Dependencies

Thanks @arunoda for his great Meteor project called [Meteor
Streams](https://github.com/arunoda/meteor-streams).

Thanks @tmeasday for this awesome package [Meteor
Presence](https://github.com/tmeasday/meteor-presence)
