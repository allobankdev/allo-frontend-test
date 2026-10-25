/**
 * Minimal pub/sub state store.
 *
 * Holds the list of rockets (fetched from the API, plus any added locally),
 * the current request status (idle/loading/success/error), the active
 * filter text, and the current page. Views subscribe to be notified
 * whenever state changes, and unsubscribe on unmount to avoid leaks.
 */
(function () {
  var listeners = [];
  var PAGE_SIZE = 10;

  var state = {
    rockets: [],
    status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
    error: null,
    filter: '',
    hasFetchedOnce: false,
    page: 1,
    pageSize: PAGE_SIZE,
  };

  function getState() {
    return state;
  }

  function subscribe(fn) {
    listeners.push(fn);
    return function unsubscribe() {
      var idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }

  function notify() {
    listeners.forEach(function (fn) {
      fn(state);
    });
  }

  function setLoading() {
    state.status = 'loading';
    state.error = null;
    notify();
  }

  function setSuccess(rockets) {
    var localOnly = state.rockets.filter(function (r) {
      return r.isLocal;
    });
    state.rockets = localOnly.concat(rockets);
    state.status = 'success';
    state.error = null;
    state.hasFetchedOnce = true;
    state.page = 1;
    notify();
  }

  function setError(message) {
    state.status = 'error';
    state.error = message;
    notify();
  }

  function setFilter(text) {
    state.filter = text;
    state.page = 1;
    notify();
  }

  function setPage(page) {
    state.page = page;
    notify();
  }

  function getFilteredRockets() {
    var q = state.filter.trim().toLowerCase();
    if (!q) return state.rockets;
    return state.rockets.filter(function (r) {
      var name = (r.full_name || r.name || '').toLowerCase();
      var desc = (r.description || '').toLowerCase();
      return name.indexOf(q) !== -1 || desc.indexOf(q) !== -1;
    });
  }

  /** Slices the filtered list down to the current page. */
  function getPaginatedRockets() {
    var filtered = getFilteredRockets();
    var totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    if (state.page < 1) state.page = 1;
    var start = (state.page - 1) * state.pageSize;
    var items = filtered.slice(start, start + state.pageSize);
    return {
      items: items,
      currentPage: state.page,
      totalPages: totalPages,
      totalItems: filtered.length,
    };
  }

  /**
   * Adds a rocket that only exists client-side (the API is read-only per
   * the assignment). Shaped to match the fields the API returns so the
   * list/detail views can render it identically.
   */
  function addLocalRocket(input) {
    var newRocket = {
      id: 'local-' + Date.now(),
      isLocal: true,
      full_name: input.full_name,
      description: input.description || null,
      image_url: input.image_url || null,
      launch_cost: input.launch_cost || null,
      maiden_flight: input.maiden_flight || null,
      manufacturer: { country_code: input.country_code || null },
    };
    state.rockets = [newRocket].concat(state.rockets);
    state.page = 1;
    notify();
    return newRocket;
  }

  function findRocketById(id) {
    return state.rockets.filter(function (r) {
      return String(r.id) === String(id);
    })[0];
  }

  window.Store = {
    getState: getState,
    subscribe: subscribe,
    setLoading: setLoading,
    setSuccess: setSuccess,
    setError: setError,
    setFilter: setFilter,
    setPage: setPage,
    getFilteredRockets: getFilteredRockets,
    getPaginatedRockets: getPaginatedRockets,
    addLocalRocket: addLocalRocket,
    findRocketById: findRocketById,
  };
})();
