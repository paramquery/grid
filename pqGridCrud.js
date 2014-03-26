/**
* Copyright 2012-2013, Paramvir Dhindsa
* Released under GPL license
* http://www.paramquery.com/license
* Last Modified: Dec 10, 2013
*/
$(function () {
    var fn = {};
    fn.options = {};
    fn._create = function () {
        var that = this;
                
        $(this.element).on("pqgridcrudload", function (evt, ui) {
            //debugger;
            that._onLoad();
        });
        //set getUrl to default
        this._setUrl();

        this._super.apply(this);
        
        //this.colModel is available after call to parent _create.        
        var colModel = this.colModel;
        
        this.pqGridCrud = {}; //to store instance variables 

        var strPopup = "<div style='display:none;' class='pq-grid-crud-popup'>\
            <form class='pq-grid-crud-form'>\
            <input type='hidden' name='recId' />\
            <table align='center'>";
        for(var i=0;i<colModel.length;i++){
            var column = colModel[i];
            strPopup += "<tr>\
            <td class='label'>"+column.title+":</td>\
            <td><input type=text name='"+column.dataIndx+"' /></td>\
            </tr>";
        }
        strPopup += "</table>\
            </form></div>";
        this.$crudPopup = $(strPopup).appendTo(document);
        this.$crudForm = this.$crudPopup.find("form");
        //create popup dialog.
        this.$crudPopup.dialog({ width: 440, modal: true,
            open: function () { $(".ui-dialog").position({ of: this.element }); },
            autoOpen: false
        });
        //create toolbar
        var $toolbar = $("<div class='pq-grid-toolbar pq-grid-toolbar-crud-remote'></div>").appendTo($(".pq-grid-top", this.element));

        $("<span>Add</span>").appendTo($toolbar).button({ icons: { primary: "ui-icon-circle-plus"} }).click(function (evt) {
            that.addRow();
        });
        $("<span>Edit</span>").appendTo($toolbar).button({ icons: { primary: "ui-icon-pencil"} }).click(function (evt) {
            that.editRow();
        });
        $("<span>Delete</span>").appendTo($toolbar).button({ icons: { primary: "ui-icon-circle-minus"} }).click(function () {
            that.deleteRow();
        });
        $toolbar.disableSelection();
        //debugger;
        this.refresh(); //to update the DOM
    }
    fn._setUrl = function (queryStr) {
        this.options.dataModel.getUrl = function () {
            //debugger;
            return { url: this.url + ((queryStr != null) ? queryStr : "") };
        }
    }
    fn._getRowIndx = function () {
        var arr = this.selection({ type: 'row', method: 'getSelection' });
        if (arr && arr.length > 0) {
            var rowIndx = arr[0].rowIndx;
            return rowIndx;
        }
        else {
            alert("Select a row.");
            return null;
        }
    }

    fn.addRow = function () {
        var DM = this.options.dataModel,
            data = DM.data,
            that = this;

        var $frm = this.$crudForm;
        $frm.find("input").val("");

        this.$crudPopup.dialog({ title: "Add Record", buttons: {
            Add: function () {
                var serializedData = $frm.serialize();
                that._setUrl("?" + serializedData);
                that.refreshDataAndView();
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
        });
        this.$crudPopup.dialog("open");
    }
    fn.editRow = function () {
        var rowIndx = this._getRowIndx();
        if (rowIndx != null) {
            //debugger;
            //this.pqGridCrud.rowIndx = rowIndx;
            var that = this,
                DM = this.options.dataModel,
                data = DM.data,
                colModel = this.colModel,
                rowData = data[rowIndx];
            //this.pqGridCrud.recId = data[rowIndx][0];

            var $frm = this.$crudForm;
            $frm.find("input[name='recId']").val(rowData['recId']);
            for(var i=0;i<colModel.length;i++){
                var dataIndx = colModel[i].dataIndx;
                $frm.find("input[name='"+dataIndx+"']").val(rowData[dataIndx]);
            }
            
            this.$crudPopup.dialog({ title: "Edit Record (" + (rowIndx + 1) + ")", buttons: {
                Update: function () {
                    that.pqGridCrud.recId = data[rowIndx]['recId']; //save it for _onLoad
                    var serializedData = $frm.serialize();

                    that._setUrl("?" + serializedData);

                    that.refreshDataAndView();
                    $(this).dialog("close");
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            }
            }).dialog("open");
        }
    }
    fn.deleteRow = function () {
        var rowIndx = this._getRowIndx();
        if (rowIndx != null) {
            this.pqGridCrud.rowIndx = rowIndx;
            var DM = this.options.dataModel;

            var deleteId = DM.data[rowIndx]['recId']
            this._setUrl("?deleteId=" + deleteId);
            this.refreshDataAndView();
        }
    }
    fn._onLoad = function () {
        //restore the selections after load if update or delete operation.
        if (this.pqGridCrud.recId != null) {
            var recId = this.pqGridCrud.recId;
            var data = this.options.dataModel.data;
            var rowIndx;
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i]['recId'] == recId) {
                    rowIndx = i;
                    break;
                }
            }
            //debugger;
            this.setSelection({ rowIndx: rowIndx });
        }
        else if (this.pqGridCrud.rowIndx != null) {
            var rowIndx = this.pqGridCrud.rowIndx;
            this.setSelection({ rowIndx: rowIndx });
        }
        //set getUrl to default.
        this._setUrl();
        this.pqGridCrud.rowIndx = null;
        this.pqGridCrud.recId = null;
    }
    $.widget("paramquery.pqGridCrud", $.paramquery.pqGrid, fn);
});
