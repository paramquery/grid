<?php

    require_once '../conf.php';

    $where = "";
    $filterValue ="";
    if(isset($_GET["filterIndx"]) && isset($_GET["filterValue"]) )
    {
        $filterIndx = $_GET["filterIndx"];
        if(isValidColumn($filterIndx)==false){
            throw("invalid filter column");
        }
        $filterValue = $_GET["filterValue"];
        $where  = " where ".$filterIndx." like CONCAT('%', ?, '%')";
    }            
    $sortIndx = $_GET["sortIndx"];
    if(isValidColumn($sortIndx)==false){
        throw("invalid sort column");
    }    
    $sortDir = $_GET["sortDir"];
    $sortDir=($sortDir=="up")?"asc":"desc";    
        
    $dbh = getDatabaseHandle();
    
    $sql = "Select OrderID,CustomerName,ProductName,UnitPrice,Quantity,
            OrderDate,RequiredDate,ShippedDate,ShipCountry,Freight,ShipName,
            ShipAddress,ShipCity,ShipRegion,ShipPostalCode from invoices ".
            $where.
            " order by ".$sortIndx. " ".$sortDir;

    //echo $sql;
    //$stmt = $dbh->query($sql);    
    $stmt = $dbh->prepare($sql);
    $stmt->execute(array($filterValue));    
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    try{
        throw new Exception("gross error");
    }
    catch(Exception $ex){
        $error = array("error" => $ex->getMessage());
        //print_r($error);
        echo json_encode($error);
        exit;
    }
    echo json_encode($products);    
//}    
?>
