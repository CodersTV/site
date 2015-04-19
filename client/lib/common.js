commonEvents = {
  'click #login-with-google' : function () {
    $('#login-buttons-google').click();
  }
};


findBootstrapEnvironment = function () {
  // copied from http://stackoverflow.com/a/15150381/1164249
  var envs = ['xs', 'sm', 'md', 'lg'];

  var $el = $('<div>');
  $el.appendTo($('body'));

  for (var i = envs.length - 1; i >= 0; i--) {
    var env = envs[i];

    $el.addClass('hidden-'+env);
    if ($el.is(':hidden')) {
      $el.remove();
      return env;
    }
  }
};
