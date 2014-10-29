<?php

class TodoController extends BaseController {

  /**
   * Display the specified resource.
   * GET /apps/{id}
   *
   * @param  int  $id
   * @return Response
   */
  public function index()
  {
    return Todo::orderBy('completed', 'ASC')->get();
  }

  	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
    return ToDo::find($id);
	}


  /**
   * Store a newly created resource in storage.
   *
   * @return Response
   */
  public function store()
  {
    $todo = new Todo();
    $post_data= Input::all();
    $todo->fill( $post_data );
    $todo->save();
    return $todo;
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  int  $id
   * @return Response
   */
  public function update($id)
  {
    $todo = Todo::find($id);
    $post_data= Input::all();
    $todo->fill( $post_data );
    $todo->save();
    return $todo;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return Response
   */
  public function destroy($id)
  {   
    $todo = Todo::find($id);
    $todo->delete();
    return $todo;
  }

}
