<?php
require("database/db_gallery.php");

class Gallery {
	public $dp;

	function __construct(){
		$this->dp = new DB_Gallery();
	}

	function get($user_id=NULL) {

		if(is_null($user_id))
			return $this->dp->getAll();
		
		return $this->dp->getByUser($user_id);
	}
		
	function post($request_data=NULL) {
		return $this->dp->insert($request_data);
	}
}