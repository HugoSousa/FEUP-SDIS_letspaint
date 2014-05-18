<?php
require("database/db_paint.php");

class Paint {
	public $dp;

	//static $FIELDS = array('name');

	function __construct(){
		$this->dp = new DB_Paint();
	}

	function get($room=NULL, $time_start=NULL, $time_end=NULL) {
		/*
		if(is_null($roomName))
			return $this->dp->getAll();
		*/
		return $this->dp->get($room, $time_start, $time_end);
	}
	
	
	function post($request_data=NULL) {
		return $this->dp->insert($request_data);
	}
	/*
	function put($request_data=NULL) {
		return $this->dp->update($request_data);
	}
	
	
	function delete($id=NULL) {
		return $this->dp->delete($id);
	}

	private function _validate($data){
		$room=array();
		foreach (Author::$FIELDS as $field) {
			//you may also vaildate the data here
			if(!isset($data[$field]))
				throw new RestException(417,"$field missing");
			$room[$field]=$data[$field];
		}
		return $room;
	}
	*/
}