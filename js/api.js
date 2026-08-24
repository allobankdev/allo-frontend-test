/**
 * Thin wrapper around the Launch Library 2 API (v2.2.0).
 * https://thespacedevs.com/llapi
 *
 * Using the lldev.thespacedevs.com "dev" host during development, per the
 * assignment brief: it serves the same data as production but with a far
 * more generous rate limit (production throttles anonymous users quickly).
 */
(function () {
  var BASE_URL = 'https://lldev.thespacedevs.com/2.2.0';

  /**
   * Fetches all SpaceX rockets in a single request.
   * mode=detailed is required, otherwise description & co. are omitted.
   * limit=20 is required, otherwise the API paginates at 10 results.
   */
  function fetchRockets() {
    var url = BASE_URL + '/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20';
    return fetch(url).then(function (res) {
      if (!res.ok) {
        throw new Error('Request failed with status ' + res.status);
      }
      return res.json();
    }).then(function (data) {
      return Array.isArray(data.results) ? data.results : [];
    });
  }

  /** Fetches a single rocket by id (used as a fallback, e.g. on a direct/refresh visit to a detail URL). */
  function fetchRocketById(id) {
    var url = BASE_URL + '/config/launcher/' + encodeURIComponent(id) + '/';
    return fetch(url).then(function (res) {
      if (!res.ok) {
        throw new Error('Request failed with status ' + res.status);
      }
      return res.json();
    });
  }

  window.Api = {
    fetchRockets: fetchRockets,
    fetchRocketById: fetchRocketById,
  };
})();
