/**
 * ParamQuery Grid a.k.a. pqGrid v1.1.2
 * 
 * Copyright (c) 2012 Paramvir Dhindsa (http://paramquery.com)
 * Released under MIT license
 * http://paramquery.com/license
 * 
 */ (function($) {
    $.paramquery = ($.paramquery == null) ? {} : $.paramquery;
    $.paramquery.xmlToArray = function(data, obj) {
        var itemParent = obj.itemParent;
        var itemNames = obj.itemNames;
        var arr = [];
        var $items = $(data).find(itemParent);
        $items.each(function(i, item) {
            var $item = $(item);
            var arr2 = [];
            $(itemNames).each(function(j, itemName) {
                arr2.push($item.find(itemName).text());
            });
            arr.push(arr2);
        });
        return arr;
    };
    $.paramquery.tableToArray = function(tbl) {
        var $tbl = $(tbl);
        var colModel = [];
        var data = [];
        var cols = [];
        var widths = [];
        var $trfirst = $tbl.find("tr:first");
        var $trsecond = $tbl.find("tr:eq(1)");
        $trfirst.find("th,td").each(function(i, td) {
            var $td = $(td);
            var title = $td.html();
            var width = $td.width();
            var dataType = "string";
            var $tdsec = $trsecond.find("td:eq(" + i + ")");
            var val = $tdsec.text();
            var align = $tdsec.attr("align");
            val = val.replace(/,/g, "");
            if (parseInt(val, 10) === val && (parseInt(val, 10) + "").length === val.length) {
                dataType = "integer";
            } else if (parseFloat(val) === val) {
                dataType = "float";
            }
            var obj = {
                title: title,
                width: width,
                dataType: dataType,
                align: align,
                dataIndx: i
            };
            colModel.push(obj);
        });
        $tbl.find("tr").each(function(i, tr) {
            if (i === 0) {
                return;
            }
            var $tr = $(tr);
            var arr2 = [];
            $tr.find("td").each(function(j, td) {
                arr2.push($.trim($(td).html()));
            });
            data.push(arr2);
        });
        return {
            data: data,
            colModel: colModel
        };
    };
    $.paramquery.formatCurrency = function(val) {
        val = Math.round(val * 10) / 10;
        val = val + "";
        if (val.indexOf(".") === -1) {
            val = val + ".0";
        }
        var len = val.length;
        var fp = val.substring(0, len - 2),
            lp = val.substring(len - 2, len),
            arr = fp.match(/\d/g).reverse(),
            arr2 = [];
        for (var i = 0; i < arr.length; i++) {
            if (i > 0 && i % 3 === 0) {
                arr2.push(",");
            }
            arr2.push(arr[i]);
        }
        arr2 = arr2.reverse();
        fp = arr2.join("");
        return fp + lp;
    };
})(jQuery);
/**
 * ParamQuery Pager a.k.a. pqPager
 */ (function($) {
    var fnPG = {};
    fnPG.options = {
        currentPage: 0,
        totalPages: 0,
        totalRecords: 0,
        msg: "",
        rPPOptions: [10, 20, 30, 40, 50, 100],
        rPP: 20
    };
    fnPG._regional = {
        strPage: "Page {0} of {1}",
        strFirstPage: "First Page",
        strPrevPage: "Previous Page",
        strNextPage: "Next Page",
        strLastPage: "Last Page",
        strRefresh: "Refresh",
        strRpp: "Records per page:",
        strDisplay: "Displaying {0} to {1} of {2} items."
    };
    $.extend(fnPG.options, fnPG._regional);
    fnPG._create = function() {
        var that = this,
            thisOptions = this.options;
        this.element.addClass("pq-pager").css({});
        this.first = $("<button type='button' title='" + this.options.strFirstPage + "'></button>", {})
            .appendTo(this.element)
            .button({
            icons: {
                primary: "pq-page-first"
            },
            text: false
        }).bind("click.paramquery", function(evt) {
            if (that.options.currentPage > 1) {
                if (that._trigger("change", evt, {
                    curPage: 1
                }) !== false) {
                    that.option({
                        currentPage: 1
                    });
                }
            }
        });
        this.prev = $("<button type='button' title='" + this.options.strPrevPage + "'></button>")
            .appendTo(this.element)
            .button({
            icons: {
                primary: "pq-page-prev"
            },
            text: false
        }).bind("click", function(evt) {
            if (that.options.currentPage > 1) {
                var currentPage = that.options.currentPage - 1;
                if (that._trigger("change", evt, {
                    curPage: currentPage
                }) !== false) {
                    that.option({
                        currentPage: currentPage
                    });
                }
            }
        });
        $("<span class='pq-separator'></span>").appendTo(this.element);
        this.pagePlaceHolder = $("<span class='pq-pageholder'></span>")
            .appendTo(this.element);
        $("<span class='pq-separator'></span>").appendTo(this.element);
        this.next = $("<button type='button' title='" + this.options.strNextPage + "'></button>")
            .appendTo(this.element)
            .button({
            icons: {
                primary: "pq-page-next"
            },
            text: false
        }).bind("click", function(evt) {
            var val = that.options.currentPage + 1;
            if (that._trigger("change", evt, {
                curPage: val
            }) !== false) {
                that.option({
                    currentPage: val
                });
            }
        });
        this.last = $("<button type='button' title='" + this.options.strLastPage + "'></button>")
            .appendTo(this.element)
            .button({
            icons: {
                primary: "pq-page-last"
            },
            text: false
        }).bind("click", function(evt) {
            var val = that.options.totalPages;
            if (that._trigger("change", evt, {
                curPage: val
            }) !== false) {
                that.option({
                    currentPage: val
                });
            }
        });
        $("<span class='pq-separator'></span>").appendTo(this.element);
        this.$strRpp = $("<span>" + this.options.strRpp + " </span>")
            .appendTo(this.element);
        this.$rPP = $("<select></select>")
            .appendTo(this.element)
            .change(function(evt) {
            var val = $(this).val();
            if (that._trigger("change", evt, {
                rPP: val
            }) !== false) {
                that.options.rPP = val;
            }
        });
        $("<span class='pq-separator'></span>").appendTo(this.element);
        this.$refresh = $("<button type='button' title='" + this.options.strRefresh + "'></button>")
            .appendTo(this.element)
            .button({
            icons: {
                primary: "pq-refresh"
            },
            text: false
        }).bind("click", function(evt) {
            if (that._trigger("refresh", evt) !== false) {}
        });
        $("<span class='pq-separator'></span>").appendTo(this.element);
        this.$msg = $("<span class='pq-pager-msg'></span>")
            .appendTo(this.element);
        this._refresh();
    };
    fnPG._refreshPage = function() {
        var that = this;
        this.pagePlaceHolder.empty();
        var strPage = this.options.strPage;
        var arr = strPage.split(" ");
        var str = "";
        $(arr).each(function(i, ele) {
            str += "<span>" + ele + "</span>";
        });
        strPage = str.replace("<span>{0}</span>", "<span class='textbox'></span>");
        strPage = strPage.replace("<span>{1}</span>", "<span class='total'></span>");
        var $temp = $(strPage).appendTo(this.pagePlaceHolder);
        this.page = $("<input type='text' tabindex='0' />")
            .replaceAll("span.textbox", $temp)
            .bind("change", function(evt) {
            var $this = $(this);
            var val = $this.val();
            if (isNaN(val) || val < 1) {
                $this.val(that.options.currentPage);
                return false;
            }
            val = parseInt(val, 10);
            if (val > that.options.totalPages) {
                $this.val(that.options.currentPage);
                return false;
            }
            if (that._trigger("change", evt, {
                curPage: val
            }) !== false) {
                that.option({
                    currentPage: val
                });
            } else {
                $this.val(that.options.currentPage);
                return false;
            }
        });
        this.$total = $temp.filter("span.total");
    };
    fnPG._refresh = function() {
        this._refreshPage();
        var sel = (this.$rPP);
        var thisOptions = this.options;
        this.$strRpp.text(thisOptions.strRpp);
        this.first.attr("title", thisOptions.strFirstPage);
        this.prev.attr("title", thisOptions.strPrevPage);
        this.next.attr("title", thisOptions.strNextPage);
        this.last.attr("title", thisOptions.strLastPage);
        this.$refresh.attr("title", thisOptions.strRefresh);
        sel.empty();
        var opts = this.options.rPPOptions;
        for (var i = 0; i < opts.length; i++) {
            var opt = document.createElement("option");
            opt.text = opts[i];
            opt.value = opts[i];
            opt.setAttribute("value", opts[i]);
            opt.innerHTML = opts[i];
            sel.append(opt);
        }
        sel.find("option[value=" + this.options.rPP + "]").attr("selected", true);
        if (this.options.currentPage >= this.options.totalPages) {
            this.next.button({
                disabled: true
            });
            this.last.button({
                disabled: true
            });
        } else {
            this.next.button({
                disabled: false
            });
            this.last.button({
                disabled: false
            });
        }
        if (this.options.currentPage <= 1) {
            this.first.button({
                disabled: true
            });
            this.prev.button({
                disabled: true
            });
        } else {
            this.first.button({
                disabled: false
            });
            this.prev.button({
                disabled: false
            });
        }
        this.page.val(this.options.currentPage);
        this.$total.text(this.options.totalPages);
        if (this.options.totalRecords > 0) {
            var rPP = this.options.rPP;
            var currentPage = this.options.currentPage;
            var totalRecords = this.options.totalRecords;
            var begIndx = (currentPage - 1) * rPP;
            var endIndx = currentPage * rPP;
            if (endIndx > totalRecords) {
                endIndx = totalRecords;
            }
            var strDisplay = this.options.strDisplay;
            strDisplay = strDisplay.replace("{0}", begIndx + 1);
            strDisplay = strDisplay.replace("{1}", endIndx);
            strDisplay = strDisplay.replace("{2}", totalRecords);
            this.$msg.html(strDisplay);
        } else {
            this.$msg.html("");
        }
    };
    fnPG._destroy = function() {
        this.element.empty().removeClass("pq-pager").enableSelection();
    };
    fnPG._setOption = function(key, value) {
        if (key === "currentPage" || key === "totalPages") {
            value = parseInt(value, 10);
        }
        $.Widget.prototype._setOption.call(this, key, value);

    };
    fnPG._setOptions = function() {
        $.Widget.prototype._setOptions.apply(this, arguments);
        this._refresh();
    };
    $.widget("paramquery.pqPager", fnPG);
    $.paramquery.pqPager.regional = {};
    $.paramquery.pqPager.regional['en'] = fnPG._regional;
    $.paramquery.pqPager.setDefaults = function(obj) {
        for (var key in obj) {
            fnPG.options[key] = obj[key];
        }
        $.widget("paramquery.pqPager", fnPG);
        $(".pq-pager").each(function(i, pager) {
            $(pager).pqPager("option", obj);
        });
    };
})(jQuery);
/**
 * ParamQuery Scrollbar a.k.a. pqScrollBar
 */ (function($) {
    var fnSB = {};
    fnSB.options = {
        length: 200,
        num_eles: 3,
        cur_pos: 0,
        timeout: 350,
        pace: 'optimum',
        direction: 'vertical'
    };
    fnSB._destroy = function() {
        this.element.removeClass("pq-scrollbar-vert").enableSelection().removeClass("pq-scrollbar-horiz").unbind('click.pq-scrollbar').empty();
        this.element.removeData();
    };
    fnSB._create = function() {
        this.length = this.options.length;
        this.direction = this.options.direction;
        this.num_eles = this.options.num_eles;
        var that = this;
        var ele = this.element.empty();
        if (this.direction === "vertical") {
            ele.addClass("pq-scrollbar-vert");
            ele.html("<div class='top-btn pq-sb-btn'></div>\
			<div class='pq-sb-slider'>\
				<div class='vert-slider-top'></div>\
				<div class='vert-slider-bg'></div>\
				<div class='vert-slider-center'></div>\
				<div class='vert-slider-bg'></div>\
				<div class='vert-slider-bottom'></div>\
			</div>\
		<div class='bottom-btn pq-sb-btn'></div>");
        } else {
            ele.addClass("pq-scrollbar-horiz");
            ele.width(this.width);
            ele.html("<div class='left-btn pq-sb-btn'></div>\
			<div class='pq-sb-slider pq-sb-slider-h'>\
				<span class='horiz-slider-left'></span><span class='horiz-slider-bg'></span><span class='horiz-slider-center'></span><span class='horiz-slider-bg'></span><span class='horiz-slider-right'></span>\
			</div>\
		<div class='right-btn pq-sb-btn'></div>");
        }
        this.element.disableSelection().bind('click.pq-scrollbar', function(evt) {
            var topSlider;
            var botSlider;
            if (that.options.disabled) {
                return;
            }
            if (that.$slider.is(":hidden")) {
                return;
            }
            if (that.direction === "vertical") {
                var clickY = evt.pageY;
                var top_this = that.element.offset().top;
                var bottom_this = top_this + that.length;
                topSlider = that.$slider.offset().top;
                botSlider = topSlider + that.$slider.height();
                if (clickY < topSlider && clickY > top_this + 17) {
                    var new_top = clickY - top_this;
                    that.$slider.css("top", new_top);
                    that._updateCurPosAndTrigger(evt);
                } else if (clickY > botSlider && clickY < bottom_this - 17) {
                    that.$slider.css("top", clickY - top_this - that.$slider.height());
                    that._updateCurPosAndTrigger(evt);
                }
            } else {
                var top = evt.pageX;
                topSlider = that.$slider.offset().left;
                botSlider = topSlider + that.$slider.width();
                if (top < topSlider) {
                    that.$slider.css("left", top - that.element.offset().left);
                    that._updateCurPosAndTrigger(evt);
                } else if (top > botSlider) {
                    that.$slider.css("left", top - that.element.offset().left - that.$slider.width());
                    that._updateCurPosAndTrigger(evt);
                }
            }
        });
        var axis = 'x';
        if (this.direction === "vertical") {
            axis = 'y';
        }
        this.$slider = $("div.pq-sb-slider", this.element).draggable({
            axis: axis,
            helper: function(evt, ui) {
                that._setDragLimits();
                return this;
            },
            start: function(evt) {
                that.topWhileDrag = null;
            },
            drag: function(evt) {
                that.dragging = true;
                var pace = that.options.pace;
                if (pace === "optimum") {
                    that._setNormalPace(evt);
                } else if (pace === "fast") {
                    that._updateCurPosAndTrigger(evt);
                }
            },
            stop: function(evt) {
                that._updateCurPosAndTrigger(evt);
                that.dragging = false;
                that._refresh();
            }
        });

        function decr_cur_pos(evt) {
            if (that.options.cur_pos > 0) {
                that.options.cur_pos--;
                that.updateSliderPos();
                that.scroll(evt);
            }
        }
        this.$top_btn = $("div.top-btn,div.left-btn", this.element).click(function(evt) {
            if (that.options.disabled) {
                return;
            }
            decr_cur_pos(evt);
            evt.preventDefault();
            return false;
        }).mousedown(function(evt) {
            if (that.options.disabled) {
                return;
            }
            that.mousedownTimeout = window.setTimeout(function() {
                that.mousedownInterval = window.setInterval(function() {
                    decr_cur_pos(evt);
                }, 50);
            }, that.options.timeout);
        }).bind('mouseup mouseout', function(evt) {
            if (that.options.disabled) {
                return;
            }
            that._mouseup(evt);
        });

        function incr_cur_pos(evt) {
            if (that.options.cur_pos < that.num_eles - 1) {
                that.options.cur_pos++;
            }
            that.updateSliderPos();
            that.scroll(evt);
        }
        this.$bottom_btn = $("div.bottom-btn,div.right-btn", this.element).click(function(evt) {
            if (that.options.disabled) {
                return;
            }
            incr_cur_pos(evt);
            evt.preventDefault();
            return false;
        }).mousedown(function(evt) {
            if (that.options.disabled) {
                return;
            }
            that.mousedownTimeout = window.setTimeout(function() {
                that.mousedownInterval = window.setInterval(function() {
                    incr_cur_pos(evt);
                }, 50);
            }, that.options.timeout);
        }).bind('mouseup mouseout', function(evt) {
            if (that.options.disabled) {
                return;
            }
            that._mouseup(evt);
        });
        this._refresh();
    };
    fnSB._mouseup = function(evt) {
        if (this.options.disabled) {
            return;
        }
        var that = this;
        window.clearTimeout(that.mousedownTimeout);
        that.mousedownTimeout = null;
        window.clearInterval(that.mousedownInterval);
        that.mousedownInterval = null;
    };
    fnSB._setDragLimits = function() {
        var top, bot;
        if (this.direction === "vertical") {
            top = this.element.offset().top + 17;
            bot = (top + this.length - 34 - this.slider_length);
            this.$slider.draggable("option", "containment", [0, top, 0, bot]);
        } else {
            top = this.element.offset().left + 17;
            bot = (top + this.length - 34 - this.slider_length);
            this.$slider.draggable("option", "containment", [top, 0, bot, 0]);
        }
    };
    fnSB._refresh = function() {
        if (this.options.num_eles <= 1) {
            this.element.css("display", "none");
        } else {
            this.element.css("display", "");
        }
        this.num_eles = this.options.num_eles;
        this.length = this.options.length;
        this._validateCurPos();
        this.$slider.css("display", "");
        if (this.direction === "vertical") {
            this.element.height(this.length);
            this._setSliderBgLength();
            this.scroll_space = this.length - 34 - this.slider_length;
            if (this.scroll_space < 4 || this.num_eles <= 1) {
                this.$slider.css("display", "none");
            }
            this.updateSliderPos(this.options.cur_pos);
        } else {
            this.element.width(this.length);
            this._setSliderBgLength();
            this.scroll_space = this.length - 34 - this.slider_length;
            if (this.scroll_space < 4 || this.num_eles <= 1) {
                this.$slider.css("display", "none");
            }
            this.updateSliderPos(this.options.cur_pos);
        }
    };
    fnSB._setSliderBgLength = function() {
        var outerHeight = this.length;
        var innerHeight = this.num_eles * 40 + outerHeight;
        var avail_space = outerHeight - 34;
        var slider_height = avail_space * outerHeight / innerHeight;
        var slider_bg_ht = Math.round((slider_height - (8 + 3 + 3)) / 2);
        if (slider_bg_ht < 1) {
            slider_bg_ht = 1;
        }
        this.slider_length = 8 + 3 + 3 + 2 * slider_bg_ht;
        if (this.direction === "vertical") {
            $("div.vert-slider-bg", this.element).height(slider_bg_ht);
            this.$slider.height(this.slider_length);
        } else {
            $(".horiz-slider-bg", this.element).width(slider_bg_ht);
            this.$slider.width(this.slider_length);
        }
    };
    fnSB._updateCurPosAndTrigger = function(evt, top) {
        var that = this;
        var $slider = that.$slider;
        if (top == null) {
            top = (that.direction === "vertical") ? parseInt($slider[0].style.top, 10) : parseInt($slider[0].style.left, 10);
        }
        var scroll_space = that.length - 34 - ((that.direction === "vertical") ? $slider[0].offsetHeight : $slider[0].offsetWidth);
        var cur_pos = (top - 17) * (that.num_eles - 1) / scroll_space;
        cur_pos = Math.round(cur_pos);
        if (that.options.cur_pos !== cur_pos) {
            if (this.dragging) {
                if (this.topWhileDrag !== null) {
                    if (this.topWhileDrag < top && that.options.cur_pos > cur_pos) {
                        return;
                    } else if (this.topWhileDrag > top && that.options.cur_pos < cur_pos) {
                        return;
                    }
                }
                this.topWhileDrag = top;
            }
            that.options.cur_pos = cur_pos;
            this.scroll(evt);
        }
    };
    fnSB._setNormalPace = function(evt) {
        if (this.timer) {
            window.clearInterval(this.timer);
            this.timer = null;
        }
        var that = this;
        that.timer = window.setInterval(function() {
            var $slider = that.$slider;
            var top = (that.direction === "vertical") ? parseInt($slider[0].style.top, 10) : parseInt($slider[0].style.left, 10);
            if (that.prev_top === top) {
                that._updateCurPosAndTrigger(evt, top);
                window.clearInterval(that.timer);
                that.timer = null;
            }
            that.prev_top = top;
        }, 20);
    };
    fnSB.setNumEles = function(num_eles) {
        this.num_eles = this.options.num_eles = num_eles;
        this.updateSliderPos();
    };
    fnSB._validateCurPos = function() {
        if (this.options.cur_pos >= this.num_eles) {
            this.options.cur_pos = this.num_eles - 1;
        }
        if (this.options.cur_pos < 0) {
            this.options.cur_pos = 0;
        }
    };
    fnSB.updateSliderPos = function() {
        var sT = (this.scroll_space * (this.options.cur_pos)) / (this.num_eles - 1);
        if (this.direction === "vertical") {
            this.$slider.css("top", 17 + sT);
        } else {
            this.$slider.css("left", 17 + sT);
        }
    };
    fnSB.scroll = function(evt) {
        var thisOptions = this.options;
        this._trigger("scroll", evt, {
            cur_pos: thisOptions.cur_pos,
            num_eles: thisOptions.num_eles
        });
    };
    fnSB._setOption = function(key, value) {
        if (key === "disabled") {
            if (value === true) {
                this.$slider.draggable("disable");
            } else {
                this.$slider.draggable("enable");
            }
        }
        $.Widget.prototype._setOption.call(this, key, value);
    };
    fnSB._setOptions = function() {
        $.Widget.prototype._setOptions.apply(this, arguments);
        this._refresh();
    };
    $.widget("paramquery.pqScrollBar", fnSB);
})(jQuery);
/**
 * ParamQuery Grid a.k.a. pqGrid*/ (function($) {
    var cCreateTable = function(that) {
        this.that = that;
    };
    var _pG = cCreateTable.prototype;
    _pG._generateTables = function(objP) {
        var that = this.that,
            thisColModel = that.colModel,
            noColumns = thisColModel.length,
            thisOptions = that.options,
            columnBorders = thisOptions.columnBorders,
            rowBorders = thisOptions.rowBorders,
            SM = thisOptions.scrollModel,
            outerWidths = that.outerWidths;
        that._bufferObj_calcInitFinal();
        var row = (objP) ? 0 : that.init,
            finalRow = (objP) ? objP.data.length - 1 : that["final"],
            prevGroupVal = "",
            GM = thisOptions.groupModel,
            hidearrHS1 = [],
            GMtrue = (GM && GM.grouping === "local") ? true : false,
            TVM = thisOptions.treeViewModel,
            data = (objP && objP.data) ? objP.data : (GMtrue ? that.dataGM : (that.data)),
            offset = that.getRowIndxOffset();
        if (!objP && (row === null || finalRow === null)) {
            that.$cont.empty();
            that.$tbl = null;
            return;
        }
        if (!objP) {
            that._trigger("beforeTableView", null, {
                data: that.data,
                curPos: row,
                finalPos: finalRow,
                curPage: that.dataModel.curPage
            });
        }
        var const_cls = "pq-grid-cell ";
        if (!thisOptions.wrap || objP) {
            const_cls += "pq-wrap-text ";
        }
        var tblClass = 'pq-grid-table ';
        if (columnBorders) {
            tblClass += "pq-grid-td-border-right ";
        }
        if (rowBorders) {
            tblClass += "pq-grid-td-border-bottom ";
        }
        var buffer = ["<table class='" + tblClass + "' cellpadding=0 cellspacing=0 >"]; {
            buffer.push("<tr class='pq-row-hidden'>");
            var wd, col, column;
            if (that.numberCell) {
                wd = that.numberCellWidth + 1;
                buffer.push("<td style='width:" + wd + "px;' ></td>");
            }
            for (col = 0; col < noColumns; col++) {
                column = thisColModel[col];
                if (column.hidden) {
                    continue;
                } else if (that.hidearrHS[col]) {
                    hidearrHS1.push(col);
                    continue;
                }
                wd = outerWidths[col];
                buffer.push("<td style='width:" + wd + "px;' pq-top-col-indx=" + col + "></td>");
            }
            for (var k = 0; k < hidearrHS1.length; k++) {
                col = hidearrHS1[k];
                column = thisColModel[col];
                wd = outerWidths[col];
                buffer.push("<td style='width:" + wd + "px;'></td>");
            }
            buffer.push("</tr>");
        }
        this.offsetRow = null;
        do {
            var rowObj = data[row],
                rowData = GMtrue ? rowObj.data : rowObj,
                rowIndx = GMtrue ? rowObj.rowIndx : row,
                hidden = rowData.hidden,
                row_str = "";
            if (hidden) {
                if (row === finalRow) {
                    break;
                }
                row++;
                continue;
            }
            if (this.offsetRow === null && rowIndx !== null) {
                this.offsetRow = (row - rowIndx);
            }
            if (GM && rowObj.groupTitle) {
                var obj = that._calcRightEdgeCol(thisColModel.length - 1);
                row_str = "<tr class='pq-group-row'><td colspan='" + obj.cols + "' style='width:" + obj.width + "px;'><div>" + rowObj.groupTitle + "</div></td></tr>";
                buffer.push(row_str);
            } else if (GM && rowObj.groupSummary) {
                that._generateSummaryRow(rowData, rowIndx, thisColModel, noColumns, hidearrHS1, offset, const_cls, buffer);
            } else {
                this._generateRow(rowData, rowIndx, thisColModel, noColumns, hidearrHS1, offset, const_cls, buffer, objP);
            }
            if (SM.scrollTillLastRow) {} else {
                if (row === finalRow) {
                    break;
                }
                row++;
            }
        }
        while (1 === 1);
        that.scrollMode = false;
        if (!SM.scrollTillLastRow) {
            $.measureTime(function() {
                buffer.push("</table>");
                var str = buffer.join("");
                if (objP) {
                    objP.$cont.empty();
                    var $tbl = $(str);
                    objP.$cont.append($tbl);
                    if (!that.tables) {that.tables = [];}
                    var indx = -1;
                    for (var l = 0; l < that.tables.length; l++) {
                        var cont = that.tables[l].cont;
                        if (cont === objP.$cont[0]) {
                            indx = l;
                        }
                    }
                    if (indx === -1) {
                        that.tables.push({
                            $tbl: $tbl,
                            cont: objP.$cont[0]
                        });
                    } else {
                        that.tables[indx].$tbl = $tbl;
                    }
                } else {
                    if (that.$tbl === undefined) {
                        that.$tbl = $(str);
                        that.$cont.append(that.$tbl);
                    } else {
                        if (that.$td_edit !== null) {
                            that.quitEditMode();
                        }
                        that.$cont.empty();
                        that.$tbl = $(str);
                        that.$cont.append(that.$tbl);
                    }
                }
            }, 'append stuff inside _generateTable');
        }
        if (!objP){
            window.setTimeout(function() {
                that._fixTableViewPort();
                that._trigger("refresh", null, {
                    dataModel: that.dataModel,
                    data: that.data,
                    initV: that.init,
                    initH: that.initH
                });
            }, 0);
        }
    };
    _pG._renderCell = function(objP) {
        var that = this.that,
            rowIndxPage = objP.rowIndxPage,
            rowIndx = objP.rowIndx,
            rowData = objP.rowData,
            colIndx = objP.colIndx,
            $td = objP.$td,
            expandIndx = objP.expandIndx,
            expanded = objP.expanded,
            treeMarginLeft = objP.treeMarginLeft,
            isLeaf = objP.isLeaf,
            column = objP.column,
            dataIndx = column.dataIndx,
            wrap = objP.wrap,
            customData = objP.customData;
        var dataCell;
        if (column.render) {
            dataCell = column.render({
                data: that.data,
                dataModel: that.dataModel,
                rowData: rowData,
                rowIndxPage: rowIndxPage,
                rowIndx: rowIndx,
                colIndx: colIndx,
                column: column,
                dataIndx: dataIndx,
                customData: customData
            });
        } else {
            dataCell = rowData[dataIndx];
        }
        if (dataCell === "" || dataCell === undefined) {dataCell = "&nbsp;";}
        var cls = "pq-td-div";
        if (wrap === false) {cls += " pq-wrap-text";}
        var strTree = "";
        if (dataIndx === expandIndx) {
            var leafClass = '';
            if (isLeaf) {
                leafClass = 'ui-icon-radio-off';
            } else if (expanded) {
                leafClass = 'ui-icon-triangle-1-se pq-tree-expand-icon';
            } else {
                leafClass = 'ui-icon-triangle-1-e pq-tree-expand-icon';
            }
            strTree = "<div class='pq-tree-icon-container' style='width:" + treeMarginLeft + "px;'>\
			<div class='ui-icon " + leafClass + " pq-tree-icon' ></div></div>";
        }
        var str = "<div class='" + cls + "'>" + strTree + dataCell + "</div>";
        if ($td !== undefined) {
            $td.html(str);
        }
        return str;
    }
    _pG._generateRow = function(rowData, rowIndx, thisColModel, noColumns, hidearrHS1, offset, const_cls, buffer, objP) {
        var row_cls = "pq-grid-row";
        var that = this.that,
            thisOptions = that.options,
            TVM = thisOptions.treeViewModel,
            columnBorders = thisOptions.columnBorders,
            wrap = thisOptions.wrap,
            customData = thisOptions.customData;
        var objRender;
        if (TVM) {
            levelIndx = TVM.levelIndx;
            leafIndx = TVM.leafIndx;
            expandIndx = TVM.expandIndx;
            isLeaf = rowData[leafIndx];
            level = rowData[levelIndx];
            treeMarginLeft = (level + 1) * 18;
            expanded = that._getRowPQData(rowIndx, "expanded");
            objRender = {
                rowIndx: rowIndx + offset,
                rowIndxPage: rowIndx,
                rowData: rowData,
                wrap: wrap,
                customData: customData,
                treeMarginLeft: treeMarginLeft,
                expandIndx: expandIndx,
                isLeaf: isLeaf,
                expanded: expanded
            };
        } else {
            objRender = {
                rowIndx: rowIndx + offset,
                rowIndxPage: rowIndx,
                rowData: rowData,
                wrap: wrap,
                customData: customData
            };
        }
        if (thisOptions.oddRowsHighlight && (rowIndx / 2 == parseInt(rowIndx / 2))) row_cls += " pq-grid-oddRow";
        if (rowData.selectedRow) {
            row_cls += " pq-row-select ui-state-highlight";
        }
        buffer.push("<tr pq-row-indx='" + rowIndx + "' class='" + row_cls + "' >");
        if (that.numberCell) {
            buffer.push("<td style='width:" + that.numberCellWidth + "px;' class='pq-grid-number-cell ui-state-default'>\
		<div class='pq-td-div'>" + ((objP) ? "&nbsp;" : (rowIndx + 1)) + "</div></td>")
        }
        for (var col = 0; col < noColumns; col++) {
            var column = thisColModel[col],
                dataIndx = column.dataIndx;
            objRender.column = column;
            objRender.colIndx = col;
            var cellSelection = false; {
                var selectedDataIndices = rowData.selectedDataIndices;
                if (selectedDataIndices) {
                    cellSelection = selectedDataIndices[dataIndx];
                }
            }
            if (column.hidden) {
                continue;
            } else if (that.hidearrHS[col]) {
                continue;
            }
            var strStyle = "";
            var cls = const_cls;
            if (column.align == "right") {
                cls += ' pq-align-right';
            } else if (column.align == "center") {
                cls += ' pq-align-center';
            }
            if (col == that.freezeCols - 1 && columnBorders) {
                cls += " pq-last-freeze-col";
            }
            if (column.className) {
                cls = cls + " " + column.className;
            }
            if (cellSelection) {
                cls = cls + " pq-cell-select ui-state-highlight";
            }
            var indxStr = "pq-col-indx='" + col + "'";
            if (objP) {
                indxStr += " pq-dataIndx='" + dataIndx + "'";
            }
            var str = "<td class='" + cls + "' style='" + strStyle + "' " + indxStr + " >\
			" + this._renderCell(objRender) + "</td>";
            buffer.push(str)
        }
        for (var k = 0; k < hidearrHS1.length; k++) {
            var col = hidearrHS1[k];
            var column = thisColModel[col],
                dataIndx = column.dataIndx;
            objRender.column = column;
            objRender.colIndx = col;
            var strStyle = "";
            strStyle += "visibility:hidden;";
            var cls = const_cls;
            if (column.align == "right") {
                cls += ' pq-align-right';
            } else if (column.align == "center") {
                cls += ' pq-align-center';
            }
            var indxStr = "pq-col-indx='" + col + "'";
            if (objP) {
                indxStr += " pq-dataIndx='" + dataIndx + "'";
            }
            var str = "<td class='" + cls + "' style='" + strStyle + "' " + indxStr + ">\
			" + this._renderCell(objRender) + "</td>";
            buffer.push(str)
        }
        buffer.push("</tr>");
        return buffer;
    }
    var cRows = function(that) {
        this.that = that;
        this.options = that.options;
        this.selectedRows = [];
        this.isDirty = false;
    }
    var _p = cRows.prototype;
    _p._addToData = function(objP) {
        var location = this.options.dataModel.location;
        var data = (location == "remote") ? this.that.data : this.options.dataModel.data,
            indx = (location == "remote") ? objP.rowIndxPage : objP.rowIndx,
            rowData = data[indx];
        rowData.selectedRow = true;
    }
    _p.setDirty = function() {
        if (this.selectedRows.length > 0) {
            this.isDirty = true;
        }
    }
    _p.removeAll = function(objP) {
        if (this.isDirty) {
            this.refresh();
        }
        var raiseEvent = objP.raiseEvent,
            that = this.that,
            offset = (objP.offset == null) ? that.getRowIndxOffset() : obj.offset;
        var selectedRows = this.selectedRows.slice(0);
        for (var i = 0; i < selectedRows.length; i++) {
            var selR = selectedRows[i];
            var rowIndx = selR.rowIndx;
            this.remove({
                rowIndx: rowIndx,
                offset: offset
            });
        }
    }
    _p.refresh = function() {
        this.selectedRows = [];
        var data = this.options.dataModel.data;
        if (!data) return;
        for (var i = 0, len = data.length; i < len; i++) {
            var rowData = data[i];
            if (rowData.selectedRow) {
                this.selectedRows.push({
                    rowIndx: i
                });
            }
        }
        this.isDirty = false;
    }
    _p.replace = function(obj) {
        if (this.isDirty) {
            this.refresh();
        }
        var rowIndx = obj.rowIndx,
            offset = obj.offset = (obj.offset == null) ? this.that.getRowIndxOffset() : obj.offset,
            rowIndxPage = obj.rowIndxPage = rowIndx - offset;
        $tr = obj.$tr,
        evt = obj.evt;
        this.removeAll({
            raiseEvent: true
        });
        this.add(obj);
    }
    _p.add = function(objP) {
        if (this.isDirty) {
            this.refresh();
        }
        var rowIndx = objP.rowIndx,
            that = this.that,
            offset = (objP.offset == null) ? that.getRowIndxOffset() : objP.offset,
            rowIndxPage = objP.rowIndxPage = rowIndx - offset,
            $tr = objP.$tr,
            evt = objP.evt,
            selectedRows = this.selectedRows,
            isSelected = this.isSelected(objP);
        if (isSelected == null) {
            return false;
        } else if (this.isSelected(objP) == false) {
            var ret = this._boundRow(objP),
                $tr = ret;
            selectedRows.push({
                rowIndx: rowIndx
            });
            this._addToData(objP);
            that._trigger("rowSelect", evt, {
                rowIndx: rowIndx,
                rowIndxPage: rowIndxPage,
                data: that.data,
                dataModel: that.dataModel,
                $tr: $tr
            });
        } else {
            var indx = this.indexOf(objP);
            var arr2 = this.selectedRows.splice(indx, 1);
            this.selectedRows = this.selectedRows.concat(arr2);
        }
    }
    _p.remove = function(objP) {
        if (this.isDirty) {
            this.refresh();
        }
        var rowIndx = objP.rowIndx,
            that = this.that,
            offset = (objP.offset == null) ? that.getRowIndxOffset() : objP.offset,
            rowIndxPage = objP.rowIndxPage = rowIndx - offset,
            evt = objP.evt,
            init = (that.init + offset - that.offsetRow),
            finall = (that['final'] + offset - that.offsetRow);
        if (this.isSelected(objP)) {
            var $tr = that.getRow({
                rowIndxPage: rowIndxPage
            });
            if ($tr) $tr.removeClass("pq-row-select ui-state-highlight");
            that._trigger("rowUnSelect", evt, {
                rowIndx: rowIndx,
                dataModel: that.dataModel,
                $tr: $tr
            });
            this._removeFromData(objP);
        }
        var indx = this.indexOf(objP);
        if (indx != -1) {
            this.selectedRows.splice(indx, 1);
        }
    }
    _p.indexOf = function(obj) {
        if (this.isDirty) {
            this.refresh();
        }
        var rowIndx = obj.rowIndx,
            selectedRows = this.selectedRows;
        for (var i = 0; i < selectedRows.length; i++) {
            if (selectedRows[i].rowIndx == rowIndx) {
                return i;
            }
        }
        return -1;
    }
    _p.isSelected = function(objP) {
        if (this.isDirty) {
            this.refresh();
        }
        var location = this.options.dataModel.location;
        var data = (location == "remote") ? this.that.data : this.options.dataModel.data,
            indx = (location == "remote") ? objP.rowIndxPage : objP.rowIndx,
            rowData = data[indx];
        return (rowData) ? ((rowData.selectedRow == null) ? false : rowData.selectedRow) : null;
    }
    _p.getSelection = function() {
        if (this.isDirty) {
            this.refresh();
        }
        return this.selectedRows;
    }
    _p._removeFromData = function(objP) {
        var location = this.options.dataModel.location;
        var data = (location == "remote") ? this.that.data : this.options.dataModel.data,
            indx = (location == "remote") ? objP.rowIndxPage : objP.rowIndx,
            rowData = data[indx];
        rowData.selectedRow = false;
    }
    _p._boundRow = function(obj) {
        var rowIndxPage = obj.rowIndxPage,
            rowIndx = obj.rowIndx,
            that = this.that,
            $tr = (obj.$tr == null) ? that.getRow({
                rowIndxPage: rowIndxPage
            }) : obj.$tr;
        if ($tr == null || $tr.length == 0) {
            return false;
        }
        $tr.addClass("pq-row-select ui-state-highlight");
        return $tr;
    }
    var cCells = function(that) {
        this.options = that.options,
        this.that = that,
        this.selectedCells = [];
    }
    var _pC = cCells.prototype;
    _pC._addToData = function(objP) {
        var location = this.options.dataModel.location;
        var data = (location == "remote") ? this.that.data : this.options.dataModel.data,
            indx = (location == "remote") ? objP.rowIndxPage : objP.rowIndx,
            rowData = data[indx];
        if (!rowData.selectedDataIndices) {
            rowData.selectedDataIndices = {};
        }
        rowData.selectedDataIndices[objP.dataIndx] = true;
    }
    _pC._removeFromData = function(objP) {
        var location = this.options.dataModel.location;
        var data = (location == "remote") ? this.that.data : this.options.dataModel.data,
            indx = (location == "remote") ? objP.rowIndxPage : objP.rowIndx,
            rowData = data[indx];
        if (rowData && rowData.selectedDataIndices) {
            rowData.selectedDataIndices[objP.dataIndx] = false;
        }
    }
    _pC.setDirty = function() {
        if (this.selectedCells.length > 0) {
            this.isDirty = true;
        }
    }
    _pC.removeAll = function(objP) {
        if (this.isDirty) {
            this.refresh();
        }
        var raiseEvent = objP.raiseEvent,
            that = this.that,
            offset = (objP.offset == null) ? that.getRowIndxOffset() : obj.offset;
        var selectedCells = this.selectedCells.slice(0);
        for (var i = 0; i < selectedCells.length; i++) {
            var selC = selectedCells[i];
            var rowIndx = selC.rowIndx,
                dataIndx = selC.dataIndx;
            this.remove({
                rowIndx: rowIndx,
                offset: offset,
                dataIndx: dataIndx
            });
        }
    }
    _pC.isSelected = function(objP) {
        if (this.isDirty) {
            this.refresh();
        }
        var location = this.options.dataModel.location;
        var that = this.that,
            data = (location == "remote") ? that.data : this.options.dataModel.data,
            indx = (location == "remote") ? objP.rowIndxPage : objP.rowIndx,
            dataIndx = (objP.dataIndx == null) ? that.colModel[objP.colIndx].dataIndx : objP.dataIndx,
            rowData = data[indx];
        if (rowData == null) {
            return null;
        }
        if (rowData.selectedDataIndices) {
            if (rowData.selectedDataIndices[dataIndx]) {
                return true;
            }
        }
        return false;
    }
    _pC.refresh = function() {
        this.selectedCells = [];
        var data = this.options.dataModel.data;
        if (!data) return;
        for (var i = 0, len = data.length; i < len; i++) {
            var rowData = data[i];
            if (rowData.selectedIndices && rowData.selectedDataIndices[dataIndx]) {
                this.selectedCells.push({
                    rowIndx: i,
                    dataIndx: dataIndx
                });
            }
        }
        this.isDirty = false;
    }
    _pC.replace = function(obj) {
        if (this.isDirty) {
            this.refresh();
        }
        var rowIndx = obj.rowIndx,
            colIndx = obj.colIndx,
            offset = obj.offset = (obj.offset == null) ? this.that.getRowIndxOffset() : obj.offset,
            rowIndxPage = obj.rowIndxPage = rowIndx - offset;
        $td = obj.$td,
        evt = obj.evt;
        this.removeAll({
            raiseEvent: true
        });
        this.add(obj);
    }
    _pC.add = function(objP) {
        if (this.isDirty) {
            this.refresh();
        }
        var rowIndx = objP.rowIndx,
            that = this.that,
            offset = (objP.offset == null) ? that.getRowIndxOffset() : objP.offset,
            rowIndxPage = objP.rowIndxPage = rowIndx - offset,
            colIndx = objP.colIndx = (objP.colIndx == null) ? that.getColIndxFromDataIndx(objP.dataIndx) : objP.colIndx,
            dataIndx = objP.dataIndx = (objP.dataIndx == null) ? that.colModel[colIndx].dataIndx : objP.dataIndx,
            evt = objP.evt,
            selectedCells = this.selectedCells,
            isSelected = this.isSelected(objP);
        if (isSelected == null) {
            return false;
        } else if (isSelected == false) {
            var $td = that.getCell({
                rowIndxPage: rowIndxPage,
                colIndx: colIndx
            });
            if ($td) $td.addClass("pq-cell-select ui-state-highlight");
            selectedCells.push({
                rowIndx: rowIndx,
                dataIndx: dataIndx
            });
            this._addToData(objP);
            that._trigger("cellSelect", evt, {
                rowIndx: rowIndx,
                rowIndxPage: rowIndxPage,
                colIndx: colIndx,
                dataIndx: dataIndx,
                data: that.data,
                dataModel: that.dataModel,
                $td: $td
            });
        } else {
            var indx = this.indexOf(objP);
            var arr2 = this.selectedCells.splice(indx, 1);
            this.selectedCells = this.selectedCells.concat(arr2);
        }
    }
    _pC.remove = function(objP) {
        if (this.isDirty) {
            this.refresh();
        }
        var rowIndx = objP.rowIndx,
            that = this.that,
            dataIndx = (objP.dataIndx == null) ? that.colModel[objP.colIndx].dataIndx : objP.dataIndx,
            colIndx = (objP.colIndx == null) ? that.getColIndxFromDataIndx(dataIndx) : objP.colIndx,
            offset = (objP.offset == null) ? that.getRowIndxOffset() : objP.offset,
            rowIndxPage = objP.rowIndxPage = rowIndx - offset,
            evt = objP.evt,
            init = (that.init + offset),
            finall = (that['final'] + offset);
        if (this.isSelected(objP)) {
            var $td = that.getCell({
                rowIndxPage: rowIndxPage,
                colIndx: colIndx
            });
            if ($td) $td.removeClass("pq-cell-select ui-state-highlight");
            that._trigger("cellUnSelect", evt, {
                rowIndx: rowIndx,
                colIndx: colIndx,
                dataIndx: dataIndx,
                dataModel: that.dataModel,
                $td: $td
            });
            this._removeFromData(objP);
        }
        var indx = this.indexOf(objP);
        if (indx != -1) {
            this.selectedCells.splice(indx, 1);
        }
    }
    _pC.indexOf = function(obj) {
        if (this.isDirty) {
            this.refresh();
        }
        var rowIndx = obj.rowIndx,
            that = this.that,
            dataIndx = obj.dataIndx = (obj.dataIndx == null) ? that.colModel[obj.colIndx].dataIndx : obj.dataIndx;
        var selectedCells = this.selectedCells;
        for (var i = 0; i < selectedCells.length; i++) {
            var sCell = selectedCells[i];
            if (sCell.rowIndx == rowIndx && sCell.dataIndx == dataIndx) {
                return i;
            }
        }
        return -1;
    }
    _pC.getSelection = function() {
        if (this.isDirty) {
            this.refresh();
        }
        return this.selectedCells;
    }
    var fn = {};
    fn.options = {
        bottomVisible: true,
        colModel: null,
        columnBorders: true,
        customData: null,
        dataModel: {
            cache: false,
            curPage: 0,
            totalPages: 0,
            rPP: 10,
            location: "local",
            sorting: "local",
            sortDir: "up",
            method: "GET",
            rPPOptions: [10, 20, 50, 100]
        },
        direction: "",
        draggable: false,
        editable: true,
        editModel: {
            clicksToEdit: 1,
            saveKey: ''
        },
        flexHeight: false,
        flexWidth: false,
        freezeCols: 0,
        getDataIndicesFromColIndices: true,
        height: 400,
        hoverMode: 'row',
        minWidth: 50,
        numberCell: true,
        numberCellWidth: 50,
        oddRowsHighlight: true,
        resizable: false,
        roundCorners: true,
        rowBorders: true,
        scrollModel: {
            pace: "fast",
            horizontal: true
        },
        selectionModel: {
            type: 'row',
            mode: 'range'
        },
        sortable: true,
        title: "&nbsp;",
        topVisible: true,
        treeViewModel: null,
        width: 600,
        wrap: true
    }
    fn._regional = {
        strLoading: "Loading",
        strAdd: "Add",
        strEdit: "Edit",
        strDelete: "Delete",
        strSearch: "Search",
        strNothingFound: "Nothing found",
        strSelectedmatches: "Selected {0} of {1} match(es)",
        strPrevResult: "Previous Result",
        strNextResult: "Next Result"
    }
    $.extend(fn.options, fn._regional);
    fn._destroyResizable = function() {
        if (this.element.data("resizable")) this.element.resizable('destroy');
    }
    fn._destroyDraggable = function() {
        if (this.element.data("draggable")) this.element.draggable('destroy');
    }
    fn._disable = function() {
        if (this.$disable == null) this.$disable = $("<div class='pq-grid-disable'></div>").css("opacity", 0.2).appendTo(this.element);
    }
    fn._enable = function() {
        if (this.$disable) {
            this.element[0].removeChild(this.$disable[0]);
            this.$disable = null;
        }
    }
    fn._destroy = function() {
        this._destroyResizable();
        this._destroyDraggable();
        this.element.empty();
        this.element.css('height', "");
        this.element.css('width', "");
        this.element.removeClass('pq-grid ui-widget ui-widget-content ui-corner-all').removeData();
    }
    fn._findCellFromEvtCoords = function(evt) {
        if (this.$tbl == null) {
            return {
                $td: null,
                rowIndxPage: null,
                colIndx: null
            };
        }
        var top = evt.pageY - this.$cont.offset().top;
        var left = evt.pageX - this.$cont.offset().left;
        var $trs = this.$tbl.find("tr");
        var indx = 0,
            rowIndxPage = 0,
            colIndx = 0;
        for (var i = 1; i < $trs.length; i++) {
            if ($trs[i].offsetTop > top) {
                break;
            } else {
                indx++;
            }
        }
        var $tr = $($trs[indx]);
        rowIndxPage = parseInt($tr.attr('pq-row-indx'));
        var $tds = $tr.find("td");
        indx = 0;
        for (var i = 1; i < $tds.length; i++) {
            if ($tds[i].offsetLeft > left) {
                break;
            } else {
                indx++;
            }
        }
        var $td = $($tds[indx]);
        if ($td[0].nodeName.toUpperCase() != "TD") {
            $td = $(evt.target).parent("td");
        }
        colIndx = parseInt($td.attr('pq-col-indx'))
        return {
            $td: $td,
            rowIndxPage: rowIndxPage,
            colIndx: colIndx
        };
    }
    fn._rangeSelectRow = function(initRowIndx, finalRowIndx, evt) {
        var that = this,
            rowSelection = that.sRows.getSelection(),
            rowSelection2 = rowSelection.slice(0);
        for (var i = 0; i < rowSelection2.length; i++) {
            var rowS = rowSelection2[i],
                row = rowS.rowIndx;
            if (row < initRowIndx || row > finalRowIndx) {
                that.sRows.remove({
                    rowIndx: row
                });
            }
        }
        for (var row = initRowIndx; row <= finalRowIndx; row++) {
            that.sRows.add({
                rowIndx: rowIndx
            });
        }
    }
    fn._rangeSelect = function(initRowIndx, initColIndx, finalRowIndx, finalColIndx, evt) {
        var that = this,
            cellSelection = that.sCells.getSelection(),
            cellSelection2 = cellSelection.slice(0);
        for (var i = 0; i < cellSelection2.length; i++) {
            var cellS = cellSelection2[i],
                row = cellS.rowIndx,
                dataIndx = cellS.dataIndx,
                col = this.getColIndxFromDataIndx(dataIndx);
            if (row < initRowIndx || row > finalRowIndx) {
                that.sCells.remove({
                    rowIndx: row,
                    colIndx: col,
                    dataIndx: dataIndx
                });
            } else if (row == initRowIndx && col < initColIndx) {
                that.sCells.remove({
                    rowIndx: row,
                    colIndx: col,
                    dataIndx: dataIndx
                });
            } else if (row == finalRowIndx && col > finalColIndx) {
                that.sCells.remove({
                    rowIndx: row,
                    colIndx: col,
                    dataIndx: dataIndx
                });
            }
        }
        for (var col = 0; col < that.colModel.length; col++) {
            var column = that.colModel[col];
            if (column.hidden) {
                continue;
            }
            var dataIndx = column.dataIndx;
            var row = initRowIndx;
            do {
                if (row == initRowIndx && col < initColIndx) {} else if (row == finalRowIndx && col > finalColIndx) {
                    break;
                } else {
                    that.sCells.add({
                        rowIndx: row,
                        colIndx: col,
                        dataIndx: dataIndx
                    });
                }
                row++;
            } while (row <= finalRowIndx);
        }
    }
    fn._blockSelect = function(initRowIndx, initColIndx, finalRowIndx, finalColIndx, evt) {
        var that = this,
            cellSelection = that.sCells.getSelection(),
            cellSelection2 = cellSelection.slice(0);
        for (var i = 0; i < cellSelection2.length; i++) {
            var cellS = cellSelection2[i],
                row = cellS.rowIndx,
                dataIndx = cellS.dataIndx,
                col = this.getColIndxFromDataIndx(dataIndx);
            if (col < initColIndx || col > finalColIndx) {
                that.sCells.remove({
                    rowIndx: row,
                    dataIndx: dataIndx,
                    colIndx: col
                });
            } else if (row < initRowIndx || row > finalRowIndx) {
                that.sCells.remove({
                    rowIndx: row,
                    dataIndx: dataIndx,
                    colIndx: col
                });
            }
        }
        for (var col = initColIndx; col <= finalColIndx; col++) {
            var column = that.colModel[col];
            var dataIndx = column.dataIndx;
            if (column.hidden) {
                continue;
            }
            var row = initRowIndx;
            do {
                that.sCells.add({
                    rowIndx: row,
                    colIndx: col,
                    dataIndx: dataIndx
                });
                row++;
            } while (row <= finalRowIndx);
        }
    }
    fn._create = function() {
        this.cTable = new cCreateTable(this);
        this.minWidth = this.options.minWidth;
        this.cols = [];
        this.dataModel = this.options.dataModel;
        this.widths = [];
        this.outerWidths = [];
        this.rowHeight = 22;
        this.hidearr = [];
        this.hidearrHS = [];
        this.numberCell = this.options.numberCell;
        this.numberCellWidth = this.options.numberCellWidth;
        this.freezeCols = this.options.freezeCols;
        this.tables = [];
        var that = this;
        this.$tbl = null;
        this._refreshHeader();
        this._refreshWidths();
        this._computeOuterWidths();
        this.element.empty().addClass('pq-grid ui-widget ui-widget-content' + (this.options.roundCorners ? ' ui-corner-all' : ''))
            .append("<div class='pq-grid-top ui-widget-header" + (this.options.roundCorners ? " ui-corner-top" : "") + "'>\
		<div class='pq-grid-title'>&nbsp;</div></div>\
	<div class='pq-grid-inner' tabindex='0'><div class='pq-grid-right'> \
		<div class='pq-header-outer ui-widget-header'>\
			<span class='pq-grid-header ui-state-default'></span><span class='pq-grid-header ui-state-default'></span>\
		</div>\
		<div class='pq-cont-right' >\
		<div class='pq-cont' ></div>\
		</div> \
		</div></div>\
	<div class='pq-grid-bottom" + (this.options.roundCorners ? " ui-corner-bottom" : "") + "'>\
	<div class='pq-grid-footer'>&nbsp;</div>\
	</div>");
        if (this.options.direction == "rtl") {
            this.element.addClass("pq-rtl");
        }
        this._trigger("render", null, {
            dataModel: this.options.dataModel,
            colModel: this.colModel
        });
        this.$top = $("div.pq-grid-top", this.element);
        this.$title = $("div.pq-grid-title", this.element);
        this.$toolbar = $("div.pq-grid-toolbar", this.element);
        this.$grid_inner = $("div.pq-grid-inner", this.element);
        this.$grid_right = $(".pq-grid-right", this.element);
        this.$header_o = $("div.pq-header-outer", this.$grid_right);
        if (!this.options.topVisible) {
            this.$top.css("display", "none");
        }
        this.$header = $(".pq-grid-header", this.$grid_right);
        this.$header_left = $(this.$header[0]);
        this.$header_right = $(this.$header[1]);
        this.$bottom = $("div.pq-grid-bottom", this.element);
        if (!this.options.bottomVisible) {
            this.$bottom.css("display", "none");
        }
        this.$footer = $("div.pq-grid-footer", this.element);
        this.$cont_o = $("div.pq-cont-right", this.$grid_right);
        this.$cont_fixed = $("div.pq-cont-fixed", this.$grid_right);
        this.$cont = $("div.pq-cont", this.$grid_right);
        this.$cont.on("click", function(evt) {
            return that._onClickCont(evt);
        });
        this.$cont.on("click", ".pq-tree-expand-icon", function(evt) {
            return that.cTreeView._onClickTreeExpandIcon(evt);
        });
        this.$cont.on("click", "td.pq-grid-cell", function(evt) {
            return that._onClickCell(evt);
        });
        this.$cont.on("click", "tr.pq-grid-row", function(evt) {
            return that._onClickRow(evt);
        });
        this.$cont.on("dblclick", "td.pq-grid-cell", function(evt) {
            return that._onDblClickCell(evt);
        });
        this.$cont.on("dblclick", "tr.pq-grid-row", function(evt) {
            return that._onDblClickRow(evt);
        });
        this.$cont.on("mouseenter", "td.pq-grid-cell", function(evt) {
            var $td = $(this);
            if (that._trigger("cellMouseEnter", evt, {
                $td: $td,
                dataModel: that.options.dataModel
            }) == false) {
                return false;
            };
            if (that.options.hoverMode == 'cell') {
                that.highlightCell($td);
            }
        });
        this.$cont.on("mouseenter", "tr.pq-grid-row", function(evt) {
            var $tr = $(this);
            if (that._trigger("rowMouseEnter", evt, {
                $tr: $tr,
                dataModel: that.options.dataModel
            }) == false) {
                return false;
            };
            if (that.options.hoverMode == 'row') {
                that.highlightRow($tr);
            }
        });
        this.$cont.on("mouseleave", "td.pq-grid-cell", function(evt) {
            var $td = $(this);
            if (that._trigger("cellMouseLeave", evt, {
                $td: $td,
                dataModel: that.options.dataModel
            }) == false) {
                return false;
            };
            if (that.options.hoverMode == 'cell') {
                that.unHighlightCell($td);
            }
        });
        this.$cont.on("mouseleave", "tr.pq-grid-row", function(evt) {
            var $tr = $(this);
            if (that._trigger("rowMouseLeave", evt, {
                $tr: $tr,
                dataModel: that.options.dataModel
            }) == false) {
                return false;
            };
            if (that.options.hoverMode == 'row') {
                that.unHighlightRow($tr);
            }
        });
        this.$cont.bind('mousewheel DOMMouseScroll', function(evt) {
            return that._onMouseWheel(evt);
        })
        var prevVScroll = 0;
        this.$hvscroll = $("<div class='pq-hvscroll-square ui-widget-content'></div>").appendTo(this.$grid_inner);
        this.$vscroll = $("<div class='pq-vscroll'></div>").appendTo(this.$grid_inner);
        this.prevVScroll = 0;
        this.$vscroll.pqScrollBar({
            pace: that.options.scrollModel.pace,
            direction: "vertical",
            cur_pos: 0,
            scroll: function(evt, obj) {
                that.scrollMode = true;
                that.selectCellRowCallback(function() {
                    that.cTable._generateTables();
                });
                $.measureTime(function() {
                    var num_eles;
                    if (evt.originalEvent && evt.originalEvent.type == "drag") {
                        num_eles = that._setScrollVNumEles();
                    } else {
                        num_eles = that._setScrollVNumEles(true);
                    }
                    if (num_eles <= 1)
                        that._setScrollHLength();
                }, 'scrollBar setNumEles stuff')
            }
        });
        var prevHScroll = 0;
        this.$hscroll = $("<div class='pq-hscroll'></div>").appendTo(this.$grid_inner);
        this.$hscroll.pqScrollBar({
            direction: "horizontal",
            pace: that.options.scrollModel.pace,
            cur_pos: 0,
            scroll: function(evt, obj) {
                that._bufferObj_calcInitFinalH();
                that._refreshHideArrHS();
                that.scrollMode = true;
                that.selectCellRowCallback(function() {
                    that._createHeader();
                    that._refreshHeaderSortIcons();
                    that.cTable._generateTables();
                    that._refreshOtherTables();
                });
            }
        })
        this.element.width(this.options.width).height(this.options.height);
        this.element.width(this.element.width());
        this.disableSelection();
        if (window.opera) {
            this.$grid_inner.bind("keypress.pq-grid", {
                that: this
            }, function(evt) {
                that.keyPressDown(evt);
            })
        } else {
            this.$grid_inner.bind("keydown.pq-grid", {
                that: this
            }, function(evt) {
                that.keyPressDown(evt);
            })
        }
        this._refreshOptions();
        this._refreshTitle();
        var DM = this.options.dataModel;
        if (typeof DM.sortIndx == "number" && DM.sorting == "local" && DM.location == "local") {
            this._refreshDataIndices();
            var colIndx = this.getColIndxFromDataIndx(DM.sortIndx);
            this._sortLocalData(DM.sortIndx, DM.sortDir, this.colModel[colIndx].dataType, DM.data);
        }
        this._initData();
        this._createSelectedRowsObject();
        this._createSelectedCellsObject();
        this._refresh();
    }
    fn._onMouseWheel = function(evt) {
        var that = this;
        var num = 0;
        var evt = evt.originalEvent;
        if (evt.wheelDelta) {
            num = evt.wheelDelta / 120;
        } else if (evt.detail) {
            num = evt.detail * -1 / 3;
        }
        var cur_pos = parseInt(that.$vscroll.pqScrollBar('option', 'cur_pos'));
        var new_pos = cur_pos - num;
        if (new_pos >= 0) {
            that.$vscroll.pqScrollBar('option', 'cur_pos', cur_pos - num).pqScrollBar('scroll');
        }
        return false;
    }
    fn._onDblClickCell = function(evt) {
        var that = this;
        var $td = $(evt.currentTarget);
        var obj = that.getCellIndices($td);
        var rowIndxPage = obj.rowIndxPage,
            offset = that.getRowIndxOffset(),
            rowIndx = rowIndxPage + offset,
            colIndx = obj.colIndx;
        if (that._trigger("cellDblClick", evt, {
            $td: $td,
            dataModel: that.options.dataModel,
            rowIndxPage: rowIndxPage,
            rowIndx: rowIndx,
            colIndx: colIndx
        }) == false) {
            return false;
        };
        if (this.isEditableCell({
            colIndx: colIndx
        }) && that.options.editModel.clicksToEdit > 1) {
            that._setSelection(null);
            if (that.options.selectionModel.type == 'cell') {
                that._setSelection({
                    rowIndx: rowIndx,
                    colIndx: colIndx
                });
            } else if (that.options.selectionModel.type == 'row') {
                that._setSelection({
                    rowIndx: rowIndx
                });
            }
            that._editCell($td);
        }
    }
    fn._onDblClickCell = function(evt) {
        var that = this;
        var $td = $(evt.currentTarget);
        var obj = that.getCellIndices($td);
        var rowIndxPage = obj.rowIndxPage,
            offset = that.getRowIndxOffset(),
            rowIndx = rowIndxPage + offset,
            colIndx = obj.colIndx;
        if (that._trigger("cellDblClick", evt, {
            $td: $td,
            dataModel: that.options.dataModel,
            rowIndx: rowIndx,
            colIndx: colIndx
        }) == false) {
            return false;
        };
        if (this.isEditableCell({
            colIndx: colIndx
        }) && that.options.editModel.clicksToEdit > 1) {
            that._setSelection(null);
            if (that.options.selectionModel.type == 'cell') {
                that._setSelection({
                    rowIndx: rowIndx,
                    colIndx: colIndx
                });
            } else if (that.options.selectionModel.type == 'row') {
                that._setSelection({
                    rowIndx: rowIndx
                });
            }
            that._editCell($td);
        }
    }
    fn._onClickCont = function(evt) {
        var that = this;
        if (that.$td_edit) {
            if (!that._isEditCell(evt)) {
                that.quitEditMode(evt);
            }
        }
    }
    fn._onClickRow = function(evt) {
        var that = this;
        var $tr = $(evt.currentTarget);
        var rowIndxPage = parseInt($tr.attr("pq-row-indx")),
            offset = that.getRowIndxOffset(),
            rowIndx = rowIndxPage + offset;
        var objP = {
            rowIndx: rowIndx,
            evt: evt
        };
        if (that._trigger("rowClick", evt, {
            $tr: $tr,
            rowIndxPage: rowIndxPage,
            rowIndx: rowIndx,
            dataModel: that.options.dataModel
        }) == false) {
            return false;
        };
        var selectionModel = that.options.selectionModel;
        if (selectionModel.type == 'row') {
            var rowSelection = that.sRows.getSelection();
            if (rowSelection.length > 0) {
                if (evt.ctrlKey && selectionModel.mode != 'single') {
                    if (that.sRows.indexOf(objP) != -1) {
                        that.sRows.remove(objP);
                    } else {
                        that._setSelection(objP);
                    }
                } else if (evt.shiftKey && selectionModel.mode != 'single') {
                    var rowS = rowSelection[rowSelection.length - 1],
                        rowIndx1 = rowS.rowIndx,
                        initRowIndx = rowIndx1,
                        finalRowIndx = rowIndx;
                    if (rowIndx1 > rowIndx) {
                        initRowIndx = rowIndx;
                        finalRowIndx = rowIndx1;
                    }
                    var rowSelection2 = rowSelection.slice(0);
                    for (var i = 0; i < rowSelection2.length; i++) {
                        var rSel = rowSelection2[i],
                            row = rSel.rowIndx;
                        if (row < initRowIndx || row > finalRowIndx) {
                            that.sRows.remove({
                                rowIndx: row,
                                evt: evt
                            });
                        }
                    }
                    for (var row = initRowIndx; row <= finalRowIndx; row++) {
                        that.sRows.add({
                            rowIndx: row,
                            evt: evt
                        });
                    }
                    that._setSelection(objP);
                } else {
                    that.sRows.removeAll({
                        raiseEvent: true
                    });
                    that._setSelection(objP);
                }
            } else {
                that._setSelection(objP);
            }
        }
    }
    fn._onDblClickRow = function(evt) {
        var that = this;
        var $tr = $(evt.currentTarget);
        var rowIndxPage = parseInt($tr.attr("pq-row-indx")),
            offset = that.getRowIndxOffset(),
            rowIndx = rowIndxPage + offset;
        var objP = {
            rowIndx: rowIndx,
            evt: evt
        };
        if (that._trigger("rowDblClick", evt, {
            $tr: $tr,
            rowIndxPage: rowIndxPage,
            rowIndx: rowIndx,
            dataModel: that.options.dataModel
        }) == false) {
            return false;
        };
    }
    fn.isEditableCell = function(obj) {
        var colIndx = obj.colIndx,
            column = (obj.column == null) ? (this.colModel[colIndx]) : obj.column,
            editable = true;
        if (this.options.editable == false) {
            editable = false;
        }
        if (column.editable == false) {
            editable = false;
        }
        return editable;
    }
    fn._getRowPQData = function(rowIndxPage, key, rowData) {
        var rowData = (rowData == null) ? this.data[rowIndxPage] : rowData;
        return rowData ? rowData[key] : null;
    }
    fn._setRowPQData = function(rowIndxPage, objP, rowData) {
        var rowData = (rowData == null) ? this.data[rowIndxPage] : rowData;
        if (!rowData) return;
        for (var key in objP) {
            rowData[key] = objP[key];
        }
    }
    fn._onClickCell = function(evt) {
        var that = this,
            thisOptions = this.options,
            selectionModel = thisOptions.selectionModel;;
        var $td = $(evt.currentTarget);
        var objP = that.getCellIndices($td);
        var rowIndxPage = objP.rowIndxPage,
            offset = that.getRowIndxOffset(),
            rowIndx = objP.rowIndx = rowIndxPage + offset,
            colIndx = objP.colIndx,
            dataIndx = objP.dataIndx = this.colModel[colIndx].dataIndx,
            column = that.colModel[colIndx];
        objP.evt = evt;
        if (that._trigger("cellClick", evt, {
            $td: $td,
            rowIndxPage: rowIndxPage,
            rowIndx: rowIndx,
            colIndx: colIndx,
            dataIndx: dataIndx,
            column: column,
            dataModel: that.options.dataModel
        }) == false) {
            return false;
        };
        if (that.$td_edit) {
            that.quitEditMode(evt);
        }
        if (this.isEditableCell({
            column: column
        }) && thisOptions.editModel.clicksToEdit == '1') {
            that._setSelection(null);
            if (selectionModel.type == 'cell') {
                that._setSelection(objP);
            } else {
                that.bringRowIntoView({
                    rowIndxPage: rowIndxPage
                });
                $td = that._bringCellIntoView({
                    rowIndxPage: rowIndxPage,
                    colIndx: colIndx
                });
            }
            window.setTimeout(function() {
                that.editCell(objP);
            }, 0)
            return;
        }
        if (selectionModel.type == 'cell') {
            var cellSelection = that.sCells.getSelection();
            if (cellSelection.length > 0) {
                if (evt.ctrlKey && selectionModel.mode != 'single') {
                    if (that.sCells.isSelected(objP)) {
                        that.sCells.remove(objP);
                    } else {
                        that._setSelection(objP);
                    }
                } else if (evt.shiftKey && selectionModel.mode != 'single') {
                    var cellS = cellSelection[cellSelection.length - 1],
                        rowIndx1 = cellS.rowIndx,
                        colIndx1 = that.getColIndxFromDataIndx(cellS.dataIndx),
                        initRowIndx = rowIndx1,
                        finalRowIndx = rowIndx,
                        initColIndx = colIndx1,
                        finalColIndx = colIndx;
                    if (rowIndx1 > rowIndx) {
                        initRowIndx = rowIndx;
                        finalRowIndx = rowIndx1;
                    }
                    if (that.options.selectionModel.mode == 'range') {
                        if (rowIndx1 > rowIndx) {
                            initColIndx = colIndx;
                            finalColIndx = colIndx1;
                        }
                        if (rowIndx == rowIndx1 && colIndx < colIndx1) {
                            initColIndx = colIndx;
                            finalColIndx = colIndx1;
                        }
                        that._rangeSelect(initRowIndx, initColIndx, finalRowIndx, finalColIndx, evt);
                    } else if (that.options.selectionModel.mode == 'block') {
                        if (colIndx1 > colIndx) {
                            initColIndx = colIndx;
                            finalColIndx = colIndx1;
                        }
                        that._blockSelect(initRowIndx, initColIndx, finalRowIndx, finalColIndx, evt);
                    }
                    that._setSelection(objP);
                } else {
                    that.sCells.removeAll({
                        raiseEvent: true
                    });
                    that._setSelection(objP);
                }
            } else {
                that._setSelection(objP);
            }
        }
    }
    fn.highlightCell = function($td) {
        $td.addClass("pq-grid-cell-hover ui-state-hover");
    }
    fn.unHighlightCell = function($td) {
        $td.removeClass("pq-grid-cell-hover ui-state-hover");
    }
    fn.highlightRow = function($tr) {
        $tr.addClass("pq-grid-row-hover ui-state-hover");
    }
    fn.unHighlightRow = function($tr) {
        $tr.removeClass("pq-grid-row-hover ui-state-hover");
    }
    fn._createSelectedRowsObject = function() {
        this.sRows = new cRows(this);
    }
    fn._createSelectedCellsObject = function() {
        this.sCells = new cCells(this);
    }
    fn._getCreateEventData = function() {
        return {
            dataModel: this.options.dataModel,
            data: this.data,
            colModel: this.options.colModel
        };
    }
    fn._refreshOptions = function() {
        this._refreshDataOptions();
    }
    fn._refreshDataOptions = function() {}
    fn.enableSelection = function() {
        this.$grid_inner.enableSelection();
    }
    fn.disableSelection = function() {
        this.$grid_inner.disableSelection();
    }
    fn._isEditCell = function(evt) {
        var $targ = $(evt.target);
        var $div = $targ.closest("div.pq-cell-selected-border-edit");
        if ($div && $div.length > 0) {
            return true;
        }
        return false;
    }
    fn._findCellFromEvt = function(evt) {
        var $targ = $(evt.target);
        var $td = $targ.closest(".pq-grid-cell");
        if ($td == null || $td.length == 0) {
            return {
                rowIndxPage: null,
                colIndx: null,
                $td: null
            };
        } else {
            var obj = this.getCellIndices($td);
            obj.$td = $td;
            return obj;
        }
    }
    fn._initPager = function() {
        var DM = this.options.dataModel;
        var that = this;
        var obj2 = {
            rPP: DM.rPP,
            rPPOptions: DM.rPPOptions,
            change: function(evt, obj) {
                var DM = that.options.dataModel;
                if (obj.curPage != undefined) {
                    DM.prevPage = DM.curPage;
                    DM.curPage = obj.curPage;
                }
                if (obj.rPP != undefined) DM.rPP = obj.rPP;
                if (DM.paging == "remote") that.remoteRequest();
                else {
                    that.$td_edit = null;
                    that._refreshDataFromDataModel();
                    that._refresh();
                }
            },
            refresh: function(evt) {
                that.refreshDataAndView();
            }
        };
        if (DM.paging) {
            this.$footer.pqPager(obj2);
        } else {}
    }
    fn._initData = function() {
        var that = this;
        var dataModel = this.options.dataModel;
        if (dataModel == undefined) {
            throw ("dataModel not found.");
        }
        this._initPager();
        if (dataModel.location == "remote") {
            var that = this;
            this.generateLoading();
            this.remoteRequest();
        } else {
            this._refreshDataFromDataModel();
        }
    }
    fn._refreshHideArrHS = function() {
        var that = this;
        for (var i = 0; i < that.colModel.length; i++) {
            that.hidearrHS[i] = false;
        }
        if (that.initH > 0) {
            var indx = that.freezeCols - 1 + that.initH;
            for (var i = that.freezeCols; i <= indx; i++) {
                if (that.colModel[i].hidden) {
                    continue;
                }
                that.hidearrHS[i] = true;
            }
        } else {}
    }
    fn.generateLoading = function() {
        if (this.$loading) this.$loading.remove();
        this.$loading = $("<div class='pq-loading'></div>").appendTo(this.element)
        $("<div class='pq-loading-bg'></div><div class='pq-loading-mask ui-state-highlight'><div>" + this.options.strLoading + "...</div></div>").appendTo(this.$loading);
        this.$loading.find("div.pq-loading-bg").css("opacity", 0.2);
    }
    fn.showLoading = function() {
        this.element.find("div.pq-loading").show();
    }
    fn.hideLoading = function() {
        this.element.find("div.pq-loading").hide();
    }
    fn._refreshDataFromDataModel = function() {
        var thisOptions = this.options,
            DM = thisOptions.dataModel,
            GM = thisOptions.groupModel,
            GMTrue = (GM && GM.grouping == "local") ? true : false,
            TVM = thisOptions.treeViewModel,
            TVTrue = (TVM) ? true : false;
        if (DM.data == null || DM.data.length == 0) {
            if (DM.paging) {
                DM.curPage = 0;
                DM.totalPages = 0;
                DM.totalRecords = 0;
            }
            return;
        }
        if (DM.paging && DM.paging == 'local') {
            DM.totalRecords = DM.data.length;
            DM.totalPages = Math.ceil(DM.data.length / DM.rPP);
            if (DM.curPage > DM.totalPages) {
                DM.curPage = DM.totalPages;
            }
            if (DM.curPage < 1 && DM.totalPages > 0) {
                DM.curPage = 1;
            }
            var begIndx = (DM.curPage - 1) * DM.rPP;
            var endIndx = DM.curPage * DM.rPP;
            if (endIndx > DM.data.length) {
                endIndx = DM.data.length;
            }
            if (GMTrue) {} else {
                this.data = DM.data.slice(begIndx, endIndx);
            }
        } else {
            if (GMTrue) {
                this._groupArrays();
                this.data = this.dataGM;
            } else {
                this.data = DM.data;
            }
        }
        if (TVTrue) {
            this.cTreeView._refreshDataFromDataModel();
        }
    }
    fn.remoteRequest = function(callback_fn) {
        if (this.loading) {
            this.xhr.abort();
        }
        var that = this;
        var url = "";
        var dataURL = "";
        var DM = this.options.dataModel;
        if (typeof DM.getUrl == "function") {
            var objURL = DM.getUrl();
            if (objURL && objURL.url) url = objURL.url;
            if (objURL && objURL.data) dataURL = objURL.data;
        }
        if (!url) {
            return;
        }
        this.loading = true;
        this.showLoading();
        this.xhr = $.ajax({
            url: url,
            dataType: DM.dataType,
            async: true,
            cache: DM.cache,
            type: DM.method,
            data: dataURL,
            beforeSend: function(jqXHR, settings) {
                if (typeof DM.beforeSend == "function") {
                    return DM.beforeSend(jqXHR, settings);
                }
            },
            success: function(responseObj, textStatus, jqXHR) {
                var dataLoaded = false;
                if (typeof DM.getData == "function") {
                    var retObj = DM.getData(responseObj, textStatus, jqXHR);
                    DM.data = retObj.data;
                    if (DM.paging) {
                        if (DM.paging == "remote") {
                            if (retObj.curPage) DM.curPage = retObj.curPage;
                            if (retObj.totalRecords) {
                                DM.totalRecords = retObj.totalRecords;
                                DM.totalPages = Math.ceil(DM.totalRecords / DM.rPP);
                            }
                        }
                    }
                    that._refreshDataFromDataModel();
                    if (DM.sorting == "local" && DM.sortIndx != undefined) {
                        that._refreshSortingDataAndView({
                            sorting: true
                        });
                    } else {
                        that._refreshViewAfterDataSort();
                    }
                } else {
                    throw ("getData callback not found!");
                }
                that.hideLoading();
                that.loading = false;
                that._trigger("load", null, {
                    dataModel: that.options.dataModel,
                    data: that.data
                });
                if (typeof callback_fn == "function") callback_fn();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                that.hideLoading();
                that.loading = false;
                if (typeof DM.error == "function") {
                    DM.error(jqXHR, textStatus, errorThrown);
                }
            }
        });
    }
    fn._fixFireFoxContentEditableIssue = function() {
        if (window.postMessage) {
            this.$grid_inner.focus();
        }
    }
    fn.selectCellRowCallback = function(fn) {
        var rowIndx, colIndx;
        if (this.$td_edit) {
            this.quitEditMode();
        }
        var that = this;
        $.measureTime(function() {
            fn.call(that);
        }, '_generateTables');
        if (this.options.flexHeight) {
            this.setGridHeightFromTable();
        }
        if (this.options.flexWidth) {
            this._setGridWidthFromTable();
        }
    }
    fn._refreshTitle = function() {
        this.$title.html(this.options.title);
    }
    fn._refreshDraggable = function() {
        if (this.options.draggable) {
            this.$title.addClass('draggable');
            this.element.draggable({
                handle: this.$title,
                start: function(evt, ui) {}
            });
        } else {
            this._destroyDraggable();
        }
    }
    fn._refreshResizable = function() {
        var that = this;
        if (this.options.resizable) {
            this.element.resizable({
                helper: "ui-state-highlight",
                delay: 0,
                start: function(evt, ui) {
                    $(ui.helper).css({
                        opacity: 0.5,
                        background: "#ccc",
                        border: "1px solid steelblue"
                    });
                },
                resize: function(evt, ui) {},
                stop: function(evt, ui) {
                    that.options.height = that.element.height();
                    that.options.width = that.element.width();
                    that._refresh();
                    that.element.css("position", "relative");
                }
            });
        } else {
            this._destroyResizable();
        }
    }
    fn.refresh = function() {
        this._refresh();
    }
    fn._refreshDataIndices = function() {
        if (this.options.getDataIndicesFromColIndices == false) {
            return;
        }
        var thisColModel = this.colModel;
        for (var i = 0; i < thisColModel.length; i++) {
            var column = thisColModel[i];
            if (column.dataIndx == null) {
                column.dataIndx = i;
            }
        }
    }
    fn._refresh = function() {
        var that = this;
        this._refreshDataIndices();
        this._refreshResizable();
        this._refreshDraggable();
        this._setScrollHNumEles();
        this._bufferObj_calcInitFinalH();
        this._refreshHideArrHS();
        this._computeOuterWidths(true);
        this._createHeader();
        this._refreshHeaderSortIcons();
        this._setInnerGridHeight();
        this._setRightGridHeight();
        this.selectCellRowCallback(function() {
            that.cTable._generateTables();
            that._computeOuterWidths();
        });
        this._setScrollHLength();
        this._setScrollVLength();
        this._setScrollVNumEles(true);
        this._setScrollHLength();
        this._refreshPager();
    }
    fn._refreshPager = function() {
        var DM = this.options.dataModel;
        if (DM.paging) {
            this.$footer.pqPager("option", {
                currentPage: DM.curPage,
                totalPages: DM.totalPages,
                totalRecords: DM.totalRecords,
                rPP: DM.rPP,
                rPPOptions: DM.rPPOptions
            });
        }
    }
    fn._refreshViewAfterDataSort = function() {
        this.selectCellRowCallback(function() {
            this.cTable._generateTables();
            this._computeOuterWidths();
        })
        this._refreshHeaderSortIcons();
        this._setRightGridHeight();
        this._setScrollVLength();
        this._setScrollVNumEles(true);
        this._setScrollHLength();
        this._refreshPager();
    }
    fn.refreshSortingDataAndView = function() {
        this._refreshSortingDataAndView({
            sorting: true
        });
    }
    fn.refreshDataAndView = function(keepSelection) {
        this.data = null;
        this.sRows.setDirty();
        this.sCells.setDirty();
        var DM = this.options.dataModel;
        if (DM.location == "remote") {
            DM.data = null;
            this.remoteRequest();
        } else {
            this._refreshSortingDataAndView({
                keepSelection: keepSelection,
                sorting: true
            });
        }
    }
    fn.getColIndxFromDataIndx = function(dataIndx) {
        var thisColModel = this.colModel;
        for (var i = 0; i < thisColModel.length; i++) {
            if (thisColModel[i].dataIndx == dataIndx) {
                return i;
            }
        }
    }
    fn._refreshSortingDataAndView = function(obj) {
        var sorting = obj.sorting,
            fn = obj.fn,
            keepSelection = obj.keepSelection;
        if (!keepSelection) {
            this.sRows.removeAll({
                raiseEvent: true
            });
            this.sCells.removeAll({
                raiseEvent: true
            });
        }
        var DM = this.options.dataModel,
            thisColModel = this.colModel,
            indx = DM.sortIndx,
            colIndx = this.getColIndxFromDataIndx(indx);
        if (indx == null || colIndx == null) {
            sorting = false;
        }
        var dir = DM.sortDir;
        var that = this;
        if (sorting == true) {
            if (DM.sorting == "remote") {
                this.remoteRequest(fn);
            } else {
                var column = thisColModel[colIndx];
                var dataType = column.dataType;
                this._sortLocalData(indx, dir, dataType, DM.data);
                this.sRows.setDirty();
                this.sCells.setDirty();
                this._refreshDataFromDataModel();
                that._refreshViewAfterDataSort();
                if (typeof fn == "function") fn();
            }
        } else if (DM.location == "remote") {
            this.remoteRequest(fn);
        } else {
            if (this.data == null) {
                this._refreshDataFromDataModel();
            }
            that._refreshViewAfterDataSort();
            if (typeof fn == "function") fn();
        }
    }
    fn._computeOuterWidths = function(basedOnWidthsOnly) {
        var options = this.options,
            columnBorders = options.columnBorders,
            thisColModel = this.colModel,
            thisColModelLength = thisColModel.length;
        for (var i = 0; i < thisColModelLength; i++) {
            var column = thisColModel[i];
            this.outerWidths[i] = parseInt(column.width) + ((columnBorders) ? 1 : 0);
        }
        this.numberCell_outerWidth = this.numberCellWidth + 1;
        return;
    }
    fn._setOption = function(key, value) {
        this.refreshRequired = true;
        if (key == "height") {
            this.element.height(value);
            $.Widget.prototype._setOption.call(this, key, value);
        } else if (key == "width") {
            this.element.width(value);
            $.Widget.prototype._setOption.call(this, key, value);
        } else if (key == "title") {
            $.Widget.prototype._setOption.call(this, key, value);
            this._refreshTitle();
        } else if (key == "roundCorners") {
            if (value) {
                this.element.addClass("ui-corner-all");
                this.$top.addClass("ui-corner-top");
                this.$bottom.addClass("ui-corner-bottom");
            } else {
                this.element.removeClass("ui-corner-all");
                this.$top.removeClass("ui-corner-top");
                this.$bottom.removeClass("ui-corner-bottom");
            }
            this.refreshRequired = false;
        } else if (key == "freezeCols") {
            if (!isNaN(value) && value >= 0 && parseInt(value) <= this.colModel.length - 2) {
                this.options.freezeCols = this.freezeCols = parseInt(value);
                this._refreshFreezeLine();
                this._setScrollHLength();
                $.Widget.prototype._setOption.call(this, key, value);
            }
        } else if (key == "resizable") {
            $.Widget.prototype._setOption.call(this, key, value);
        } else if (key == "scrollModel") {
            var obj = value;
            for (var key in obj) {
                this.options.scrollModel[key] = obj[key];
            }
        } else if (key == "dataModel") {
            $.Widget.prototype._setOption.call(this, key, value);
            var paging = value["paging"];
            if (this.$footer.hasClass('pq-pager') == false && (paging == "local" || paging == "remote")) {
                this._initPager();
            } else if (this.$footer.hasClass('pq-pager') && (paging != "local" && paging != "remote")) {
                this.$footer.pqPager('destroy');
                this.$footer.html("&nbsp;");
            }
            this.refreshDataAndView();
        } else if (key == "selectionModel") {
            var obj = value;
            for (var key in obj) {
                this.options.selectionModel[key] = obj[key];
            }
            this.refreshRequired = false;
        } else if (key == "colModel") {
            $.Widget.prototype._setOption.call(this, key, value);
            this._refreshHeader();
            this._refreshWidths();
            this._refreshDataIndices();
        } else if (key == "disabled") {
            if (value == true) {
                this._disable();
            } else {
                this._enable();
            }
            this.refreshRequired = false;
        } else if (key == "numberCell") {
            this.numberCell = value;
            $.Widget.prototype._setOption.call(this, key, value);
        } else if (key == "numberCellWidth") {
            this.numberCellWidth = value;
            $.Widget.prototype._setOption.call(this, key, value);
        } else if (key == "customData") {
            $.Widget.prototype._setOption.call(this, key, value);
            this.refreshRequired = false;
        } else if (key == "strLoading") {
            $.Widget.prototype._setOption.call(this, key, value);
            this.generateLoading();
            this.refreshRequired = false;
        } else if (key == "topVisible") {
            if (value == true)
                this.$top.css("display", "");
            else
                this.$top.css("display", "none");
        } else if (key == "bottomVisible") {
            if (value == true)
                this.$bottom.css("display", "");
            else
                this.$bottom.css("display", "none");
        } else {
            $.Widget.prototype._setOption.call(this, key, value);
        }
    }
    fn._setOptions = function() {
        $.Widget.prototype._setOptions.apply(this, arguments);
        if (this.refreshRequired) {
            this._refresh();
        }
        this.refreshRequired = true;
    }
    fn._generateCellRowOutline = function(obj) {
        var $td = obj.$td,
            $tr = obj.$tr,
            that = this;
        if ($tr) {
            var wd = that._calcRightEdgeCol(that.colModel.length - 1);
            wd -= 4;
            var ht = $tr[0].offsetHeight - 4;
            var $table = $($tr[0].offsetParent);
            var offsetParent = $table[0].offsetParent;
            var lft = $tr[0].offsetLeft + $table[0].offsetLeft;
            var top = $tr[0].offsetTop + $table[0].offsetTop;
            that._generateCellHighlighter(offsetParent, lft, top, wd, ht);
        } else if ($td) {
            var $table = $($td[0].offsetParent);
            var offsetParent = $table[0].offsetParent;
            var wd = $td[0].offsetWidth - 4;
            var ht = $td[0].offsetHeight - 4;
            var lft = $td[0].offsetLeft + $table[0].offsetLeft;
            var top = $td[0].offsetTop + $table[0].offsetTop;
            that._generateCellHighlighter(offsetParent, lft, top, wd, ht);
        }
    }
    fn._removeCellRowOutline = function() {
        if (this.$div_focus) {
            this._fixFireFoxContentEditableIssue();
            this.$div_focus.remove();
            this.$div_focus = null;
        }
    }
    fn._generateCellHighlighter = function(offsetParent, lft, top, wd, ht) {
        if (this.$div_focus && this.$div_focus[0].offsetParent == offsetParent) {
            if (this.$td_edit != null) {
                this._fixFireFoxContentEditableIssue();
                this.$div_focus.empty().removeClass('pq-cell-selected-border-edit');
                this.$td_edit = null;
            }
            this.$div_focus.css({
                left: lft,
                top: top,
                height: ht,
                width: wd
            });
        } else {
            if (this.$div_focus) this.$div_focus.remove();
            this.$div_focus = $("<div class='pq-cell-selected-border'></div>")
                .appendTo(offsetParent);
            this.$div_focus.css({
                left: lft,
                top: top,
                height: ht,
                width: wd
            });
        }
    }
    fn._selectRow = function(rowIndx, evt) {
        this.selectRow(rowIndx, evt)
    }
    fn._findfirstUnhiddenColIndx = function() {
        for (var i = 0; i < this.colModel.length; i++) {
            if (!this.colModel[i].hidden) {
                return i
            }
        }
    }
    fn.selectRow = function(obj) {
        var rowIndx = obj.rowIndx,
            evt = obj.evt,
            offset = obj.offset;
        if (evt && (evt.type == "keydown" || evt.type == "keypress")) {
            if (this.sRows.replace(obj) == false) {
                return false;
            }
        } else if (this.sRows.add(obj) == false) {
            return false;
        }
        if (evt != null) this._setGridFocus();
        return true;
    }
    fn.scrollY = function(rowIndx) {
        this.$vscroll.pqScrollBar("option", "cur_pos", rowIndx).pqScrollBar("scroll");
    }
    fn.bringRowIntoView = function(obj) {
        var rowIndxPage = obj.rowIndxPage;
        var init = this.init - this.offsetRow;
        var calcCurPos = this._calcCurPosFromRowIndxPage(rowIndxPage);
        if (calcCurPos < this.scrollCurPos) {
            this.$vscroll.pqScrollBar("option", "cur_pos", calcCurPos).pqScrollBar("scroll");
        }
        var $tr = this.$tbl.find("tr[pq-row-indx=" + rowIndxPage + "]");
        if ($tr[0] == undefined) {
            this.$vscroll.pqScrollBar("option", "cur_pos", calcCurPos).pqScrollBar("scroll");
        } else {
            var td_bottom = $tr[0].offsetTop + $tr[0].offsetHeight,
                htCont = this.$cont[0].offsetHeight,
                htSB = this._getScollBarHorizontalHeight();
            if (td_bottom > htCont - htSB) {
                var diff = td_bottom - (htCont - htSB);
                var $trs = this.$tbl.children().children("tr");
                var ht = 0,
                    indx = 0;
                $trs.each(function(i, tr) {
                    ht += tr.offsetHeight;
                    if (ht >= diff) {
                        indx = i;
                        return false;
                    }
                })
                var cur_pos = this.scrollCurPos + indx;
                var num_eles = this.$vscroll.pqScrollBar("option", "num_eles");
                if (num_eles < cur_pos + 1) {
                    num_eles = cur_pos + 1;
                }
                this.$vscroll.pqScrollBar("option", {
                    num_eles: num_eles,
                    cur_pos: cur_pos
                }).pqScrollBar("scroll");
            }
        }
    }
    fn._bringCellIntoView = function(obj) {
        var rowIndxPage = obj.rowIndxPage,
            colIndx = obj.colIndx,
            tdneedsRefresh = false;
        var $td;
        if (this.hidearrHS[colIndx]) {
            this.hidearrHS[colIndx] = false;
            var cur_pos = colIndx - this.freezeCols - this._calcNumHiddenUnFrozens(colIndx);
            this.$hscroll.pqScrollBar("option", "cur_pos", cur_pos).pqScrollBar("scroll");
            tdneedsRefresh = true;
        } else {
            var $td = this.$tbl.find("tr[pq-row-indx=" + rowIndxPage + "]>td[pq-col-indx=" + colIndx + "]");
            if ($td.length == 0) {
                return false;
            }
            var td_right = this._calcRightEdgeCol(colIndx).width;
            var wd_scrollbar = 17;
            if (this.$vscroll.css("visibility") == "hidden" || this.$vscroll.css("display") == "none") {
                wd_scrollbar = 0;
            }
            if (td_right > this.$cont[0].offsetWidth - wd_scrollbar) {
                var diff = this._calcWidthCols(colIndx) - (this.$cont[0].offsetWidth - wd_scrollbar);
                var $tds = $td.parent("tr").children("td");
                var data_length = this.colModel.length;
                var wd = 0,
                    initH = 0;
                for (var i = this.freezeCols; i < data_length; i++) {
                    if (!this.colModel[i].hidden) {
                        wd += this.outerWidths[i];
                    }
                    if (i == colIndx) {
                        initH = i - this.freezeCols - this._calcNumHiddenUnFrozens(i);
                        break;
                    } else if (wd >= diff) {
                        initH = i - this.freezeCols - this._calcNumHiddenUnFrozens(i) + 1;
                        break;
                    }
                }
                this.$hscroll.pqScrollBar("option", "cur_pos", initH).pqScrollBar("scroll");
                tdneedsRefresh = true;
            }
        }
        if (tdneedsRefresh) {
            var $td = this.$tbl.find("tr[pq-row-indx=" + rowIndxPage + "]>td[pq-col-indx=" + colIndx + "]");
            return $td;
        } else {
            return $td;
        }
    }
    fn.selection = function(obj) {
        var rowIndx = obj.rowIndx,
            colIndx = obj.colIndx,
            method = obj.method,
            type = obj.type;
        if (type == 'row') {
            return this['sRows'][method](obj);
        } else if (type == 'cell') {
            return this['sCells'][method](obj);
        }
        return;
    }
    fn.setSelection = function(obj) {
        if (obj == null || obj.rowIndx == null) {
            this.sRows.removeAll({
                raiseEvent: true
            });
            this.sCells.removeAll({
                raiseEvent: true
            });
            return;
        }
        this._bringPageIntoView(obj);
        return this._setSelection(obj);
    }
    fn._bringPageIntoView = function(obj) {
        var rowIndx = obj.rowIndx,
            that = this;
        var DM = this.options.dataModel;
        if (DM.paging == "local" && rowIndx >= 0) {
            var curPage = DM.curPage;
            var rPP = DM.rPP;
            var begIndx = (curPage - 1) * rPP;
            var endIndx = curPage * rPP;
            if (rowIndx >= begIndx && rowIndx < endIndx) {} else {
                DM.curPage = Math.ceil((rowIndx + 1) / rPP);
                this._refreshDataFromDataModel();
                this._refreshViewAfterDataSort();
            }
            rowIndxPage = (rowIndx % rPP);
        }
    }
    fn._setSelection = function(obj) {
        if (obj == null) {
            this.sRows.removeAll({
                raiseEvent: true
            });
            this.sCells.removeAll({
                raiseEvent: true
            });
            return false;
        }
        var offset = obj.offset = (obj.offset == null) ? this.getRowIndxOffset() : obj.offset,
            rowIndx = obj.rowIndx = (obj.rowIndx == null) ? obj.rowIndxPage + offset : obj.rowIndx,
            rowIndxPage = obj.rowIndxPage = (obj.rowIndxPage == null) ? obj.rowIndx - offset : obj.rowIndxPage,
            colIndx = obj.colIndx,
            evt = obj.evt;
        if (rowIndxPage < 0 || colIndx < 0) {
            return false;
        }
        if (this.data == null || this.data.length == 0) {
            return false;
        }
        if (rowIndxPage >= this.data.length || colIndx >= this.colModel.length) {
            return false;
        }
        this.bringRowIntoView({
            rowIndxPage: rowIndxPage
        });
        if (colIndx == null) {
            return this.selectRow({
                rowIndx: rowIndx,
                evt: evt
            });
        }
        this._bringCellIntoView({
            rowIndxPage: rowIndxPage,
            colIndx: colIndx
        });
        return this.selectCell({
            rowIndx: rowIndx,
            colIndx: colIndx,
            evt: evt
        });
    }
    fn.saveEditCell = function() {
        if (this.$td_edit == null) return;
        var $td = this.$td_edit,
            obj = this.getCellIndices($td),
            offset = this.getRowIndxOffset(),
            colIndx = obj.colIndx,
            rowIndxPage = obj.rowIndxPage,
            rowIndx = obj.rowIndx = rowIndxPage + offset,
            thisColModel = this.colModel,
            column = obj.column = thisColModel[colIndx],
            dataIndx = obj.dataIndx = column.dataIndx,
            prevVal = this.data[rowIndxPage][dataIndx];
        if (rowIndxPage != null) {
            var dataCell = this._getEditCellData(obj);
            if (dataCell != prevVal) {
                this.data[rowIndxPage][dataIndx] = dataCell;
                obj.data = this.data;
                if (this._trigger("cellSave", null, obj) == false) {
                    return;
                }
                this.refreshRow(obj);
                this._fixTableViewPort();
                var that = this;
                if (that.options.flexHeight) {
                    that.setGridHeightFromTable();
                    that._fixIEFooterIssue();
                } else {
                    that.bringRowIntoView({
                        rowIndxPage: rowIndxPage
                    });
                }
            }
        }
    }
    fn._fixTableViewPort = function() {
        var cont = this.$cont[0];
        cont.scrollTop = 0;
        cont.scrollLeft = 0;
    }
    fn._fixIEFooterIssue = function() {
        $(".pq-grid-footer").css({
            position: "absolute"
        });
        $(".pq-grid-footer").css({
            position: "relative"
        });
    }
    fn.refreshColumn = function(obj) {
        var customData = this.options.customData,
            colIndx = obj.colIndx = (obj.colIndx == null) ? this.getColIndxFromDataIndx(obj.dataIndx) : obj.colIndx,
            offset = this.getRowIndxOffset();
        for (var row = this.init; row <= this["final"]; row++) {
            var rowIndxPage = obj.rowIndxPage = row;
            obj.rowIndx = rowIndxPage + offset;
            var column = obj.column = this.colModel[colIndx];
            obj.$td = this.getCell(obj);
            obj.rowData = this.data[rowIndxPage];
            obj.customData = customData;
            this.cTable._renderCell(obj);
        }
    }
    fn.refreshCell = function(obj) {
        if (!this.data) return;
        var offset = obj.offset = (obj.offset == null) ? this.getRowIndxOffset() : obj.offset,
            rowIndx = obj.rowIndx = (obj.rowIndx == null) ? obj.rowIndxPage + offset : obj.rowIndx,
            rowIndxPage = obj.rowIndxPage = (obj.rowIndxPage == null) ? obj.rowIndx - offset : obj.rowIndxPage,
            dataIndx = obj.dataIndx,
            colIndx = obj.colIndx = (obj.colIndx == null) ? this.getColIndxFromDataIndx(dataIndx) : obj.colIndx,
            $td = obj.$td = (obj.$td == null) ? this.getCell(obj) : obj.$td,
            column = obj.column = this.colModel[colIndx],
            rowData = this.data[rowIndxPage];
        if (!rowData) return;
        var objRender = obj;
        objRender.rowData = rowData;
        objRender.customData = this.options.customData;
        if ($td && $td.length > 0) this.cTable._renderCell(objRender);
    }
    fn.refreshRow = function(obj) {
        if (!this.data) return;
        var thisOptions = this.options,
            offset = obj.offset = (obj.offset == null) ? this.getRowIndxOffset() : obj.offset,
            rowIndx = obj.rowIndx = (obj.rowIndx == null) ? obj.rowIndxPage + offset : obj.rowIndx,
            rowIndxPage = obj.rowIndxPage = (obj.rowIndxPage == null) ? obj.rowIndx - offset : obj.rowIndxPage,
            $tr = (obj.$tr == null) ? this.getRow(obj) : obj.$tr,
            thisColModel = this.colModel,
            rowData = this.data[rowIndxPage],
            TVM = thisOptions.treeViewModel;
        if (!rowData) return;
        var levelIndx, leafIndx, expandIndx,
            isLeaf, level, treeMarginLeft = 0,
            expanded;
        if (TVM) {
            var levelIndx = TVM.levelIndx,
                leafIndx = TVM.leafIndx,
                expandIndx = TVM.expandIndx,
                isLeaf = rowData[leafIndx],
                level = rowData[levelIndx],
                treeMarginLeft = (level + 1) * 18,
                expanded = this._getRowPQData(rowIndx, "expanded");
        }
        var objRender = {
            rowIndx: rowIndx,
            rowIndxPage: rowIndxPage,
            rowData: rowData,
            treeMarginLeft: treeMarginLeft,
            expandIndx: expandIndx,
            isLeaf: isLeaf,
            expanded: expanded,
            customData: thisOptions.customData
        };
        for (var colIndx = 0; colIndx < thisColModel.length; colIndx++) {
            var column = thisColModel[colIndx];
            var $td = $tr.find("td[pq-col-indx=" + colIndx + "]");
            objRender.$td = $td;
            objRender.colIndx = colIndx;
            objRender.column = column;
            if ($td && $td.length > 0) this.cTable._renderCell(objRender);
        }
    }
    fn.quitEditMode = function(evt) {
        if (this.$td_edit) {
            var $td = this.$td_edit;
            this.disableSelection();
            this._setGridFocus();
            this._trigger("quitEditMode", evt, {
                $td: $td,
                dataModel: this.options.dataModel
            });
            this._removeCellRowOutline();
            this.$td_edit = null;
        }
    }
    fn.getData = function() {
        return this.data;
    }
    fn.getViewPortRowsIndx = function() {
        return {
            beginIndx: this.init,
            endIndx: this['final']
        };
    }
    fn.getRowIndxOffset = function() {
        var DM = this.options.dataModel,
            paging = DM.paging,
            offset = 0;
        if (paging == "local" || paging == "remote") {
            var curPage = DM.curPage;
            var rPP = DM.rPP;
            offset = (rPP * (curPage - 1));
        }
        return offset;
    }
    fn.getRowOffset = function() {
        return this.offsetRow;
    }
    fn._cellblurred = function() {
        this.$div_focus.remove();
        this.$div_focus = null;
        this.$td_focus = null;
        this.$tr_focus = null;
    }
    fn.selectCell = function(obj) {
        var rowIndx = obj.rowIndx,
            colIndx = obj.colIndx,
            evt = obj.evt;
        if (evt && (evt.type == "keydown" || evt.type == "keypress")) {
            if (this.sCells.replace(obj) == false) {
                return false;
            }
        } else {
            if (this.sCells.add(obj) == false) {
                return false;
            }
        }
        if (evt != null) this._setGridFocus();
        return true;
    }
    fn._setGridFocus = function() {
        var that = this;
        window.setTimeout(function() {
            if (that.$td_edit == null) {
                that.$grid_inner.focus();
            }
        }, 0)
    }
    fn.getEditCell = function() {
        if (this.$td_edit) {
            return {
                $td: this.$td_edit,
                $cell: this.$div_focus
            };
        } else {
            return null;
        }
    }
    fn.editCell = function(obj) {
        var $td = this.getCell(obj);
        if ($td != null && $td.length == 1) {
            if (this.$td_edit && this.$td_edit[0] != $td[0]) {
                this.quitEditMode();
            }
            this._editCell($td);
            return $td;
        }
    }
    fn.getFirstEditableColIndx = function() {
        if (!this.options.editable) {
            return -1;
        }
        var colModel = this.colModel;
        for (var i = 0; i < colModel.length; i++) {
            var column = colModel[i];
            if (column.editable == false) {
                continue;
            }
            return i;
        }
        return -1;
    }
    fn._editFirstCellInRow = function(obj) {
        var colIndx = this.getFirstEditableColIndx();
        if (colIndx != -1) {
            var rowIndxPage = obj.rowIndxPage;
            obj.colIndx = colIndx;
            this.bringRowIntoView(obj);
            var $td = this._bringCellIntoView(obj);
            if ($td && $td.length > 0)
                this._editCell($td);
        }
    }
    fn._editCell = function($td) {
        var that = this;
        var obj = that.getCellIndices($td);
        var rowIndxPage = obj.rowIndxPage,
            offset = this.getRowIndxOffset(),
            rowIndx = rowIndxPage + offset,
            colIndx = obj.colIndx,
            column = this.colModel[colIndx],
            dataIndx = column.dataIndx;
        if (this.$td_edit && this.$td_edit[0] == $td[0]) {
            return false;
        }
        this.$td_edit = $td;
        this.enableSelection();
        this._removeCellRowOutline();
        this._generateCellRowOutline({
            $td: $td
        });
        var $cell = this.$div_focus.addClass('pq-cell-selected-border-edit');
        if (column.align == "right") {
            $cell.css("text-align", "right");
        } else if (column.align == "center") {
            $cell.css("text-align", "center");
        } else {
            $cell.css("text-align", "left");
        }
        if (column.editor) {
            column.editor({
                $cell: $cell,
                data: this.data,
                dataModel: this.dataModel,
                rowIndx: rowIndx,
                rowIndxPage: rowIndxPage,
                colIndx: dataIndx
            });
        } else {
            $cell.html("<div contenteditable='true' tabindx='0' class='pq-grid-editor-default'></div>");
            var that = this;
            $cell.children().html(that.data[rowIndxPage][dataIndx]);
        }
        var that = this;
        window.setTimeout(function() {
            if (that.$td_edit != null) {
                var $cell = that.$div_focus;
                $cell.children().focus();
            }
        }, 0)
    }
    fn.getRow = function(obj) {
        var rowIndxPage = obj.rowIndxPage;
        var $tr;
        if (this.$tbl != undefined) $tr = this.$tbl.find("tr[pq-row-indx=" + rowIndxPage + "]");
        return $tr;
    }
    fn.getCell = function(obj) {
        var rowIndxPage = (obj.rowIndxPage == null) ? (obj.rowIndx - this.getRowIndxOffset()) : obj.rowIndxPage,
            colIndx = obj.colIndx;
        var $td;
        if (this.$tbl != undefined) $td = this.$tbl.find("tr[pq-row-indx=" + rowIndxPage + "]>td[pq-col-indx=" + colIndx + "]");
        return $td;
    }
    fn.getEditCellData = function() {
        if (this.$td_edit) {
            var obj = this.getCellIndices(this.$td_edit);
            return this._getEditCellData(obj);
        } else {
            return null;
        }
    }
    fn._getEditCellData = function(obj) {
        var colIndx = obj.colIndx,
            rowIndxPage = obj.rowIndxPage,
            rowIndx = (obj.rowIndx != null) ? obj.rowIndx : rowIndxPage + this.getRowIndxOffset(),
            column = (obj.column) ? obj.column : this.colModel[colIndx],
            $cell = (obj.$cell) ? obj.$cell : this.$div_focus;
        if (column.getEditCellData) {
            var dataCell = column.getEditCellData({
                $cell: $cell,
                data: this.data,
                dataIndx: column.dataIndx,
                dataModel: this.dataModel,
                rowIndx: rowIndx,
                rowIndxPage: rowIndxPage,
                colIndx: colIndx
            });
        } else {
            var dataCell = $cell.children().html();
        }
        return dataCell;
    }
    fn.getCellIndices = function($td) {
        if ($td == null || $td.length == 0) return {
                rowIndxPage: null,
                colIndx: null
        };
        var $tr = $td.parent("tr");
        var $tbl = $tr.parent("tbody");
        var rowIndxPage = parseInt($tr.attr("pq-row-indx"));
        var colIndx = parseInt($td.attr("pq-col-indx"));
        return {
            rowIndxPage: rowIndxPage,
            colIndx: colIndx
        }
    }
    fn._incrRowIndx = function(rowIndxPage, noRows) {
        var newRowIndx = rowIndxPage,
            noRows = (noRows == null) ? 1 : noRows,
            counter = 0;
        for (var i = rowIndxPage + 1, len = this.data.length; i < len; i++) {
            var hidden = this._getRowPQData(i, "hidden");
            if (!hidden) {
                counter++;
                newRowIndx = i;
                if (counter == noRows) {
                    return newRowIndx;
                }
            }
        }
        return newRowIndx;
    }
    fn._decrRowIndx = function(rowIndxPage, noRows) {
        var newRowIndx = rowIndxPage,
            noRows = (noRows == null) ? 1 : noRows,
            counter = 0;
        for (var i = rowIndxPage - 1; i >= 0; i--) {
            var hidden = this._getRowPQData(i, "hidden");
            if (!hidden) {
                counter++;
                newRowIndx = i;
                if (counter == noRows) {
                    return newRowIndx;
                }
            }
        }
        return newRowIndx;
    }
    fn._incrIndx = function(rowIndxPage, colIndx) {
        var that = this;
        if (colIndx == null) {
            if (rowIndxPage == this._getLastVisibleRowIndxPage(this.data)) {
                return null;
            }
            rowIndxPage = this._incrRowIndx(rowIndxPage);
            return {
                rowIndxPage: rowIndxPage
            };
        }
        var column;
        do {
            colIndx++;
            if (colIndx >= that.colModel.length) {
                if (rowIndxPage == this._getLastVisibleRowIndxPage(this.data)) {
                    return null;
                }
                rowIndxPage = this._incrRowIndx(rowIndxPage);
                colIndx = 0;
            }
            column = that.colModel[colIndx];
        } while (column && column.hidden);
        return {
            rowIndxPage: rowIndxPage,
            colIndx: colIndx
        };
    }
    fn._decrIndx = function(rowIndxPage, colIndx) {
        var that = this;
        if (colIndx == null) {
            if (rowIndxPage == this._getFirstVisibleRowIndxPage(this.data)) {
                return null;
            }
            rowIndxPage = this._decrRowIndx(rowIndxPage);
            return {
                rowIndxPage: rowIndxPage
            };
        }
        var column;
        do {
            colIndx--;
            if (colIndx < 0) {
                if (rowIndxPage == this._getFirstVisibleRowIndxPage(this.data)) {
                    return null;
                }
                rowIndxPage = this._decrRowIndx(rowIndxPage);
                colIndx = that.colModel.length - 1;
            }
            column = that.colModel[colIndx];
        } while (column && column.hidden);
        return {
            rowIndxPage: rowIndxPage,
            colIndx: colIndx
        };
    }
    fn._incrEditIndx = function(rowIndxPage, colIndx) {
        var that = this;
        var column;
        do {
            colIndx++;
            if (colIndx >= that.colModel.length) {
                if (rowIndxPage == this._getLastVisibleRowIndxPage(this.data)) {
                    return null;
                }
                rowIndxPage = this._incrRowIndx(rowIndxPage);
                colIndx = 0;
            }
            column = that.colModel[colIndx];
        } while (column && (column.hidden || column.editable === false));
        return {
            rowIndxPage: rowIndxPage,
            colIndx: colIndx
        };
    }
    fn._decrEditIndx = function(rowIndxPage, colIndx) {
        var that = this;
        var column;
        do {
            colIndx--;
            if (colIndx < 0) {
                if (rowIndxPage == this._getFirstVisibleRowIndxPage(this.data)) {
                    return null;
                }
                rowIndxPage = this._decrRowIndx(rowIndxPage);
                colIndx = that.colModel.length - 1;
            }
            column = that.colModel[colIndx];
        } while (column && (column.hidden || column.editable === false));
        return {
            rowIndxPage: rowIndxPage,
            colIndx: colIndx
        };
    }
    fn.addColumn = function(column, columnData) {
        var thisOptions = this.options,
            thisOptionsColModel = thisOptions.colModel,
            data = thisOptions.dataModel.data;
        thisOptionsColModel.push(column);
        this._refreshHeader();
        for (var i = 0; i < data.length; i++) {
            var rowData = data[i];
            rowData.push("");
        }
    }
    fn.keyPressDown = function(evt) {
        var that = this,
            selectedCells = this.sCells.getSelection(),
            selectedRows = this.sRows.getSelection(),
            offset = that.getRowIndxOffset(),
            selectionModel = that.options.selectionModel,
            rowIndx, colIndx;
        var keyCodes = {
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            tab: 9,
            enter: 13,
            pageDown: 34,
            pageUp: 33,
            spaceBar: 32,
            esc: 27,
            home: 36,
            end: 35
        }
        if (that.$td_edit) {
            var $td = $(that.$td_edit[0]);
            var obj = that.getCellIndices($td),
                rowIndxPage = obj.rowIndxPage,
                rowIndx = rowIndxPage + offset,
                colIndx = obj.colIndx,
                column = this.colModel[colIndx],
                colSaveKey = (column.editModel) ? column.editModel.saveKey : null;
            if (that._trigger("cellEditKeydown", evt, {
                dataModel: this.dataModel,
                $cell: this.$div_focus,
                rowIndx: rowIndx,
                rowIndxPage: rowIndxPage,
                colIndx: colIndx,
                $td: $td,
                column: that.colModel[colIndx]
            }) == false) {
                return false;
            };
            if (evt.keyCode == keyCodes.tab) {
                var obj;
                if (evt.shiftKey) {
                    obj = that._decrEditIndx(rowIndxPage, colIndx);
                } else {
                    obj = that._incrEditIndx(rowIndxPage, colIndx);
                }
                that.saveEditCell();
                if (obj == null) {
                    evt.preventDefault();
                    return false;
                }
                that.quitEditMode(evt);
                if (this.options.selectionModel.type == 'row') {
                    if (obj.rowIndxPage != rowIndxPage) {
                        that._setSelection(null);
                        that._setSelection({
                            rowIndxPage: obj.rowIndxPage
                        });
                    }
                    that._bringCellIntoView({
                        rowIndxPage: obj.rowIndxPage,
                        colIndx: obj.colIndx
                    });
                } else
                if ((obj.rowIndxPage != rowIndxPage || obj.colIndx != colIndx) && this.options.selectionModel.type == 'cell') {
                    that._setSelection(null);
                    that._setSelection({
                        rowIndxPage: obj.rowIndxPage,
                        colIndx: obj.colIndx
                    });
                }
                rowIndxPage = obj.rowIndxPage;
                colIndx = obj.colIndx;
                var $td2 = this.getCell({
                    rowIndxPage: obj.rowIndxPage,
                    colIndx: obj.colIndx
                });
                if ($td2 && $td2.length > 0) this._editCell($td2);
                evt.preventDefault();
                return false;
            } else if (evt.keyCode == colSaveKey) {
                that.saveEditCell();
                that.quitEditMode(evt);
            } else if (colSaveKey == null && evt.keyCode == this.options.editModel.saveKey) {
                that.saveEditCell();
                that.quitEditMode(evt);
            } else if (evt.keyCode == keyCodes.esc) {
                that.quitEditMode(evt);
                evt.preventDefault();
                return false;
            } else if (evt.keyCode == keyCodes.pageUp || evt.keyCode == keyCodes.pageDown) {
                evt.preventDefault();
                return false;
            }
            return;
        } else if (selectedRows.length > 0 && selectionModel.type == 'row') {
            var obj = selectedRows[selectedRows.length - 1],
                rowIndx = obj.rowIndx,
                rowIndxPage = rowIndx - offset;
        } else {
            if (selectedCells.length > 0 && selectionModel.type == 'cell') {
                var obj = selectedCells[selectedCells.length - 1],
                    rowIndx = obj.rowIndx,
                    rowIndxPage = rowIndx - offset,
                    dataIndx = obj.dataIndx,
                    colIndx = this.getColIndxFromDataIndx(dataIndx);
                if (rowIndx == null || colIndx == null)
                    return;
                that._trigger("cellKeydown", evt, {
                    dataModel: this.dataModel,
                    rowIndx: rowIndx,
                    colIndx: colIndx,
                    $td: obj.$td,
                    column: that.colModel[colIndx]
                });
                if (evt.cancelBubble) {
                    return;
                }
            } else {
                return;
            }
        }
        if (evt.keyCode == keyCodes.left) {
            var obj = that._decrIndx(rowIndxPage, colIndx);
            if (obj) that._setSelection({
                    rowIndxPage: obj.rowIndxPage,
                    colIndx: obj.colIndx,
                    evt: evt
                });
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.right) {
            var obj = that._incrIndx(rowIndxPage, colIndx);
            if (obj) that._setSelection({
                    rowIndxPage: obj.rowIndxPage,
                    colIndx: obj.colIndx,
                    evt: evt
                });
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.tab) {
            var obj;
            if (evt.shiftKey) {
                obj = that._decrIndx(rowIndxPage, colIndx);
            } else {
                obj = that._incrIndx(rowIndxPage, colIndx);
            }
            if (obj) that._setSelection({
                    rowIndxPage: obj.rowIndxPage,
                    colIndx: obj.colIndx,
                    evt: evt
                });
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.up) {
            rowIndxPage = that._decrRowIndx(rowIndxPage);
            if (obj) that._setSelection({
                    rowIndxPage: rowIndxPage,
                    colIndx: colIndx,
                    evt: evt
                });
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.down) {
            rowIndxPage = that._incrRowIndx(rowIndxPage);
            if (obj) that._setSelection({
                    rowIndxPage: rowIndxPage,
                    colIndx: colIndx,
                    evt: evt
                });
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.pageDown || evt.keyCode == keyCodes.spaceBar) {
            var rowIndx = this._incrRowIndx(rowIndxPage, this.pageSize + 1) + offset;
            that._setSelection({
                rowIndx: rowIndx,
                colIndx: colIndx,
                evt: evt
            });
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.pageUp) {
            var rowIndx = this._decrRowIndx(rowIndxPage, this.pageSize + 1) + offset;
            that._setSelection({
                rowIndx: rowIndx,
                colIndx: colIndx,
                evt: evt
            });
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.home) {
            rowIndx = 0 + offset;
            that._setSelection({
                rowIndx: rowIndx,
                colIndx: colIndx,
                evt: evt
            });
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.end) {
            rowIndx = that.data.length - 1 + offset;
            that._setSelection({
                rowIndx: rowIndx,
                colIndx: colIndx,
                evt: evt
            });
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.enter) {
            if (this.options.selectionModel.type == 'row') {
                var $tr, $td;
                if (selectedRows.length > 0) {
                    that._editFirstCellInRow({
                        rowIndxPage: rowIndxPage
                    });
                }
            } else {
                if (selectedCells.length > 0) {
                    var $td = this.getCell({
                        rowIndxPage: rowIndxPage,
                        colIndx: colIndx
                    });
                    if ($td && $td.length > 0) {
                        if (this.isEditableCell({
                            colIndx: colIndx
                        })) {
                            that._editCell($td);
                        }
                    }
                }
            }
            evt.preventDefault();
            return;
        } else {}
    }
    fn._calcNumHiddenFrozens = function() {
        var num_hidden = 0;
        for (var i = 0; i < this.freezeCols; i++) {
            if (this.colModel[i].hidden) {
                num_hidden++;
            }
        }
        return num_hidden;
    }
    fn._calcNumHiddenUnFrozens = function(colIndx) {
        var num_hidden = 0;
        var len = (colIndx != null) ? colIndx : this.colModel.length;
        for (var i = this.freezeCols; i < len; i++) {
            if (this.colModel[i].hidden) {
                num_hidden++;
            }
        }
        return num_hidden;
    }
    fn._setScrollHLength = function() {
        if (!this.options.scrollModel.horizontal) {
            this.$hscroll.css("visibility", "hidden");
            this.$hvscroll.css("visibility", "hidden");
            return;
        } else {
            this.$hscroll.css("visibility", "");
            this.$hvscroll.css("visibility", "");
        }
        var wd = this.$cont[0].offsetWidth;
        if (this.numberCell) {
            wd -= this.numberCell_outerWidth;
        }
        var thisColModel = this.colModel;
        for (var i = 0; i < this.freezeCols; i++) {
            var column = thisColModel[i];
            if (!column.hidden) {
                wd -= this.outerWidths[i];
            }
        }
        var wdSB = this._getScollBarVerticalWidth();
        if (wdSB == 0) {
            this.$hscroll.css("right", 0);
        } else {
            this.$hscroll.css("right", "");
        }
        wd -= wdSB;
        this.$hscroll.pqScrollBar("option", "length", wd);
    }
    fn._setScrollHNumEles = function() {
        var data_length = this.colModel.length - this.freezeCols - this._calcNumHiddenUnFrozens();
        this.$hscroll.pqScrollBar("option", "num_eles", (data_length));
    }
    fn._getScollBarHorizontalHeight = function() {
        var htSB = 17;
        if (this.$hscroll.css("visibility") == "hidden" || this.options.scrollModel.horizontal == false || this.$hscroll.css("display") == "none") {
            htSB = 0;
        }
        return htSB;
    }
    fn._getScollBarVerticalWidth = function() {
        var wdSB = 17;
        if (this.$vscroll.css("visibility") == "hidden" || this.options.flexHeight || this.$vscroll.css("display") == "none") {
            wdSB = 0;
        }
        return wdSB;
    }
    fn._setScrollVNumEles = function(fullRefresh) {
        var that = this,
            $vscroll = this.$vscroll,
            options = $vscroll.pqScrollBar("option"),
            num_eles = parseInt(options.num_eles),
            cur_pos = parseInt(options.cur_pos);
        var htSB = this._getScollBarHorizontalHeight();
        var GM = this.options.groupModel;
        var data = (GM && GM.grouping == "local") ? this.dataGM : this.data;
        var totalVisibleRows = data ? this._getTotalVisibleRows(data) : 0;
        var htCont = this.$cont[0].offsetHeight;
        var htTbl = (this.$tbl) ? this.$tbl[0].offsetHeight : 0;
        if (htTbl > 0 && htTbl > htCont - htSB) {
            var $trs = this.$tbl.children().children("tr");
            var ht = 0,
                visibleRows = 0;
            $trs.each(function(i, tr) {
                ht += tr.offsetHeight;
                if (ht >= htCont - htSB) {
                    visibleRows = (i > 1) ? (i - 1) : 0;
                    return false;
                }
            });
            num_eles = totalVisibleRows - visibleRows + 1;
        } else {
            num_eles = cur_pos + 1;
        }
        if (num_eles < cur_pos + 1) {
            num_eles = cur_pos + 1;
        }
        if (fullRefresh) {
            that.$vscroll.pqScrollBar("option", "num_eles", num_eles);
        } else {
            that.$vscroll.pqScrollBar("setNumEles", num_eles);
        }
        return num_eles;
    }
    fn._getFirstVisibleRowIndxPage = function(data) {
        for (var i = 0, len = data.length; i < len; i++) {
            var hidden = this._getRowPQData(i, "hidden");
            if (!hidden) {
                return i;
            }
        }
    }
    fn._getLastVisibleRowIndxPage = function(data) {
        for (var i = data.length - 1; i >= 0; i--) {
            var hidden = this._getRowPQData(i, "hidden");
            if (!hidden) {
                return i;
            }
        }
    }
    fn._getTotalVisibleRows = function(data) {
        if (this.options.treeViewModel) {
            var noRows = 0;
            for (var i = 0, len = data.length; i < len; i++) {
                var hidden = this._getRowPQData(i, "hidden");
                if (!hidden) {
                    noRows++;
                }
            }
            return noRows;
        } else {
            return data.length;
        }
    }
    fn._setScrollVLength = function() {
        var cont_ht = this.$cont.height();
        var htSB = this._getScollBarHorizontalHeight();
        this.$vscroll.css("bottom", htSB);
        var len = (cont_ht - htSB);
        this.$vscroll.pqScrollBar("option", "length", len);
        return;
        var GM = this.options.groupModel;
        var data = (GM && GM.grouping == "local") ? this.dataGM : this.data;
        var totalVisibleRows = data ? this._getTotalVisibleRows(data) : 0;
        var options = this.$vscroll.pqScrollBar("option"),
            cur_pos = parseInt(options.cur_pos);
        if (totalVisibleRows >= 0 && this.$tbl) {
            var htCont = this.$cont[0].offsetHeight;
            var htTbl = this.$tbl[0].offsetHeight;
            if (htTbl > htCont - htSB) {
                var $trs = this.$tbl.children().children("tr");
                var ht = 0,
                    visibleRows = 0;
                $trs.each(function(i, tr) {
                    ht += tr.offsetHeight;
                    if (ht >= htCont - htSB) {
                        visibleRows = (i > 1) ? (i - 1) : 0;
                        return false;
                    }
                });
                num_eles = totalVisibleRows - visibleRows + 1;
            } else {
                num_eles = cur_pos + 1;
            }
            if (num_eles < 2 && totalVisibleRows > 1) {
                if (htTbl > htCont - htSB) {
                    num_eles = 2;
                }
            }
        }
        this.$vscroll.pqScrollBar("option", {
            num_eles: num_eles
        });
    }
    fn._setInnerGridHeight = function() {
        if (this.options.flexHeight) return;
        var ht = (this.element.height() -
            ((this.options.topVisible) ? this.$top[0].offsetHeight : 0) -
            ((this.options.bottomVisible) ? this.$bottom[0].offsetHeight : 0));
        this.$grid_inner.height(ht + "px");
    }
    fn._setRightGridHeight = function() {
        this.$header_o.height(this.$header_left.height() - 2);
        if (this.options.flexHeight) return;
        this.$vscroll.css("visibility", "");
        if (this.$tbl) this.$tbl.css("marginBottom", 0);
        var ht = (this.element.height() - this.$header_o[0].offsetHeight - ((this.options.topVisible) ? this.$top[0].offsetHeight : 0) - ((this.options.bottomVisible) ? this.$bottom[0].offsetHeight : 0));
        var ht_contFixed = 0;
        this.$cont.height((ht - ht_contFixed) + "px");
    }
    fn.setGridHeightFromTable = function() {
        var htTbl = 0;
        var htSB = this._getScollBarHorizontalHeight();
        if (this.$tbl) {
            htTbl = (this.$tbl[0].offsetHeight - 1);
            this.$tbl.css("marginBottom", htSB);
        } else {
            htTbl = 22;
        }
        var htCombined = htTbl + htSB;
        this.$cont.height("");
        this.element.height("");
        this.$grid_inner.height("");
        this.$vscroll.css("visibility", "hidden");
    }
    fn._setGridWidthFromTable = function() {
        var wdSB = 17;
        if (this.$vscroll.css("visibility") == "hidden" || this.$vscroll.css("display") == "none") {
            wdSB = 0;
        }
        if (this.$tbl) {
            this.element.width((this.$tbl[0].offsetWidth + wdSB) + "px");
        } else {
            var wd_tbl = this.$header_left.find("table")[0].offsetWidth;
            this.element.width((wd_tbl) + "px");
        }
    }
    fn._setRightGridWidth = function() {}
    fn._bufferObj_getInit = function() {
        return this.init;
    }
    fn._bufferObj_getFinal = function() {
        return this["final"];
    }
    fn._bufferObj_minRowsPerGrid = function() {
        var ht = this.$cont[0].offsetHeight;
        return Math.ceil(ht / this.rowHeight);
    }
    fn._calcCurPosFromRowIndxPage = function(rowIndxPage) {
        if (!this.options.treeViewModel) {
            return rowIndxPage;
        }
        var cur_pos = 0;
        for (var i = 0, len = this.data.length; i < len; i++) {
            if (i == rowIndxPage) {
                break;
            }
            var hidden = this._getRowPQData(i, "hidden");
            if (!hidden) {
                cur_pos++;
            }
        }
        return cur_pos;
    }
    fn._bufferObj_calcInitFinal = function() {
        var GM = this.options.groupModel,
            GMtrue = (GM && GM.grouping == "local") ? true : false,
            data = GMtrue ? this.dataGM : this.data,
            TVM = this.options.treeViewModel;
        if (data == null || data.length == 0) {
            this['final'] = this['init'] = null;
        } else if (this.options.flexHeight) {
            this.init = 0;
            this['final'] = data.length - 1;
        } else {
            var cur_pos = parseInt(this.$vscroll.pqScrollBar("option", "cur_pos"));
            this.scrollCurPos = parseInt(cur_pos);
            if (isNaN(cur_pos) || cur_pos < 0) {
                this.init = 0;
            } else if (TVM) {
                var j = 0;
                for (var i = 0; i < data.length; i++) {
                    if (j == cur_pos) {
                        break;
                    }
                    var hidden = this._getRowPQData(i, "hidden");
                    if (!hidden) {
                        j++;
                    }
                }
                this.init = i;
            } else {
                this.init = cur_pos;
            }
            if (this.init + 1 > data.length) {
                this.init = data.length - 1;
            }
            var noRows = this._bufferObj_minRowsPerGrid();
            this.pageSize = noRows;
            if (TVM) {
                var visibleRows = 0;
                for (var i = this.init; i < data.length; i++) {
                    if (noRows == visibleRows) {
                        break;
                    }
                    var hidden = this._getRowPQData(i, "hidden");
                    if (!hidden) {
                        visibleRows++;
                    }
                }
                this['final'] = i;
            } else {
                this['final'] = this.init + noRows;
            }
            if (this['final'] + 1 > data.length) {
                this['final'] = data.length - 1;
            }
        }
    }
    fn._bufferObj_calcInitFinalH = function() {
        var cur_pos = parseInt(this.$hscroll.pqScrollBar("option", "cur_pos"));
        var initH = 0;
        var indx = 0,
            thisColModel = this.colModel;
        for (var i = this.freezeCols, len = thisColModel.length; i < len; i++) {
            if (thisColModel[i].hidden) {
                initH++;
            } else if (indx == cur_pos) {
                break;
            } else {
                initH++;
                indx++;
            }
        }
        this.initH = initH;
    }
    fn._calcWidthCols = function(colIndx) {
        var wd = 0;
        if (this.numberCell) {
            wd += this.numberCell_outerWidth;
        }
        for (var i = 0; i <= colIndx; i++) {
            if (!this.colModel[i].hidden) wd += this.outerWidths[i];
        }
        return wd;
    }
    fn._calcRightEdgeCol = function(colIndx) {
        var wd = 0,
            cols = 0;
        if (this.numberCell) {
            wd += this.numberCell_outerWidth;
            cols++;
        }
        for (var i = 0; i <= colIndx; i++) {
            if (!this.colModel[i].hidden && this.hidearrHS[i] == false) {
                wd += this.outerWidths[i];
                cols++;
            }
        }
        return {
            width: wd,
            cols: cols
        };
    }
    fn._refreshFreezeLine = function() {
        return;
        if (this.$freezeLine) this.$freezeLine.remove();
        this.$freezeLine = $("<div style='position:absolute;width:1px;z-index:100;'></div>").appendTo(this.$grid_inner);
        var ht = this.$grid_inner.outerHeight();
        var ele = $("td[pq-grid-col-indx=" + this.freezeCols + "]", this.$header)[0];
        var lft = this._calcWidthCols(this.freezeCols - 1) - 1;
        this.$freezeLine.height(ht).css({
            backgroundColor: "blue",
            top: "0",
            left: lft
        });
    }
    fn._getDragHelper = function(evt) {
        var $target = $(evt.currentTarget);
        this.$cl = $("<div class='pq-grid-drag-bar'></div>").appendTo(this.$grid_inner);
        this.$clleft = $("<div class='pq-grid-drag-bar'></div>").appendTo(this.$grid_inner);
        var indx = parseInt($target.attr("pq-grid-col-indx"));
        var ht = this.$grid_inner.outerHeight();
        this.$cl.height(ht);
        this.$clleft.height(ht);
        var ele = $("td[pq-grid-col-indx=" + indx + "]", this.$header)[0];
        var lft = ele.offsetLeft + ((indx > this.options.freezeCols) ? parseInt(this.$header[1].style.left) : 0);
        this.$clleft.css({
            left: lft
        });
        lft = lft + ele.offsetWidth;
        this.$cl.css({
            left: lft
        });
    }
    fn._setDragLimits = function(indx) {
        var that = this;
        var $head = that.$header_left;
        if (indx >= this.options.freezeCols) {
            $head = that.$header_right;
        }
        var $pQuery_drag = $head.find("div.pq-grid-col-resize-handle[pq-grid-col-indx=" + indx + "]");
        var $pQuery_col = $head.find("td.pq-grid-col[pq-grid-col-indx=" + indx + "]");
        var cont_left = $pQuery_col.offset().left + that.minWidth;
        var wdSB = 17;
        if (this.options.flexHeight || this.$vscroll.css("visibility") == "hidden") {
            wdSB = 0;
        }
        var cont_right = that.$cont.offset().left + that.$cont[0].offsetWidth - wdSB + 20;
        $pQuery_drag.draggable("option", 'containment', [cont_left, 0, cont_right, 0]);
    }
    fn._getOrderIndx = function(indx) {
        var columnOrder = this.options.columnOrder;
        if (columnOrder != null) {
            return columnOrder[indx];
        } else {
            return indx;
        }
    }
    fn.nestedCols = function(colMarr, _depth, _hidden) {
        var len = colMarr.length;
        var arr = [];
        if (_depth == null) _depth = 1;
        var new_depth = _depth,
            colSpan = 0,
            width = 0,
            childCount = 0;
        for (var i = 0; i < len; i++) {
            var colM = colMarr[i];
            if (_hidden == true) {
                colM.hidden = _hidden;
            }
            if (colM.colModel != null) {
                var obj = this.nestedCols(colM.colModel, _depth + 1, colM.hidden);
                arr = arr.concat(obj.colModel);
                if (obj.colSpan > 0) {
                    if (obj.depth > new_depth) {
                        new_depth = obj.depth;
                    }
                    colM.colSpan = obj.colSpan;
                    colSpan += obj.colSpan;
                } else {
                    colM.colSpan = 0;
                    colM.hidden = true;
                }
                colM.childCount = obj.childCount;
                childCount += obj.childCount;
            } else {
                if (colM.hidden) {
                    colM.colSpan = 0;
                } else {
                    colM.colSpan = 1;
                    colSpan++;
                }
                colM.childCount = 0;
                childCount++;
                arr.push(colM);
            }
        }
        return {
            depth: new_depth,
            colModel: arr,
            colSpan: colSpan,
            width: width,
            childCount: childCount
        };
    }
    fn.getHeadersCells = function() {
        var optColModel = this.options.colModel,
            thisColModelLength = this.colModel.length,
            depth = this.depth;
        var arr = [];
        for (var row = 0; row < depth; row++) {
            arr[row] = [];
            var k = 0;
            var colSpanSum = 0,
                childCountSum = 0;
            for (var col = 0; col < thisColModelLength; col++) {
                var colModel;
                if (row == 0) {
                    colModel = optColModel[k];
                } else {
                    var parentColModel = arr[row - 1][col];
                    var children = parentColModel.colModel;
                    if (children == null) {
                        colModel = parentColModel;
                    } else {
                        var diff = (col - parentColModel.leftPos);
                        var colSpanSum2 = 0,
                            childCountSum2 = 0;
                        var tt = 0;
                        for (var t = 0; t < children.length; t++) {
                            childCountSum2 += (children[t].childCount > 0) ? children[t].childCount : 1;
                            if (diff < childCountSum2) {
                                tt = t;
                                break;
                            }
                        }
                        colModel = children[tt];
                    }
                }
                var childCount = (colModel.childCount) ? colModel.childCount : 1;
                if (col == childCountSum) {
                    colModel.leftPos = col;
                    arr[row][col] = colModel;
                    childCountSum += childCount;
                    if (optColModel[k + 1]) {
                        k++;
                    }
                } else {
                    arr[row][col] = arr[row][col - 1];
                }
            }
        }
        this.headerCells = arr;
        return arr;
    }
    fn.assignRowSpan = function() {
        var optColModel = this.options.colModel,
            thisColModelLength = this.colModel.length,
            headerCells = this.headerCells,
            depth = this.depth;
        for (var col = 0; col < thisColModelLength; col++) {
            for (var row = 0; row < depth; row++) {
                var colModel = headerCells[row][col];
                if (col > 0 && colModel == headerCells[row][col - 1]) {
                    continue;
                } else if (row > 0 && colModel == headerCells[row - 1][col]) {
                    continue;
                }
                var rowSpan = 1;
                for (var row2 = row + 1; row2 < depth; row2++) {
                    var colModel2 = headerCells[row2][col];
                    if (colModel == colModel2) {
                        rowSpan++;
                    }
                }
                colModel.rowSpan = rowSpan;
            }
        }
        return headerCells;
    }
    fn._refreshHeader = function() {
        var obj = this.nestedCols(this.options.colModel);
        this.colModel = obj.colModel;
        this.depth = obj.depth;
        this.getHeadersCells();
        this.assignRowSpan();
    }
    fn._refreshWidths = function() {
        var that = this;
        $(this.colModel).each(function(i, col) {
            if (col.width != undefined) {
                var wd = parseInt(col.width)
                if (wd < that.minWidth) {
                    wd = that.minWidth;
                    col.width = wd;
                }
            } else {
                col.width = that.minWidth;
            }
        });
    }
    fn._createHeader = function() {
        var that = this;
        var str = "<table class='pq-grid-header-table' cellpadding=0 cellspacing=0>";
        var hidearrHS1 = [];
        var thisOptions = this.options,
            optColModel = thisOptions.colModel,
            optColModelLength = optColModel.length,
            thisColModel = this.colModel,
            thisColModelLength = thisColModel.length,
            depth = this.depth,
            columnBorders = thisOptions.columnBorders,
            headerCells = this.headerCells;
        if (depth >= 1) {
            str += "<tr>";
            if (this.numberCell) {
                str += "<td style='width:" + (this.numberCellWidth + 1) + "px;' ></td>";
            }
            for (var col = 0; col < thisColModelLength; col++) {
                var column = thisColModel[col];
                if (column.hidden) {
                    continue;
                }
                var wd = parseInt(column.width) + ((columnBorders) ? 1 : 0);
                str += "<td style='width:" + wd + "px;'></td>";
            }
            str += "</tr>";
        }
        for (var row = 0; row < depth; row++) {
            str += "<tr>";
            if (row == 0 && this.numberCell) {
                str += "<td class='pq-grid-number-col' rowspan='" + depth + "'>\
				<div class='pq-grid-header-table-div'>&nbsp;</div></td>";
            }
            for (var col = 0; col < thisColModelLength; col++) {
                var column = headerCells[row][col];
                var colSpan = column.colSpan;
                if (row > 0 && column == headerCells[row - 1][col]) {
                    continue;
                } else if (col > 0 && column == headerCells[row][col - 1]) {
                    continue;
                }
                if (column.hidden) {
                    continue;
                }
                var cls = "pq-grid-col";
                if (column.align == "right") {
                    cls += ' pq-align-right';
                } else
                if (column.align == "center") {
                    cls += ' pq-align-center';
                }
                if (col == that.freezeCols - 1 && depth == 1) {
                    cls += " pq-last-freeze-col";
                }
                var colIndx = "",
                    dataIndx = "";
                if (column.colModel == null) {
                    colIndx = "pq-grid-col-indx='" + col + "'";
                }
                str += "<td " + colIndx + " " + dataIndx + " class='" + cls + "' rowspan=" + column.rowSpan + " colspan=" + colSpan + ">\
				<div class='pq-grid-header-table-div' >" +
                    column.title +
                    "<span class='pq-col-sort-icon'>&nbsp;</span></div></td>";
            }
            str += "</tr>";
        }
        str += "</table>";
        this.$header.empty();
        this.$header.append(str);
        var $header_left = $(this.$header[0]);
        var $header_right = $(this.$header[1]);
        var freezeCols = parseInt(this.options.freezeCols);
        var wd = this._calcWidthCols(freezeCols - 1);
        $header_left.css({
            width: wd,
            zIndex: 1
        });
        var lft = 0;
        for (var i = freezeCols; i < (this.initH + freezeCols); i++) {
            var column = thisColModel[i];
            if (column.hidden) {
                continue;
            }
            var oW = this.outerWidths[i];
            if (oW == null) {
                throw ("Assert: unknown width");
            }
            lft += oW;
        }
        $header_right.css({
            left: "-" + lft + "px"
        });
        this.$header.find("td").click(function() {
            if (!that.options.sortable) {
                return;
            }
            var colIndx = $(this).attr("pq-grid-col-indx");
            if (colIndx == null) {
                return;
            }
            var column = that.colModel[colIndx];
            if (column.sortable == false) {
                return;
            }
            var dataIndx = column.dataIndx;
            if (that._trigger("beforeSort", null, {
                dataModel: that.dataModel,
                data: that.data,
                sortIndx: dataIndx
            }) == false) {
                return;
            }
            var dir = "up";
            var DM = that.options.dataModel;
            if (DM.sortIndx == dataIndx) {
                dir = (DM.sortDir == "up") ? "down" : "up";
            }
            DM.sortIndx = dataIndx;
            DM.sortDir = dir;
            that._refreshSortingDataAndView({
                sorting: true,
                keepSelection: true,
                fn: function() {
                    that._trigger("sort", null, {
                        dataModel: that.dataModel,
                        data: that.data
                    });
                }
            });
        })
        var lft = 0;
        var hd_ht = that.$header[0].offsetHeight;
        var direction = this.options.direction;
        for (var i = 0; i < this.colModel.length; i++) {
            var colModel = that.colModel[i];
            if (that.hidearrHS[i]) {
                continue;
            } else if (colModel.hidden) {
                continue;
            }
            if (colModel.resizable != undefined && colModel.resizable == false) {
                continue;
            }
            var $head = that.$header_left;
            if (i >= that.options.freezeCols) {
                $head = that.$header_right;
            }
            var $handle = $("<div pq-grid-col-indx='" + i + "' class='pq-grid-col-resize-handle'>&nbsp;</div>")
                .appendTo($head);
            var pq_col = that.$header_right.find("td[pq-grid-col-indx=" + i + "]")[0];
            lft = parseInt(pq_col.offsetLeft) + parseInt((direction == "rtl") ? 0 : (pq_col.offsetWidth - 10));
            $handle.css({
                left: lft,
                height: hd_ht
            });
        }
        var drag_left, drag_new_left, cl_left;
        var $pQuery_handles = that.$header.find(".pq-grid-col-resize-handle").draggable({
            axis: 'x',
            helper: function(evt, ui) {
                var $target = $(evt.target)
                var indx = parseInt($target.attr("pq-grid-col-indx"));
                that._setDragLimits(indx);
                that._getDragHelper(evt, ui);
                return $target;
            },
            start: function(evt, ui) {
                drag_left = ui.position.left;
                cl_left = parseInt(that.$cl[0].style.left);
            },
            drag: function(evt, ui) {
                drag_new_left = ui.position.left;
                var dx = (drag_new_left - drag_left);
                that.$cl[0].style.left = cl_left + dx + "px";
            },
            stop: function(evt, ui) {
                that.$clleft.remove();
                that.$cl.remove();
                drag_new_left = ui.position.left;
                var dx = (drag_new_left - drag_left);
                var $target = $(ui.helper);
                var colIndx = parseInt($target.attr("pq-grid-col-indx"));
                var column = that.colModel[colIndx];
                column.width = parseInt(column.width) + dx;
                that._computeOuterWidths(true);
                that._refresh();
                for (var i = 0; i < that.tables.length; i++) {
                    var $tbl = that.tables[i].$tbl;
                    $tbl.find("td[pq-top-col-indx='" + colIndx + "']").width(that.outerWidths[colIndx]);
                }
            }
        });
    }
    fn._refreshHeaderSortIcons = function() {
        var DM = this.options.dataModel;
        if (DM.sortIndx == undefined) return;
        var $pQuery_cols = this.$header.find(".pq-grid-col");
        $pQuery_cols.removeClass("pq-col-sort-asc pq-col-sort-desc ui-state-active");
        var sortIndx = DM.sortIndx;
        var colIndx = this.getColIndxFromDataIndx(sortIndx);
        var addClass = "ui-state-active pq-col-sort-" + (DM.sortDir == "up" ? "asc" : "desc")
        this.$header.find(".pq-grid-col[pq-grid-col-indx=" + colIndx + "]").addClass(addClass)
    }
    fn._generateSummaryRow = function(rowData, rowIndx, thisColModel, noColumns, hidearrHS1, offset, const_cls, buffer) {
        var row_cls = "pq-summary-row",
            row_str = "",
            columnBorders = this.options.columBorders;
        row_str += "<tr pq-row-indx='" + rowIndx + "' class='" + row_cls + "'>"
        buffer.push(row_str);
        if (this.numberCell) {
            buffer.push("<td style='width:" + this.numberCellWidth + "px;' class='pq-grid-number-cell pq-row-selector'>\
		<div class='pq-td-div'></div></td>")
        }
        var objRender = {
            rowIndx: rowIndx + offset,
            rowIndxPage: rowIndx,
            rowData: rowData,
            summaryCell: true
        };
        for (var col = 0; col < noColumns; col++) {
            var column = thisColModel[col],
                dataIndx = column.dataIndx;
            objRender.column = column;
            objRender.colIndx = col; {
                var cellSelection = false;
                var selectedDataIndices = rowData.selectedDataIndices;
                if (selectedDataIndices) {
                    cellSelection = selectedDataIndices[dataIndx];
                }
            }
            if (column.hidden) {
                continue;
            } else if (this.hidearrHS[col]) {
                continue;
            }
            var strStyle = "";
            var cls = const_cls;
            if (column.align == "right") {
                cls += ' pq-align-right';
            } else if (column.align == "center") {
                cls += ' pq-align-center';
            }
            if (col == this.freezeCols - 1 && columnBorders) {
                cls += " pq-last-freeze-col";
            }
            if (column.className) {
                cls = cls + " " + column.className;
            }
            if (cellSelection) {
                cls = cls + " pq-cell-select";
            }
            var valCell = (rowData[dataIndx] == null) ? "" : rowData[dataIndx];
            var str = "<td class='" + cls + "' style='" + strStyle + "' >\
			<div>" + valCell + "</div></td>";
            buffer.push(str)
        }
        for (var k = 0; k < hidearrHS1.length; k++) {
            var col = hidearrHS1[k];
            var column = thisColModel[col],
                dataIndx = column.dataIndx;;
            objRender.column = column;
            objRender.colIndx = col;
            var strStyle = "";
            strStyle += "visibility:hidden;";
            var cls = const_cls;
            if (column.align == "right") {
                cls += ' pq-align-right';
            } else if (column.align == "center") {
                cls += ' pq-align-center';
            }
            var valCell = (rowData[dataIndx] == null) ? "" : rowData[dataIndx];
            var str = "<td class='" + cls + "' style='" + strStyle + "' >\
			<div>" + valCell + "</div></td>";
            buffer.push(str)
        }
        buffer.push("</tr>");
        return buffer;
    }
    fn.createTable = function(objP) {
        this.cTable._generateTables(objP);
    }
    fn._refreshOtherTables = function() {
        return;
        var thisColModel = this.colModel,
            noColumns = thisColModel.length,
            columnBorders = this.options.columBorders;
        for (var i = 0; i < this.tables.length; i++) {
            var tblObj = this.tables[i];
            var $tbl = tblObj.$tbl,
                $tr = $tbl.find("tr:first");
            for (var col = 0; col < noColumns; col++) {
                var column = thisColModel[col],
                    dataIndx = column.dataIndx;
                if (column.hidden) {
                    var $td = $tr.find("td[pq-dataIndx='" + dataIndx + "']");
                    if ($td.length > 1) {
                        var $tds = $tbl.find("td[pq-dataIndx='" + dataIndx + "']").remove();
                        tblObj.$tds.add($tds);
                    }
                } else if (this.hidearrHS[col]) {
                    var $td = $tr.find("td[pq-dataIndx='" + dataIndx + "']");
                    if ($td.css("visibility") != "hidden") {}
                }
                var strStyle = "";
                var cls = const_cls;
                if (column.align == "right") {
                    cls += ' pq-align-right';
                } else if (column.align == "center") {
                    cls += ' pq-align-center';
                }
                if (col == this.freezeCols - 1 && columnBorders) {
                    cls += " pq-last-freeze-col";
                }
                if (column.className) {
                    cls = cls + " " + column.className;
                }
                if (cellSelection) {
                    cls = cls + " pq-cell-select";
                }
                var str = "<td class='" + cls + "' style='" + strStyle + "' pq-col-indx='" + col + "'>\
				" + this.cTable._renderCell(objRender) + "</td>";
                buffer.push(str)
            }
            for (var k = 0; k < hidearrHS1.length; k++) {
                var col = hidearrHS1[k];
                var column = thisColModel[col];
                objRender.column = column;
                objRender.colIndx = col;
                var strStyle = "";
                strStyle += "visibility:hidden;";
                var cls = const_cls;
                if (column.align == "right") {
                    cls += ' pq-align-right';
                } else if (column.align == "center") {
                    cls += ' pq-align-center';
                }
                var str = "<td class='" + cls + "' style='" + strStyle + "' pq-col-indx='" + col + "'>\
				" + this.cTable._renderCell(objRender) + "</td>";
                buffer.push(str)
            }
        }
    }
    fn._sortLocalData = function(dataIndx, dir, dataType, data) {
        var m_sort_dir = dir,
            TVM = this.options.treeViewModel,
            that = this;
        if (data == null || data.length == 0) {
            return;
        }

        function innerSort() {
            function sort_integer(obj1, obj2) {
                var val1 = obj1[dataIndx];
                var val2 = obj2[dataIndx];
                val1 = val1 ? parseInt(val1) : 0;
                val2 = val2 ? parseInt(val2) : 0;
                return (val1 - val2);
            }

            function sort_custom(obj1, obj2) {
                var val1 = obj1[dataIndx];
                var val2 = obj2[dataIndx];
                return dataType(val1, val2);
            }

            function sort_float(obj1, obj2) {
                var val1 = (obj1[dataIndx] + "").replace(/,/g, "");
                var val2 = (obj2[dataIndx] + "").replace(/,/g, "");
                val1 = val1 ? parseFloat(val1) : 0;
                val2 = val2 ? parseFloat(val2) : 0;
                return (val1 - val2);
            }
            var iter = 0;

            function sort_string(obj1, obj2) {
                iter++;
                var val1 = obj1[dataIndx];
                var val2 = obj2[dataIndx];
                val1 = val1 ? val1 : "";
                val2 = val2 ? val2 : "";
                if (val1 > val2) {
                    return 1;
                } else if (val1 < val2) {
                    return -1;
                }
                return 0;
            }
            if (dataType == "integer") {
                data = data.sort(sort_integer)
            } else if (dataType == "float") {
                data = data.sort(sort_float)
            } else if (typeof dataType == "function") {
                data = data.sort(sort_custom);
            } else {
                data = data.sort(sort_string)
            }
            if (m_sort_dir == "down") {
                data = data.reverse();
            }
        }
        $.measureTime(innerSort, "innerSort");
    }
    $.widget("paramquery.pqGrid", fn);
    $.paramquery.pqGrid.regional = {};
    $.paramquery.pqGrid.regional['en'] = fn._regional;
    $.paramquery.pqGrid.setDefaults = function(obj) {
        for (var key in obj) {
            fn.options[key] = obj[key];
        }
        $.widget("paramquery.pqGrid", fn);
        $(".pq-grid").each(function(i, grid) {
            $(grid).pqGrid("option", obj);
        })
    }
    $.measureTime = function(fn, nameofFunc) {
        var initTime = (new Date()).getTime();
        fn();
        var finalTime = (new Date()).getTime();
        var cnt = finalTime - initTime;
    }
})(jQuery);
var cons = {
    log: function(str) {
        try {
            if (document.compatMode && document.all && typeof str == 'object') throw "";
            console.log(str);
        } catch (e) {
            var st = "";
            if (typeof str == 'object') {
                for (var key in str) {
                    if (typeof str[key] != 'function') st += key + " = " + str[key]
                }
            } else {
                if (document.getElementById('console') == undefined) {
                    $("<textarea id='console' rows=8 cols=100>" + str + "</textarea>").appendTo(document.body);
                }
                var $console = $("#console")
                $console.text($console.text() + '\r\n' + str);
                $console[0].scrollTop = 1000000000000;
            }
        }
    }
};
