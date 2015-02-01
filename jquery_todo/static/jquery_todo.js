(function(){
	var $todoForm = $('#todoForm');
	var $todoInput = $('#todoInput');
	var $todoList = $('#todoList');
	$todoForm.submit(function(e) {
		/* Act on the event */
		e.preventDefault();
		var input_value = $todoInput.val();
		$todoList.append('<li>' + input_value +'&nbsp;<a href="#" class="todoDelete">x</a></li>');
		$todoInput.val("");
	});
	$todoList.on('click', '.todoDelete', function(event) {
		event.preventDefault();
		$(this).parent().remove();
		/* Act on the event */
	});

})();