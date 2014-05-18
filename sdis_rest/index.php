<?php
    require_once 'restler_minified/restler.php';
    //require_once 'restler_minified/jsonpformat.php';

    #set autoloader
    #do not use spl_autoload_register with out parameter
    #it will disable the autoloading of formats
    spl_autoload_register('spl_autoload');

    $r = new Restler();
    $r->setSupportedFormats('JsonFormat', 'JsonpFormat');
    $r->addAPIClass('Room');
    $r->addAPIClass('User');
    $r->addAPIClass('Paint');
    $r->handle();
?>