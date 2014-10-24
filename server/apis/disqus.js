var CryptoJS = Meteor.require('crypto-js');

Meteor.methods({
    disqusSSO: function () {
        var DISQUS_SECRET = Meteor.settings.disqus.secret,
            DISQUS_PUBLIC = Meteor.settings.disqus.public,
            userId = Meteor.userId(),
            user = Meteor.users.findOne({_id: userId});

        if (! userId) {
            return {};
        }

        var userUrl = Meteor.absoluteUrl() + 'coder/' + (user.profile.username || user._id),
            disqusData = {
                id: user._id,
                username: user.profile.name,
                email: user.services.google.email,
                avatar: user.superchat.pic_square,
                url: userUrl
            },
            disqusStr = JSON.stringify(disqusData),
            timestamp = Math.round(+new Date() / 1000);

        /*
        * Note that `Buffer` is part of node.js
        * For pure Javascript or client-side methods of
        * converting to base64, refer to this link:
        * http://stackoverflow.com/questions/246801/how-can-you-encode-a-string-to-base64-in-javascript
        */
        var message = new Buffer(disqusStr).toString('base64');

        /* 
        * CryptoJS is required for hashing (included in dir)
        * https://code.google.com/p/crypto-js/
        */
        var result = CryptoJS.HmacSHA1(message + " " + timestamp, DISQUS_SECRET);
        var hexsig = CryptoJS.enc.Hex.stringify(result);

        return {
            pubKey: DISQUS_PUBLIC,
            auth: message + " " + hexsig + " " + timestamp
        };
    }
})
