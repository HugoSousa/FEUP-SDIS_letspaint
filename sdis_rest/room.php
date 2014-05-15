<?php
require("database/db_room.php");

class Room {
	public $dp;

	static $FIELDS = array('name');

	function __construct(){
		$this->dp = new DB_Room();
	}

	function get($name=NULL) {

		if(is_null($name))
			return $this->dp->getAll();

		return $this->dp->getByName($name);
	}
	
	function post($request_data=NULL) {
		return $this->dp->insert($request_data);
	}
	function delete($id=NULL) {
		return $this->dp->delete($id);
	}

	/*
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