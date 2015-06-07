define(['underscore', 'backbone', 'handlebars', 'util', 'text!template/appeal.tpl'], function (_, Backbone, Handlebars, util, template_source) {
  console.log('init...');

  var AppealView = Backbone.View.extend({
    template: null,
    _players: null,
    _good: 'unknown',

    events: {
      'change .appeal_track input': 'appealChanged'
    },

    initialize: function (opts) {
      this.template = Handlebars.compile(template_source);

      this._good = opts.good || 'unknown';
      this._players = opts.players || [];
    },

    render: function () {
      console.log('appeal:render');
      $(this.el).html(this.template(this));
    },

    getPlayer: function (color) {
      return _.find(this._players, function (p) { return p.color === color; });
    },

    appealChanged: function (event) {
      var $target = $(event.target)
        , $track = $target.parents('.appeal_track')
        , value = $target.val()
        , player = this.getPlayer($track.data('player'));

      console.log(this._good+':appeal:change:'+$track.data('player')+'='+value+' ('+$target.attr('id')+')');

      player.setAppeal(this._good, value);
    },

    good: function () {
      return util.ucfirst(this._good);
    },

    players: function () {
      var out = []
        , width = 12 / this._players.length
        , good = this._good;

      $.each(this._players, function (i, p) {
        
        var track = [];

        for (var i = 0; i < 20; i++) {
          track.push({ n: i + 1, selected: p.industry[good].appeal === i });
        }

        out.push({ width: width, name: p.color, color: p.color, appeal_track: track });

      });

      return out;
    },

  });

  return AppealView;
});
