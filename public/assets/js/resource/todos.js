todoModel = Backbone.Model.extend({
	schema: {
		Name: {required: true},
		Description: {type: 'textarea'},
		Completed: {type: 'checkbox'},
	},
	urlRoot: '/todos'
});

todosCollection = Backbone.Collection.extend({
		model: todoModel,
		url: '/todos',
});

todosView = Backbone.View.extend({
	events: {
		'click .add': 'add'
	},
	add: function() {
		this.form({ model: new todoModel(), legend: '<i class="fa fa-check-square-o"></i> Add Todo'}).on('completed', function(){
			if(this.closeAction === 'save'){
				this.options.model.save();
				myTodos.add(this.options.model);
				new todoView({model: this.options.model});
			}
		});
	},
	template: 'todos' ,
	onShow: function() {
		_.each(myTodos.models,function(model) {
			new todoView({'model': model});
		});
		$('.quick').berry({fields: {Name: {label: false, required: true} } }).on('save', function(){
			if(this.validate()){
				var model = new todoModel({name: this.toJSON().name, description: ''});
				model.save();
				myTodos.add(model);
				this.fields.name.setValue('');
				new todoView({model: model});
			}else{
				this.fields.name.focus();
			}
		})
	},
	render: function() {
		this.setElement(render(this.template, myTodos ));
	},
});

todoView = Backbone.View.extend({
	events: {
		'click .delete': 'destroy',
		'click': 'edit',
		'click .completed': 'toggle'
	},
	toggle: function(e) {
		e.stopPropagation();
		this.model.save({completed: !this.model.attributes.completed},{wait: true, patch: true});
	},
	edit: function(e) {
		e.stopPropagation();
		$().berry({model: this.model, fields: ['Name', 'Description'], legend: '<i class="fa fa-check-square-o"></i> Edit Todo'});
	},
	template: 'todo',
	target: '.todo-list',
	initialize: function() {
		this.setElement(render(this.template, this.model.attributes ));
		this.model.on('change', $.proxy(function() {
			this.$el.replaceWith(this.setElement(render(this.template, this.model.attributes )).$el);
			this.render()
			this.editing = false;
		}), this);
		$(this.target).append(this.$el);
	}
});