<?php
require_once '../include.php';
?>
<style>
div.pq-grid-toolbar-search
{
    text-align:left;
}
div.pq-grid-toolbar-search *
{
    margin:1px 5px 1px 0px; 
    vertical-align:middle;       
}
div.pq-grid-toolbar-search .pq-separator
{
   margin-left:10px;   
   margin-right:10px;   
}
div.pq-grid-toolbar-search select
{
    height:18px;    
    position:relative;
}
div.pq-grid-toolbar-search input.pq-filter-txt
{
    width:180px;border:1px solid #b5b8c8;        
    height:16px;
    padding:0px 5px;        
}    
</style>    
<script class="ppjs">
$(function () {
    //var pqFilter = $.paramquery.pqFilter;
    var pqFilter = {
        search: function () {
            var txt = $("input.pq-filter-txt").val().toUpperCase(),
                dataIndx = $("select#pq-filter-select-column").val(),
                DM = $grid.pqGrid("option", "dataModel");
            DM.filterIndx = dataIndx;
            DM.filterValue = txt;
            $grid.pqGrid("refreshDataAndView");
        }
    }
    //define colModel
        var colM = [
            { title: "Order ID", width: 100, dataIndx: "OrderID" },            
            { title: "Customer Name", width: 130, dataIndx: "CustomerName" },
            { title: "ShipCountry", width: 100, dataIndx: "ShipCountry" },
            { title: "Product Name", width: 190, dataIndx: "ProductName" },
            { title: "Unit Price", width: 100, dataIndx: "UnitPrice", align: "right" },
            { title: "Quantity", width: 100, dataIndx: "Quantity", align:"right" },            
            { title: "Order Date", width: 100, dataIndx: "OrderDate"},
            { title: "Required Date", width: 100, dataIndx: "RequiredDate" },
            { title: "Shipped Date", width: 100, dataIndx: "ShippedDate" },            
            { title: "Freight", width: 100, align: "right", dataIndx: "Freight" },
            { title: "Shipping Name", width: 120, dataIndx: "ShipName" },
            { title: "Shipping Address", width: 180, dataIndx: "ShipAddress" },
            { title: "Shipping City", width: 100, dataIndx: "ShipCity" },
            { title: "Shipping Region", width: 110, dataIndx: "ShipRegion" },
            { title: "Shipping Postal Code", width: 130, dataIndx: "ShipPostalCode" }
        ];
    //define dataModel
    var dataModel = {
        location: "remote",
        sorting: "remote",
        paging: "local",
        dataType: "JSON",
        method: "GET",
        curPage: 1,
        rPP: 20,
        sortIndx: "OrderID",
        sortDir: "up",
        rPPOptions: [1, 10, 20, 30, 40, 50, 100, 500, 1000],
        filterIndx: "",
        filterValue: "",
        getUrl: function () {
            var data = {
                sortIndx: this.sortIndx,
                sortDir: this.sortDir};
            if (this.filterIndx && this.filterValue ) {
                  data['filterIndx']=this.filterIndx;
                  data['filterValue']=this.filterValue;
            }
            var obj = { url: "remote.php", data: data };
            //debugger;
            return obj;
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert(textStatus);    
            //debugger;
        },
        getData: function (response) {
            return { data: response.data };
        }
    }
    var obj = { width: 800, height: 400,
        dataModel: dataModel,
        colModel: colM,
        editable: false,
        title: "Shipping Orders",
        topVisible: true,
        resizable: true,
        columnBorders: true,
        freezeCols: 2
    };
    //obj.render = pqFilter.pqgridrender;
    //append the filter toolbar in top section of grid
 
    obj.render = function (evt, obj) {
        var $toolbar = $("<div class='pq-grid-toolbar pq-grid-toolbar-search'></div>").appendTo($(".pq-grid-top", this));
 
        $("<span>Filter</span>").appendTo($toolbar);
 
        $("<input type='text' class='pq-filter-txt'/>").appendTo($toolbar)
            .change(function (evt) {            
                pqFilter.search();            
        });
 
        $("<select id='pq-filter-select-column'>\
        <option value='ShipCountry'>Ship Country</option>\
        <option value='CustomerName'>Customer Name</option>\
        </select>").appendTo($toolbar)
           .change(function () {
            pqFilter.search();
        });
        $("<span class='pq-separator'></span>").appendTo($toolbar);
 
    };
    var $grid = $("#grid_php").pqGrid(obj);
});
</script>    
<div id="grid_php" style="margin:5px auto;"></div>
</body>
</html>