/**
 * ParamQuery Grid a.k.a. pqGrid v1.0.3
 * 
 * Copyright (c) 2012 Paramvir Dhindsa (http://paramquery.com)
 * Released under MIT license
 * http://paramquery.com/license
 * 
 */     	
(function($){
	$.adapter={
		xmlToArray:function(data,obj){
			var itemParent=obj.itemParent;
			var itemNames=obj.itemNames;
			var arr=[];
			var $items=$(data).find(itemParent);
			$items.each(function(i,item){
				var $item=$(item);
				var arr2=[];
				$(itemNames).each(function(j,itemName){
					arr2.push($item.find(itemName).text());	
				})
				arr.push(arr2);
			})
			return arr;
		},
		tableToArray:function(tbl){
			var $tbl=$(tbl);
			var colModel=[];
			var data=[];
			var cols=[];
			var widths=[];
			var $trfirst=$tbl.find("tr:first");
			var $trsecond=$tbl.find("tr:eq(1)");
			$trfirst.find("th,td").each(function(i,td){
				var $td=$(td);
				var title=$td.html();
				var width=$td.width();
				var dataType="string";
				var $tdsec=$trsecond.find("td:eq("+i+")");
				var val=$tdsec.text();
				var align=$tdsec.attr("align");
				val=val.replace(/,/g,"");
				if(parseInt(val)==val && (parseInt(val)+"").length == val.length){
					dataType="integer";
				}
				else if(parseFloat(val)==val ){
					dataType="float";
				}
				var obj={title:title,width:width,dataType:dataType,align:align};
				colModel.push(obj);
			})
			$tbl.find("tr").each(function(i,tr){
				if(i==0)return;
				var $tr=$(tr);
				var arr2=[];
				$tr.find("td").each(function(j,td){
					arr2.push($.trim($(td).html()));
				})
				data.push(arr2);
			})
			return {data:data,colModel:colModel};
		}
	}
})(jQuery);
/**
 * ParamQuery Pager a.k.a. pqPager
 */     	
(function($){
var fnPG={};
fnPG.options={
	currentPage:0,
	totalPages:0,
	totalRecords:0,
	msg:"",
	rPPOptions:[10,20,30,40,50,100],
	rPP:20,
	change:null
};
fnPG._create=function(){
	var that=this;
	this.element.addClass("pq-pager").css({});
	this.first = $( "<button type='button' title='First Page'></button>", {
	})
	.appendTo( this.element )
	.button({
		icons: {
			primary:"pq-page-first"
		},text:false
	}).bind("click.paramquery",function(evt){
		if(that.options.currentPage>1){
			if ( that._trigger( "change", evt, {
				curPage: 1
			} ) !== false ) {
				that.option( {currentPage:1} );
			}
		}					
	});
	this.prev=$( "<button type='button' title='Previous Page'></button>")
	.appendTo( this.element )
	.button({icons:{primary:"pq-page-prev"},text:false}).bind("click",function(evt){
		if(that.options.currentPage>1){
			var currentPage=that.options.currentPage-1;
			if ( that._trigger( "change", evt,{
				curPage: currentPage
			} ) !== false ) {
				that.option( {currentPage:currentPage} );
			}						
		}
	});
	$("<span class='pq-separator'></span>").appendTo(this.element);
	$( "<span>Page </span>", {					
	})
	.appendTo( this.element )
	this.page=$( "<input type='text' tabindex='0' />")
	.appendTo( this.element )
	.bind("change",function(evt){
		var $this=$(this)
		var val=$this.val();
		if(isNaN(val)||val<1){
			$this.val(that.options.currentPage)
			return false;
		}
		val=parseInt(val);
		if(val>that.options.totalPages){
			$this.val(that.options.currentPage);
			return false;						
		}
		if ( that._trigger( "change", evt, {
			curPage: val
		}) !== false ) {
			that.option( {currentPage:val} );
		}				
		else{
			$this.val(that.options.currentPage);
			return false;												
		}		
	})
	$( "<span>of </span>", {					
	})
	.appendTo( this.element )
	this.$total=$( "<span class='total'></span>", {					
	})
	.appendTo( this.element )
	$("<span class='pq-separator'></span>").appendTo(this.element);
	this.next=$( "<button type='button' title='Next Page'></button>")
	.appendTo( this.element )
	.button({icons:{primary:"pq-page-next"},text:false}).bind("click",function(evt){
		var val=that.options.currentPage+1;
		if ( that._trigger( "change", evt, {curPage: val} ) !== false ) {			
			that.option( {currentPage:val} );
		}				
	});
	this.last=$( "<button type='button' title='Last Page'></button>")
	.appendTo( this.element )
	.button({icons:{primary:"pq-page-last"},text:false}).bind("click",function(evt){
		var val=that.options.totalPages;
		if ( that._trigger( "change", evt, {curPage: val} ) !== false ) {			
			that.option( {currentPage:val} );
		}									
	});
	$("<span class='pq-separator'></span>").appendTo(this.element);
	$("<span>Records per page: </span>")
	.appendTo(this.element)
	this.$rPP=$("<select></select>")
	.appendTo(this.element)
	.change(function(evt){
		var val=$(this).val();
		if (that._trigger("change", evt,{rPP: val}) !== false) {
			that.options.rPP=val;
		}
	})
	$("<span class='pq-separator'></span>").appendTo(this.element);
	this.$refresh=$("<button type='button' title='Refresh'></button>")
	.appendTo(this.element)
	.button({icons:{primary:"pq-refresh"},text:false}).bind("click",function(evt){		
		if ( that._trigger( "refresh", evt ) !== false ) {			
		}				
	});
	$("<span class='pq-separator'></span>").appendTo(this.element);
	this.$msg=$("<span class='pq-pager-msg'></span>")
	.appendTo( this.element )
	this._refresh();
}
fnPG._refresh=function(){
	var sel=(this.$rPP);
	sel.empty();
	var opts = this.options.rPPOptions;
	for(var i=0;i<opts.length;i++){
        var opt=document.createElement("option");
        opt.text=opts[i];
        opt.value=opts[i];
        opt.setAttribute("value",opts[i]);
        opt.innerHTML=opts[i];
		sel.append(opt)
	}				
	sel.find("option[value="+this.options.rPP+"]").attr("selected",true)
	if(this.options.currentPage>=this.options.totalPages){
		this.next.button({disabled:true});
		this.last.button({disabled:true});
	}
	else{
		this.next.button({disabled:false});
		this.last.button({disabled:false});					
	}
	if(this.options.currentPage<=1){
		this.first.button({disabled:true});
		this.prev.button({disabled:true});
	}		
	else{
		this.first.button({disabled:false});
		this.prev.button({disabled:false});					
	}
	this.page.val(this.options.currentPage)
	this.$total.text(this.options.totalPages);		
	if(this.options.totalRecords>0){
		var rPP = this.options.rPP;
		var currentPage = this.options.currentPage;
		var totalRecords = this.options.totalRecords;
		var begIndx = (currentPage-1)*rPP;
		var endIndx = currentPage*rPP;
		if(endIndx>totalRecords){
			endIndx = totalRecords;
		}
		this.$msg.html("Displaying "+(begIndx+1)+" to "
			+(endIndx)+" of "+totalRecords+" items.")		
	}
	else{
		this.$msg.html("");
	}
}
fnPG._destroy=function(){
	this.element.empty().removeClass("pq-pager").enableSelection();
	_super();
}
fnPG._setOption=function(key,value){
	if(key=="currentPage"||key=="totalPages")value=parseInt(value);	
	$.Widget.prototype._setOption.call( this, key, value );				
}
fnPG._setOptions=function(){
	$.Widget.prototype._setOptions.apply( this, arguments );
	this._refresh();				
}
	$.widget("paramquery.pqPager",fnPG);	
})(jQuery);
/**
 * ParamQuery Scrollbar a.k.a. pqScrollBar
 */     	
