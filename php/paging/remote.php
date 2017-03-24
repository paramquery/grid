<?php

require_once '../conf.php';

if(isset($_POST["pq_curpage"]) && isset($_POST["pq_rpp"]) )
{
    $pq_curPage = $_POST["pq_curpage"];    
    
    $pq_rPP=$_POST["pq_rpp"];
    
    $sql = "Select count(*) from invoices";
    
    $dbh = getDatabaseHandle();
    $stmt = $dbh->query($sql);    
    $total_Records = $stmt->fetchColumn();
    
    $skip = pageHelper($pq_curPage, $pq_rPP, $total_Records);
                    
    $sql = "Select OrderID,CustomerName,ProductName,UnitPrice,Quantity,
            OrderDate,RequiredDate,ShippedDate,ShipCountry,Freight,ShipName,
            ShipAddress,ShipCity,ShipRegion,ShipPostalCode from invoices order by orderID limit ".$skip." , ".$pq_rPP;
    $stmt = $dbh->query($sql);    
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sb = "{\"totalRecords\":" . $total_Records . ",\"curPage\":" . $pq_curPage . ",\"data\":".json_encode($products)."}";
    echo $sb;
}    
?>