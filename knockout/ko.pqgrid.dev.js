/*!
 * ParamQuery Pro v3.5.0
 * 
 * Copyright (c) 2012-2021 Paramvir Dhindsa (http://paramquery.com)
 * Released under GNU General Public License v3
 * http://paramquery.com/license
 * 
 */
 
(function($) {
    var fn = $.paramquery.pqGrid.prototype;
    fn.totalRows = fn.totalRows || function() {
        var DM = this.options.dataModel,
            data = DM.data,
            dataUf = DM.dataUF || [];
        return data.length + dataUf.length;
    };
    var timeFactory = {
        timer: function() {
            var id;
            return {
                setTimeout: function(fn) {
                    id && ko.tasks.cancel(id);
                    id = ko.tasks.schedule(fn);
                }
            };
        }
    };

    function readCellTemplates(CM) {
        var i = 0,
            len = CM.length,
            column, template, present;
        for (; i < len; i++) {
            column = CM[i];
            if (template = column.template) {
                present = true;
                column.render = (function(tmpl) {
                    return function(ui) {
                        return tmpl;
                    }
                })(template);
            }
        }
        return present;
    };

    function disposeRow(rd) {
        var pq_ko = rd.pq_ko,
            key;
        if (pq_ko) {
            for (key in pq_ko) {
                pq_ko[key].dispose();
            }
        }
    };

    function cBind(element, value, context) {
        var self = this,
            options = value(),
            data,
            grid,
            timerKoData = timeFactory.timer(),
            timerExport = timeFactory.timer(),
            CM = options.colModel,
            koM = options.koModel || {},
            bind = readCellTemplates(CM || []) || koM.bind,
            DM = options.dataModel,
            items = DM.data,
            koItem = koM.item,
            koData = typeof items === "function" ? items : null;
        options.refresh = function() {
            bind && self.onRefresh(this);
        };
        self.element = element;
        self.timerItem = timeFactory.timer();
        self.context = context;
        if (koData) {
            data = koData();
            if (!koItem && data[0] && !$.isPlainObject(data[0])) {
                koItem = data[0].constructor;
            }
            options.dataModel.data = self.importData(data, koItem);
            self.subscribeKoDataChange(koData, koItem, timerKoData);
        }
        self.koItem = koItem;
        grid = pq.grid(element, options);
        self.grid = grid;
        grid.on("sort filter load", self.onSortFilterLoad(self, koData, koItem, timerExport)).on("change", self.onChange(self, koData, koItem, timerExport)).on("refreshRow refreshCell", self.onRefreshRowCell(self, bind));
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            grid.destroy();
        });
    }
    var _p = cBind.prototype;
    _p.onChange = function(self, koData, koItem, timerEx) {
        return function(evt, ui) {
            if (koData) {
                var rl = ui.rowList;
                if (rl.length == 1 && rl[0].type == "update") {
                    var ro = rl[0],
                        item = ro.rowData.pq_ko_item,
                        newRow = ro.newRow;
                    for (var key in newRow) {
                        item[key](newRow[key]);
                    }
                } else {
                    self.inChange = true;
                    timerEx.setTimeout(function() {
                        koData(self.exportData(koItem));
                        self.inChange = false;
                    });
                }
            }
        };
    };
    _p.onSortFilterLoad = function(self, koData, koItem, timerEx) {
        return function(evt) {
            if (koData) {
                self.inChange = true;
                timerEx.setTimeout(function() {
                    koData(self.exportData(koItem));
                    self.inChange = false;
                });
            }
        };
    };
    _p.onRefreshRowCell = function(self, bind) {
        return function(evt, ui) {
            if (bind) {
                var $tr = this.getRow(ui);
                ko.cleanNode($tr[0]);
                self.rowScope($tr, ui.rowData, ui.rowIndx);
            }
        }
    };
    _p.disposeData = function() {
        var data = this.grid.option('dataModel.data'),
            i = 0,
            len = data.length;
        for (; i < len; i++) {
            disposeRow(data[i]);
        }
    };
    _p.subscribe = function(obs, rd, key, pq_ko) {
        var timerItem = this.timerItem,
            self = this;
        pq_ko[key] = pq_ko[key] || obs.subscribe(function(change) {
            rd;
            key;
            rd[key] = change;
            timerItem.setTimeout(function() {
                self.grid.refresh({
                    header: false
                });
            });
        });
    };
    _p.importData = function(data, koItem) {
        var newData = [],
            self = this;
        if (koItem) {
            ko.utils.arrayMap(data, function(item) {
                newData.push(self.importRow(item, koItem));
            });
            return newData;
        } else {
            return data;
        }
    }
    _p.importRow = function(item, koItem) {
        var rd, obs, pq_ko;
        if (koItem) {
            pq_ko = {};
            rd = {
                pq_ko: pq_ko
            };
            for (var key in item) {
                obs = item[key];
                this.subscribe(obs, rd, key, pq_ko);
                rd[key] = obs();
            }
            rd.pq_ko_item = item;
            return rd;
        } else {
            return item;
        }
    };
    _p.exportRow = function(rd) {
        var item = rd.pq_ko_item,
            pq_ko, obs, key;
        if (item) {
            for (key in item) {
                item[key](rd[key]);
            }
        } else {
            item = new koItem(rd);
            rd.pq_ko = pq_ko = rd.pq_ko || {};
            for (key in item) {
                obs = item[key];
                this.subscribe(obs, rd, key, pq_ko);
            }
        }
        return item;
    };
    _p.exportData = function(koItem) {
        var self = this,
            data = self.grid.options.dataModel.data,
            newData = [],
            item;
        if (koItem) {
            ko.utils.arrayMap(data, function(rd) {
                item = self.exportRow(rd);
                newData.push(item);
            });
            return newData;
        } else {
            return data;
        }
    };
    _p.importArrayChanges = function(changes, koItem) {
        var rd,
            change, status, indx,
            len = changes.length,
            data = this.grid.option('dataModel.data');
        if (len > data.length) {
            return true;
        }
        while (len--) {
            change = changes[len];
            status = change.status;
            indx = change.index;
            if (status == "added") {
                rd = this.importRow(change.value, koItem);
                data.splice(indx, 0, rd);
            } else if (status == "deleted") {
                disposeRow(data[indx]);
                data.splice(indx, 1);
            }
        }
    };
    _p.rowScope = function($tr, rd, ri) {
        var binding = this.context.extend({
            rd: (rd.pq_ko_item || rd),
            ri: ri
        });
        ko.applyBindingsToDescendants(binding, $tr[0]);
    };
    _p.subscribeKoDataChange = function(koData, koItem, timer) {
        var self = this,
            fullImport,
            grid;
        if (!koData) return;
        koData.subscribe(function(changes) {
            if (!self.inChange) {
                if (!fullImport) {
                    fullImport = !koItem || self.importArrayChanges(changes, koItem);
                    timer.setTimeout(function() {
                        self.grid.refreshView();
                    });
                }
            }
        }, null, 'arrayChange');
        koData.subscribe(function(arr) {
            if (!self.inChange && fullImport) {
                if (koData() != arr) {
                    throw ("koData != arr assert failed");
                }
                grid = self.grid;
                timer.setTimeout(function() {
                    koItem && self.disposeData();
                    grid.option('dataModel.data', self.importData(koData(), koItem));
                    grid.refreshView();
                });
                fullImport = false;
            }
        });
    };
    _p.onRefresh = function(grid) {
        var i = 0,
            ui, rd, $tr,
            trs = this.element.querySelectorAll(".pq-grid-row"),
            len = trs.length;
        for (; i < len; i++) {
            $tr = $(trs[i]);
            ui = grid.getRowIndx({
                $tr: $tr
            });
            rd = grid.getRowData(ui);
            this.rowScope($tr, rd, ui.rowIndx);
        }
    };
    ko.bindingHandlers.pqGrid = {
        init: function(element, value, allBindings, vm, context) {
            new cBind(element, value, context);
            return {
                controlsDescendantBindings: true
            };
        }
    };
})(jQuery);