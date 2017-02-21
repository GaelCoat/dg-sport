var isMobile = require('../libs/isMobile');
var Projects = require('../projects');

module.exports = Backbone.View.extend({

  events: {},

  lang: 'fr',

  initialize: function(params) {

    this.lang = params.lang;
    this.tpl = _.template($('#tpl-projects').html());
  },

  renderProjects: function() {

    var that = this;
    var els = [];

    _.each(Projects, function(project) {

      var tpl = _.template($('#tpl-projects-each').html());
      els.push(tpl({ project: project, isMobile: isMobile, lang: that.lang }));
    });

    return els;
  },

  dispatch: function(els) {

    var that = this;

    var split = _.partition(els, function(el, id) { return id % 2; });

    this.$el.find('.col.left-col').append(split[1]);
    this.$el.find('.col.right-col').append(split[0]);

    return that;
  },

  render: function() {

    var that = this;

    return q.fcall(function() {

      that.$el.html(that.tpl({
        lang: that.lang,
        isMobile: isMobile
      }));

      return that.renderProjects();
    })
    .then(that.dispatch.bind(that))
    .catch(function(err) {

      console.log(err);
    })

  },

});

