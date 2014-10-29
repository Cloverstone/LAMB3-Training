<?php
class Todo extends Eloquent{
	protected $fillable = array('name', 'description', 'completed');
}
