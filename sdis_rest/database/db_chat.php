<?php
/**
 * SQLite DB. All data is stored in data_pdo_sqlite.sq3 file
 * This file will be automatically created when missing
 * Make sure this folder has sufficient write permission 
 * for this page to create the file.
 */
class DB_Chat
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
        $stmt = $this->db->query('SELECT room.id, user.name, chat.time, chat.message FROM chat, user, room WHERE chat.id_room = room.id AND chat.id_user = user.id ORDER BY chat.time');

        return $stmt->fetchAll();
    }

    function getByRoom($room_id, $time_start, $time_end)
    {
    	if(is_null($time_start) && is_null($time_end)){
            $stmt = $this->db->prepare('SELECT room.id, user.name, chat.time, chat.message FROM chat, user, room WHERE chat.id_room = ? 
            	AND chat.id_room = room.id AND chat.id_user = user.id ORDER BY chat.time');
            if(! $stmt->execute(array($room_id)))
                return false;
        }
        else if(is_null($time_start) && (! is_null($time_end))){
            $stmt = $this->db->prepare('SELECT room.id, user.name, chat.time, chat.message FROM chat, user, room WHERE chat.id_room = room.id AND chat.id_user = user.id AND chat.id_room = ? AND chat.time <= ? ORDER BY chat.time');
            if(! $stmt->execute(array($room_id, $time_end)))
                return false;
        }
        else if((! is_null()) && is_null($time_end)){
            $stmt = $this->db->prepare('SELECT room.id, user.name, chat.time, chat.message FROM chat, user, room WHERE chat.id_room = room.id AND chat.id_user = user.id AND chat.id_room = ? AND chat.time > ? ORDER BY chat.time');
            if(! $stmt->execute(array($room_id, $time_start)))
                return false;
        }
        else{
            $stmt = $this->db->prepare('SELECT room.id, user.name, chat.time, chat.message FROM chat, user, room WHERE chat.id_room = room.id AND chat.id_user = user.id AND chat.id_room = ? AND chat.time > ? AND chat.time <= ? ORDER BY chat.time');
            if(! $stmt->execute(array($room_id, $time_start, $time_end)))
                return false;
        }

        return $stmt->fetchAll();
    }
    
    function getById($chat_id){
    	$stmt = $this->db->prepare('SELECT room.id, user.name, chat.time, chat.message FROM chat, user, room WHERE chat.id = ? AND chat.id_room = room.id AND chat.id_user = user.id');

    	if(! $stmt->execute(array($chat_id)))
                return false;

        return $stmt->fetch();
    }

    function insert ($request_data)
    {
        $user_id = $request_data['user_id'];
        $room_id = $request_data['room_id'];
        $message = $request_data['message'];

        $sql = "INSERT INTO chat (message, id_room, id_user) VALUES (?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(1, $message, PDO::PARAM_STR);
        $stmt->bindValue(2, $room_id, PDO::PARAM_INT);
        $stmt->bindValue(3, $user_id, PDO::PARAM_INT);

        if(! $stmt->execute())
            return false;

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