<?php

    require_once '../conf.php';

    $dbh = getDatabaseHandle();
                
    $sql = "Select OrderID,CustomerName,ProductName,UnitPrice,Quantity,
            OrderDate,RequiredDate,ShippedDate,ShipCountry,Freight,ShipName,
            ShipAddress,ShipCity,ShipRegion,ShipPostalCode from invoices order by orderID limit 0,100";
    
    $stmt = $dbh->query($sql);    
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products);
?>
