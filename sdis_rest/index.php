<?php
    require_once 'restler_minified/restler.php';

    #set autoloader
    #do not use spl_autoload_register with out parameter
    #it will disable the autoloading of formats
    spl_autoload_register('spl_autoload');

    $r = new Restler();
    $r->addAPIClass('Room');
    $r->handle();
?>