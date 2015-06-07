<h1>{{good}}</h1>
<div class="subnav btn-group">
{{#subnav}}
  <a href="{{url}}" role="button" class="btn btn-default {{#if current}}active{{/if}}">{{ name }}</a>
{{/subnav}}
</div>
<h2>Demand</h2>
{{#domestic}}
<form class="form">
<div class="form-group">
  <label class="control-label">Maximum domestic demand</label>
  <div class="">
    <select class='domestic form-control' name="{{name}}">
{{#range}}
      <option value="{{ value }}" {{#if selected}}selected="selected"{{/if}}>{{ value }}</option>
{{/range}}
    </select>
  </div>
</div>
</form>
{{/domestic}}
<h3>Order</h3>
<ul class="player_order">
{{#order}}
  <li><span class="who player_{{ color }}">{{ color }}</span><span class="fa fa-arrow-right"></span></li>
{{/order}}
</ul>

<h3>Distribution</h3>
<div class="row">
{{#players}}
  <div class="col-xs-{{width}}">
    <h4 class="player_{{color}}">{{color}}</h4>
    <p>Appeal: {{appeal}}</p>
{{#if importer}}
    <p class='importer'>Importer</p>
{{else}}
    <p>Capacity:
      <select class="capacity" data-player="{{ color }}" data-industry="{{ industry }}" name="{{color}}_capacity">
      {{#capacity}}
        <option value="{{value}}" {{#if selected}}selected="selected"{{/if}}>{{ value }}</option>
      {{/capacity}}
      </select>
    </p>
{{/if}}
    <p>Share: {{share}}</p>
  </div>
{{/players}}
</div>
<div class="row">
{{#players}}
  <div class="col-xs-{{width}}">
    <ul class="demand_track {{color}}" data-player="{{color}}">
{{#demand_track}}
{{#if taken}}
      <li class='cube'><span class='fa fa-lg fa-square'></span></li>
{{else}}
      <li class='regret'><span class='fa fa-lg fa-circle-thin'></span></li>
{{/if}}
{{/demand_track}}
    </ul>
  </div>
{{/players}}
  </div>
</div>
