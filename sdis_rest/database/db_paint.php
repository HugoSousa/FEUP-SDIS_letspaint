<?php
/**
 * SQLite DB. All data is stored in data_pdo_sqlite.sq3 file
 * This file will be automatically created when missing
 * Make sure this folder has sufficient write permission 
 * for this page to create the file.
 */
class DB_Paint
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

    
    function get($room, $time_start, $time_end)
    {
        if(is_null($time_start) && is_null($time_end)){
            $stmt = $this->db->prepare('SELECT * FROM paint WHERE id_room = ? ORDER BY time');
            if(! $stmt->execute(array($room)))
                return false;
        }
        else if(is_null($time_start) && (! is_null($time_end))){
            $stmt = $this->db->prepare('SELECT * FROM paint WHERE id_room = ? AND time <= ? ORDER BY time');
            if(! $stmt->execute(array($room, $time_end)))
                return false;
        }
        else if((! is_null()) && is_null($time_end)){
            $stmt = $this->db->prepare('SELECT * FROM paint WHERE id_room = ? AND time > ? ORDER BY time');
            if(! $stmt->execute(array($room, $time_start)))
                return false;
        }
        else{
            $stmt = $this->db->prepare('SELECT * FROM paint WHERE id_room = ? AND time > ? AND time <= ? ORDER BY time');
            if(! $stmt->execute(array($room, $time_start, $time_end)))
                return false;
        }

        return $stmt->fetchAll();
    }
    /*
    function getByName($name)
    {
        $stmt = $this->db->query("SELECT user.id, user.name, user.id_room FROM user WHERE name = '" . mysql_escape_string($name) . "'");

        return $stmt->fetch();
    }

    function getByRoomName($roomName)
    {
        $stmt = $this->db->query("SELECT user.id, user.name, user.id_room FROM user, room WHERE room.name = '" . mysql_escape_string($roomName) . "' AND user.id_room = room.id");

        return $stmt->fetchAll();
    }
    */
    function getById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM paint WHERE id = ?");
       
        if(!$stmt->execute(array($id)))
            return false;

        return $stmt->fetch();
    }
    
    function insert ($request_data)
    {
        $id_room = $request_data['room'];
        $type = $request_data['type'];
        $line_width = $request_data['line_width'];
        $pos_x = $request_data['pos_x'];
        $pos_y = $request_data['pos_y'];
        $color = $request_data['color'];
        $line_id = $request_data['line_id'];
        $width = $request_data['width'];
        $height = $request_data['height'];
        $text = $request_data['text'];

        $sql = "INSERT INTO paint (id_room, type, line_id, line_width, pos_x, pos_y, color, width, height, text) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);

        if(! $stmt->execute(array($id_room, $type, $line_id, $line_width, $pos_x, $pos_y, $color, $width, $height, $text))){
            return false;  
        }
       
        return $this->getById($this->db->lastInsertId());
    }

    /*
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
    */
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