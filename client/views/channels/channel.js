// This file is a mess :(

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
// player = null;
onYouTubeIframeAPIReady = function() {
  Session.set('YTApiReady', true);
};
// 4. The API will call this function when the video player is ready.
Template.channel.onPlayerReady = function(event) {
  //$('#selected-video-container').fitVids();
  //event.target.playVideo();
  player.addEventListener('onError', Template.channel.onError);
};

Template.channel.onError = function (event) {
  if (event.data === 0) {
    var channel = Template.channel.getChannel();
    Meteor.call('requestVideoDeletion', channel.URL, function (err, res) {
      if (!err && res === true) {
        alertify.error('The user has deleted the video. We just removed it from listing.');
      }
    });
  }
};

Template.channel.created = function () {
  if (typeof player === 'undefined') {
    $.getScript('//www.youtube.com/iframe_api', function () {
      $.getScript('//s.ytimg.com/yts/jsbin/www-widgetapi-vfl9XMVxC.js', function () {})
    });
  }
};

Template.rendered('chatroom', function () {
  _.defer(function () {
    var $window = $(window);
    $window.on('resize', function () {
      var $chatContainer = $('#chat-container');
      var $videoWrapper = $('.row.flex-video');
      var height = parseFloat($videoWrapper.css('padding-bottom')) + parseFloat($videoWrapper.css('padding-top')) + $videoWrapper.height() - $('#msg-input').height() - $('.send-msg').height();

      $chatContainer.height(height);
      $chatContainer.find('#chat-wrapper').height(height);
    });
    $window.resize();
  });
});

Template.channel.rendered = function() {
  Template.channel.DisqusSSO();
  Session.set('channelRendered', true);
};

Template.channel.destroyed = function () {
  Session.set('channelRendered', false);
};

Template.channel.DisqusReset = function () {
  var disqusSSO = Session.get('disqusSSO');
  try {
    DISQUS.reset({
      reload: true,
      config: function () {
        this.page.identifier = Path();
        this.page.url = Meteor.absoluteUrl() + Path().substr(1);
        if (! _.isEmpty(disqusSSO)) {
          this.page.remote_auth_s3 = disqusSSO.auth;
          this.page.api_key = disqusSSO.pubKey;
        }
      }
    });
  } catch (err) {

  }
};

Template.channel.DisqusSSO = function () {
  Meteor.call('disqusSSO', function (err, res) {
    if (err) {
      console.log(err);
      return;
    }

    Session.set('disqusSSO', res);
    window.disqus_config = function () {
      this.page.identifier = Path();
      this.page.url = Meteor.absoluteUrl() + Path().substr(1);
      if (! _.isEmpty(res)) {
        this.page.remote_auth_s3 = res.auth;
        this.page.api_key = res.pubKey;
      }
    }
  });
};

Template.channel.LoadDisqusJS = function () {
  /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
  var disqus_shortname = 'coderstv'; // required: replace example with your forum shortname

  /* * * DON'T EDIT BELOW THIS LINE * * */
  (function() {
    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  })();
};

Template.channel.getChannel = function() {
  return Channels.findOne({});
};

Deps.autorun(function disqus () {
  var user = Meteor.user();
  var channel = Template.channel.getChannel();

  if (Session.equals('channelRendered', false) ||
      Session.equals('disqusSSO', false) ||
      ! channel) {
    return;
  }

  if (window.DISQUS) {
    return Template.channel.DisqusReset();
  }

  if (Session.equals('mustLoadDisqus', false)) {
    return;
  }

  Session.set('mustLoadDisqus', false);
  Template.channel.LoadDisqusJS();
});

Deps.autorun(function youtube (c) {
  var channel = Template.channel.getChannel();
  if (Session.equals('YTApiReady', false) ||
      Session.equals('channelRendered', false) ||
      ! channel) {
    return;
  }

  var interval = Meteor.setInterval(function () {
    if(! document.getElementById('player-div')) {
      return;
    }
    var playerDiv = document.createElement('div');

    playerDiv.id = 'player-div';
    document.getElementById('player-parent').innerHTML = '';
    document.getElementById('player-parent').appendChild(playerDiv);

    player = new YT.Player('player-div', {
      videoId: channel.URL,
      events: {
        'onReady': Template.channel.onPlayerReady
      }
    });

    Meteor.clearInterval(interval);
  }, 100);

  c.onInvalidate(function () {
    Meteor.clearInterval(interval);
  });
});

Template.info_row.watchers = function () {
  return Presences.find().count();
};

Template.channel_past_videos.pastList = function () {
  var currentCoderId = Session.get('currentCoder');
  return Channels.find({owner: currentCoderId, isLive: false});
};

Template.info_row.following = function () {
  var currentCoderId = Session.get('currentCoder');
  return !! Follower.get(currentCoderId);
};

Template.channel.events({
  'click h1' : function (event) {
    var $h1 = $(event.target);
    $h1.toggleClass('truncate');
  },
  'click .follow-coder': function (event) {
    var currentCoderId = Session.get('currentCoder');

    if (Meteor.user()) {
      $(event.target).popover('hide');
    } else {
      $(event.target).popover({
        animation: true,
        placement: 'left',
        content: function () {
          return 'You first need to login before following coders.';
        }
      });
      Meteor.setTimeout(function () {
        $(event.target).popover('hide');
      }, 5 * 1000);
      trackEvent('follow-coder-fail', {coderId: currentCoderId});
      return;
    }

    Follower.set(currentCoderId);
    trackEvent('follow-coder', {coderId: currentCoderId});
  },
  'click .unfollow-coder': function (event) {
    var currentCoderId = Session.get('currentCoder');
    Follower.unset(currentCoderId);
    trackEvent('unfollow-coder', {coderId: currentCoderId});
  },
});

Template.chatroom.events({
  'focus #msg' : function (event) {
    if (Meteor.user()) {
      $('#msg-box').popover('destroy');
      return;
    }

    $('#msg-box').popover({
      placement: 'top',
      content: function () {
        return 'You first need to login before sending messages.';
      }
    });
  },
  'focusout #msg' : function (event) {
    if (! Meteor.user()) {
      $('#msg-box').popover('hide');
    }
  },
  'click #toggle-users-list': function () {
    trackEvent('users-list', {});
  },
  'click a[title="Github Flavored Markdown"]': function () {
    trackEvent('github-markdown', {});
  }
});
