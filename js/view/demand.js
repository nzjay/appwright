define(['underscore', 'backbone', 'handlebars', 'util', 'text!template/demand.tpl'], function (_, Backbone, Handlebars, util, template_source) {
  console.log('init...');
  function isImporter(player) {
    return player.color == 'black';
  }

  function getImporter(good, appeal) {
    var importer = { color: 'black', industry: {} }
    importer.industry[good] = { appeal: appeal, capacity: Number.POSITIVE_INFINITY };

    return importer;
  }

  function appealOrdering(good) {
    return function (p1, p2) {
      p1Appeal = p1.industry[good].appeal;
      p2Appeal = p2.industry[good].appeal;

      if (p1Appeal === p2Appeal) {
        // importer always comes last in a tie
        if (isImporter(p1)) {
          return 1;
        } else if (isImporter(p2)) {
          return -1;
        }

        // FIXME tie break, factory base + quality level
        return 0;
      }

      // highest appeal comes first
      return p1Appeal > p2Appeal ? -1 : 1;
    };
  }

  var DemandView = Backbone.View.extend({
    template: null,
    _good: 'unknown',
    ordering: null,

    initialize: function (opts) {
      this.template = Handlebars.compile(template_source);
      this._good = opts.good || 'unknown';
      this._players = opts.players || [];
      this.domestic_demand = 20;
      this.ordering = appealOrdering(opts.good);
    },

    render: function () {
      console.log('demand:render');
      $(this.el).html(this.template(this));
    },

    good: function () {
      return util.ucfirst(this._good);
    },

    order: function () {
      return _.map(this.getOrderedPlayers(), function (p) { return { color: p.color }; });
    },

    getOrderedPlayers: function () {
      var importer = getImporter(this._good, 6)
        , players = [importer].concat(this._players)
        , order = players.sort(this.ordering);

      return order;
    },

    players: function () {
      var out = []
        , view = this
        , good = this._good
        , players = this.getOrderedPlayers()
        , domestic_demand = this.domestic_demand
        , ranges = {}
        , distribution = {}
        , width = Math.floor(12 / players.length)
        , gap = 12 % players.length;

      $.each(players, function (i, p) {
        var appeal = p.industry[good].appeal
          , capacity = p.industry[good].capacity;

        ranges[p.color] = { max: appeal, min: Math.max(appeal - capacity, 0) };
      });

      var used = 0;
      // run down the appeal track, assigning demand share
      for (var i = domestic_demand; i > 0 && used <= domestic_demand; i--) {

        // consider players in order, assign share to any player with appeal above the threshhold and capacity to fill
        $.each(players, function (j, p) {

          var range = ranges[p.color]
            , inRange = i <= range.max && i > range.min
            , demandAvailable = used < domestic_demand;

          // if everything is good, increase the player's demand share
          if (inRange && demandAvailable) {
            used++;

            distribution[p.color] = (distribution[p.color] || 0) + 1
          }

        });
      }

      $.each(players, function (i, p) {
        out.push({
          color: p.color,
          width: width,
          appeal: p.industry[good].appeal,
          capacity: p.industry[good].capacity,
          share: distribution[p.color],
          demand_track: view._demand_track(ranges[p.color].max, distribution[p.color])
        });

      });

      out[out.length-1].width += gap;

      return out;
    },

    _demand_track: function (start, count) {
      var track = []
        , end = start - count;

      for (var i = this.domestic_demand; i > 0; i--) {
        var cell = { taken: false };

        if (start >= i && end < i) {
          cell.taken = true;
        }

        track.push(cell);
      };

      return track;
    }
  });

  return DemandView;
});