(function($){
var fnSB={};
fnSB.options={
	length:200,
	num_eles:3,
	cur_pos:0,
	timeout:350,
	pace:'optimum',
	direction:'vertical'
}
fnSB._destroy=function(){
	this.element.removeClass("pq-scrollbar-vert").enableSelection().removeClass("pq-scrollbar-horiz").unbind('click.pq-scrollbar').empty();
	this.element.removeData();
}
fnSB._create=function(){
	this.length=this.options.length;
	this.direction=this.options.direction;	
	this.num_eles=this.options.num_eles;
	var that=this;
	var ele=this.element.empty();
	if(this.direction=="vertical"){
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
	}
	else{
		ele.addClass("pq-scrollbar-horiz");
		ele.width(this.width);
		ele.html("<div class='left-btn pq-sb-btn'></div>\
			<div class='pq-sb-slider pq-sb-slider-h'>\
				<span class='horiz-slider-left'></span><span class='horiz-slider-bg'></span><span class='horiz-slider-center'></span><span class='horiz-slider-bg'></span><span class='horiz-slider-right'></span>\
			</div>\
		<div class='right-btn pq-sb-btn'></div>");					
	}
	this.element.disableSelection().bind('click.pq-scrollbar',function(evt){
		if(that.options.disabled)return;
		if(that.$slider.is(":hidden"))return;
		if(that.direction=="vertical"){
			var clickY=evt.pageY;
			var top_this=that.element.offset().top;
			var bottom_this=top_this+that.length;
			var topSlider= that.$slider.offset().top;
			var botSlider=topSlider+ that.$slider.height();
			if(clickY<topSlider && clickY>top_this+17 ){
				var new_top = clickY-top_this;						
				that.$slider.css("top",new_top);
				that._updateCurPosAndTrigger(evt);
			}
			else if(clickY>botSlider && clickY<bottom_this-17){
				that.$slider.css("top",clickY-top_this-that.$slider.height());
				that._updateCurPosAndTrigger(evt);
			}					
		}
		else{
			var top=evt.pageX;
			var topSlider= that.$slider.offset().left;
			var botSlider=topSlider+ that.$slider.width();
			if(top<topSlider){
				that.$slider.css("left",top-that.element.offset().left);
				that._updateCurPosAndTrigger(evt);
			}
			else if(top>botSlider){
				that.$slider.css("left",top-that.element.offset().left-that.$slider.width());
				that._updateCurPosAndTrigger(evt);
			}					
		}
	});
	var axis='x';
	if(this.direction=="vertical")axis='y';
	this.$slider = $("div.pq-sb-slider",this.element).draggable({axis:axis,
		helper: function(evt, ui){
			that._setDragLimits();
			return this;
		},
		drag:function(evt){
			var pace=that.options.pace;
			if(pace=="optimum")
				that._setNormalPace(evt);
			else if(pace=="fast")
				that._updateCurPosAndTrigger(evt);	
		},	
		stop:function(evt){
			that._updateCurPosAndTrigger(evt);
		}
	});
	function decr_cur_pos(evt){
		if (that.options.cur_pos > 0) {
			that.options.cur_pos--;
			that.updateSliderPos();
			that._trigger("scroll",evt, {cur_pos: that.options.cur_pos});
		}				
	}
	this.$top_btn = $("div.top-btn,div.left-btn",this.element).click(function(evt){
		if(that.options.disabled)return;
		decr_cur_pos(evt);
		evt.preventDefault();
		return false;
	}).mousedown(function(evt){
		if(that.options.disabled)return;
		that.mousedownTimeout=window.setTimeout(function(){
			that.mousedownInterval = window.setInterval(function(){
				decr_cur_pos(evt)
			},50);					
		},that.options.timeout)				
	}).bind('mouseup mouseout',function(evt){
		if(that.options.disabled)return;
		that._mouseup(evt);
	});
	function incr_cur_pos(evt){
		if (that.options.cur_pos < that.num_eles - 1) {
			that.options.cur_pos++;
			that.updateSliderPos();
			that._trigger("scroll", evt,{cur_pos: that.options.cur_pos});															
		}
	}			
	this.$bottom_btn = $("div.bottom-btn,div.right-btn",this.element).click(function(evt){
		if(that.options.disabled)return;
		incr_cur_pos(evt);
		evt.preventDefault();
		return false;
	}).mousedown(function(evt){
		if(that.options.disabled)return;
		that.mousedownTimeout=window.setTimeout(function(){
			that.mousedownInterval = window.setInterval(function(){
				incr_cur_pos(evt)
			},50);					
		},that.options.timeout)						
	}).bind('mouseup mouseout',function(evt){
		if(that.options.disabled)return;
		that._mouseup(evt);
	});
	this._refresh();
}
fnSB._mouseup=function(evt){
	if(this.options.disabled)return;
	var that=this;			
	window.clearTimeout(that.mousedownTimeout);
	that.mousedownTimeout=null;
	window.clearInterval(that.mousedownInterval);
	that.mousedownInterval=null;
}
fnSB._setDragLimits=function(){
	if (this.direction == "vertical") {
		var top = this.element.offset().top+17;
		var bot = (top + this.length - 34 - this.slider_length); 
		this.$slider.draggable("option","containment",[0,top,0,bot]);						
	}
	else{
		var top = this.element.offset().left+17;
		var bot = (top + this.length - 34 - this.slider_length); 
		this.$slider.draggable("option","containment",[top,0,bot,0]);						
	}
}
fnSB._refresh=function(){
	if(this.options.num_eles<=1){
		this.element.css("display","none");				
	}
	else{
		this.element.css("display","");		
	}					
	this.num_eles=this.options.num_eles;
	this.length=this.options.length;
	this._validateCurPos();
	this.$slider.css("display","");
	if(this.direction=="vertical"){
		this.element.height(this.length);
		this._setSliderBgLength();
		this.scroll_space =this.length-34-this.slider_length;
		if(this.scroll_space<4 ||this.num_eles<=1){
			this.$slider.css("display","none");
		}
		this.updateSliderPos(this.options.cur_pos);
	}
	else{
		this.element.width(this.length);
		this._setSliderBgLength();
		this.scroll_space =this.length-34-this.slider_length;
		if(this.scroll_space<4 ||this.num_eles<=1){
			this.$slider.css("display","none");
		}
		this.updateSliderPos(this.options.cur_pos);
	}
}
fnSB._setSliderBgLength=function(){
	var outerHeight=this.length;
	var innerHeight=this.num_eles*40+outerHeight;
	var avail_space = outerHeight-34;
	var slider_height = avail_space* outerHeight/innerHeight;
	var slider_bg_ht=Math.round((slider_height-(8+3+3))/2);
	if(slider_bg_ht<1){
		slider_bg_ht=1
	}
	this.slider_length=8+3+3+2*slider_bg_ht;
	if(this.direction=="vertical"){
		$("div.vert-slider-bg",this.element).height(slider_bg_ht);
		this.$slider.height(this.slider_length);
	}
	else{
		$(".horiz-slider-bg",this.element).width(slider_bg_ht);
		this.$slider.width(this.slider_length);
	}
}
fnSB._updateCurPosAndTrigger = function(evt,top){
	var that=this;
	var $slider=that.$slider;
	if(top==null){
		top=(that.direction=="vertical")?parseInt($slider[0].style.top):parseInt($slider[0].style.left);
	}
	var scroll_space =that.length-34-((that.direction=="vertical")?$slider[0].offsetHeight:$slider[0].offsetWidth);
	var cur_pos = (top-17)*(that.num_eles-1)/scroll_space;
	cur_pos=Math.round(cur_pos);
	if(that.options.cur_pos!=cur_pos){
		that.options.cur_pos=cur_pos;
		that._trigger("scroll",evt, {cur_pos: that.options.cur_pos});
	}				
}
fnSB._setNormalPace=function(evt){
	if(this.timer){
		window.clearInterval(this.timer);
		this.timer=null;
	}
	var that=this;
	that.timer=window.setInterval(function(){
		var $slider=that.$slider;
		var top=(that.direction=="vertical")?parseInt($slider[0].style.top):parseInt($slider[0].style.left);
		if(that.prev_top==top){
			that._updateCurPosAndTrigger(evt,top);
			window.clearInterval(that.timer);
			that.timer=null;
		}
		that.prev_top = top;				
	},20);				
}
fnSB._validateCurPos=function(){
	if(this.options.cur_pos>=this.num_eles){
		this.options.cur_pos=this.num_eles-1;
	}
	if(this.options.cur_pos<0){
		this.options.cur_pos=0;				
	}	
}
fnSB.updateSliderPos=function(){
	var sT=(this.scroll_space*(this.options.cur_pos))/(this.num_eles-1);
	if(this.direction=="vertical")
		this.$slider.css("top",17+sT);
	else				
		this.$slider.css("left",17+sT);
}
fnSB.scroll=function(){
	var evt=null;
	this._trigger("scroll",evt, {cur_pos: this.options.cur_pos});
}
fnSB._setOption=function(key,value){
	if(key=="disabled"){
		if(value==true)
			this.$slider.draggable("disable");
		else
			this.$slider.draggable("enable");
	}
	$.Widget.prototype._setOption.call( this, key, value );
}
fnSB._setOptions=function(){
	$.Widget.prototype._setOptions.apply( this, arguments );
	this._refresh();				
}
	$.widget("paramquery.pqScrollBar",fnSB);
})(jQuery);
/**
 * ParamQuery Grid a.k.a. pqGrid*/
