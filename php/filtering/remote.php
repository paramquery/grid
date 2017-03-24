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
        
    $dbh = getDatabaseHandle();
    
    $sql = "Select OrderID,CustomerName,ProductName,UnitPrice,Quantity,
            OrderDate,RequiredDate,ShippedDate,ShipCountry,Freight,ShipName,
            ShipAddress,ShipCity,ShipRegion,ShipPostalCode from invoices ".
            $where.
            " order by OrderID";

    //echo $sql;
    $stmt = $dbh->prepare($sql);
    $stmt->execute(array($filterValue));    
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($products);    
?>
