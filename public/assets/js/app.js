alert = function(value){ console.log(value); };
function render(template, data){
	if(typeof templates[template] === 'undefined'){
		templates[template] =  Hogan.compile($('#'+template).html());
	}
  return templates[template].render(data, templates);
}

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

$(function() {
	Backbone.View.prototype.close = function() {
		this.remove();
		this.unbind();
		if (this.onClose){
			this.onClose();
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
	Backbone.Model.prototype.alert = function(keys) {
		$.gritter.add(
			$.extend(
				{title: 'Success!', text: 'Successfully updated' + this.model.attributes['name'], timeout: 3000, color: "#5F895F", icon: "fa fa-user"},
				(this.alert || {})
			)
		);
	};
	Backbone.Model.prototype.fields = function(keys) {
		return containsKey(this.schema,keys);
	};
	Backbone.View.prototype.autoElement = function(options) {
		options = $.extend({append: true}, options);
		this.setElement(render(this.template, this.model.attributes ));
		this.model.on('change', $.proxy(function() {
			// var temp = this.$el;
			// this.setElement(ich[this.template]( this.model.attributes ));
			// temp.replaceWith(this.$el);
			this.$el.replaceWith(this.setElement(render(this.template, this.model.attributes )).$el);
			this.render()
			this.editing = false;
		}), this);
		if(options.append !== false){
			$(this.target).append(this.$el);
		}
	};
	Backbone.View.prototype.autoAdd = function(options) {
		this.collection.on('add', $.proxy(function(){ contentManager.show( new this.constructor({ collection: this.collection }))}, this) );
	};


	Backbone.ItemView = Backbone.View.extend({
		initialize: function() {
			this.autoElement();
		},
		edit: function(e) {
			e.stopPropagation();
			this.form();
		}
	});

	Backbone.ListView = Backbone.View.extend({
		add: function() {
			$().berry({context: this, legend: this.legend, model: new this.collection.model(), fields: this.fields}).on('completed', function(){
				if(this.closeAction === 'save'){
					this.options.context.collection.add(this.options.model);
					new this.options.context.modelView({'model': this.options.model});
				}
			});
		},
		onShow: function() {
			_.each(this.collection.models, function(model) {
				new this.modelView({'model': model});
			}, this);
		},
		initialize: function() {
			this.fields = this.fields || this.modelView.prototype.fields;
			this.setElement(render(this.template, this.collection ));
		},
	});

});