
module.exports = Marionette.AppRouter.extend({

  routes: {
    '': 'home',
    ':lang(/)': 'languageSelect',
    ':lang/:project': 'project',
  },

  lang: null,

  home: function() {

    this.trigger('router:home');
    return this.setLang('fr');
  },

  languageSelect: function(lang) {

    this.trigger('router:home');
    return this.setLang(lang);
  },

  project: function(lang, id) {

    var that = this;

    return q.fcall(function() {

      if (!that.lang) return that.setLang(lang);
      return that;
    })
    .then(function() {

      return that.loadProject(id);
    });
  },

  setLang: function(lang) {

    var langs = ['fr', 'en', 'de', 'ita'];

    if (langs.indexOf(lang) === -1) return this.navigate('/fr/', true);

    this.lang = lang;
    this.trigger('app:lang', lang);
    return this;
  },

  loadProject: function(id) {

    this.trigger('project:load', id);
    return this;
  }
});
