<?php
/**
 * SQLite DB. All data is stored in data_pdo_sqlite.sq3 file
 * This file will be automatically created when missing
 * Make sure this folder has sufficient write permission 
 * for this page to create the file.
 */
class DB_User
{
    private $db;
    function __construct ()
    {
        $file = dirname(__FILE__) . '/paint.db';
        $db_found = file_exists($file);
        $this->db = new PDO('sqlite:' . $file);
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        /*
        if (! $db_found)
            $this->install();
            */
    }

    
    function getAll ()
    {
        $stmt = $this->db->query('SELECT * FROM user');

        return $stmt->fetchAll();
    }

    function getByName($name)
    {
        $stmt = $this->db->query("SELECT * FROM user WHERE name = '" . mysql_escape_string($name) . "'");

        return $stmt->fetch();
    }

    function getByRoomName($roomName)
    {
        $stmt = $this->db->query("SELECT user.id, user.name, user.id_room FROM user, room WHERE room.name = '" . mysql_escape_string($roomName) . "' AND user.id_room = room.id");

        return $stmt->fetchAll();
    }
    
    function getById($id)
    {
        $stmt = $this->db->query("SELECT user.id, user.name, user.id_room FROM user WHERE id = '" . mysql_escape_string($id) . "'");

        return $stmt->fetch();
    }
    
    function insert ($request_data)
    {
        $name = $request_data['name'];
        $password = $request_data['password'];

        $sql = "INSERT INTO user (id_room, name, password) VALUES (NULL, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(1, $name, PDO::PARAM_STR);
        $stmt->bindValue(2, $password, PDO::PARAM_STR);

        if(! $stmt->execute())
            return false;

        return $this->getByName($name);
    }


     function update ($request_data)
    {
        $id_user = $request_data['user'];
        $id_room = $request_data['room'];

        $sql = "UPDATE user SET id_room = ? WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(1, $id_room, PDO::PARAM_STR);
        $stmt->bindValue(2, $id_user, PDO::PARAM_STR);

        if(! $stmt->execute())
            return false;

        return $this->getById($id_user);
    }
    /*
    function delete ($id)
    {
        $deleted = $this->getById($id);

        $sql = "DELETE FROM room WHERE id = ?";
        $stmt = $this->db->prepare($sql);

        if(! $stmt->execute(array($id))){
            return false;
        }
        return $deleted;
    }
    */
}