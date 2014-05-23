<?php
/**
 * SQLite DB. All data is stored in data_pdo_sqlite.sq3 file
 * This file will be automatically created when missing
 * Make sure this folder has sufficient write permission 
 * for this page to create the file.
 */
class DB_Gallery
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
        $stmt = $this->db->query('SELECT * FROM gallery');

        return $stmt->fetchAll();
    }

    function getByUser($user_id)
    {
        $stmt = $this->db->query("SELECT gallery.url, gallery.id_user FROM gallery, user WHERE gallery.id_user = '" . mysql_escape_string($user_id) . "' AND gallery.id_user = user.id");

        return $stmt->fetchAll();
    }

    function insert ($request_data)
    {
        $user_id = $request_data['user_id'];
        $url = $request_data['url'];

        $sql = "INSERT INTO gallery (url, id_user) VALUES (?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(1, $url, PDO::PARAM_STR);
        $stmt->bindValue(2, $user_id, PDO::PARAM_INT);

        if(! $stmt->execute())
            return false;

        return $this->getByUser($user_id);
    }

}