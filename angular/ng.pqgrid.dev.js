/*!
 * Angularjs grid v2.0.5
 *
 * Copyright (c) 2016 Paramvir Dhindsa (http://paramquery.com)
 * Released under GNU General Public License v3
 * http://paramquery.com/license
 *
 */
(function($) {
    "use strict";
    var pq = window.pq = window.pq || {};
    if (pq.ng) {
        return;
    }
    pq.ng = {};
    var timeFactory = {
        timer: function() {
            var id;
            return {
                setTimeout: function(fn) {
                    id && clearTimeout(id);
                    id = setTimeout(fn);
                }
            };
        }
    };

    function equals(obj1, obj2) {
        return (obj1.arr == obj2.arr && obj1.len == obj2.len && obj1.first == obj2.first && obj1.last == obj2.last);
    };

    function getObj(arr) {
        var len = arr.length;
        return {
            arr: arr,
            len: len,
            first: len ? arr[0] : null,
            last: len ? arr[len - 1] : null
        };
    };

    function cGrid($scope, $ele, $attr, $compile, $timeout, $parse) {
        var self = this;
        self.$scope = $scope;
        self.$compile = $compile;
        self.$timeout = $timeout;
        self.$parse = $parse;
        self.rowScopes = [];
        self.$ele = $ele;
        var cloneOptions = $attr.cloneOptions,
            _optionsStr = $attr.options,
            _options = $scope.$eval(_optionsStr),
            rebind = $attr.rebind,
            options = cloneOptions ? $.extend(true, {}, _options) : _options,
            ngM = options.ngModel || {},
            compileRows = self.readCellTemplates(options.colModel || []) || ngM.compileRows,
            DM = options.dataModel,
            dataStr = (typeof DM.data == "string") ? DM.data : null,
            watch = ngM.watch || 1,
            detailTmpl = self.detailTmpl = options.detailTemplate;
        self.timerDigest = timeFactory.timer();
        rebind && (rebind == "all" ? self.rebindAll(_options, _optionsStr) : self.rebind(rebind, _optionsStr));
        detailTmpl && self.templateDetail(detailTmpl, options);
        self.unregWatch = (watch && dataStr) ? (function() {
            if (watch === true) {
                return $scope.$watchCollection(dataStr, self.watchCollListener(self));
            } else {
                return $scope.$watch(self.watch(self, dataStr));
            }
        })() : null;
        dataStr && (DM.data = $scope.$eval(dataStr));
        options.render = self.onRender(self, options, options.render);
        ngM.compileHeader && (options.refreshHeader = self.onRefreshHeader(self, options.refreshHeader));
        ngM.compileToolbar && (options.dataAvailable = self.oneDataReady(self, 'dataAvailable'));
        options.beforeRefreshData = self.onDataReady(self, dataStr, options.dataReady);
        compileRows && (options.refresh = self.onRefresh(self, options.refresh));
        $ele.pqGrid(options).data('pqGrid');
        $ele.on("pqgridcellsave", self.onRefreshRowCell(self, compileRows)).on("destroy", self.onDestroy(self));
        self.bindEvents($attr);
        watch === true && dataStr && self.digest($scope);
    };
    pq.ng.cGrid = cGrid;
    var _p = cGrid.prototype;
    _p.onEvent = function(self, expr) {
        return function(evt, ui) {
            var $scope = self.$scope.$new();
            $scope.evt = evt;
            $scope.ui = ui;
            $scope.$eval(expr);
            $scope.$destroy();
            self.digestAsync();
        };
    };
    _p.bindEvents = function($attr) {
        var keys = $attr.$attr,
            self = this,
            eventName, key;
        for (key in keys) {
            if (key.indexOf("on") === 0) {
                eventName = key.substring(2, 3).toLowerCase() + key.substr(3);
                self.$ele.on("pqgrid" + eventName.toLowerCase(), self.onEvent(self, $attr[key]));
            }
        }
    };
    _p.rebindWListen = function(self, rebind) {
        return function rebindWListen(n, o) {
            if (n !== o) {
                self.grid.option(rebind, n);
                self.grid.refreshView();
            }
        };
    };
    _p.compareObj = function(newobj, oldobj, fn, _rebind) {
        var key, newopt, oldopt, rebind;
        for (key in oldobj) {
            newopt = newobj[key];
            oldopt = oldobj[key];
            rebind = (_rebind ? _rebind + "." : "") + key;
            if ($.isPlainObject(newopt)) {
                this.compareObj(newopt, oldopt, fn, rebind);
            } else if (newopt !== oldopt && !$.isArray(newopt)) {
                fn(rebind, newopt);
            }
        }
    };
    _p.copy = function(src, dest) {
        var self = this,
            key, val;
        for (var key in src) {
            val = src[key];
            if ($.isPlainObject(val)) {
                dest[key] = {};
                self.copy(val, dest[key]);
            } else {
                dest[key] = val;
            }
        }
        return dest;
    };
    _p.rebindAll = function(options, _optionsStr) {
        var self = this,
            scope = self.$scope,
            oldopts = self.copy(options, {});
        scope.$watch(function rebindAllWatch() {
            var changed = false,
                newopts = scope.$eval(_optionsStr);
            self.compareObj(newopts, oldopts, function(rebind, n) {
                changed = true;
                self.grid.option(rebind, n);
            });
            if (changed) {
                oldopts = self.copy(newopts, {});
                self.grid.refreshView();
            }
        });
    };
    _p.rebind = function(rebinds, _optionsStr) {
        var arr = rebinds.split(" "),
            self = this,
            $scope = self.$scope,
            i = 0;
        for (; i < arr.length; i++) {
            var rebind = arr[i],
                str = _optionsStr + "." + rebind;
            $scope.$watch(str, self.rebindWListen(self, rebind));
        }
    };
    _p.templateDetail = function(detailTmpl, options) {
        var self = this;
        options.detailModel = options.detailModel || {};
        options.detailModel.init = function(ui) {
            var newScope = self.$scope.$new(false),
                $detail;
            newScope.ui = ui;
            ui.rowData.pq_scope_detail = newScope;
            detailTmpl = typeof detailTmpl == "function" ? detailTmpl.call(this, ui) : detailTmpl;
            $detail = self.$compile(detailTmpl)(newScope);
            self.digest(newScope);
            return $detail;
        }
    };
    _p.detailDestroyScopes = function() {
        if (this.detailTmpl) {
            var data = this.grid.option('dataModel.data'),
                i = 0,
                len = data.length,
                scope,
                rd;
            for (; i < len; i++) {
                rd = data[i];
                if (scope = rd.pq_scope_detail) {
                    scope.$destroy();
                }
            }
        }
    };
    _p.onDataReady = function(self, dataStr) {
        return function onDataReady(evt) {
            if (dataStr) {
                var data = self.grid.options.dataModel.data;
                self.updateObjInt(data);
                self.$parse(dataStr).assign(self.$scope, data);
            };
            self.digestAsync();
        };
    };
    _p.watchCollListener = function(self) {
        return function(newVal, oldVal) {
            if (newVal !== oldVal) {
                self.refreshGrid(newVal);
            }
        };
    };
    _p.watch = function(self, dataStr) {
        return function watch() {
            var dataExt = self.$scope.$eval(dataStr),
                objInt, objExt;
            objExt = getObj(dataExt);
            objInt = self.objInt;
            if (objInt && !equals(objInt, objExt)) {
                self.refreshGrid(dataExt);
            }
        };
    };
    _p.updateObjInt = function(data) {
        this.objInt = getObj(data);
    };
    _p.cleanRowScopes = function() {
        var i = 0,
            rowScopes = this.rowScopes,
            len = rowScopes.length;
        for (; i < len; i++) {
            rowScopes[i].$destroy();
        }
        rowScopes.length = 0;
    };
    _p.onRefreshRowCell = function(self, bind) {
        return function(evt, ui) {
            if (bind) {
                var $tr = self.grid.getRow(ui);
                setTimeout(function() {
                    try {
                        self.rowScope($tr, ui.rowData, ui.rowIndx);
                    } catch (ex) {}
                });
            }
        };
    };
    _p.onRefresh = function(self) {
        return function() {
            var grid = self.grid,
                $trs, $tr, i = 0,
                len, ui, rd;
            self.cleanRowScopes();
            $trs = grid.$cont.children().children().children().children(".pq-grid-row:not('.pq-detail-child')");
            len = $trs.length;
            for (; i < len; i++) {
                $tr = $($trs[i]);
                ui = grid.getRowIndx({
                    $tr: $tr
                });
                rd = grid.getRowData(ui);
                self.rowScope($tr, rd, ui.rowIndx);
            }
        };
    };
    _p.onRefreshHeader = function(self) {
        return function() {
            var grid = self.grid,
                $scope = self.$scope;
            self.$compile(grid.$header)($scope);
            self.digest($scope);
        };
    };
    _p.oneDataReady = function(self, str) {
        return function() {
            var grid = self.grid,
                $scope = self.$scope;
            self.$compile(grid.$toolbar)($scope);
            self.digest($scope);
            $(this).pqGrid('option', str, null);
        };
    };
    _p.onRender = function(self, options, cb) {
        return function(evt, ui) {
            var grid = $(this).data('paramqueryPqGrid'),
                $scope = self.$scope;
            $scope.grid = grid;
            self.grid = grid;
            grid.$scope = $scope;
            options.grid = grid;
            cb && cb.call(this, evt, ui);
        };
    };
    _p.onDestroy = function(self) {
        return function() {
            self.$scope.$destroy();
            self.cleanRowScopes();
            self.detailDestroyScopes();
            self.unregWatch && self.unregWatch();
        };
    };
    _p.digestAsync = function() {
        var self = this,
            timerD = self.timerDigest,
            $root = self.$scope.$root,
            phase = $root.$$phase;
        if (phase != '$apply' && phase != '$digest') {
            timerD.setTimeout(function() {
                phase = $root.$$phase;
                if (phase != '$apply' && phase != '$digest') {
                    $root.$digest();
                }
            });
        }
    };
    _p.digest = function($scope) {
        var phase = $scope.$root.$$phase;
        if (phase != '$apply' && phase != '$digest') {
            $scope.$digest();
        }
    };
    _p.rowScope = function($tr, rd, ri) {
        var self = this,
            $rowScope = self.$scope.$new(false);
        self.rowScopes.push($rowScope);
        $rowScope.rd = rd;
        $rowScope.ri = ri;
        self.$compile($tr)($rowScope);
        self.digest($rowScope);
    };
    _p.readCellTemplates = function(CM) {
        var i = 0,
            len = CM.length,
            column, template, present,
            self = this,
            $scope = self.$scope,
            valids,
            $compile = self.$compile;
        for (; i < len; i++) {
            column = CM[i];
            if (template = column.template) {
                present = true;
                column.render = self.templateCell(template);
            }
            if (template = column.editorTemplate) {
                column.editor = {
                    type: self.templateEditor(self, column.editor, template, $compile, $scope)
                };
            }
            if (valids = column.validations) {
                for (var j = 0; j < valids.length; j++) {
                    if (template = valids[j].template) {
                        valids[i].type = self.templateValid(template, $compile, $scope);
                    }
                }
            }
        }
        return present;
    };
    _p.templateValid = function(tmpl, $compile, $scope) {
        return function(ui) {
            var edScope = $scope.$new(false),
                ret;
            edScope.ui = ui;
            $compile(tmpl)(edScope);
            ret = edScope.return;
            edScope.$destroy();
            return ret;
        };
    };
    _p.templateEditor = function(self, editor, tmpl, $compile, $scope) {
        return function(ui) {
            var edScope = $scope.$new(false),
                scope_editor;
            edScope.ui = ui;
            $compile(tmpl)(edScope);
            scope_editor = edScope.editor;
            edScope.$destroy();
        };
    };
    _p.templateCell = function(tmpl) {
        return function() {
            return tmpl;
        };
    };
    _p.refreshGrid = function(pSdata) {
        var grid = this.grid;
        grid.option('dataModel.data', pSdata);
        grid.refreshView();
    };
    angular.module('pq.grid', []).directive('pqGrid', ["$compile", "$timeout", "$parse", function($compile, $timeout, $parse) {
        return {
            restrict: 'AE',
            scope: true,
            replace: true,
            link: function($scope, $ele, $attr) {
                new cGrid($scope, $ele, $attr, $compile, $timeout, $parse);
            },
            template: '<div></div>'
        };
    }]);
})(jQuery);