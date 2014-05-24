<?php
    require_once 'restler_minified/restler.php';
    //require_once 'restler_minified/jsonpformat.php';
    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }

    #set autoloader
    #do not use spl_autoload_register with out parameter
    #it will disable the autoloading of formats
    spl_autoload_register('spl_autoload');

    $r = new Restler();
    $r->setSupportedFormats('JsonFormat', 'JsonpFormat');
    $r->addAPIClass('Room');
    $r->addAPIClass('User');
    $r->addAPIClass('Paint');
    $r->addAPIClass('Gallery');
    $r->addAPIClass('Chat');
    $r->handle();
?>