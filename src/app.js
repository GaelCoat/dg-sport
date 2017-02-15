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

    return this;
  },

  setLang: function(lang) {

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

  load: function(params) {

    console.log('LOAD', params);
  },
});
