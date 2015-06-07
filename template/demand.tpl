<h1>{{good}}</h1>
<ul class="subnav">
{{#subnav}}
  <li><a href="{{url}}" {{#if current}}class="current"{{/if}}>{{ name }}</a></li>
{{/subnav}}
</ul>
<h2>Demand</h2>
<p>Maximum domestic demand: {{domestic_demand}}</p>
<h3>Order</h3>
<ul>
{{#order}}
  <li class='player_{{ color }}'>{{ color }}</li>
{{/order}}
</ul>

<h3>Distribution</h3>
<div class="row">
{{#players}}
  <div class="col-xs-{{width}}">
    <h4 class="player_{{color}}">player: {{name}}</h4>
    <p>Appeal: {{appeal}}</p>
    <p>Capacity: {{capacity}}</p>
    <p>Share: {{share}}</p>
    <ul class="demand_track {{color}}" data-player="{{color}}">
{{#demand_track}}
{{#if taken}}
      <li>taken</li>
{{else}}
      <li>free</li>
{{/if}}
{{/demand_track}}
    </ul>
  </div>
{{/players}}
</div>
