Template.test_helper_shareit_with_data.dataContext = function() {
  return {title: 'Test title'}
}

renderToDiv = function(comp) {
  div = document.createElement("DIV");
  UI.materialize(comp, div);
  return div;
};

Tinytest.add("ShareIt - {{> shareit}} template renders", function(test) {
  div = renderToDiv(Template.test_helper_shareit)
  html = canonicalizeHtml(div.innerHTML)
  test.include(html, "Share on Facebook")
  test.include(html, "Share on Twitter")
});

Tinytest.add("ShareIt - {{> shareit}} template doesn't throw an exception from the rendered function", function(test) {
  try {
    Template.shareit.rendered()
  } catch (e) {
    console.log(e)
    test.fail('The rendered function should not throw an error without data.')
  }
});

Tinytest.addAsync("ShareIt - {{> shareit}} template renders valid share links", function(test, done) {
  div = renderToDiv(Template.test_helper_shareit_with_data)
  // This feels like a punt, should investigate more
  Meteor.setTimeout(function() {
    html = div.innerHTML
    test.include(html, 'https://www.facebook.com/sharer/sharer.php?s=100&amp;p[url]=http%3A%2F%2Flocalhost%3A3000%2F&amp;p[title]=Test%20title&amp;p[summary]=undefine')
    test.include(html, 'https://twitter.com/intent/tweet?url=http%3A%2F%2Flocalhost%3A3000%2F&amp;text=Test%20title')
    // This is important for Async tests.
    done()
  }, 200);
});
