
module.exports = Backbone.View.extend({

  events: {},

  windowHeight: $(window).height(),
  firstTop: null,

  force: null,

  type: 'translate',

  initialize: function(params) {

    this.listenTo(Backbone, 'window:scroll', this.scroll.bind(this));
    this.force = params.force;
    this.firstTop = this.$el.offset().top;

    this.type = params.type;
  },

  //-------------------------------------
  // Scroll Handle
  //-------------------------------------
  scroll: function(e) {

    var pos = $(e.currentTarget).scrollTop();
    var top = this.$el.offset().top;
    var height = this.$el.outerHeight();

    if (top + height < pos || top > pos + this.windowHeight) return this;

    return this[this.type](pos);
  },

  translate: function(pos) {

    this.$el.css({
      '-webkit-transform': 'translate3d(0px,'+Math.round((this.firstTop - pos) * this.force) +'px, 0px)',
      'transform': 'translate3d(0px,'+Math.round((this.firstTop - pos) * this.force) +'px, 0px)'
    });

    return this;
  },

  margin: function(pos) {

    return this;
  },

  render: function() {

    var that = this;
    return this;
  },

});

