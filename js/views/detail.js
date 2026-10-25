/**
 * Rocket detail screen.
 * The static skeleton lives in index.html; this view just fills fields in
 * and swaps in a loading/error panel when needed.
 */
(function () {
  function formatText(value, fallback) {
    return value === null || value === undefined || value === '' ? fallback : value;
  }

  function formatCurrency(value) {
    if (value === null || value === undefined || value === '') return 'N/A';
    var num = Number(value);
    if (isNaN(num)) return String(value);
    return '$' + num.toLocaleString();
  }

  function formatDate(value) {
    if (!value) return 'N/A';
    var d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function initialLetter(name) {
    var trimmed = (name || '?').trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
  }

  function mount(section, params) {
    var id = params.id;
    var cancelled = false;

    var backLink = section.querySelector('.back-link');
    var detailCard = section.querySelector('.detail');
    var img = section.querySelector('#detail-image');
    var placeholder = section.querySelector('#detail-placeholder');
    var nameEl = section.querySelector('#detail-name');
    var descEl = section.querySelector('#detail-description');
    var costEl = section.querySelector('#detail-cost');
    var countryEl = section.querySelector('#detail-country');
    var firstFlightEl = section.querySelector('#detail-first-flight');

    var panelEl = null; // lazily-created loading/error panel, inserted after the back link

    function clearPanel() {
      if (panelEl) {
        panelEl.remove();
        panelEl = null;
      }
    }

    function showPanel(tplId) {
      detailCard.hidden = true;
      clearPanel();
      var tpl = document.getElementById(tplId);
      panelEl = tpl.content.firstElementChild.cloneNode(true);
      backLink.insertAdjacentElement('afterend', panelEl);
      return panelEl;
    }

    function showDetail(rocket) {
      clearPanel();
      detailCard.hidden = false;

      var name = formatText(rocket.full_name || rocket.name, 'Unnamed rocket');
      nameEl.textContent = name;
      descEl.textContent = formatText(rocket.description, 'No description available.');
      costEl.textContent = formatCurrency(rocket.launch_cost);
      countryEl.textContent = formatText(rocket.manufacturer && rocket.manufacturer.country_code, 'N/A');
      firstFlightEl.textContent = formatDate(rocket.maiden_flight);

      img.removeAttribute('src');
      img.hidden = true;
      placeholder.hidden = true;

      if (rocket.image_url) {
        img.src = rocket.image_url;
        img.alt = name;
        img.hidden = false;
        img.onerror = function () {
          img.hidden = true;
          placeholder.hidden = false;
          placeholder.textContent = initialLetter(name);
        };
      } else {
        placeholder.hidden = false;
        placeholder.textContent = initialLetter(name);
      }
    }

    function loadFromApi() {
      var panel = showPanel('tpl-state-loading');
      Api.fetchRocketById(id)
        .then(function (rocket) {
          if (cancelled) return;
          showDetail(rocket);
        })
        .catch(function (err) {
          if (cancelled) return;
          var errPanel = showPanel('tpl-state-error');
          errPanel.querySelector('.panel__error').textContent =
            'Something went wrong' + (err.message ? ': ' + err.message : '') + '.';
          errPanel.querySelector('.js-retry').addEventListener('click', loadFromApi);
        });
    }

    function render() {
      var cached = Store.findRocketById(id);
      if (cached) {
        showDetail(cached);
        return;
      }
      if (String(id).indexOf('local-') === 0) {
        // Locally-added rockets only live in memory; a full page refresh
        // straight into this URL has no API record to fall back to.
        var panel = showPanel('tpl-state-error');
        panel.querySelector('.panel__error').textContent =
          'This rocket was added locally and is no longer available after a refresh.';
        panel.querySelector('.js-retry').remove();
        return;
      }
      loadFromApi();
    }

    render();

    function unmount() {
      cancelled = true;
      img.onerror = null;
      clearPanel();
    }

    return { unmount: unmount };
  }

  window.DetailView = { mount: mount };
})();
