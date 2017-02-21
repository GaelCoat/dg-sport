var isMobile = require('../libs/isMobile');
var Projects = require('../projects');

module.exports = Backbone.View.extend({

  events: {},

  lang: 'fr',

  initialize: function(params) {

    this.lang = params.lang;
    this.tpl = _.template($('#tpl-project').html());

    console.log(params);
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

    return q.fcall(function() {

      that.$el.html(that.tpl({
        lang: that.lang,
        isMobile: isMobile,
        project: that.model
      }));

      return that;
    })
    .then(function() {

      that.renderOthers();
      that.$el.show(0).addClass('ready');
      return that;
    });
  },

  unload: function() {

    var that = this;

    this.$el.fadeOut(400, function() {

      that.$el.removeClass('ready');
      that.$el.empty();
      $('body').removeClass('modal-open')
    });
  },

});

