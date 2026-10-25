(function () {
  Router.register('/', 'view-list', ListView);
  Router.register('/rocket/:id', 'view-detail', DetailView);
  Router.start();
})();
