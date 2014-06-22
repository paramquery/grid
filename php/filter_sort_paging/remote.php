<?php

    require_once '../conf.php';

    $where = "";
    $filterValue ="";
    if(isset($_POST["filterIndx"]) && isset($_POST["filterValue"]) )
    {
        $filterIndx = $_POST["filterIndx"];
        if(isValidColumn($filterIndx)==false){
            throw("invalid filter column");
        }
        $filterValue = $_POST["filterValue"];        
        $where  = " where ".$filterIndx." like CONCAT('%', ?, '%')";
    }            
    $sortIndx = $_POST["sortIndx"];
    if(isValidColumn($sortIndx)==false){
        throw("invalid sort column");
    }    
    $sortDir = $_POST["sortDir"];
    $sortDir=($sortDir=="up")?"asc":"desc";    
        
    $dbh = getDatabaseHandle();
    
    //count filtered records.
    $sql = "Select count(*) from invoices ".
            $where;            

    $pq_curPage = $_POST["pq_curpage"];    
    
    $pq_rPP=$_POST["pq_rpp"];
            
    $stmt = $dbh->prepare($sql);    
    $stmt->execute(array($filterValue));
    
    $total_Records = $stmt->fetchColumn();
    
    $skip = pageHelper($pq_curPage, $pq_rPP, $total_Records);

    $sql = "Select OrderID,CustomerName,ProductName,UnitPrice,Quantity,
            OrderDate,RequiredDate,ShippedDate,ShipCountry,Freight,ShipName,
            ShipAddress,ShipCity,ShipRegion,ShipPostalCode from invoices ".
            $where.
            " order by ".$sortIndx. " ".$sortDir."  limit ".$skip." , ".$pq_rPP;
        
    //$stmt = $dbh->query($sql);    
    $stmt = $dbh->prepare($sql);
    $stmt->execute(array($filterValue));
            
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sb = "{\"totalRecords\":" . $total_Records . ",\"curPage\":" . $pq_curPage . ",\"data\":".json_encode($products)."}";
    echo $sb;
    
?>
