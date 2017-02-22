var isMobile = require('../libs/isMobile');
var Projects = require('../projects');

module.exports = Backbone.View.extend({

  events: {},

  lang: 'fr',

  initialize: function(params) {

    this.lang = params.lang;
    this.tpl = _.template($('#tpl-project').html());
  },

  renderOthers: function() {

    var that = this;

    var els = [];

    var others = _.reject(Projects, function(item) {

      return item === that.model;
    });

    var selected = others.slice(0, 3);

    _.each(selected, function(other) {

      var tpl = _.template($('#tpl-project-other').html());
      var el = tpl({ other: other, lang: that.lang });
      var el = $(el);
      el.find('.cover').css('background-image', 'url('+other.preview+')');
      els.push(el);
    });

    this.$el.find('ul.others').append(els);

    return this;
  },

  render: function() {

    var that = this;

    this.$el.hide(0).removeClass('ready');

    return q.fcall(function() {

      var hope = $(that.tpl({
        lang: that.lang,
        isMobile: isMobile,
        project: that.model
      }));

      that.$el = hope;
      console.log(that.$el);

      $('#projects-holder').append(that.$el);

      return that;
    })
    .then(function() {

      that.renderOthers();
      that.$el.show(0).addClass('ready');
      return that;
    });
  },

  unload: function(fake) {

    var that = this;

    if (fake) return this.remove();

    this.$el.fadeOut(400, function() {

      that.remove();
      $('body').removeClass('modal-open')
    });
  },

});

