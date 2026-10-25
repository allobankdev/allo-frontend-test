/**
 * Rocket list screen.
 * Markup for the shell (filter input, add button, content/pagination
 * containers) already lives in index.html; this view fills it in using
 * the <template> elements also defined there, and attaches behavior.
 */
(function () {
  function formatText(value, fallback) {
    return value === null || value === undefined || value === '' ? fallback : value;
  }

  function truncate(text, maxLen) {
    if (!text) return text;
    return text.length > maxLen ? text.slice(0, maxLen).trim() + '\u2026' : text;
  }

  function initialLetter(name) {
    var trimmed = (name || '?').trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
  }

  function buildCard(rocket) {
    var tpl = document.getElementById('tpl-rocket-card');
    var node = tpl.content.firstElementChild.cloneNode(true);

    var name = formatText(rocket.full_name || rocket.name, 'Unnamed rocket');
    var description = formatText(rocket.description, 'No description available.');

    node.setAttribute('data-id', rocket.id);
    node.setAttribute('aria-label', 'View details for ' + name);
    node.querySelector('.card__name').textContent = name;
    node.querySelector('.card__description').textContent = truncate(description, 110);

    var img = node.querySelector('.card__image');
    var placeholder = node.querySelector('.placeholder');
    if (rocket.image_url) {
      img.src = rocket.image_url;
      img.alt = name;
      img.hidden = false;
      img.addEventListener('error', function () {
        img.hidden = true;
        placeholder.hidden = false;
        placeholder.textContent = initialLetter(name);
      });
    } else {
      placeholder.hidden = false;
      placeholder.textContent = initialLetter(name);
    }

    function goToDetail() {
      Router.navigate('/rocket/' + encodeURIComponent(rocket.id));
    }
    node.addEventListener('click', goToDetail);
    node.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToDetail();
      }
    });

    return node;
  }

  function mount(section, params) {
    var filterInput = section.querySelector('#filter-input');
    var addBtn = section.querySelector('#add-rocket-btn');
    var contentEl = section.querySelector('#list-content');
    var paginationEl = section.querySelector('#pagination');

    var modal = document.getElementById('add-rocket-modal');
    var form = document.getElementById('add-rocket-form');
    var cancelBtn = document.getElementById('cancel-add-btn');

    filterInput.value = Store.getState().filter;

    function renderPagination(paginated) {
      paginationEl.innerHTML = '';
      if (paginated.totalPages <= 1) return;

      function makeBtn(label, page, opts) {
        opts = opts || {};
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = label;
        if (opts.active) btn.classList.add('is-active');
        if (opts.disabled) btn.disabled = true;
        btn.addEventListener('click', function () {
          Store.setPage(page);
        });
        return btn;
      }

      paginationEl.appendChild(makeBtn('Prev', paginated.currentPage - 1, { disabled: paginated.currentPage === 1 }));
      for (var p = 1; p <= paginated.totalPages; p++) {
        paginationEl.appendChild(makeBtn(String(p), p, { active: p === paginated.currentPage }));
      }
      paginationEl.appendChild(
        makeBtn('Next', paginated.currentPage + 1, { disabled: paginated.currentPage === paginated.totalPages })
      );
    }

    function renderContent(state) {
      contentEl.innerHTML = '';
      paginationEl.innerHTML = '';

      if (state.status === 'loading') {
        var loadingTpl = document.getElementById('tpl-state-loading');
        contentEl.appendChild(loadingTpl.content.cloneNode(true));
        return;
      }

      if (state.status === 'error') {
        var errorTpl = document.getElementById('tpl-state-error');
        var errorNode = errorTpl.content.cloneNode(true);
        errorNode.querySelector('.panel__error').textContent =
          'Something went wrong' + (state.error ? ': ' + state.error : '') + '.';
        errorNode.querySelector('.js-retry').addEventListener('click', loadRockets);
        contentEl.appendChild(errorNode);
        return;
      }

      var paginated = Store.getPaginatedRockets();
      if (paginated.totalItems === 0) {
        var emptyTpl = document.getElementById('tpl-state-empty');
        contentEl.appendChild(emptyTpl.content.cloneNode(true));
        return;
      }

      var grid = document.createElement('div');
      grid.className = 'grid';
      paginated.items.forEach(function (rocket) {
        grid.appendChild(buildCard(rocket));
      });
      contentEl.appendChild(grid);
      renderPagination(paginated);
    }

    function loadRockets() {
      Store.setLoading();
      Api.fetchRockets()
        .then(function (rockets) {
          Store.setSuccess(rockets);
        })
        .catch(function (err) {
          Store.setError(err.message);
        });
    }

    var unsubscribe = Store.subscribe(renderContent);
    renderContent(Store.getState());

    if (Store.getState().status === 'idle') {
      loadRockets();
    }

    var filterTimeout = null;
    function onFilterInput(e) {
      var value = e.target.value;
      clearTimeout(filterTimeout);
      filterTimeout = setTimeout(function () {
        Store.setFilter(value);
      }, 150);
    }
    filterInput.addEventListener('input', onFilterInput);

    function openModal() {
      modal.classList.remove('hidden');
      var firstField = form.querySelector('input[name="full_name"]');
      if (firstField) firstField.focus();
    }
    function closeModal() {
      modal.classList.add('hidden');
      form.reset();
    }
    function onFormSubmit(e) {
      e.preventDefault();
      var formData = new FormData(form);
      var name = (formData.get('full_name') || '').toString().trim();
      if (!name) return;
      Store.addLocalRocket({
        full_name: name,
        description: (formData.get('description') || '').toString().trim() || null,
        image_url: (formData.get('image_url') || '').toString().trim() || null,
        launch_cost: (formData.get('launch_cost') || '').toString().trim() || null,
        country_code: (formData.get('country_code') || '').toString().trim() || null,
        maiden_flight: (formData.get('maiden_flight') || '').toString().trim() || null,
      });
      closeModal();
    }
    function onOverlayClick(e) {
      if (e.target === modal) closeModal();
    }
    function onKeydown(e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    }

    addBtn.addEventListener('click', openModal);
    cancelBtn.addEventListener('click', closeModal);
    form.addEventListener('submit', onFormSubmit);
    modal.addEventListener('click', onOverlayClick);
    document.addEventListener('keydown', onKeydown);

    function unmount() {
      unsubscribe();
      clearTimeout(filterTimeout);
      filterInput.removeEventListener('input', onFilterInput);
      addBtn.removeEventListener('click', openModal);
      cancelBtn.removeEventListener('click', closeModal);
      form.removeEventListener('submit', onFormSubmit);
      modal.removeEventListener('click', onOverlayClick);
      document.removeEventListener('keydown', onKeydown);
      modal.classList.add('hidden');
    }

    return { unmount: unmount };
  }

  window.ListView = { mount: mount };
})();
