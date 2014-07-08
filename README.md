wikilinks
=========

A jQuery plugin to create multiple input fields.

Required files:
-----

```html
<link rel="stylesheet" href="jquery.wikirex.links.css">

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="http://code.jquery.com/ui/1.11.0/jquery-ui.js"></script>

<script src="jquery.wikirex.links.js"></script>
```

Example:
-----

```js
$(document).ready(function(){
  var data = '[["Title 1","Value 1"],["Title 2","Value 2"]]';
  data = $.parseJSON(data);
  
  $('#banners').wikilinks({
      number: 2, 
      data: data, //JSON object
      class: ['', 'photo'], 
      on_add: added_callback
  });
});

function added_callback(){
  var $wrap = $(this);
}
```

```html
<div id="banners"></div>
```
