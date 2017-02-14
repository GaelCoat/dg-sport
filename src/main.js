var hope = require('./libs/appear');
var Parallax = require('./views/parallax');
var Section = require('./views/section');
var Lang = require('./lang')

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
  escape: /\{\{\-(.+?)\}\}/g,
  evaluate: /\<\%(.+?)\%\>/gim
};


var Main = Backbone.View.extend({

  sections: [],

  events: {
    'click header .lang': 'showLangSelect',
    'click header .scrollTo': 'scrollTo',
    'click': 'hideLangSelect',
  },

  nat: 'eng',

  initialize: function(params) {

  },

  scrollTo: function(e) {

    var section = this.$el.find(e.currentTarget).data('section');
    $('html, body').animate( { scrollTop: $('#'+section).offset().top }, 750 );
    return this;
  },

  //-------------------------------------
  // Scroll Handle
  //-------------------------------------
  scroll: _.throttle(function(e) {

    Backbone.trigger('window:scroll', e);
  }, 20),

  //-------------------------------------
  // Show Language Dropdown
  //-------------------------------------
  showLangSelect: function(e) {

    e.stopPropagation();
    this.$el.find(e.currentTarget).toggleClass('open');
    return this;
  },

  //-------------------------------------
  // Hide Language Dropdown
  //-------------------------------------
  hideLangSelect: function(e) {

    this.$el.find('header .lang').removeClass('open');
    return this;
  },

  //-------------------------------------
  // OnScroll Parallax
  //-------------------------------------
  initParallax: function() {

    var that = this;

    this.$el.find('.parallax').each(function() {

      var $this = $(this);
      var view = new Parallax({
        el: $this,
        force: $this.data('force'),
        type: $this.data('type')
      });
      view.render();
    });

    return this;
  },

  //-------------------------------------
  // Appear
  //-------------------------------------
  initAppears: function() {

    var that = this;

    // Apparitions
    $('section').appear();
    $('section').on('appear', function(event, $els) { $els.addClass('ready'); });
    $('section').on('disappear', function(event, $els) { $els.removeClass('ready'); });

    return this;
  },

  //-------------------------------------
  // Detect Language
  //-------------------------------------
  getLang: function() {

    var lang =  window.location.pathname.slice(1);
    if (lang.length === 0) return this;

    var langs = ['fr', 'en', 'de', 'ita'];

    if (langs.indexOf(lang) === -1) {

      window.history.replaceState(null, 'eng', '/eng');
      this.nat = 'eng';
    } else this.nat = lang;

    this.$el.find('header .lang span').text(this.nat);

    return this;
  },

  //-------------------------------------
  // Render each section with current Language
  //-------------------------------------
  renderSections: function() {

    var that = this;

    var promises = [];

    this.$el.find('section').each(function() {

      var defer = q.defer();
      var $this = $(this);

      q.fcall(function() {

        var view = new Section({
          el: $this,
          id: $this.attr('id'),
          lang: Lang[that.nat],
        });

        return view.render();
      })
      .then(defer.resolve)

      promises.push(defer.promise);
    });

    return promises;
  },

  // ------------------------------------------------
  // Preload all pictures, return percentage
  // ------------------------------------------------
  preloadAll: function() {

    var that = this;
    var ready = [];

    var total = this.$el.find('.preload').length;
    var percent = 0;

    this.$el.find('.preload').each(function(i) {


      var defer = q.defer();

      var $this = $(this);
      var url = $this.data('src');
      var img = new Image();
      img.src = url;
      img.onload = function() {

        percent += 100/total;

        that.$el.find('.loader .percent').css('height', percent+'%');

        if ($this.hasClass('to-bg')) $this.css('background-image', 'url('+url+')');
        else $this.attr('src', url);

        $this.removeClass('preload');
        defer.resolve(url);
      };

      ready.push(defer.promise);
    });

    return ready;
  },

  render: function() {

    var that = this;

    $(window).scroll(this.scroll.bind(this));
    $(window).resize(function() {

      Backbone.trigger('window:resize');
    });

    return q.fcall(that.getLang.bind(that))
    .then(that.renderSections.bind(that))
    .all()
    .then(that.preloadAll.bind(that))
    .all()
    .then(function() {

      return [
        that.initAppears(),
        that.initParallax()
      ]
    })
    .delay(600)
    .then(function() {

      that.$el.find('.loader').fadeOut(400);
      return that;
    })
    .delay(1000)
    .then(function() {

      that.$el.removeClass('loading');
      that.$el.find('#home').addClass('ready');
      return that;
    });

  },

});

var View = new Main({el: $('body')});
View.render();

