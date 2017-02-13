
module.exports = Backbone.View.extend({

  events: {},

  lang: 'fr',

  initialize: function(params) {

    this.lang = params.lang[this.id];
  },

  getTpl: function() {

    this.tpl = _.template($('#tpl-'+this.id).html());
    return this;
  },

  render: function() {

    var that = this;

    return q.fcall(that.getTpl.bind(that))
    .then(function() {

      that.$el.html(that.tpl({
        lang: that.lang
      }));
      return that;
    });
  },

});

