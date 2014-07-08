wikilinks
=========

A jQuery plugin to create multiple input fields.

Required files:
-----

```html
<link rel="stylesheet" href="jquery.wikirex.links.css">

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="jquery.wikirex.links.js"></script>
```

Example:
-----

```js
$(document).ready(function(){
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
