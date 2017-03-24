<?php
// mysql example

define('DB_HOSTNAME','localhost'); // database host name
define('DB_USERNAME', 'username');     // database user name
define('DB_PASSWORD', 'password'); // database password
define('DB_NAME', 'northwind'); // database name 

function getDatabaseHandle(){
    $dsn = 'mysql:host='.DB_HOSTNAME.';dbname='.DB_NAME;
    $options = array(
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
    ); 
    $dbh = new PDO($dsn, DB_USERNAME, DB_PASSWORD, $options);
    return $dbh;
}
//check every column name
function isValidColumn($dataIndx){
    if (preg_match('/^[a-z,A-Z]*$/', $dataIndx))
    {
        return true;
    }
    else
    {
        return false;
    }    
}
function pageHelper(&$pq_curPage, $pq_rPP, $total_Records){
    $skip = ($pq_rPP * ($pq_curPage - 1));

    if ($skip >= $total_Records)
    {        
        $pq_curPage = ceil($total_Records / $pq_rPP);
        $skip = ($pq_rPP * ($pq_curPage - 1));
    }    
    return $skip;
}

?>
