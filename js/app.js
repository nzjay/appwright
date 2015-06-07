require.config({
  baseUrl: 'js/',

  paths: {
    jquery: "//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min",
    backbone: "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.1/backbone-min",
    underscore: "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
    handlebars: "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.min",
    bootstrap: "//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min",
    text: "vendor/requirejs/text",
    template: "../template",
  },

  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone',
    },
    backbone: {
      exports: '_',
    },
    bootstrap: {
      deps: ['jquery'],
    }
  }
});

require(['jquery', 'underscore', 'backbone', 'handlebars', 'bootstrap', 'model/player', 'view/appeal', 'view/demand'], function ($, _, Backbone, Handlebars, Bootstrap, PlayerModel, AppealView, DemandView) {
  var pages = $('#pages')
    , colors = ['black', 'red', 'blue', 'green', 'yellow']
    , players = []
    , views = { 'demand': {}, 'appeal': {} }
    , goods = ['bread', 'clothes', 'cutlery', 'lamps']
    , goods_data = $.map(goods, function (g) {
        return { name: g[0].toUpperCase() + (g.length > 1 ? g.slice(1) : ''), link_name: g };
    });

  window.GameState = {
    players: players
  };

  var data = {
    blue: {
      bread: { appeal: 13, capacity: 2 },
      clothes: { appeal: 0, capacity: 2 }
    },
    red: {
      bread: { appeal: 10, capacity: 7 },
      clothes: { appeal: 12, capacity: 2 }
    },
    green: {
      bread: { appeal: 15, capacity: 6 },
      clothes: { appeal: 1, capacity: 2 }
    },
    yellow: {
      bread: { appeal: 6, capacity: 7 },
      clothes: { appeal: 14, capacity: 2 }
    },
    black: {
      clothes: { appeal: 3 }
    }
  };

  // Game data setup
  $.each(colors, function (i, color) {

    var p = PlayerModel(color, data[color]);

    players.push(p);

  });

  // App setup
  var layout = Handlebars.compile($('#layout').html())({ goods: goods_data });

  // Create pages per good
  $.each(goods, function (i, good) {
    var appeal_id = 'appeal_' + good
      , demand_id = 'demand_' + good;

    // create appeal page
    var appeal_page = $('<li class="page">').attr('id', appeal_id).html(layout)
      , appeal_view = new AppealView({ el: appeal_page.find('.content'), good: good, players: players });

    // create demand page
    var demand_page = $('<li class="page">').attr('id', demand_id).html(layout)
      , demand_view = new DemandView({ el: demand_page.find('.content'), good: good, players: players });

    views.appeal[good] = appeal_view;
    views.demand[good] = demand_view;

    appeal_view.render();
    demand_view.render();

    pages.append(appeal_page);
    pages.append(demand_page);
  });

  function show(page, industry) {
    $('#pages > li').removeClass('active')
      .filter(page)
      .addClass('active');

    $('#pages > li .btn-group.nav .btn').removeClass('active')
      .filter(function (i, e) { return $(e).data('industry') == industry; })
      .addClass('active');
  }

  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      ":good/appeal": "appeal",
      ":good/demand": "demand"
    },

    index: function () {
    },

    appeal: function (good) {

      show("#appeal_" + good, good);
    },

    demand: function (good) {
      show('#demand_' + good, good);
    }
  });

  // Setup events
  $.each(players, function (i, p) {
    $.each(goods, function (j, g) {
      var name = g+':appeal';

      p.on(name, function (event) {
        views.demand[g].render();
      });
    });
  });

  var router = new Router;
  Backbone.history.start();

  if (! window.location.hash) {
    window.location.hash = 'bread/appeal';
  }
});
