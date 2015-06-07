<h1>{{good}}</h1>
<div class="subnav btn-group">
{{#subnav}}
  <a href="{{url}}" role="button" class="btn btn-default {{#if current}}active{{/if}}">{{ name }}</a>
{{/subnav}}
</div>
<h2>Appeal</h2>
<div class="row">
{{#players}}
  <div class="col-xs-{{width}}">
    <h4 class="player_{{color}} player">{{name}}</h4>
    <ul class="appeal_track {{color}}" data-player="{{color}}">
{{#appeal_track}}
      <li>
        <input type="radio" name="{{ name }}" id="{{id}}" value="{{n}}" {{#if selected}}checked="checked"{{/if}}/>
        <div class="info">
          <label for="{{id}}">{{n}}</label>
          <span class="fa fa-lg fa-square cube player_{{../color}}"></span>
        </div>
      </li>
{{/appeal_track}}
    </ul>
  </div>
{{/players}}
</div>
