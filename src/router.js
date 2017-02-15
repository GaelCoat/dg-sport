
module.exports = Marionette.AppRouter.extend({

  routes: {
    '': 'home',
    ':lang(/)': 'languageSelect',
    ':lang/:project': 'project',
  },

  home: function() {

    return this.setLang('en');
  },

  languageSelect: function(lang) {

    return this.setLang(lang);
  },

  project: function(lang, project) {

    console.log(project);
    return this;
  },

  setLang: function(lang) {

    var langs = ['fr', 'en', 'de', 'ita'];

    if (langs.indexOf(lang) === -1) return this.navigate('/', true);

    this.trigger('app:lang', lang);
    return this;
  },

  loadView: function(path, params) {

    this.trigger('view:load', path, params);
    return this;
  }
});
