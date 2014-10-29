<?php

	/* Vender CDN's */
	/* bootstrap */
	Assets::add('font-awesome.min.css','//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/');
	Assets::add('bootstrap.min.css', '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/');
	Assets::add('bootstrap.min.js', '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/');
	/* jquery */
	Assets::add('jquery.min.js', '//ajax.googleapis.com/ajax/libs/jquery/2.0.3/');
	Assets::add('jquery-ui.min.js', '//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/');
	/* backbone */
	Assets::add('underscore-min.js', '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/');
	Assets::add('backbone-min.js', '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/');

	/* templating */
	Assets::add('hogan-3.0.1.js', 'http://twitter.github.com/hogan.js/builds/3.0.1/');

	/* Berry Stuff */
	Assets::add('berry.min.js');
	Assets::add('bootstrap.berry.js');

	Assets::add('backbone.berry.js');
	Assets::add('modal.berry.js');
	Assets::add('modal.mustache');


	/* App specific */
	Assets::add('routes.js');
	Assets::add('app.js');
	Assets::add('todo.mustache');
	Assets::add('todos.mustache');
	Assets::add('style.css');
?>