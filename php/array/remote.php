<?php

$products = array();

$products[0] = array("OrderID"=>"10248","CustomerName"=>"Vins et alcools Chevalier",
    "ProductName"=>"Mozzarella di Giovanni","UnitPrice"=>"34.8000","Quantity"=>"5",
    "OrderDate"=>"1996-07-04 00:00:00","RequiredDate"=>"1996-08-01 00:00:00","ShippedDate"=>"1996-07-16 00:00:00",
    "ShipCountry"=>"France","Freight"=>"32.3800","ShipName"=>"Vins et alcools Chevalier",
    "ShipAddress"=>"59 rue de l-Abbaye","ShipCity"=>"Reims","ShipRegion"=>"null","ShipPostalCode"=>"51100");

$products[1] = array("OrderID"=>"10248","CustomerName"=>"Vins et alcools Chevalier",
    "ProductName"=>"Singaporean Hokkien Fried Mee","UnitPrice"=>"9.8000","Quantity"=>"10",
    "OrderDate"=>"1996-07-04 00:00:00","RequiredDate"=>"1996-08-01 00:00:00","ShippedDate"=>"1996-07-16 00:00:00",
    "ShipCountry"=>"France","Freight"=>"32.3800","ShipName"=>"Vins et alcools Chevalier",
    "ShipAddress"=>"59 rue de l-Abbaye","ShipCity"=>"Reims","ShipRegion"=>"null","ShipPostalCode"=>"51100");

echo json_encode($products);

?>
