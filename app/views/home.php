<?PHP include 'includes.php';?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>My ToDo App</title>
	<?=Assets::styles();?>
</head>
<body>
	<div class="container">
	<h2>My Todo List</h2><hr>
		<div class="row" id="content"></div>
	</div>
	<?=Assets::scripts();?>
	<?=Assets::templates();?>
</body>
</html>
