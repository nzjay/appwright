define(['underscore', 'backbone', 'handlebars', 'util', 'text!template/demand.tpl'], function (_, Backbone, Handlebars, util, template_source) {

  var DOMESTIC_INITIAL = 10
    , DOMESTIC_MAX = 20
    , INITIAL_DOMESTIC = { 'bread': 10, 'clothes': 9, 'cutlery': 8, 'lamps': 7 }
    , MAX_DOMESTIC = {'bread': 20, 'clothes': 19, 'cutlery': 18, 'lamps': 17 }
    , CAPACITY_MAX = 25; // max production (bread? 2+3+3+2?) + max storage (10 warehouse + 5 small warehouse) = ~25ish. no one will ever sell this many anyway... the maximum demand track is 20

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
      p1_appeal = p1.industry[good].appeal;
      p2_appeal = p2.industry[good].appeal;

      if (p1_appeal === p2_appeal) {
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
      return p1_appeal > p2_appeal ? -1 : 1;
    };
  }

  var DemandView = Backbone.View.extend({
    template: null,
    _good: 'unknown',
    ordering: null,

    events: {
      'change .domestic': 'changeDomestic',
      'change .capacity': 'changeCapacity',
    },

    initialize: function (opts) {
      this.template = Handlebars.compile(template_source);
      this._good = opts.good || 'unknown';
      this._players = opts.players || [];
      this.domestic_demand = opts.domestic || INITIAL_DOMESTIC[opts.good] || DOMESTIC_INITIAL;
      this.ordering = appealOrdering(opts.good);
    },

    changeDomestic: function (event) {
      var $target = $(event.target);

      this.domestic_demand = $target.val();

      this.render();
    },

    changeCapacity: function (event) {
      var $target = $(event.target)
        , target_industry = $target.data('industry')
        , target_player = _.find(this._players, function (p) { return p.color == $target.data('player') });

      target_player.industry[target_industry].capacity = $target.val();

      this.render();
    },

    render: function () {
      $(this.el).html(this.template(this));
    },

    subnav: function () {
      var base = '#' + this._good;
      return [{ url: base+'/appeal', name: 'appeal' }, { url: base+'/demand', name: 'demand' }];
    },

    domestic: function () {
      var max = MAX_DOMESTIC[this._good] || DOMESTIC_MAX
        , out = {
        name: 'domestic_' + this._good,
        value: this.domestic_demand,
        range: []
      };

      for (var i = 1; i < max; i++) {
        out.range.push({ value: i, selected: out.value == i });
      }

      return out;
    },

    good: function () {
      return util.ucfirst(this._good);
    },

    order: function () {
      return _.map(this.getOrderedPlayers(), function (p) { return { color: p.color }; });
    },

    getOrderedPlayers: function () {
      return this._players.sort(this.ordering);
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
          , capacity = p.industry[good].capacity
          , max = Math.min(appeal, domestic_demand);

        distribution[p.color] = 0;
        ranges[p.color] = { max: max, min: Math.max(max - capacity, 0) };
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

            distribution[p.color] += 1;
          }

        });
      }

      // of the players that received demand, who starts the earliest/finishes the latest?
      var participating = _.pick(ranges, function (r, i) { return distribution[i] > 0; })
        , starts = _.map(participating, function (r) { return r.max; })
        , ends = _.map(participating, function (r, i) { return r.max - distribution[i] })
        , earliest_start = Math.max.apply(null, starts.concat([0]))
        , latest_finish = Math.min.apply(null, ends.concat(this.domestic_demand));

      // fill in the player's demand share data
      $.each(players, function (i, p) {
        var start = ranges[p.color].max
          , count = distribution[p.color]
          , diff = earliest_start - start;

        out.push({
          color: p.color,
          industry: good,
          importer: isImporter(p),
          width: width,
          appeal: p.industry[good].appeal,
          capacity: view._capacity_range(p.industry[good].capacity),
          share: distribution[p.color] || 0,
          demand_track: view._demand_track(start, count, earliest_start, latest_finish)
        });

      });

      out[out.length-1].width += gap;

      return out;
    },

    _capacity_range: function (capacity) {
      var range = [];

      for (var i = 0; i < CAPACITY_MAX; i++) {
        range.push({ selected: i == capacity, value: i });
      }

      return range;
    },

    _demand_track: function (start, count, track_start, track_end) {
      var track = []
        , end = start - count;

      for (var i = track_start; i > track_end; i--) {
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
