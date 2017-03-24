<?php
require_once '../include.php';
?>

<script class="ppjs">
    $(function () {
        var colM = [
            { title: "Order ID", width: 100, dataIndx: "OrderID" },            
            { title: "Customer Name", width: 130, dataIndx: "CustomerName" },
            { title: "Product Name", width: 190, dataIndx: "ProductName" },
            { title: "Unit Price", width: 100, dataIndx: "UnitPrice", align: "right" },
            { title: "Quantity", width: 100, dataIndx: "Quantity", align:"right" },            
            { title: "Order Date", width: 100, dataIndx: "OrderDate"},
            { title: "Required Date", width: 100, dataIndx: "RequiredDate" },
            { title: "Shipped Date", width: 100, dataIndx: "ShippedDate" },
            { title: "ShipCountry", width: 100, dataIndx: "ShipCountry" },
            { title: "Freight", width: 100, align: "right", dataIndx: "Freight" },
            { title: "Shipping Name", width: 120, dataIndx: "ShipName" },
            { title: "Shipping Address", width: 180, dataIndx: "ShipAddress" },
            { title: "Shipping City", width: 100, dataIndx: "ShipCity" },
            { title: "Shipping Region", width: 110, dataIndx: "ShipRegion" },
            { title: "Shipping Postal Code", width: 130, dataIndx: "ShipPostalCode" }
        ];
        var dataModel = {
            location: "remote",            
            paging:"remote",
            curPage:1,
            sorting:"remote",
            dataType: "JSON",
            method: "POST",
            sortIndx: "OrderID",
            getUrl: function(){
                return {
                    url: "remote.php",
                    data:{
                        pq_curpage:this.curPage,
                        pq_rpp:this.rPP,
                        sortIndx:this.sortIndx,
                        sortDir:this.sortDir
                    }
                }
            },
            getData: function ( dataJSON ) {                
                return { curPage: dataJSON.curPage, totalRecords: dataJSON.totalRecords, data: dataJSON.data };                
            }
        }

        var grid1 = $("div#grid_php").pqGrid({ width: 900, height: 400,
            dataModel: dataModel,
            colModel: colM,            
            title: "Shipping Orders"
        });
    });

</script>    
<div id="grid_php" style="margin:5px auto;"></div>
</body>
</html>