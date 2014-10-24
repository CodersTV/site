(function() {
    $SA = {
        s : 18757,
        asynch : 1
    };
    (function() {
        var sa = document.createElement("script");
        sa.type = "text/javascript";
        sa.async = true;
        sa.src = ("https:" == document.location.protocol ? "https://" + $SA.s + ".sa" : "http://" + $SA.s + ".a") + ".siteapps.com/" + $SA.s + ".js";
        var t = document.getElementsByTagName("script")[0];
        t.parentNode.insertBefore(sa, t);
    })();
})();

if (typeof I18n !== 'undefined') {
    var i18n = Meteor.I18n(),
        my_lang = new MyLang();

    setLang = function (lang) {
        my_lang.set(lang);
    }

    Deps.autorun(function () {
        i18n.lang(my_lang.get());
    });

}

