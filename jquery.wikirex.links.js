/*

jquery.wikirex.wikilinks Plugin
Author: Rex Lo wikirexlo@gmail.com
Version: 1.1
Updated: 2013-7-19

Log:
Input type could be changed
*/


(function( $ ){
	//This plugin is for white label admin

	$.fn.wikilinks = function( method ) {
		var methods = $.fn.wikilinks.methods;
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}    
	
	};

	$.fn.wikilinks.defaults = {
		prefix: 'wikilinks_', 
		number: 3, 
		data: null, //$.parseJSON('[["1d","2d","3adf"],["4fa","5dfaf","6adfaf"]]')
		data_type: 'json', 
		unique_data: '', 
		add_enabled: true, 
		labels:['Title', 'Image', 'Link'], 
		types: ['text', 'text', 'text'], 
		option_labels: [], 
		option_values: [], 
		class: ['', '', ''], 
		preview: true, 
		on_preview: function($wrapper){}, 
		on_click: function($wrapper, $item, index){}, 
		on_add: function(){}, //this will be $wrapper
		loaded: function(event){}, 
		filter: 'input[type="text"], textarea, select'
	};


  $.fn.wikilinks.methods = {
	init : function( options ) { 
		var settings = $.extend({}, $.fn.wikilinks.defaults, options || {});

		return this.each(function(){
			var $container = $(this).addClass('wikilinks');
			$container.data('options', settings);

			$container.wikilinks('clear');

			if(typeof settings.data == 'undefined' || settings.data == '' || settings.data == null || settings.data.length == 0){
				$container.wikilinks('add', [], settings.on_add);
			}else{
				var data = settings.data;

				if(typeof data == 'string') data = $.parseJSON(data);

				for(var i = 0; i < data.length; i++){
					$container.wikilinks('add', data[i], settings.on_add);
				}

			}

			init_listeners();
			set_style();
			callback();


			//===========================================================
			function get_wrapper($item){
				return $container.find('.wikilinks_wrapper').has($item);
			}


			function init_listeners(){
				$container.delegate('.wikilinks_wrapper', 'click', function(){
					$container.find('.wikilinks_wrapper.selected').removeClass('selected');
					$(this).addClass('selected');
				});

				$container.delegate('input.add', 'click', function(event){
					$container.wikilinks('add', [], settings.on_add);
				});

				$container.delegate('input.delete', 'click', function(event){
					var wrapper_count = $container.children('div.wikilinks_wrapper').size();
					var $wrapper = get_wrapper($(this));

					if(wrapper_count > 1){
						$wrapper.remove();
					}else{
						clear_set($wrapper);
					}
				});

				$container.delegate('input.preview', 'click', preview);

				$container.delegate(settings.filter, 'click', function(event){
					var $this = $(this);
					var $wrapper = get_wrapper($this);
					var index = $wrapper.find(settings.filter).index(this);
					//console.log(index);

					if(typeof settings.on_click == 'function'){
						settings.on_click.call($container, $wrapper, $this, index); //First $menu is environment object
					}else{
						alert('The setting of callback function is not a valid function object');
					}
				});
			}

			function clear_set($wrapper){
				$wrapper.find(settings.filter).val('');
			}

			function callback(){
				//trigger callback function
				if(typeof settings.loaded == 'function'){
					settings.loaded.call($container); //First $menu is environment object
				}else{
					alert('The setting of callback function is not a valid function object');
				}
			}

			function set_style(){
				//Make items are sortable
				$container.sortable({
					placeholder: 'wikirex_links_placeholder'
				});
			}

			function preview(event){
				var $item = $(event.currentTarget);
				var $wrapper = get_wrapper($item);
				var url = $wrapper.find('.url').val();

				if(typeof settings.on_preview == 'function'){
					settings.on_preview.call($container, $wrapper); 
				}
			}
		});//End main loop
    },
	add: function(data_array, callback){
		var $c = $(this);
		var options = $c.data('options');

		var $wrapper = $('<div class="wikilinks_wrapper"><table width="100%"></table></div>').appendTo($c);
		var $table = $wrapper.children('table:first');

		for(var i = 0; i < options.number; i++){
			var value = '';
			if(typeof data_array == 'undefined' || data_array == null || data_array.length == 0){
				value = '';
			}else{
				value = data_array[i];
			}

			var $tr = $('<tr></tr>').appendTo($table);
			var $td_1 = $('<td class="wikilink_label">' + (typeof options.labels[i] == 'undefined' ? '' : options.labels[i]) + '</td>').appendTo($tr);
			var $td_2 = $('<td></td>').appendTo($tr);

			var type = options.types[i];
			if(typeof type == 'undefined' || type == null) type = 'text';
			var input_class = options.class[i];
			if(typeof input_class == 'undefined' || input_class == null) input_class = '';

			if(typeof value != 'undefined') value = value.replace(/\<br\/\>/g, '\n');
			if(type == 'text'){
				$td_2.append('<input type="text" id="wikilink_input" name="wikilink_input" value="' + value + '" class="' + input_class + '" />');
			}else if(type == 'textarea'){
				//console.log(value);
				//value = value.replace('"', '&quot;');
				$td_2.append('<textarea name="wikilink_input" class="' + input_class + '">' + value + '</textarea>');
			}else if(type == 'select'){
				var $select = $('<select name="wikilink_input"></select>').appendTo($td_2);
				var labels = options.option_labels[i];
				var option_values = options.option_values[i];
				for(var j = 0; j < labels.length; j++){
					var selected = '';
					if(option_values[j] == value) selected = 'selected';
					$select.append('<option value="' + option_values[j] + '" ' + selected + '>' + labels[j] + '</option>');
				}
			}
		}


		//Add buttons
		$tr = $('<tr><td class="wikilink_label"></td><td></td></tr>').appendTo($table);
		var $panel = $tr.children('td:eq(1)');
		$panel.append('<input type="button" class="add" value="  +  "/>');
		$panel.append('<input type="button" class="delete" value="  -  "/>');

		if(options.preview){
			$panel.append('<input type="button" class="preview" value="' + 'Preview' + '"/>');
		}

		if(options.unique_data != ''){
			$panel.append('<input type="hidden" name="unique" value="' + unique_data + '"/>');
		}

		if(options.add_enabled == false){
			$wrapper.find('input.add').hide();
			$wrapper.find('input.delete').hide();
		}

		if(typeof callback == 'function'){
			callback.call($wrapper[0]);
		}
	},
    clear : function() {
		$(this).children().remove();
    }, 
	get_data: function(){
		var $c = $(this);
		var options = $c.data('options');
		var json = '[';
		var data = [];
		var sep = '';

		$c.find('.wikilinks_wrapper').each(function(index){
			var $wrapper = $(this);
			var arr = []
			var field_count = 1;

			$wrapper.find(options.filter).each(function(index2){
				if(field_count > options.number) return false;
				arr.push($(this).val());
				field_count++;
			});

			data.push(arr);
		});
	
		//console.log(data);
		//console.log(JSON.stringify(data));
		return JSON.stringify(data);
	}
  };



})( jQuery );