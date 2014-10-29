routes = {
	'undefined': {
		init: function() {
			myTodos = new todosCollection();
			myTodos.fetch( { success: function() {
				contentManager.show( new todosView() );
			}});
		},
		resource: 'todos'
	},

};