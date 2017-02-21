var hope = require('../libs/appear');
var isMobile = require('../libs/isMobile');
var Parallax = require('./parallax');
var Section = require('./section');
var Works = require('./projects');
var Lang = require('../lang');
var Project = require('./project');
var Projects = require('../projects');

module.exports = Marionette.View.extend({

  sections: [],

  events: {
    'click a:not([regular])': 'handleRedirect',
    'click header .drop-lang': 'showLangSelect',
    'click header .scrollTo': 'scrollTo',
    'click': 'hideLangSelect',
  },

  lang: null,
  currentProject: null,

  initialize: function(params) {

    this.lang = App.lang;
    this.$el.find('header .drop-lang > span').text(this.lang);
  },

  //-------------------------------------
  // Soft Redirect
  //-------------------------------------
  handleRedirect: function(e) {

    var href = $(e.currentTarget).attr('href');
    var protocol = this.protocol + '//';

    if (href.slice(protocol.length) !== protocol) {
      e.preventDefault();
      this.trigger('redirect', href)
    }

    return this;
  },

  //-------------------------------------
  // Basic anchor
  //-------------------------------------
  scrollTo: function(e) {

    var section = this.$el.find(e.currentTarget).data('section');
    $('html, body').animate( { scrollTop: $('#'+section).offset().top }, 750 );
    return this;
  },

  //-------------------------------------
  // Mobile TabBar Work-Around
  //-------------------------------------
  setSizes: function() {

    var that = this;

    this.$el.find('.setSize').each(function() {

      $(this).height($(this).height());
    });

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

    if (isMobile) return this;

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
  // Render unique project
  //-------------------------------------
  renderProject: function(id) {

    this.$el.addClass('modal-open');
    this.$el.find('article#project').empty();

    this.currentProject = new Project({
      model: Projects[id],
      lang: this.lang,
      el: this.$el.find('article#project')
    });

    return this.currentProject.render();
  },

  unloadProject: function() {

    if (this.currentProject) this.currentProject.unload();
    return this;
  },

  //-------------------------------------
  // Render each section with current Language
  //-------------------------------------
  renderSections: function() {

    var that = this;

    var promises = [];

    this.$el.find('section').each(function() {

      $('body').scrollTop(0);

      var defer = q.defer();
      var $this = $(this);

      q.fcall(function() {

        if ($this.attr('id') === 'projects') {

          var view = new Works({
            el: $this,
            id: $this.attr('id'),
            lang: that.lang,
          });

        } else {

          var view = new Section({
            el: $this,
            id: $this.attr('id'),
            lang: Lang[that.lang],
          });

        }

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

    if (isMobile) this.$el.addClass('mobile');

    return q.fcall(that.renderSections.bind(that))
    .all()
    .then(that.preloadAll.bind(that))
    .all()
    .then(function() {

      if (isMobile) that.setSizes();

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


