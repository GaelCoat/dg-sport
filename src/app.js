var Router = require('./router');
var Layout = require('./views/layout')

module.exports = Marionette.Application.extend({

  region: 'body',

  router: null,
  layout: null,

  lang: null,

  onStart: function() {

    this.router = new Router();
    this.router.on('app:lang', this.setLang.bind(this));
    this.router.on('router:home', this.unloadProject.bind(this));
    this.router.on('project:load', this.loadProject.bind(this));

    return this;
  },

  setLang: function(lang) {

    if (this.layout) return this;

    this.lang = lang;

    this.layout = new Layout({
      el: this.region
    });

    this.layout.render();

    this.listenTo(this.layout, 'redirect', this.cleanRedirect.bind(this))
    return this;
  },

  cleanRedirect: function(url) {

    this.router.navigate(url, true);
    return this;
  },

  loadProject: function(id) {

    this.layout.renderProject(id);
    return this;
  },

  unloadProject: function() {

    if (this.layout) this.layout.unloadProject();
    return this;
  },
});
