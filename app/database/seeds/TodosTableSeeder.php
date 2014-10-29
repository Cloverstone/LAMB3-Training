<?php

class TodosTableSeeder extends Seeder {

	public function run()
	{
		// Uncomment the below to wipe the table clean before populating
		DB::table('todos')->truncate();

		$todos = array(
			array('completed'=>false, 'name'=>'Stuff', 'description'=>"Do all of the stuff", 'created_at' => new DateTime,'updated_at' => new DateTime),
			array('completed'=>true, 'name'=>'More', 'description'=>"Get More stuff Done", 'created_at' => new DateTime,'updated_at' => new DateTime),
		);

		// Uncomment the below to run the seeder
		DB::table('todos')->insert($todos);

	}

}