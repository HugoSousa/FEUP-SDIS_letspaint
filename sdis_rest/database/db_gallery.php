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
        $stmt = $this->db->query('SELECT gallery.url, gallery.id_user, gallery.time, user.name FROM gallery, user WHERE gallery.id_user = user.id');

        return $stmt->fetchAll();
    }

    function getByUser($user_id)
    {
        $stmt = $this->db->query("SELECT gallery.url, gallery.id_user FROM gallery, user WHERE gallery.id_user = '" . mysql_escape_string($user_id) . "' AND gallery.id_user = user.id ORDER BY gallery.url");

        return $stmt->fetchAll();
    }

    function getByUrl($url)
    {
        $stmt = $this->db->query("SELECT gallery.url, gallery.id_user FROM gallery WHERE gallery.url = '" . mysql_escape_string($url) . "'");

        return $stmt->fetch();
    }

    function insert ($request_data)
    {
        $user_id = $request_data['user_id'];
        $url = $request_data['url'];

        $data = substr($url, strpos($url, ",") + 1);
        $decodedData = base64_decode($data);

        //buscar id do utilizador que gravou a imagem a $_SESSION
        $now = new DateTime();
        $filename = $user_id . $now->format("Ymdhis").".png";
        $directory = "images//" . $filename;
        $fp = fopen($directory, 'wb');
        fwrite($fp, $decodedData);
        fclose($fp);
        //echo $filename;

        
        $sql = "INSERT INTO gallery (url, id_user) VALUES (?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(1, $filename, PDO::PARAM_STR);
        $stmt->bindValue(2, $user_id, PDO::PARAM_INT);

        if(! $stmt->execute())
            return false;

        return $this->getByUrl($filename);
        
    }

}