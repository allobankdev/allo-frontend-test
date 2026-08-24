/**
 * Tiny hash router.
 *
 * Unlike a router that injects markup from scratch, each screen already
 * exists as a static <section class="view"> in index.html. The router's
 * job is just to show the matching section and hide the rest, then hand
 * that section to the view's mount(section, params) — which returns
 * { unmount } for cleanup (unsubscribing from the store, cancelling
 * in-flight fetches) when the user navigates away.
 */
(function () {
  var routes = [];
  var currentUnmount = null;
  var notFoundEl = document.getElementById('view-not-found');

  function allViewEls() {
    return document.querySelectorAll('.view');
  }

  /** pattern examples: '/', '/rocket/:id' */
  function register(pattern, sectionId, view) {
    var paramNames = [];
    var regexStr = pattern.replace(/\/:([^/]+)/g, function (_, name) {
      paramNames.push(name);
      return '/([^/]+)';
    });
    var regex = new RegExp('^' + regexStr + '$');
    routes.push({ regex: regex, paramNames: paramNames, sectionId: sectionId, view: view });
  }

  function parseHash() {
    var hash = window.location.hash || '#/';
    hash = hash.replace(/^#/, '');
    if (hash.charAt(0) !== '/') hash = '/' + hash;
    return hash;
  }

  function resolve() {
    var path = parseHash();
    for (var i = 0; i < routes.length; i++) {
      var route = routes[i];
      var match = path.match(route.regex);
      if (match) {
        var params = {};
        route.paramNames.forEach(function (name, idx) {
          params[name] = decodeURIComponent(match[idx + 1]);
        });
        return { route: route, params: params };
      }
    }
    return null;
  }

  function render() {
    if (typeof currentUnmount === 'function') {
      try {
        currentUnmount();
      } catch (e) {
        console.error('Error while unmounting previous view', e);
      }
      currentUnmount = null;
    }

    allViewEls().forEach(function (el) {
      el.hidden = true;
    });

    var matched = resolve();
    if (!matched) {
      notFoundEl.hidden = false;
      return;
    }

    var sectionEl = document.getElementById(matched.route.sectionId);
    sectionEl.hidden = false;

    var result = matched.route.view.mount(sectionEl, matched.params);
    if (result && typeof result.unmount === 'function') {
      currentUnmount = result.unmount;
    }
    window.scrollTo(0, 0);
  }

  function start() {
    window.addEventListener('hashchange', render);
    render();
  }

  function navigate(path) {
    window.location.hash = path;
  }

  window.Router = {
    register: register,
    start: start,
    navigate: navigate,
  };
})();
