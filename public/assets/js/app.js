alert = function(value){ console.log(value); };

/* Render templates - abstract for different renderings*/
function render(template, data){
	if(typeof templates[template] === 'undefined'){
		templates[template] =  Hogan.compile($('#'+template).html());
	}
  return templates[template].render(data, templates);
}

/* Based on Marrionette  -  needs work, ignore for now*/
$(function(){

	contentManager = new RegionManager();
	sidebarManager = new RegionManager({el: '#sidebar'});

	var Workspace = Backbone.Router.extend({
		route: function(route, name, callback) {
			return Backbone.Router.prototype.route.call(this, route, name, function() {
				this.trigger('beforeRoute');
				if (!callback) callback = this[name];
				return callback.apply(this, arguments);
			});
		},
		initialize: function(options) {
			this.history = [];
			return this.on("beforeRoute", this.storeRoute);
		},
		storeRoute: function() {
			return this.history.push(Backbone.history.fragment);
		},
		previousFragment: function() {
			return this.history[this.history.length - 2];
		},
		changeAndStoreFragment: function(fragment) {
			this.navigate(fragment);
			return this.storeRoute();
		},
		previous: function(trigger) {
			if (this.history.length > 1) {
				if(typeof trigger === 'undefined') { trigger = true; }
				return this.navigate(this.history[this.history.length - 2], {trigger: trigger});
			}
		},
		routes: {
			":path(/:optional)(/:path2)(/:optional2)": "default",
			"": 'default'
		},
		default: function(path1, optional, path2, optional2) {
			var path = path1 || 'Apps';

			if(typeof routes[path] === 'undefined'){
				path = 'undefined';
			}
			if(typeof routes[path] !== 'undefined'){
				$('.logo i').addClass('fa-spin');
				$.ajax({
					url: '/assets/js/resource/' + routes[path].resource + '.js',
					//url: '/modules/assets/js/' + routes[path].resource + '/resource.js',
					dataType: "script",
					cache: true,
					success: function(){
						$('.logo i').removeClass('fa-spin');
						if(typeof routes[path] !== 'undefined'){
							var activeLink = $("[href='#/" + path + "']");
							var parent = activeLink.closest(".menu-item").find(".menu-item-parent").html();
							$('.sidebar-menu a').removeClass('active');
							activeLink.closest('a').addClass('active');
							if(typeof parent == 'undefined'){parent = path;}
							//$('.breadcrumb').html('<li><a href="#">I<i style="color: #83C018" class="fa fa-power-off"></i>N Dashboard</a></li><li>' + parent + '</li>').show();
							if(parent != path){
								$('.breadcrumb').append('<li>' + path + '</li>');
							}
							if(typeof path2 !== 'undefined' && path2 !== null){
								routes[path + '_' + path2].init(optional,optional2);
							}else{
								routes[path].init(optional);
							}

						}
					},error:function(){
						alert('Bad Response');
						$('.logo i').removeClass('fa-spin');
						if(typeof routes[path] !== 'undefined'){
							var activeLink = $("[href='#/" + path + "']");
							var parent = activeLink.closest(".menu-item").find(".menu-item-parent").html();
							$('.sidebar-menu a').removeClass('active');
							activeLink.closest('a').addClass('active');
							if(typeof parent == 'undefined'){parent = path;}
							//$('.breadcrumb').html('<li><a href="#">I<i style="color: #83C018" class="fa fa-power-off"></i>N Dashboard</a></li><li>' + parent + '</li>').show();
							if(parent != path){
								$('.breadcrumb').append('<li>' + path + '</li>');
							}
							if(typeof path2 !== 'undefined' && path2 !== null){
								routes[path + '_' + path2].init(optional,optional2);
							}else{
								routes[path].init(optional);
							}

						}
					}
				});
			}else{alert('Route Not Supported');}
		}
	});

	myrouter = new Workspace();
	Backbone.history.start();

	//Backbone.history.start({ pushState: true, root: '/', silent: window.silentRouter });
});

/* Tools */
RegionManager = function(defaults) {
	this.currentView = undefined;
	defaults = $.extend({el:"#content"}, defaults);
	var el = defaults.el;

	var closeView = function (view) {
		for(var i in Berry.instances){
			Berry.instances[i].destroy();
		}
		if (view && view.close) {
			view.close();
		}
	};

	var openView = function (view) {
		view.render();
		$(el).html(view.el);
		if (view.onShow) {
			view.onShow();
		}
		$('html, body').animate({ scrollTop: 0 }, 'fast');
		$(el).find('.tooltips').tooltip();
    $(el).find('.popovers').popover();
	};

	this.show = function (view) {

		closeView(this.currentView);
		if(view){
			this.currentView = view;
			openView(this.currentView);
		}else{
			this.currentView = undefined;
		}
		
	};
};
/* End Based on Marrionette*/

/*extends Backbone view prototype*/
$(function() {
	Backbone.View.prototype.close = function() {
		this.remove();
		this.unbind();
		if (this.onClose){
			this.onClose();
		}
		if(this.berry){
			this.berry.destroy();
		}
	};
	Backbone.View.prototype.form = function(options) {
		options = options || {target: this.formTarget};
		this.berry = $(this.formTarget || options.target).berry($.extend({model: this.model, legend: this.legend, fields: this.fields }, options));
		return this.berry;
	};
	Backbone.View.prototype.destroy = function(e) {
		e.stopPropagation();
		this.$el.fadeOut('fast', $.proxy(function() {
			this.model.destroy();
			this.remove();
		}, this));
	};
});