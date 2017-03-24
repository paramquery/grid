<?php

    require_once '../conf.php';

if(isset($_POST["sortDir"]) && isset($_POST["sortIndx"]) )
{
    $sortIndx = $_POST["sortIndx"];
    if(isValidColumn($sortIndx)==false){
        throw("invalid sort column");
    }        
    $sortDir = $_POST["sortDir"];
    $sortDir=($sortDir=="up")?"asc":"desc";
    
    $pq_curPage = $_POST["pq_curpage"];        
    $pq_rPP=$_POST["pq_rpp"];
    
    $sql = "Select count(*) from invoices";
    
    $dbh = getDatabaseHandle();
    $stmt = $dbh->query($sql);    
    $total_Records = $stmt->fetchColumn();
    
    $skip = ($pq_rPP * ($pq_curPage - 1));

    if ($skip >= $total_Records)
    {        
        $pq_curPage = ceil($total_Records / $pq_rPP);
        $skip = ($pq_rPP * ($pq_curPage - 1));
    }          
    
    $sql = "Select OrderID,CustomerName,ProductName,UnitPrice,Quantity,
            OrderDate,RequiredDate,ShippedDate,ShipCountry,Freight,ShipName,
            ShipAddress,ShipCity,ShipRegion,ShipPostalCode from invoices order by ".$sortIndx."  ".$sortDir.
            " limit ".$skip." , ".$pq_rPP;

    //echo $sql;
    $stmt = $dbh->query($sql);    
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sb = "{\"totalRecords\":" . $total_Records . ",\"curPage\":" . $pq_curPage . ",\"data\":".json_encode($products)."}";
    echo $sb;
}    
?>
