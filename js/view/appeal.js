define(['underscore', 'backbone', 'handlebars', 'util', 'text!template/appeal.tpl'], function (_, Backbone, Handlebars, util, template_source) {
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

      player.setAppeal(this._good, value);
    },

    subnav: function () {
      var base = '#' + this._good;
      return [{ url: base+'/appeal', name: 'appeal' }, { url: base+'/demand', name: 'demand' }];
    },

    good: function () {
      return util.ucfirst(this._good);
    },

    players: function () {
      var out = []
        , width = Math.floor(12 / this._players.length)
        , gap = 12 % this._players.length
        , good = this._good;

      $.each(this._players, function (i, p) {
        
        var track = [];

        for (var i = 0; i <= 20; i++) {
          var cell = {
            n: i,
            selected: p.industry[good].appeal === i,
            id: good + '_' + p.color + '_appeal_' + i,
            name: 'appeal['+good+']['+p.color+']'
          };

          track.push(cell);
        }

        out.push({ width: width, name: p.color, color: p.color, appeal_track: track });

      });

      out[out.length-1].width += gap;

      return out;
    },

  });

  return AppealView;
});