(function ($) {
    var fn = {};
    fn.options = {
        cellSelected: null,
        colModel: null,
        columnBorders: true,
		columnOrder: null,
        dataModel: {
            curPage: 0,
            totalPages: 0,
            rPP: 10,
            location: "local",
            sorting: "local",
            sortDir: "up",
            method: "GET",
            rPPOptions: [10, 20, 50, 100]
        },
        draggable: false,
        editable: true,
        freezeCols: 0,
        height: 400,
        minWidth: 50,
        numberCell: true,
        numberCellWidth: 50,		
        resizable: false,	
		scrollPace:'fast',	
        sortable: true,
        title: "&nbsp;",
        width: 600,
        wrap: true
    }
    fn._destroyResizable = function () {
        if (this.element.data("resizable")) this.element.resizable('destroy');
    }
    fn._destroyDraggable = function () {
        if (this.element.data("draggable")) this.element.draggable('destroy');
    }
    fn.disable = function () {
        if (this.$disable == null) this.$disable = $("<div class='pq-grid-disable'></div>").css("opacity", 0.2).appendTo(this.element);
    }
    fn.enable = function () {
        if (this.$disable) {
            this.element[0].removeChild(this.$disable[0]);
            this.$disable = null;
        }
    }
    fn._destroy = function () {
        this._destroyResizable();
        this._destroyDraggable(); 
        this.element.empty(); 
        this.element.css('height', "");
        this.element.css('width', "");
        this.element.removeClass('pq-grid').removeData();
    }
    fn._findCellFromEvtCoords = function (evt) {
        if (this.$tbl == null) {
            return {
                $td: null,
                rowIndx: null,
                colIndx: null
            };
        }
        var top = evt.pageY - this.$cont.offset().top;
        var left = evt.pageX - this.$cont.offset().left;
        var $trs = this.$tbl.find("tr");
        var indx = 0,
            rowIndx = 0,
            colIndx = 0;
        for (var i = 1; i < $trs.length; i++) {
            if ($trs[i].offsetTop > top) {
                break;
            } else {
                indx++;
            }
        }
        var $tr = $($trs[indx]);
        rowIndx = parseInt($tr.attr('pq-row-indx'));
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
            rowIndx: rowIndx,
            colIndx: colIndx
        };
    }
    fn._create = function () {
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
        this.freezeCols = this.options.freezeCols ? this.options.freezeCols : 0;
        this.columnBorders = this.options.columnBorders ? true : false;
        var that = this;
        this.$tbl = null; 
        this.colModel = this.options.colModel ? this.options.colModel : [];
        $(this.colModel).each(function (i, col) {
            if (col.width != undefined) {
                var wd = parseInt(col.width)
                if (wd < that.minWidth) wd = that.minWidth;
                that.widths[i] = wd;
            } else {
                that.widths[i] = that.minWidth;
            }
        });
        this.element.empty().addClass('pq-grid').append("<div class='pq-grid-top'>\
		<div class='pq-grid-title'>&nbsp;</div></div>\
	<div class='pq-grid-inner' tabindex=0><div class='pq-grid-right'> \
		<div class='pq-header-outer'> \
			<div class='pq-grid-header'></div> \
		</div> \
		<div class='pq-cont-right' style=''>\
			<div class='pq-cont' ></div> \
		</div> \
		</div></div>\
	<div class='pq-grid-bottom'>\
	<div class='pq-grid-footer'>&nbsp;</div>\
	</div>");
        this._trigger("render", null, {
            dataModel: this.options.dataModel       
        });
        this.$top = $("div.pq-grid-top", this.element);
		this.$title = $("div.pq-grid-title", this.element);
        this.$toolbar = $("div.pq-grid-toolbar", this.element);
        this.$grid_inner = $("div.pq-grid-inner", this.element);
        this.$grid_right = $(".pq-grid-right", this.element);
        this.$header_o = $("div.pq-header-outer", this.$grid_right);
        this.$header = $("div.pq-grid-header", this.$grid_right);
		this.$bottom = $("div.pq-grid-bottom", this.element); 
        this.$footer = $("div.pq-grid-footer", this.element); 
        this.$cont_o = $("div.pq-cont-right", this.$grid_right);
        this.$cont = $("div.pq-cont", this.$grid_right).click(function (evt) {
            if (that._isEditCell(evt)) {
                return true;
            } 
            var obj = that._findCellFromEvtCoords(evt);
            var $td = obj.$td,
                rowIndx = obj.rowIndx,
                colIndx = obj.colIndx;
            if ($td == null || $td.length == 0) {
                return;
            }
            if (that.$td_edit && (that.$td_edit[0] == $td[0])) { 
                return true;
            }
            if (that.$tr_focus == null && that.$td_focus && (that.$td_focus[0] == $td[0])) { 
                that._editCell($td);
                return true;
            }
            if ($td.hasClass('pq-row-selector')) {
                that._setSelection(rowIndx);
                return;
            }
            if ($td)
            that._setSelection(rowIndx, colIndx, evt);
        }).dblclick(function (evt) {
            return true;
        });
        this.$cont.bind('mousewheel DOMMouseScroll', function (evt) {
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
        })
        var prevVScroll = 0;
        $("<div class='pq-hvscroll-square'></div>").appendTo(this.$grid_inner);
        this.$vscroll = $("<div class='pq-vscroll'></div>").appendTo(this.$grid_inner);
        this.prevVScroll = 0;
        this.$vscroll.pqScrollBar({
			pace:that.options.scrollPace,
            direction: "vertical",
            cur_pos: 0,
            scroll: function (evt, obj) {				
                that.$cont[0].scrollTop = 0; 
                if(that.init!=obj.cur_pos){
	                $.measureTime(function () {
	                    that.selectCellRowCallback(that._generateTables);
	                }, 'that.selectCellRowCallback(that._generateTables)');
			        that._trigger("refresh", null, {
			            dataModel: that.dataModel,
			            data: that.data
			        });					
				}
            }
        });
        var prevHScroll = 0;
        this.$hscroll = $("<div class='pq-hscroll'></div>").appendTo(this.$grid_inner);
        this.$hscroll.pqScrollBar({
            direction: "horizontal",
			pace:that.options.scrollPace,
            cur_pos: 0,
            scroll: function (evt, obj) {
                that._bufferObj_calcInitFinalH();
                that._refreshHideArrHS();
                that.selectCellRowCallback(function () {
                    that._createHeader();
                    that._refreshHeaderSortIcons();
                    that._generateTables();
                });
            }
        })
        this.element.width(this.options.width + "px").height(this.options.height + "px");
		this.disableSelection();
        if ($.browser.opera) {
            this.$grid_inner.bind("keypress.pq-grid", {
                that: this
            }, function (evt) {
                that.keyPressDown(evt);
            })
        } else {
            this.$grid_inner.bind("keydown.pq-grid", {
                that: this
            }, function (evt) {
                that.keyPressDown(evt);
            })
        }
        this._refreshOptions();
        this._refreshTitle();
        var DM = this.options.dataModel;
        if (typeof DM.sortIndx == "number" && DM.sorting == "local" && DM.location == "local") {
            this._sortLocalData(DM.sortIndx, DM.sortDir, this.colModel[DM.sortIndx].dataType); 
        }
        this._initData(); 
        this._refresh();
    }
    fn._getCreateEventData = function () {
        return {
            dataModel: this.options.dataModel,
            data: this.data,
            colModel: this.options.colModel
        };
    }
    fn._refreshOptions = function () {
        this._refreshDataOptions();
    }
    fn._refreshDataOptions = function () {
    }
    fn.enableSelection=function(){
		this.$grid_inner.enableSelection();
	}
    fn.disableSelection=function(){
		this.$grid_inner.disableSelection();
	}	
	fn._isEditCell = function (evt) {
        var $targ = $(evt.target);
        if ($targ.hasClass("pq-cell-selected-border-edit") || $targ.parents('div.pq-cell-selected-border-edit').length > 0) {
            return true;
        }
        return false;
    }
    fn._initPager = function () {
        var DM = this.options.dataModel;
        var that = this;
        var obj2 = {
            rPP: DM.rPP,
            rPPOptions: DM.rPPOptions,
            change: function (evt, obj) {
                if (obj.curPage != undefined){
					DM.prevPage = DM.curPage;
					DM.curPage = obj.curPage;					 
				} 
                if (obj.rPP != undefined) DM.rPP = obj.rPP;
                if (DM.paging == "remote") that.remoteRequest();
                else {
					that.$td_edit=null;
					that.$tr_focus=null;
					that.$td_focus=null;
                    that._refreshDataFromDataModel();
                    that._refresh();
                }
            },
            refresh: function (evt) {
                that.refreshDataAndView();
            }
        };
        if (DM.paging) {
            this.$footer.pqPager(obj2);
        } else {
        }
    }
    fn._initData = function () {
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
    fn._refreshHideArrHS = function () {
        var that = this;
        for (var i = 0; i < that.colModel.length; i++) {
            that.hidearrHS[i] = false;
        }
		var columnOrder=this.options.columnOrder;
        if (that.initH > 0) {
            var indx = that.freezeCols - 1 + that.initH;
            for (var i = that.freezeCols; i <= indx; i++) {
				var i1=i;
				if(columnOrder!=null)i1=columnOrder[i];
                if (that.colModel[i1].hidden) {
                    continue;
                }
				that.hidearrHS[i] = true;	
            }
        } else { 
        }
    }
    fn.generateLoading = function () {
        var $loading = $("<div class='pq-loading'></div>").appendTo(this.element)
        $("<div class='pq-loading-bg'></div><div class='pq-mask'><div>Loading...</div></div>").appendTo($loading)
        $loading.find("div.pq-loading-bg").css("opacity", 0.2);
    }
    fn.showLoading = function () {
        this.element.find("div.pq-loading").show();
    }
    fn.hideLoading = function () {
        this.element.find("div.pq-loading").hide();
    }
    fn._refreshDataFromDataModel = function () {
        var DM = this.options.dataModel;
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
            this.data = DM.data.slice(begIndx, endIndx);
        } else {
            this.data = DM.data;
        }
    }
    fn.remoteRequest = function (callback_fn) {
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
            cache: false,
            type: DM.method,
            data: dataURL,
            beforeSend: function (jqXHR, settings) {
                if (typeof DM.beforeSend == "function") {
                    return DM.beforeSend(jqXHR, settings);
                }
            },
            success: function (responseObj, textStatus, jqXHR) {
                var dataLoaded = false;
                if (typeof DM.getData == "function") {
                    var retObj = DM.getData(responseObj, textStatus, jqXHR); 
                    DM.data = retObj.data;
                    if (DM.paging) {
                        if (DM.paging == "remote") {
                            if (retObj.curPage) DM.curPage = retObj.curPage;
                            if (retObj.totalRecords){
								DM.totalRecords = retObj.totalRecords;
								DM.totalPages = Math.ceil(DM.totalRecords/DM.rPP);
							} 
                        }
                    }
                    that._refreshDataFromDataModel();
                    if (DM.sorting == "local" && DM.sortIndx != undefined) { 
                        that._refreshSortingDataAndView(true);
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
            error: function (jqXHR, textStatus, errorThrown) {
                that.hideLoading();
                that.loading = false;				
				if(typeof DM.error == "function"){
					DM.error(jqXHR, textStatus, errorThrown);
				}
            }
        });
    }
	fn.reorderColumns=function(arr){
		var orderArr=[1,0,2,3,4,5,6];
		var newarr=[];
		for(var i=0;i<this.data.length;i++){
			var row=this.data[i];
			var newrow=[];
			for(var j=0;j<this.colModel.length;j++){
				newrow.push(row[orderArr[j]]);					
			}
			newarr.push(newrow);
		}
		var DM=this.options.dataModel;
		DM.data=newarr;
		this._refreshDataFromDataModel();
		this.refresh();
	}
	fn._fixFireFoxContentEditableIssue=function(){
        if(!$.browser.msie){
			this.$grid_inner.focus(); 	
		}							
	}
    fn.selectCellRowCallback = function (fn) {
        var rowIndx, colIndx;
        if (this.$tr_focus) {
            rowIndx = this.$tr_focus.attr("pq-row-indx");
        } else if (this.$td_edit) {
            rowIndx = this.$td_edit.parent("tr").attr("pq-row-indx");
            colIndx = this.$td_edit.attr("pq-col-indx");
        } else if (this.$td_focus) {
            rowIndx = this.$td_focus.parent("tr").attr("pq-row-indx");
            colIndx = this.$td_focus.attr("pq-col-indx");
        }
        var that = this;
        $.measureTime(function () {
            fn.call(that); 
        }, '_generateTables');
        if (this.$tr_focus) {
			this._boundRow(rowIndx); 
        } else if (this.$td_edit) {
            this._boundCell(rowIndx, colIndx); 
        } else if (this.$td_focus) { 
			this._boundCell(rowIndx, colIndx); 
        }
    }
    fn._refreshTitle = function () {
        this.$title.html(this.options.title);
    }
    fn._refreshDraggable = function () {
        if (this.options.draggable) {
            this.$title.addClass('draggable');
            this.element.draggable({
                handle: this.$title,
                start: function (evt, ui) {
                }
            });
        } else {
            this._destroyDraggable();
        }
    }
    fn._refreshResizable = function () {
        var that = this;
        if (this.options.resizable) {
            this.element.resizable({
                helper: "ui-state-highlight",
                delay: 0,
                start: function (evt, ui) {
                    $(ui.helper).css({
                        opacity: 0.5,
                        background: "#ccc",
                        border: "1px solid steelblue"
                    });
                },
                resize: function (evt, ui) {
                },
                stop: function (evt, ui) {
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
    fn.refresh = function () {
        this._refresh();
    }
    fn._refresh = function () {
        var that = this;
        this._refreshResizable();
        this._refreshDraggable();
        this._bufferObj_calcInitFinalH();
        this._refreshHideArrHS();
        this._createHeader();
        this._refreshHeaderSortIcons();
        this._setInnerGridHeight();
        this._setRightGridHeight();
        this._setVScrollHeight();
        this.selectCellRowCallback(function () {
            that._generateTables();
            that._computeOuterWidths();
        });
        this._setHScrollWidth();
        this._refreshPager();
        this._trigger("refresh", null, {
            dataModel: this.dataModel,
            data: this.data
        });		
    }
    fn._refreshPager = function () {
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
    fn._refreshViewAfterDataSort = function () {
        this.$td_focus = null;
        this.$tr_focus = null;
        this._setVScrollHeight();
        this._generateTables();
        this._computeOuterWidths(); 
        this._refreshHeaderSortIcons();
        this._setRightGridHeight();
        this._setVScrollHeight(); 
        this._setHScrollWidth(); 
        this._refreshPager();
    }
    fn.refreshSortingDataAndView = function () {
        this._refreshSortingDataAndView(true);
    }
    fn.refreshDataAndView = function () {
        this.data = null;
        this.$td_focus = null;
        this.$tr_focus = null;
        var DM = this.options.dataModel;
        if (DM.location == "remote") {
            DM.data = null;
            this.remoteRequest();
        } else {
            this._refreshSortingDataAndView();
        }
        this._trigger("refresh", null, {
            dataModel: this.dataModel,
            data: this.data
        });
    }
    fn._refreshSortingDataAndView = function (sorting, fn) {
        var DM = this.options.dataModel;
        var indx = DM.sortIndx;
        if (indx == undefined) {
        } else if (indx > this.colModel.length - 1) {
            indx = this.colModel.length - 1;
            DM.sortIndx = indx;
        }
        var dir = DM.sortDir;
        var that = this;
        if (sorting == true) {
			if(indx==null){
				return;
			}
            if (DM.sorting == "remote") {
                this.remoteRequest(fn);
            } else {
                var dataType = this.colModel[indx].dataType;
                this._sortLocalData(indx, dir, dataType);
                this._refreshDataFromDataModel();
                that._refreshViewAfterDataSort();
                if (typeof fn == "function") fn();
            }
        } else if (DM.location == "remote") {
            this.remoteRequest(fn);
        } else {
			if(this.data==null){
				this._refreshDataFromDataModel();
			}			
            that._refreshViewAfterDataSort();
            if (typeof fn == "function") fn();
        }
    }
    fn._computeOuterWidths = function () {
        if (this.$tbl == null || this.data.length == 0) {
            for (var i = 0; i < this.colModel.length; i++) {
                this.outerWidths[i] = this.widths[i];
            }
            this.numberCell_outerWidth = this.numberCellWidth;
            return;
        }
        var $tr = this.$tbl.find("tr:first");
        var $tds = this.$tbl.find("tr:first>td");
		var columnOrder = this.options.columnOrder;
        for (var i = 0; i < this.colModel.length; i++) {
			var i1=i;
			if(columnOrder!=null)i1=columnOrder[i];
            var $td = $tr.find("td[pq-col-indx=" + i1 + "]");
            if ($td.length > 0) {
                this.outerWidths[i] = parseInt($td[0].offsetWidth);
            } else {
                this.outerWidths[i] = null;
            }
        }
        if (this.numberCell) {
            this.numberCell_outerWidth = parseInt($tds[0].offsetWidth);
        }
    }
    fn._setOption = function (key, value) {
        if (key == "height") {
            this.element.height(value + "px");
            $.Widget.prototype._setOption.call(this, key, value);
        } else if (key == "width") {
            this.element.width(value + "px");
            $.Widget.prototype._setOption.call(this, key, value);
        } else if (key == "title") {
            $.Widget.prototype._setOption.call(this, key, value);
            this._refreshTitle();
        } else if (key == "freezeCols") {
            if (!isNaN(value) && value >= 0 && parseInt(value) <= this.colModel.length - 2) {
                this.freezeCols = parseInt(value);
                this._refreshFreezeLine(); 
                this._setHScrollWidth();
                $.Widget.prototype._setOption.call(this, key, value);
            }
        } else if (key == "resizable") {
            $.Widget.prototype._setOption.call(this, key, value);
        } else if (key == "scrollPace") {
			this.$hscroll.pqScrollBar("option",value);
			this.$vscroll.pqScrollBar("option",value);
            $.Widget.prototype._setOption.call(this, key, value);			
        } else if (key == "dataModel") {
            $.Widget.prototype._setOption.call(this, key, value);
            this._refreshSortingDataAndView();
        }
		else{
			$.Widget.prototype._setOption.call(this, key, value);
		}
    }
    fn._setOptions = function () {
        $.Widget.prototype._setOptions.apply(this, arguments); 
        this._refresh(); 
    }    
    fn._generateCellHighlighter = function (offsetParent, lft, top, wd, ht) {
        if (this.$div_focus && this.$div_focus[0].offsetParent == offsetParent) {
			if (this.$td_edit != null) {				
				this._fixFireFoxContentEditableIssue();
				this.$div_focus.empty().removeClass('pq-cell-selected-border-edit');
				this.$td_edit=null;
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
    fn._selectRow = function (rowIndx, evt) {
        this.selectRow(rowIndx, evt)
    }
    fn._findfirstUnhiddenColIndx = function () {
        for (var i = 0; i < this.colModel.length; i++) {
            if (!this.colModel[i].hidden) {
                return i
            }
        }
    }
    fn._boundRow = function (rowIndx) {
        var $tr = this._get$TR(rowIndx); 
        if ($tr == null || $tr.length == 0) {
            return false;
        }
        var wd = this._calcRightEdgeCol(this.colModel.length - 1);
        wd -= 4; 
        var ht = $tr[0].offsetHeight - 4;
        var $table = $($tr[0].offsetParent);
        var offsetParent = $table[0].offsetParent;
        var lft = $tr[0].offsetLeft + $table[0].offsetLeft;
        var top = $tr[0].offsetTop + $table[0].offsetTop;
        var that = this;
		if(this.$td_focus)this.$td_focus.removeClass("pq-cell-select");
		if(this.$tr_focus)this.$tr_focus.removeClass("pq-row-select");
        this.$tr_focus = $tr;
		this.$tr_focus.addClass("pq-row-select");
        this.$td_focus = $tr.find("td[pq-col-indx=" + this._findfirstUnhiddenColIndx() + "]");
        this._generateCellHighlighter(offsetParent, lft, top, wd, ht);
    }
    fn.selectRow = function (rowIndx, evt) {
        if (this._boundRow(rowIndx) == false) {
            return false;
        }
        this._trigger("rowSelect", evt, {
            rowIndx: rowIndx,
            data: this.data
        }); 
        return true;
    }
    fn.scrollY=function(rowIndx){
		this.$vscroll.pqScrollBar("option", "cur_pos", rowIndx).pqScrollBar("scroll");
	}
    fn._bringRowIntoView = function (rowIndx) {
        if (rowIndx < this._bufferObj_getInit()) {
            this.$vscroll.pqScrollBar("option", "cur_pos", rowIndx).pqScrollBar("scroll");
        }
        var $tr = this.$tbl.find("tr[pq-row-indx=" + rowIndx + "]");
        if ($tr[0] == undefined) {
            this.$vscroll.pqScrollBar("option", "cur_pos", rowIndx).pqScrollBar("scroll");
        } else {
            var td_bottom = $tr[0].offsetTop + $tr[0].offsetHeight;
            if (td_bottom > this.$cont[0].offsetHeight - 17) {
                var diff = td_bottom - (this.$cont[0].offsetHeight - 17); 
                var $trs = this.$tbl.children().children("tr");
                var ht = 0,
                    indx = 0;
                $trs.each(function (i, tr) {
                    ht += tr.offsetHeight;
                    if (ht >= diff) {
                        indx = i;
                        return false;
                    }
                })
                if (this.init + indx + 1 > rowIndx) {
                    indx = rowIndx - 1 - this.init;
                }
                this.$vscroll.pqScrollBar("option", "cur_pos", this.init + indx + 1).pqScrollBar("scroll");
            }
        }
    }
	fn.setSelection = function(rowIndx, colIndx){
		var DM = this.options.dataModel;
        if (DM.paging == "local" && rowIndx >= 0) {
            var curPage = DM.curPage;
            var rPP = DM.rPP;
            var begIndx = (curPage - 1) * rPP;
            var endIndx = curPage * rPP;
            rowIndx=parseInt(rowIndx);
            if (rowIndx >= begIndx && rowIndx < endIndx) {
            }
            else {
                DM.curPage = Math.ceil((rowIndx + 1)/ rPP);
                this.refreshDataAndView();
            }
            rowIndx = (rowIndx % rPP);            
        }
		return this._setSelection(rowIndx,colIndx);
	}
    fn._setSelection = function (rowIndx, colIndx, evt) {
		if(rowIndx==null){
			if(this.$div_focus){
				this.$div_focus.remove();
				this.$div_focus=null;
				this.$td_focus=null;
				this.$tr_focus=null;
				this.$td_edit=null;
			}	
			return false;		
		}
        if (rowIndx < 0 || colIndx < 0) {
            return false;
        }
        if (this.data == null || this.data.length == 0) {
            return false;
        }
        if (rowIndx >= this.data.length || colIndx >= this.colModel.length) {		
            return false;
        }
        this._bringRowIntoView(rowIndx);
        if (colIndx == null) {
            return this.selectRow(rowIndx, evt); 
        }
        if (this.hidearrHS[colIndx]) {
            this.hidearrHS[colIndx] = false; 
            var cur_pos = colIndx - this.freezeCols - this._calcNumHiddenUnFrozens(colIndx);
            this.$hscroll.pqScrollBar("option", "cur_pos", cur_pos).pqScrollBar("scroll");
        } else {
            var $td = this.$tbl.find("tr[pq-row-indx=" + rowIndx + "]>td[pq-col-indx=" + colIndx + "]");
            if ($td.length == 0) {
                return false;
            }
            var td_right = this._calcRightEdgeCol(colIndx);
            if (td_right > this.$cont[0].offsetWidth - 17) {
                var diff = this._calcWidthCols(colIndx) - (this.$cont[0].offsetWidth - 17); 
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
            }
        }
        return this.selectCell(rowIndx, colIndx, evt);
    }
	fn.saveEditCell = function () {
        if (this.$td_edit == null) return;
        var $td = this.$td_edit;
        var obj = this._getRowColIndx($td);
        var rowIndx = obj.rowIndx,
            colIndx = obj.colIndx;
		if(this.options.columnOrder!=null)colIndx=this.options.columnOrder[colIndx];
        if (rowIndx != null) {
            var $cell = this.$div_focus;
            if (this.colModel[obj.colIndx].saveCell) {
                var ret = this.colModel[colIndx].saveCell({
                    cell: $cell,
                    data: this.data,
                    rowIndx: rowIndx,
                    colIndx: colIndx
                });
                if (ret != undefined) {
                    this.data[rowIndx][colIndx] = ret;
                }
            } else {
                var dataCell = $cell.children().html();
                this.data[rowIndx][colIndx] = dataCell;
            }
            // to allow the user to have one global handler to save the data (i.e: to the server)
			this._trigger("cellSave", null, {
				rowIndx: rowIndx,
				colIndx: colIndx,
				data: this.data
			}); 
            var $tr = this._get$TR(rowIndx);
            for (var i = 0; i < this.colModel.length; i++) {
				var i1=i;
				if(this.options.columnOrder!=null)i1=this.options.columnOrder[i];
                var $td = $tr.find("td[pq-col-indx=" + i + "]");
                if ($td && $td.length > 0) this._renderCell(rowIndx, i1, $td);
            }
        }
    }
    fn.quitEditMode = function () {
        if (this.$td_edit) {
            this.disableSelection(); 
            this._boundCell(null, null, this.$td_edit);
            this._setGridFocus();
        }
    }
    fn.getData = function () {
        return this.data;
    }
    fn.getViewPortRowsIndx=function(){
		this._bufferObj_calcInitFinal();
		return {beginIndx:this.init,endIndx:this['final']};
	}
	fn.getSelection = function () {
		function rr(rowIndx){
			if(rowIndx==null){
				return null;
			}
			var DM = this.options.dataModel;
            var paging = DM.paging;
            if (paging == "local") {
                var curPage = DM.curPage;
                var rPP = DM.rPP;
				rowIndx=parseInt(rowIndx);
                rowIndx += (rPP * (curPage - 1));
            }
			return rowIndx;
		}
        if (this.$tr_focus) {
            var rowIndx = this.$tr_focus.attr("pq-row-indx");
			rowIndx=rr.call(this,rowIndx);
            return {
                rowIndx: parseInt(rowIndx),
                colIndx: null,
                data: this.data
            };
        } else if (this.$td_focus) {
            var rowIndx = this.$td_focus.parent("tr").attr("pq-row-indx");
			rowIndx=rr.call(this,rowIndx);
            var colIndx = this.$td_focus.attr("pq-col-indx");
            return {
                rowIndx: parseInt(rowIndx),
                colIndx: parseInt(colIndx),
                data: this.data
            };
        } else {
            return {
                rowIndx: null,
                colIndx: null,
                data: this.data
            };
        }
    }
	fn._cellblurred=function(){
		this.$div_focus.remove();
		this.$div_focus=null;
		this.$td_focus=null;
		this.$tr_focus=null;		
	}
    fn._boundCell = function (rowIndx, colIndx, $td) {
        if ($td == null) var $td = this._get$TD(rowIndx, colIndx); 
        if ($td == null || $td.length == 0) {
            return false;
        }
        if ($td.css("visibility") == "hidden") {
            return false;
        }
        var $table = $($td[0].offsetParent);
        var offsetParent = $table[0].offsetParent;
        var wd = $td[0].offsetWidth - 4;
        var ht = $td[0].offsetHeight - 4;
        var lft = $td[0].offsetLeft + $table[0].offsetLeft;
        var top = $td[0].offsetTop + $table[0].offsetTop;
        this._generateCellHighlighter(offsetParent, lft, top, wd, ht);
		if(this.$tr_focus)this.$tr_focus.removeClass("pq-row-select");
		if(this.$td_focus)this.$td_focus.removeClass("pq-cell-select");
        this.$td_focus = $td;
		this.$td_focus.addClass("pq-cell-select");        
        this.$tr_focus = null;		
    }
    fn.selectCell = function (rowIndx, colIndx, evt) {
        if (this._boundCell(rowIndx, colIndx) == false) {
            return false;
        }
		if(evt!=null)this._setGridFocus();
        this._trigger("cellSelect", evt, {
            rowIndx: rowIndx,
            colIndx: colIndx,
            data: this.data
        }); 
        return true;
    }
    fn._setGridFocus = function () {
        var that = this;
        window.setTimeout(function () {
            if (that.$td_edit == null) {
                that.$grid_inner.focus(); 
            }
        }, 0)
    }
    fn.editCell = function (rowIndx, colIndx) {
        var $td = this._get$TD(rowIndx, colIndx);
        if ($td == null || this.$td_focus == null || this.$td_focus[0] != $td[0]) {
            if (this._setSelection(rowIndx, colIndx) == true) this._editCell(this.$td_focus);
        } else {
            this._editCell($td);
        }
    }
    fn._editCell = function ($td) {
        var that = this;
        var obj = that._getRowColIndx($td);
        var rowIndx = obj.rowIndx;
        var colIndx = obj.colIndx;
		if(this.options.columnOrder!=null)colIndx=this.options.columnOrder[colIndx];
        if (this.options.editable == false || this.colModel[colIndx].editable === false) {
            return false;
        }
        if (this.$td_edit && this.$td_edit[0] == $td[0]) { 
            return false;
        }
        this.$td_edit = $td;
        this.enableSelection();
        var $cell = this.$div_focus.addClass('pq-cell-selected-border-edit');
        if (this.colModel[colIndx].align == "right") {
            $cell.css("text-align", "right");
        } else if (this.colModel[colIndx].align == "center") {
            $cell.css("text-align", "center");
        } else {
            $cell.css("text-align", "left");
        }
        if (this.colModel[colIndx].editor) {
            this.colModel[colIndx].editor({
                cell: $cell,
                data: this.data,
                rowIndx: rowIndx,
                colIndx: colIndx
            });
        } else {
            $cell.html("<div contenteditable='true' tabindx='0' style='background:#fff;padding:2px;'></div>");
            var that = this;
            $cell.children().html(that.data[rowIndx][colIndx]);
        }
        var that = this;
        window.setTimeout(function () {
            if (that.$td_edit != null) $cell.children().focus();
        }, 0)
    }
    fn._get$TR = function (rowIndx) {
        var $tr;
        if (this.$tbl != undefined) $tr = this.$tbl.find("tr[pq-row-indx=" + rowIndx + "]");
        return $tr;
    }
    fn._get$TD = function (rowIndx, colIndx) {
        var $td;
        if (this.$tbl != undefined) $td = this.$tbl.find("tr[pq-row-indx=" + rowIndx + "]>td[pq-col-indx=" + colIndx + "]");
        return $td;
    }
    fn._getRowColIndx = function ($td) {
        if ($td == null || $td.length == 0) return {
            rowIndx: null,
            colIndx: null
        };
        var $tr = $td.parent("tr");
        var $tbl = $tr.parent("tbody"); 
        var rowIndx = parseInt($tr.attr("pq-row-indx"));
        var colIndx = parseInt($td.attr("pq-col-indx"));
        return {
            rowIndx: rowIndx,
            colIndx: colIndx
        }
    }
    fn.keyPressDown = function (evt) {
        var that = this;
        var keyCodes = {
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            tab: 9,
            enter: 13,
            pageDown: 34,
            pageUp: 33,
            esc: 27,
            home: 36,
            end: 35
        }
        var rowIndx;
        var colIndx;
        function incr_colIndx() {
            do {
                colIndx++;
            } while (that.colModel[colIndx] && that.colModel[colIndx].hidden);
        }
        function decr_colIndx() {
            do {
                colIndx--;
            } while (that.colModel[colIndx] && that.colModel[colIndx].hidden);
        }
        if (that.$td_edit) {
            var $td = $(that.$td_edit[0]);
            var obj = that._getRowColIndx(that.$td_focus);
            rowIndx = obj.rowIndx;
            colIndx = obj.colIndx;
            if (evt.keyCode == keyCodes.tab) { 
                that.saveEditCell();
                that.quitEditMode();
                if (evt.shiftKey) {
                    decr_colIndx();
                    if (colIndx < 0) {
                        colIndx = that.colModel.length - 1;
                        rowIndx--;
                    }
                } else {
                    incr_colIndx();
                    if (colIndx >= that.colModel.length) {
                        rowIndx++;
                        colIndx = 0;
                    }
                }
                that._setSelection(rowIndx, colIndx, evt);
                evt.preventDefault();
                return false;
            } else if (evt.keyCode == keyCodes.esc) {
                that.quitEditMode();
            }
            return; 
        }
        else if (that.$td_focus) {
            var obj = that._getRowColIndx(that.$td_focus);
            rowIndx = obj.rowIndx;
            colIndx = obj.colIndx;
            if (rowIndx == null || colIndx == null) return;
        } else {
            return;
        }
        if (evt.keyCode == keyCodes.left) {
            decr_colIndx();
            that._setSelection(rowIndx, colIndx, evt);
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.right) {
            incr_colIndx();
            that._setSelection(rowIndx, colIndx, evt);
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.tab) {
            if (evt.shiftKey) {
                decr_colIndx();
                if (colIndx < 0) {
                    colIndx = that.colModel.length - 1;
                    rowIndx--;
                }
            } else {
                incr_colIndx();
                if (colIndx >= that.colModel.length) {
                    rowIndx++;
                    colIndx = 0;
                }
            }
            that._setSelection(rowIndx, colIndx, evt);
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.up) {
            rowIndx = (rowIndx > 0) ? rowIndx - 1 : rowIndx;
            that._setSelection(rowIndx, colIndx, evt);
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.down) {
            rowIndx = (rowIndx < that.data.length - 1) ? (rowIndx + 1) : rowIndx;
            that._setSelection(rowIndx, colIndx, evt);
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.pageDown) {
            var rowIndx = that.init + 10;
            if (rowIndx > that.data.length - 1) {
                rowIndx = that.data.length - 1;
            }
            that.$vscroll.pqScrollBar("option", "cur_pos", rowIndx).pqScrollBar("scroll");
            var $td = that.$tbl.find("tr[pq-row-indx=" + rowIndx + "]>td[pq-col-indx=" + colIndx + "]");
            that.selectCell(rowIndx, colIndx, evt)
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.pageUp) {
            var rowIndx = that.init - 10;
            if (rowIndx < 0) {
                rowIndx = 0;
            }
            that.$vscroll.pqScrollBar("option", "cur_pos", rowIndx).pqScrollBar("scroll");
            var $td = that.$tbl.find("tr[pq-row-indx=" + rowIndx + "]>td[pq-col-indx=" + colIndx + "]");
            that.selectCell(rowIndx, colIndx, evt)
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.home) {
            rowIndx = 0;
            that._setSelection(rowIndx, colIndx, evt);
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.end) {
            rowIndx = that.data.length - 1;
            that._setSelection(rowIndx, colIndx, evt);
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.enter) {
            if (that.$tr_focus != null) {
                that._boundCell(that.$td_focus);
            }
            that._editCell(that.$td_focus);
            evt.preventDefault();
            return;
        } else {
        }
    }
    fn._calcNumHiddenFrozens = function () {
        var num_hidden = 0;
        for (var i = 0; i < this.freezeCols; i++) {
            if (this.colModel[i].hidden) {
                num_hidden++;
            }
        }
        return num_hidden;
    }
    fn._calcNumHiddenUnFrozens = function (colIndx) {
        var num_hidden = 0;
        var len = (colIndx) ? colIndx : this.colModel.length;
        for (var i = this.freezeCols; i < len; i++) {
            if (this.colModel[i].hidden) {
                num_hidden++;
            }
        }
        return num_hidden;
    }
    fn._setHScrollWidth = function () {
        var wd = this.$cont[0].offsetWidth;        
        if (this.numberCell) {
            wd -= this.numberCell_outerWidth;
        }
		var columnOrder=this.options.columnOrder;
        for (var i = 0; i < this.freezeCols; i++) {
			var i1=i;
			if(columnOrder!=null)i1=columnOrder[i];
            wd -= this.outerWidths[i1];
        }
        var width_vscroll = 0;
        if (this.$vscroll.css("display") == "none") {
            this.$hscroll.css("right", 0);
        } else {
            width_vscroll = 17;
            this.$hscroll.css("right", "");
        }
        wd -= width_vscroll; 
        this.$hscroll.pqScrollBar("option", "length", wd);
        var data_length = this.colModel.length - this.freezeCols - this._calcNumHiddenUnFrozens();
        this.$hscroll.pqScrollBar("option", "num_eles", (data_length));
    }
    fn._setVScrollHeight = function () {
        var ht = this.$cont.height();
        this.$vscroll.pqScrollBar("option", "length", (ht - 17));
        var data_length = (this.data) ? this.data.length : 0;
        if (data_length >= 0) {
            this.$vscroll.pqScrollBar("option", "num_eles", (data_length));
        }
    }
    fn._setInnerGridHeight = function () {
        var ht = (this.element.outerHeight() - this.$top.outerHeight() -  this.$bottom.outerHeight());
        this.$grid_inner.height(ht + "px");
    }
    fn._setRightGridHeight = function () {
        var ht = (this.element.outerHeight() - this.$header_o.outerHeight() - this.$top.outerHeight() - this.$bottom.outerHeight());
        this.$cont.height(ht + "px");
    }
    fn._setRightGridWidth = function () {
    }
    fn._bufferObj_getInit = function () {
        return this.init;
    }
    fn._bufferObj_getFinal = function () {
        return this["final"];
    }
    fn._bufferObj_minRowsPerGrid = function () {
        var ht = this.$cont[0].offsetHeight;
        return Math.ceil(ht / this.rowHeight);
    }
    fn._bufferObj_calcInitFinal = function () {
        if (this.data == null || this.data.length == 0) {
            this['final'] = this['init'] = null;
        } else {
            var cur_pos = parseInt(this.$vscroll.pqScrollBar("option", "cur_pos"));
            this.init = cur_pos;
            this['final'] = this.init + this._bufferObj_minRowsPerGrid();
            if (this['final'] + 1 > this.data.length) {
                this['final'] = this.data.length - 1;
            }
        }
    }
    fn._bufferObj_calcInitFinalH = function () {
        var cur_pos = parseInt(this.$hscroll.pqScrollBar("option", "cur_pos"));
        var initH = 0;
        var indx = 0;
        for (var i = this.freezeCols; i < this.colModel.length; i++) {
            if (this.colModel[i].hidden) {
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
    fn._calcWidthCols = function (colIndx) {
        var wd = 0;
        if (this.numberCell) {
            wd += this.numberCell_outerWidth; 
        }
        for (var i = 0; i <= colIndx; i++) {
            if (!this.colModel[i].hidden) wd += this.outerWidths[i];
        }
        return wd;
    }
    fn._calcRightEdgeCol = function (colIndx) {
        var wd = 0;
        if (this.numberCell) {
            wd += this.numberCell_outerWidth; 
        }
        for (var i = 0; i <= colIndx; i++) {
            if (!this.colModel[i].hidden && this.hidearrHS[i] == false) wd += this.outerWidths[i];
        }
        return wd;
    }
    fn._refreshFreezeLine = function () {
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
    fn._getDragHelper = function (evt) {
        var $target = $(evt.currentTarget);
        this.$cl = $("<div style='position:absolute;width:1px;z-index:100;'></div>").appendTo(this.$grid_inner);
        this.$clleft = $("<div style='position:absolute;width:1px;z-index:100'></div>").appendTo(this.$grid_inner);
        var indx = parseInt($target.attr("pq-grid-col-indx"));
        var ht = this.$grid_inner.outerHeight();
        this.$cl.height(ht);
        this.$clleft.height(ht);
        var ele = $("td[pq-grid-col-indx=" + indx + "]", this.$header)[0];
        var lft = ele.offsetLeft;
        this.$clleft.css({
            backgroundColor: "#000",
            top: "0",
            left: lft
        });
        lft = lft + ele.offsetWidth;
        this.$cl.css({
            backgroundColor: "#000",
            top: "0",
            left: lft
        });
    }
    fn._setDragLimits = function (indx) {
        var that = this;
        var $head = that.$header;
        var $pQuery_drag = $head.find("div.pq-grid-col-resize-handle[pq-grid-col-indx=" + indx + "]");
        var $pQuery_col = $head.find("td.pq-grid-col[pq-grid-col-indx=" + indx + "]");
        var cont_left = $pQuery_col.offset().left + that.minWidth;
        var cont_right = that.$cont.offset().left + that.$cont[0].offsetWidth - 17; 
        $pQuery_drag.draggable("option", 'containment', [cont_left, 0, cont_right, 0]);
    }
	fn._getOrderIndx=function(indx){
		var columnOrder=this.options.columnOrder;
		if (columnOrder != null) {
			return columnOrder[indx];
		}
		else{
			return indx;
		}
	}
    fn._createHeader = function () {
        var that = this;
        var str = "<table class='pq-grid-header-table' cellpadding=0 cellspacing=0><tr>";
        if (this.numberCell) {
            str += "<td style='width:" + this.numberCellWidth + "px;'>\
		<div class='pq-grid-header-table-div'>&nbsp;</div></td>";
        }
        var hidearrHS1 = [];
		var columnOrder=this.options.columnOrder;
		for(var i=0;i<this.colModel.length;i++){
			var i1=i;
			if(columnOrder!=null)i1=columnOrder[i];
			var colModel=this.colModel[i1];
            if (colModel.hidden) { 
				continue;				
            } else if (that.hidearrHS[i]) {
                hidearrHS1.push(i)
				continue;
            }
            var cls = "pq-grid-col";
            if (colModel.align == "right") {
                cls += ' pq-align-right';
            } else if (colModel.align == "center") {
                cls += ' pq-align-center';
            }
            if (i == that.freezeCols - 1) {
                cls += " pq-last-freeze-col";
            }
            var wd = that.widths[i1];
            if (that.columnBorders == false) {
                wd -= 1;
            }
            var stile = "width:" + wd + "px;";
            str += "<td style='" + stile + "' pq-grid-col-indx='" + i + "' class='" + cls + "'>\
		<div class='pq-grid-header-table-div'>" + colModel.title + "<span class='pq-col-sort-icon'>&nbsp;</span></div></td>";
        }
        $.each(hidearrHS1, function (k, i) {
            var col = that.colModel[i];
            var cls = "pq-grid-col";
            if (col.align == "right") {
                cls += ' pq-align-right';
            } else if (col.align == "center") {
                cls += ' pq-align-center';
            }
            var stile = "width:" + that.widths[i] + "px;visibility:hidden;";
            str += "<td style='" + stile + "' pq-grid-col-indx='" + i + "' class='" + cls + "'>\
		<div class='pq-grid-header-table-div'>" + col.title + "<span class='pq-col-sort-icon'>&nbsp;</span></div></td>";
        })
        str += "</tr></table>";
        this.$header.empty();
        this.$header.append(str);
        this.$header.find("td").click(function () {
            if (!that.options.sortable) {
                return; 
            }
            var indx = $(this).attr("pq-grid-col-indx");
			if (columnOrder != null) {
				indx = columnOrder[indx];
			}
            if (that._trigger("beforeSort", null, {
                dataModel: that.dataModel,
                data: that.data,
                sortIndx: indx
            }) == false) {
                return;
            }
            var dir = "up";
            var DM = that.options.dataModel;
            if (DM.sortIndx == indx) {
                dir = (DM.sortDir == "up") ? "down" : "up";
            }
            DM.sortIndx = indx;
            DM.sortDir = dir;
            that._refreshSortingDataAndView(true, function () {
                that._trigger("sort", null, {
                    dataModel: that.dataModel,
                    data: that.data
                });
            });
        })
        var $pQuery_cols = that.$header.find(".pq-grid-col");
        var lft = 0;
		var hd_ht=that.$header[0].offsetHeight;
		for(var i=0;i<this.colModel.length;i++){	
			var i1=i;
			if(columnOrder!=null){
				i1=columnOrder[i];
			}
			var colModel=that.colModel[i1];
            if (that.hidearrHS[i]) {
				continue;
            } else if (colModel.hidden) {
				continue;
            }
            if (colModel.resizable != undefined && colModel.resizable == false) {
				continue;
            }
            var $handle = $("<div pq-grid-col-indx='" + i + "' class='pq-grid-col-resize-handle'>&nbsp;</div>").appendTo(that.$header);
            var pq_col = that.$header.find("td[pq-grid-col-indx=" + i + "]")[0];
            lft = pq_col.offsetLeft + pq_col.offsetWidth - 10;
            $handle.css({
                left: lft,
                height: hd_ht 
            });
        }
        var drag_left, drag_new_left, cl_left;
        var $pQuery_handles = that.$header.find(".pq-grid-col-resize-handle").draggable({
            axis: 'x',
            helper: function (evt, ui) {
                var $target = $(evt.target)
                var indx = parseInt($target.attr("pq-grid-col-indx"));
                that._setDragLimits(indx); 
                that._getDragHelper(evt, ui);
                return $target;
            },
            start: function (evt, ui) {
                drag_left = ui.position.left;
                cl_left = parseInt(that.$cl[0].style.left);
            },
            drag: function (evt, ui) {
                drag_new_left = ui.position.left;
                var dx = (drag_new_left - drag_left);
                that.$cl[0].style.left = cl_left + dx + "px";
            },
            stop: function (evt, ui) {
                that.$clleft.remove();
                that.$cl.remove();
                drag_new_left = ui.position.left;
                var dx = (drag_new_left - drag_left);
                var $target = $(ui.helper);
                var indx = parseInt($target.attr("pq-grid-col-indx"));
				var columnOrder = that.options.columnOrder;
				if(columnOrder!=null)indx=columnOrder[indx];
                var prev_width = that.widths[indx];
                that.widths[indx] = that.widths[indx] + dx;
                that._refresh();
            }
        });
        $pQuery_handles.each(function (i, handle) {
        })
    }
    fn._refreshHeaderSortIcons = function () {
        if (this.options.dataModel.sortIndx == undefined) return;
        var $pQuery_cols = this.$header.find(".pq-grid-col");
        $pQuery_cols.removeClass("pq-col-sort-asc pq-col-sort-desc");
        var DM = this.options.dataModel;
		var sortIndx=DM.sortIndx;
		sortIndx=this._getOrderIndx(sortIndx);
        this.$header.find(".pq-grid-col[pq-grid-col-indx=" + sortIndx + "]").addClass("pq-col-sort-" + (DM.sortDir == "up" ? "asc" : "desc"))
    }
    fn._generateTables = function () {
        var noColumns = this.colModel.length;
        var top = 0;
        this._bufferObj_calcInitFinal();
        var init = this.init,
            finall = this['final'];			
        if (init == null || finall == null) {
            this.$cont.empty();
            this.$tbl = null;
            return;
        }							
        this._trigger("beforeTableView", null, {
			data:this.data,
            curPos: init,
			finalPos: finall,
			curPage: this.dataModel.curPage			            
        });					
        var const_cls = "";
        if (this.columnBorders) const_cls = "pq-grid-td-border-right ";
        if (this.options.wrap == false) const_cls += "pq-wrap-text ";
        var buffer = ["<table style='table-layout:fixed;width:0px;position:absolute;top:0px;' cellpadding=0 cellspacing=0>"];
		var columnOrder=this.options.columnOrder;
        for (var i = init; i <= finall; i++) {
            var row_cls = "pq-grid-row";
            if (i / 2 == parseInt(i / 2)) row_cls += " pq-grid-oddRow";
            var row_str = "<tr pq-row-indx='" + i + "' class='" + row_cls + "'>"
            buffer.push(row_str)
            if (this.numberCell) {
                buffer.push("<td style='width:" + this.numberCellWidth + "px;' class='pq-grid-number-cell pq-row-selector'>\
			<div class='pq-td-div'>" + (i + 1) + "</div></td>") 
            }
            var hidearrHS1 = [];
            for (var j = 0; j < noColumns; j++) {
				var j1=j;				
				if(columnOrder!=null)j1=columnOrder[j];
                if (this.colModel[j1].hidden) { 
                    continue;
                } else if (this.hidearrHS[j]) {
                    hidearrHS1.push(j)
                    continue;
                }
                var strStyle = "";
                if (i == init) { 
                    strStyle = "width:" + this.widths[j1] + "px;";						
                }
                var cls = const_cls; 
                if (this.colModel[j1].align == "right") {
                    cls += ' pq-align-right';
                } else if (this.colModel[j1].align == "center") {
                    cls += ' pq-align-center';
                }
                if (j == this.freezeCols - 1) {
                    cls += " pq-last-freeze-col";
                }
                var str = "<td class='" + cls + "' style='" + strStyle + "' pq-col-indx='" + j + "'>\
				" + this._renderCell(i, j1) + "</td>";
                buffer.push(str)
            }
            for (var k = 0; k < hidearrHS1.length; k++) {
                var j = hidearrHS1[k];
				var j1=j;
				if(columnOrder!=null)j1=columnOrder[j];
                var strStyle = "";
                if (i == init) {
                    strStyle = "width:" + this.widths[j1] + "px;";
                }
                strStyle += "visibility:hidden;";
                var cls = const_cls; 
                if (this.colModel[j1].align == "right") {
                    cls += ' pq-align-right';
                } else if (this.colModel[j1].align == "center") {
                    cls += ' pq-align-center';
                }
                var str = "<td class='" + cls + "' style='" + strStyle + "' pq-col-indx='" + j + "'>\
				" + this._renderCell(i, j1) + "</td>";
                buffer.push(str)
            }
            buffer.push("</tr>")
        }
        buffer.push("</table>")
        var str = buffer.join("");
        if (this.$tbl == undefined) {
            this.$tbl = $(str);
            this.$cont.append(this.$tbl)
        } else {
			if (this.$td_edit != null) {
				this._fixFireFoxContentEditableIssue();
			}			
            this.$cont.empty();
			this.$td_edit = null;
            this.$tbl = $(str);
            this.$cont.append(this.$tbl)
        }
    }
    fn._renderCell = function (rowIndx, colIndx, $td) {        
		var dataCell;
        if (this.colModel[colIndx].render) {            
            dataCell = this.colModel[colIndx].render({
                data: this.data,
                rowIndx: rowIndx,
                colIndx: colIndx
            });
        }
		else{
			var dataCell = this.data[rowIndx][colIndx];
		}
        if (dataCell == "" || dataCell == undefined) dataCell = "&nbsp;"; 
        var cls = "pq-td-div";
        if (this.options.wrap == false) cls += " pq-wrap-text";
        var str = "<div class='" + cls + "'>" + dataCell + "</div>";
        if ($td != undefined) {
            $td.html(str);
        }
        return str;
    }
    fn._sortLocalData = function (indx, dir, dataType) {
        var m_index = indx;
        var m_sort_dir = dir;
        var data = this.options.dataModel.data; 
        if (data == null || data.length == 0) {
            return;
        }
        function innerSort() {
            function sort_integer(obj1, obj2) {
                var val1 = obj1[indx];
                var val2 = obj2[indx];
                val1 = val1 ? parseInt(val1) : 0;
                val2 = val2 ? parseInt(val2) : 0;
                return (val1 - val2);
            }
            function sort_custom(obj1, obj2) {
                var val1 = obj1[indx];
                var val2 = obj2[indx];
                return dataType(val1, val2);
            }
            function sort_float(obj1, obj2) {
                var val1 = obj1[indx].replace(/,/g, ""); 
                var val2 = obj2[indx].replace(/,/g, "");
                val1 = val1 ? parseFloat(val1) : 0;
                val2 = val2 ? parseFloat(val2) : 0;
                return (val1 - val2);
            }
            var iter = 0;
            function sort_string(obj1, obj2) {
                iter++;
                var val1 = obj1[indx];
                var val2 = obj2[indx];
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
    $.measureTime = function (fn, nameofFunc) {
        var initTime = (new Date()).getTime();
        fn();
        var finalTime = (new Date()).getTime();
        var cnt = finalTime - initTime;
    }
})(jQuery);
var cons = {
    log: function (str) {
        try {
            if ($.browser.msie && typeof str == 'object') throw "";
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
                $console[0].scrollTop = 10000000000000;
            }
        }
    }
};
