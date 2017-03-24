<?php

require_once '../conf.php';

if(isset($_POST["sortDir"]) && isset($_POST["sortIndx"]) )
{
    $sortIndx = $_POST["sortIndx"];
    if(isValidColumn($sortIndx)==false){
        throw("invalid column");
    }
    $sortDir = $_POST["sortDir"];
    $sortDir=($sortDir=="up")?"asc":"desc";
        
    $dbh = getDatabaseHandle();
    
    $sql = "Select OrderID,CustomerName,ProductName,UnitPrice,Quantity,
            OrderDate,RequiredDate,ShippedDate,ShipCountry,Freight,ShipName,
            ShipAddress,ShipCity,ShipRegion,ShipPostalCode from invoices order by ".$sortIndx."  ".$sortDir;

    //echo $sql;
    $stmt = $dbh->query($sql);    
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products);    
}    
?>
