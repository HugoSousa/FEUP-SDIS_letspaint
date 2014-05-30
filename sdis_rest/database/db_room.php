<?php
/**
 * SQLite DB. All data is stored in data_pdo_sqlite.sq3 file
 * This file will be automatically created when missing
 * Make sure this folder has sufficient write permission 
 * for this page to create the file.
 */
class DB_Room
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
        $stmt = $this->db->query('SELECT * FROM room');

        return $stmt->fetchAll();
    }

    function getByName($name)
    {
        $stmt = $this->db->query("SELECT * FROM room WHERE name = '" . mysql_escape_string($name) . "'");

        return $stmt->fetch();
    }

    function getById($id)
    {
        $stmt = $this->db->query("SELECT * FROM room WHERE id = " . $id );

        return $stmt->fetch();
    }

    function insert ($request_data)
    {
        $name = $request_data['name'];

        $sql = "INSERT INTO room (id, name) VALUES (NULL, ?)";
        $stmt = $this->db->prepare($sql);

        if(! $stmt->execute(array($name))){
            return false;
        }
        
        return $this->getByName($name);
    }

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
}