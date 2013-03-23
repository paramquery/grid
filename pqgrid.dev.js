/**
 * ParamQuery Grid a.k.a. pqGrid v1.0.6
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
				var obj={title:title,width:width,dataType:dataType,align:align,dataIndx:i};
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
	var cRows=function(that){
		this.that=that;		
		this.options=that.options;
		this.selectedRows=[];
		this.isDirty=false;		
	}	
	var _p=cRows.prototype;
	_p._addToData=function(objP){
		var location=this.options.dataModel.location;
		var data=(location=="remote")?this.that.data:this.options.dataModel.data,
			indx=(location=="remote")?objP.rowIndxPage:objP.rowIndx,
			row=data[indx],
			len_row=row.length,
			objCell=row[len_row-1];
		if(objCell.pqData){
			objCell.selectedRow=true;
		}
		else{
			row[len_row]= {pqData:true,selectedRow:true};
		}		
	}
	_p.setDirty=function(){
		if(this.selectedRows.length>0){
			this.isDirty=true;
		}			
	}	
	_p.removeAll=function(objP){
		if(this.isDirty){
			this.refresh();
		}			
		var raiseEvent=objP.raiseEvent,
			that=this.that,
			offset=(objP.offset==null)?that.getRowIndxOffset():obj.offset;		
		var selectedRows=this.selectedRows.slice(0);
		for(var i=0;i<selectedRows.length;i++){
			var selR=selectedRows[i];
			var rowIndx=selR.rowIndx;
			this.remove({rowIndx:rowIndx,offset:offset});				
		}
	}
	_p.refresh=function(){
		this.selectedRows=[];
		var data=this.options.dataModel.data;
		if(!data)return;
		for(var i=0,len=data.length;i<len;i++){
			var row=data[i],
				objC=row[row.length-1];
			if(objC && objC.pqData){
				if(objC.selectedRow){
					this.selectedRows.push({rowIndx:i});	
				}
			}							
		}
		this.isDirty=false;
	}	
	_p.replace=function(obj){
		if(this.isDirty){
			this.refresh();
		}					
		var rowIndx=obj.rowIndx,
			offset=obj.offset=(obj.offset==null)?this.that.getRowIndxOffset():obj.offset,
			rowIndxPage= obj.rowIndxPage=rowIndx-offset;						
			$tr=obj.$tr,
			evt=obj.evt;
		this.removeAll( {raiseEvent: true});
		this.add(obj);
	}									
	_p.add=function(objP){
		if(this.isDirty){
			this.refresh();
		}					
		var rowIndx=objP.rowIndx,
			that=this.that,
			offset=(objP.offset==null)?that.getRowIndxOffset():objP.offset,
			rowIndxPage = objP.rowIndxPage = rowIndx-offset,			
			$tr=objP.$tr,
			evt=objP.evt,
			selectedRows =this.selectedRows,
			isSelected = this.isSelected(objP);			
		if(isSelected==null){
			return false;
		}
		else if(this.isSelected(objP)==false){								
			var	ret=this._boundRow(objP),				
				$tr=ret;	
			selectedRows.push({rowIndx:rowIndx});				
			this._addToData(objP);
			that._trigger("rowSelect",evt,{
				rowIndx: rowIndx,				
				rowIndxPage: rowIndxPage,
				data:that.data,
				dataModel:that.dataModel,
				$tr: $tr
			});										
		}
		else{
			var indx=this.indexOf(objP);
			var arr2=this.selectedRows.splice(indx,1);
			this.selectedRows = this.selectedRows.concat(arr2);
		}		
	}
	_p.remove=function(objP){
		if(this.isDirty){
			this.refresh();
		}						
		var rowIndx=objP.rowIndx,
		that=this.that,
		offset=(objP.offset==null)?that.getRowIndxOffset():objP.offset,
		rowIndxPage=objP.rowIndxPage= rowIndx-offset,			
		evt=objP.evt,		
		init=(that.init+offset),
		finall=(that['final']+offset);
		if(this.isSelected(objP)){
			if(rowIndx >= init && rowIndx <= finall){
				var $tr=that.getRow({rowIndxPage:rowIndxPage});
				if($tr)$tr.removeClass("pq-row-select");
				that._trigger("rowUnSelect",evt,{
					rowIndx:rowIndx,
					dataModel:that.dataModel,
					$tr:$tr
				});								
			}				
			this._removeFromData(objP);
		}
		var indx=this.indexOf(objP);
		if(indx!=-1){
			this.selectedRows.splice(indx,1);
		}																																									
	}
	_p.indexOf=function(obj){
		if(this.isDirty){
			this.refresh();
		}					
		var rowIndx=obj.rowIndx,
			selectedRows=this.selectedRows;
		for(var i=0;i<selectedRows.length;i++){
			if(selectedRows[i].rowIndx==rowIndx){
				return i;
			}
		}
		return -1;
	} 
	_p.isSelected=function(objP){
		if(this.isDirty){
			this.refresh();
		}					
		var location=this.options.dataModel.location;
		var data=(location=="remote")?this.that.data:this.options.dataModel.data,
			indx=(location=="remote")?objP.rowIndxPage:objP.rowIndx,
			rowData=data[indx],
			len_row=(rowData)?rowData.length:null,
			objCell=(len_row)?rowData[len_row-1]:null;
		if(objCell==null){
			return null;
		}	
		else if (objCell.pqData) {
			return objCell.selectedRow;
		}
		else{
			return false;
		}						
	}
	_p.getSelection=function(){
		if(this.isDirty){
			this.refresh();
		}					
		return this.selectedRows;
	}									
	_p._removeFromData=function(objP){
		var location=this.options.dataModel.location;
		var data=(location=="remote")?this.that.data:this.options.dataModel.data,
			indx=(location=="remote")?objP.rowIndxPage:objP.rowIndx,
			row=data[indx],
			len_row=row.length,
			objCell=row[len_row-1];
		if(objCell.pqData){
			objCell.selectedRow=false;	
		}
	}				
	_p._boundRow=function(obj){
		var rowIndxPage=obj.rowIndxPage,
			rowIndx =obj.rowIndx,					
			that=this.that,
			$tr=(obj.$tr==null)?that.getRow({rowIndxPage:rowIndxPage}):obj.$tr;						
        if ($tr == null || $tr.length == 0) {
            return false;
        }
		$tr.addClass("pq-row-select");	        							        	
		return $tr;	
    }		
	var cCells=function(that){
		this.options=that.options,
			this.that=that,
			this.selectedCells=[];		
	}
	var _pC=cCells.prototype;
	_pC._addToData=function(objP){
		var location=this.options.dataModel.location;
		var data=(location=="remote")?this.that.data:this.options.dataModel.data,
			indx=(location=="remote")?objP.rowIndxPage:objP.rowIndx,
			row=data[indx],
			len_row=row.length,
			objCell=row[len_row-1];
		if(objCell.pqData){
			if(!objCell.selectedDataIndices){
				objCell.selectedDataIndices={};
			}
			objCell.selectedDataIndices[objP.dataIndx]=true;
		}
		else{
			row[len_row]= {pqData:true,selectedDataIndices:{}};
			row[len_row].selectedDataIndices[objP.dataIndx]=true;
		}		
	}
	_pC._removeFromData=function(objP){
		var location=this.options.dataModel.location;
		var data=(location=="remote")?this.that.data:this.options.dataModel.data,
			indx=(location=="remote")?objP.rowIndxPage:objP.rowIndx,					
			row=data[indx],
			len_row=row.length,
			objCell=row[len_row-1];
		if(objCell.pqData && objCell.selectedDataIndices){
			objCell.selectedDataIndices[objP.dataIndx]=false;
		}
	}					
	_pC.setDirty=function(){
		if(this.selectedCells.length>0){
			this.isDirty=true;
		}			
	}	
	_pC.removeAll=function(objP){
		if(this.isDirty){
			this.refresh();
		}			
		var raiseEvent=objP.raiseEvent,
			that=this.that,
			offset=(objP.offset==null)?that.getRowIndxOffset():obj.offset;		
		var selectedCells=this.selectedCells.slice(0);
		for(var i=0;i<selectedCells.length;i++){
			var selC=selectedCells[i];
			var rowIndx=selC.rowIndx,
				dataIndx=selC.dataIndx;
			this.remove({rowIndx:rowIndx,offset:offset, dataIndx:dataIndx});				
		}
	}	
	_pC.isSelected=function(objP){
		if(this.isDirty){
			this.refresh();
		}	
		var location=this.options.dataModel.location;
		var that=this.that, 
			data=(location=="remote")?that.data:this.options.dataModel.data,
			indx=(location=="remote")?objP.rowIndxPage:objP.rowIndx,									
			dataIndx=(objP.dataIndx==null)?that.colModel[objP.colIndx].dataIndx:objP.dataIndx,
			rowData=data[indx],
			len_row=(rowData)?rowData.length:null,
			objCell=(len_row)?rowData[len_row-1]:null;
		if(objCell==null){
			return null;
		}	
		else if (objCell.pqData) {
			var selectedDataIndices=objCell.selectedDataIndices;
			if(selectedDataIndices && selectedDataIndices[dataIndx]!=null){
				return selectedDataIndices[dataIndx];	
			}			
		}
		return false;
	}	
	_pC.refresh=function(){
		this.selectedCells=[];
		var data=this.options.dataModel.data;
		if(!data)return;
		for(var i=0,len=data.length;i<len;i++){
			var row=data[i],
				objC=row[row.length-1];
			if(objC && objC.pqData){
				var selectedDataIndices=objC.selectedDataIndices;
				if(selectedDataIndices){
					for(var dataIndx in selectedDataIndices){
						if(selectedDataIndices[dataIndx]){
							this.selectedCells.push({rowIndx:i,dataIndx:dataIndx});	
						}												
					}
				}
			}							
		}
		this.isDirty=false;
	}		
	_pC.replace=function(obj){
		if(this.isDirty){
			this.refresh();
		}					
		var rowIndx=obj.rowIndx,
			colIndx=obj.colIndx,
			offset=obj.offset=(obj.offset==null)?this.that.getRowIndxOffset():obj.offset,
			rowIndxPage= obj.rowIndxPage=rowIndx-offset;						
			$td=obj.$td,
			evt=obj.evt;
		this.removeAll( {raiseEvent: true});
		this.add(obj);
	}
	_pC.add=function(objP){
		if(this.isDirty){
			this.refresh();
		}					
		var rowIndx=objP.rowIndx,
			that=this.that,
			offset=(objP.offset==null)?that.getRowIndxOffset():objP.offset,
			rowIndxPage = objP.rowIndxPage = rowIndx-offset,
			colIndx=objP.colIndx= (objP.colIndx==null)?that.getColIndxFromDataIndx(objP.dataIndx):objP.colIndx,
			dataIndx=objP.dataIndx= (objP.dataIndx==null)?that.colModel[colIndx].dataIndx:objP.dataIndx,			
			evt=objP.evt,
			selectedCells =this.selectedCells,
			isSelected = this.isSelected(objP);
		if(isSelected==null){
			return false;
		}
		else if(isSelected==false){								
			var $td=that.getCell({rowIndxPage:rowIndxPage,colIndx:colIndx});								
			if($td)$td.addClass("pq-cell-select");
			selectedCells.push({rowIndx:rowIndx,dataIndx:dataIndx});				
			this._addToData(objP);
			that._trigger("cellSelect",evt,{
				rowIndx: rowIndx,				
				rowIndxPage: rowIndxPage,
				colIndx:colIndx,
				dataIndx:dataIndx,
				data:that.data,
				dataModel:that.dataModel,
				$td: $td
			});										
		}
		else{
			var indx=this.indexOf(objP);
			var arr2=this.selectedCells.splice(indx,1);
			this.selectedCells = this.selectedCells.concat(arr2);
		}		
	}
	_pC.remove=function(objP){
		if(this.isDirty){
			this.refresh();
		}						
		var rowIndx=objP.rowIndx,
			that=this.that,
			dataIndx=(objP.dataIndx==null)?that.colModel[objP.colIndx].dataIndx:objP.dataIndx,			
			colIndx=(objP.colIndx==null)?that.getColIndxFromDataIndx(dataIndx):objP.colIndx,			
			offset=(objP.offset==null)?that.getRowIndxOffset():objP.offset,
			rowIndxPage=objP.rowIndxPage = rowIndx-offset,			
			evt=objP.evt,		
			init=(that.init+offset),
			finall=(that['final']+offset);
		if(this.isSelected(objP)){
			if(rowIndx >= init && rowIndx <= finall){
				var $td=that.getCell({rowIndxPage:rowIndxPage,colIndx:colIndx});
				if($td)$td.removeClass("pq-cell-select");
				that._trigger("cellUnSelect",evt,{
					rowIndx:rowIndx,
					colIndx:colIndx,
					dataIndx:dataIndx,
					dataModel:that.dataModel,
					$td:$td
				});								
			}				
			this._removeFromData(objP);																																		
		}
		var indx=this.indexOf(objP);
		if(indx!=-1){
			this.selectedCells.splice(indx,1);
		}																																											
	}
	_pC.indexOf=function(obj){
		if(this.isDirty){
			this.refresh();
		}			
		var rowIndx=obj.rowIndx,
			that=this.that,
			dataIndx=obj.dataIndx =(obj.dataIndx==null)?that.colModel[obj.colIndx].dataIndx:obj.dataIndx;
		var selectedCells=this.selectedCells;
		for(var i=0;i<selectedCells.length;i++){
			var sCell=selectedCells[i];
			if(sCell.rowIndx==rowIndx && sCell.dataIndx==dataIndx){
				return i;
			}
		}
		return -1;
	}
	_pC.getSelection=function(){
		if(this.isDirty){
			this.refresh();
		}							
		return this.selectedCells;
	}		
    var fn = {};
    fn.options = {
        colModel: null,
        columnBorders: true,
		customData:null,
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
		editModel: {clicksToEdit:1,saveKey:''},
		flexHeight: false,
		flexWidth: false,
        freezeCols: 0,		
		getDataIndicesFromColIndices: true,
        height: 400,
		hoverMode:'row',
        minWidth: 50,
        numberCell: true,
        numberCellWidth: 50,		
        resizable: false,	
		scrollModel:{pace:"fast", horizontal:true},
		selectionModel: {type:'row',mode:'range'},
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
    fn._disable = function () {
        if (this.$disable == null) this.$disable = $("<div class='pq-grid-disable'></div>").css("opacity", 0.2).appendTo(this.element);
    }
    fn._enable = function () {
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
	fn._rangeSelectRow = function(initRowIndx, finalRowIndx, evt){
		var that=this,
			rowSelection = that.sRows.getSelection(),
			rowSelection2=rowSelection.slice(0);
		for (var i = 0; i < rowSelection2.length; i++) {
			var rowS = rowSelection2[i], row = rowS.rowIndx;
			if(row<initRowIndx || row>finalRowIndx){
				that.sRows.remove({rowIndx:row});
			}			
		}
		for(var row =initRowIndx; row<=finalRowIndx;row++){
			that.sRows.add({rowIndx:rowIndx});
		}
	}	
	fn._rangeSelect=function(initRowIndx,initColIndx,finalRowIndx,finalColIndx,evt){
		var that=this,
			cellSelection = that.sCells.getSelection(),
			cellSelection2=cellSelection.slice(0);
		for(var i=0;i<cellSelection2.length;i++){
			var cellS=cellSelection2[i],
				row=cellS.rowIndx,
				dataIndx=cellS.dataIndx,
				col=this.getColIndxFromDataIndx(dataIndx);
			if(row<initRowIndx||row>finalRowIndx){
				that.sCells.remove({rowIndx:row,colIndx:col,dataIndx:dataIndx});
			}
			else if(row==initRowIndx && col<initColIndx){
				that.sCells.remove({rowIndx:row,colIndx:col,dataIndx:dataIndx});
			}
			else if(row==finalRowIndx && col>finalColIndx){
				that.sCells.remove({rowIndx:row,colIndx:col,dataIndx:dataIndx});
			}										
		}
		for (var col = 0; col < that.colModel.length; col++) {
			var column=that.colModel[col];
			if(column.hidden){
				continue;
			}			
			var dataIndx=column.dataIndx;			
			var row=initRowIndx;
			do{
				if(row==initRowIndx && col<initColIndx){
				}
				else if(row==finalRowIndx && col>finalColIndx){
					break;
				}
				else{
					that.sCells.add({rowIndx:row,colIndx:col,dataIndx:dataIndx});	
				}									
				row++;
			}while(row<=finalRowIndx);
		}
	}
	fn._blockSelect=function(initRowIndx,initColIndx,finalRowIndx,finalColIndx,evt){
		var that=this,
			cellSelection=that.sCells.getSelection(),
			cellSelection2=cellSelection.slice(0);
		for(var i=0;i<cellSelection2.length;i++){
			var cellS=cellSelection2[i],
				row=cellS.rowIndx,
				dataIndx=cellS.dataIndx,
				col=this.getColIndxFromDataIndx(dataIndx);
			if(col<initColIndx||col>finalColIndx){
				that.sCells.remove({rowIndx:row,dataIndx:dataIndx,colIndx:col});
			}
			else if(row<initRowIndx || row>finalRowIndx){
				that.sCells.remove({rowIndx:row,dataIndx:dataIndx,colIndx:col});
			}
		}														
		for (var col = initColIndx; col <= finalColIndx; col++) {
			var column=that.colModel[col];
			var dataIndx=column.dataIndx;
			if(column.hidden){
				continue;
			}
			var row=initRowIndx;
			do{
				that.sCells.add({rowIndx:row,colIndx:col,dataIndx:dataIndx});																	
				row++;
			}while(row<=finalRowIndx);
		}									
	}
	fn._addSelection=function(obj){
		var rowIndxPage=obj.rowIndxPage,
			colIndx=obj.colIndx;
		var data=this.data;
		data[rowIndxPage][this.customDataIndx]={selection:{colIndx:colIndx}};	
	}
	fn._removeSelection=function(obj){
		var rowIndxPage=obj.rowIndxPage,
			colIndx=obj.colIndx,
			$tr=obj.$tr,
			data=this.data;
		data[rowIndxPage][this.customDataIndx]={selection:null};	
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
        this.freezeCols = this.options.freezeCols;		
        this.columnBorders = this.options.columnBorders;
        var that = this;
        this.$tbl = null; 
		this._refreshHeader();
        $(this.colModel).each(function (i, col) {
            if (col.width != undefined) {
                var wd = parseInt(col.width)
                if (wd < that.minWidth){
					wd = that.minWidth;
					col.width=wd;
				} 
            } else {                
				col.width= that.minWidth;
            }
        });
		this._computeOuterWidths();
        this.element.empty().addClass('pq-grid').append("<div class='pq-grid-top'>\
		<div class='pq-grid-title'>&nbsp;</div></div>\
	<div class='pq-grid-inner' tabindex=0><div class='pq-grid-right'> \
		<div class='pq-header-outer'><span class='pq-grid-header'></span><span class='pq-grid-header'></span></div> \
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
        this.$header = $(".pq-grid-header", this.$grid_right);
		this.$header_left=$(this.$header[0]);
		this.$header_right=$(this.$header[1]);
		this.$bottom = $("div.pq-grid-bottom", this.element); 
        this.$footer = $("div.pq-grid-footer", this.element); 
        this.$cont_o = $("div.pq-cont-right", this.$grid_right);
        this.$cont = $("div.pq-cont", this.$grid_right);
		this.$cont.on("click", function (evt) {
			return that._onClickCont(evt);
		});		
		this.$cont.on("click", "td.pq-grid-cell", function (evt) {		
			return that._onClickCell(evt); 
        }).mousedown(function(evt){
		});
		this.$cont.on("click", "tr.pq-grid-row", function (evt) {
			return that._onClickRow(evt);
		});
		this.$cont.on("dblclick", "td.pq-grid-cell", function (evt) {
			return that._onDblClickCell(evt);
        });
		this.$cont.on("mouseenter", "td.pq-grid-cell", function (evt) {
			var $td=$(this);
	        if(that._trigger("cellMouseEnter", evt, {
	            $td: $td,
				dataModel: that.options.dataModel
	        })==false){return false;};		
			if(that.options.hoverMode=='cell'){
				that.highlightCell($td);
			}								            	
        });
		this.$cont.on("mouseenter", "tr.pq-grid-row", function (evt) {
			var $tr=$(this);
	        if(that._trigger("rowMouseEnter", evt, {
	            $tr: $tr,
				dataModel: that.options.dataModel
	        })==false){return false;};
			if(that.options.hoverMode=='row'){
				that.highlightRow($tr);
			}								            	
        });
        this.$cont.on("mouseleave", "td.pq-grid-cell", function (evt) {
			var $td=$(this);
	        if(that._trigger("cellMouseLeave", evt, {
	            $td: $td,
				dataModel: that.options.dataModel
	        })==false){return false;};								            
			if(that.options.hoverMode=='cell'){
				that.unHighlightCell($td);
			}								            	
        });		
        this.$cont.on("mouseleave", "tr.pq-grid-row", function (evt) {
			var $tr=$(this);
	        if(that._trigger("rowMouseLeave", evt, {
	            $tr: $tr,
				dataModel: that.options.dataModel
	        })==false){return false;};								            
			if(that.options.hoverMode=='row'){
				that.unHighlightRow($tr);
			}								            	
        });		
        this.$cont.bind('mousewheel DOMMouseScroll', function (evt) {
			return that._onMouseWheel(evt);
        })
        var prevVScroll = 0;
        this.$hvscroll = $("<div class='pq-hvscroll-square'></div>").appendTo(this.$grid_inner);
        this.$vscroll = $("<div class='pq-vscroll'></div>").appendTo(this.$grid_inner);
        this.prevVScroll = 0;
        this.$vscroll.pqScrollBar({
			pace:that.options.scrollModel.pace,
            direction: "vertical",
            cur_pos: 0,
            scroll: function (evt, obj) {				
                that.$cont[0].scrollTop = 0; 
                if(that.init!=obj.cur_pos){
	                $.measureTime(function () {
	                    that.selectCellRowCallback(that._generateTables);
	                }, 'that.selectCellRowCallback(that._generateTables)');
				}
            }
        });
        var prevHScroll = 0;
        this.$hscroll = $("<div class='pq-hscroll'></div>").appendTo(this.$grid_inner);
        this.$hscroll.pqScrollBar({
            direction: "horizontal",
			pace:that.options.scrollModel.pace,
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
			this._refreshDataIndices();
			var colIndx=this.getColIndxFromDataIndx(DM.sortIndx);
            this._sortLocalData(DM.sortIndx, DM.sortDir, this.colModel[colIndx].dataType); 
        }
        this._initData(); 
		this._createSelectedRowsObject();
		this._createSelectedCellsObject();
        this._refresh();
    }
	fn._onMouseWheel=function(evt){
		var that=this;
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
	fn._onDblClickCell=function(evt){
		var that=this;
		var $td=$(evt.currentTarget);
		var obj=that.getCellIndices($td);
		var rowIndxPage=obj.rowIndxPage,
			offset=that.getRowIndxOffset(),
			rowIndx=rowIndxPage+offset,
			colIndx=obj.colIndx;
        if(that._trigger("cellDblClick", evt, {
            $td: $td,
			dataModel: that.options.dataModel
        })==false){return false;};
		if(this.isEditableCell({colIndx:colIndx}) && that.options.editModel.clicksToEdit>1){
			that._setSelection(null);
			if (that.options.selectionModel.type == 'cell'){
				that._setSelection({rowIndx:rowIndx,colIndx:colIndx});
			}
			else if(that.options.selectionModel.type == 'row'){
				that._setSelection({rowIndx:rowIndx});
			}			
			that._editCell($td);
		}								            			
	}
	fn._onClickCont=function(evt){
		var that=this;
		if(that.$td_edit){
			if(!that._isEditCell(evt)){
				that.quitEditMode(evt);	
			}				
		}										
	}
	fn._onClickRow=function(evt){
		var that=this;
		var $tr=$(evt.currentTarget);
		var rowIndxPage = parseInt($tr.attr("pq-row-indx")),
			offset=that.getRowIndxOffset(),
			rowIndx=rowIndxPage+offset;
		var objP={rowIndx:rowIndx,evt:evt};
        if(that._trigger("rowClick", evt, {
            $tr: $tr,
            rowIndx: rowIndx,
			dataModel: that.options.dataModel
        })==false){return false;};											
		var selectionModel=that.options.selectionModel;
		if (selectionModel.type == 'row') {
			var rowSelection=that.sRows.getSelection();					
			if (rowSelection.length > 0) {
				if (evt.ctrlKey && selectionModel.mode!='single') {
					if(that.sRows.indexOf(objP)!=-1){
						that.sRows.remove(objP);
					}
					else{
						that._setSelection(objP);																			
					}						
				}
				else if (evt.shiftKey && selectionModel.mode!='single') {
					var rowS=rowSelection[rowSelection.length-1],
						rowIndx1=rowS.rowIndx,
						initRowIndx=rowIndx1,
						finalRowIndx=rowIndx;
					if(rowIndx1>rowIndx){
						initRowIndx=rowIndx;
						finalRowIndx=rowIndx1;
					}
					var rowSelection2=rowSelection.slice(0);
					for (var i=0; i < rowSelection2.length; i++) {
						var rSel=rowSelection2[i],
							row=rSel.rowIndx;
						if(row<initRowIndx||row>finalRowIndx){
							that.sRows.remove({rowIndx:row,evt:evt});	
						}																
					}
					for(var row=initRowIndx;row<=finalRowIndx;row++){
						that.sRows.add({rowIndx:row,evt:evt});
					}
					that._setSelection(objP);																								
				}
				else{
					that.sRows.removeAll( {raiseEvent: true});
					that._setSelection(objP);																
				}
			}
			else{
				that._setSelection(objP);					
			}
		}		
	}
	fn.isEditableCell=function(obj){
		var colIndx=obj.colIndx,
			column=(obj.column==null)?(this.colModel[colIndx]):obj.column,
			editable=true;
		if(this.options.editable==false){
			editable=false;
		}		
		if(column.editable==false){
			editable=false;
		}
		return editable;			
	}
	fn._onClickCell=function(evt){
		var that=this,
			thisOptions=this.options,
			selectionModel=thisOptions.selectionModel;;
		var $td=$(evt.currentTarget);
		var objP=that.getCellIndices($td);
		var rowIndxPage=objP.rowIndxPage,
			offset=that.getRowIndxOffset(),
			rowIndx=objP.rowIndx = rowIndxPage+offset,
			colIndx=objP.colIndx,
			dataIndx=objP.dataIndx=this.colModel[colIndx].dataIndx,
			column=that.colModel[colIndx];
		objP.evt=evt;
        if(that._trigger("cellClick", evt, {
            $td: $td,
            rowIndx: rowIndx,
			colIndx: colIndx,
			dataIndx:dataIndx,
			column: column,
			dataModel: that.options.dataModel
        })==false){return false;};
		if(that.$td_edit){
			that.quitEditMode(evt);
		}					
		if(this.isEditableCell({column:column}) && thisOptions.editModel.clicksToEdit=='1'){
			that._setSelection(null);		
			if (selectionModel.type == 'cell'){
				that._setSelection(objP);
			}
			else{
				that._bringRowIntoView({rowIndxPage:rowIndxPage});
				$td=that._bringCellIntoView({rowIndxPage:rowIndxPage,colIndx:colIndx});
			}
			window.setTimeout(function(){
				that.editCell(objP);
			},0)
			return;
		}
		if (selectionModel.type == 'cell') {
			var cellSelection=that.sCells.getSelection();					
			if(cellSelection.length>0){
				if (evt.ctrlKey && selectionModel.mode!='single') {
					if (that.sCells.isSelected(objP)) {
						that.sCells.remove(objP);
					}
					else {
						that._setSelection(objP);												
					}						
				}
				else if (evt.shiftKey && selectionModel.mode!='single') {
					var cellS=cellSelection[cellSelection.length-1],
						rowIndx1=cellS.rowIndx,
						colIndx1= that.getColIndxFromDataIndx(cellS.dataIndx),
						initRowIndx=rowIndx1,
						finalRowIndx=rowIndx,
						initColIndx=colIndx1,
						finalColIndx=colIndx;
						if(rowIndx1>rowIndx){
							initRowIndx=rowIndx;
							finalRowIndx=rowIndx1;
						}
					if (that.options.selectionModel.mode == 'range') {
						if (rowIndx1 > rowIndx) {
							initColIndx=colIndx;
							finalColIndx=colIndx1;																									
						}
						if(rowIndx==rowIndx1 && colIndx<colIndx1){
							initColIndx=colIndx;
							finalColIndx=colIndx1;
						}
						that._rangeSelect(initRowIndx,initColIndx,finalRowIndx,finalColIndx,evt);
					}
					else if (that.options.selectionModel.mode == 'block') {
						if (colIndx1 > colIndx) {
							initColIndx = colIndx;
							finalColIndx = colIndx1;
						}
						that._blockSelect(initRowIndx,initColIndx,finalRowIndx,finalColIndx,evt);
					}
					that._setSelection(objP);												
				}
				else {
					that.sCells.removeAll({raiseEvent: true});
					that._setSelection(objP);										
				}
			}
			else{
				that._setSelection(objP);	
			}					
		}            		
	}	
	fn.highlightCell=function($td){
		$td.addClass("pq-grid-cell-hover");
	}
	fn.unHighlightCell=function($td){
		$td.removeClass("pq-grid-cell-hover");
	}
	fn.highlightRow=function($tr){
		$tr.addClass("pq-grid-row-hover");
	}	
	fn.unHighlightRow=function($tr){
		$tr.removeClass("pq-grid-row-hover");
	}		
	fn._createSelectedRowsObject=function(){
		this.sRows=new cRows(this);
	}
	fn._createSelectedCellsObject=function(){
		this.sCells = new cCells(this);
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
		var $div= $targ.closest("div.pq-cell-selected-border-edit");
		if($div && $div.length>0){
			return true;
		}
        return false;
    }
	fn._findCellFromEvt=function(evt){
        var $targ = $(evt.target);
        var $td= $targ.closest(".pq-grid-cell");
		if($td==null || $td.length==0){
			return {rowIndxPage:null,colIndx:null,$td:null};
		}		
		else{
			var obj=this.getCellIndices($td);
			obj.$td=$td;
			return obj;
		}
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
        if (that.initH > 0) {
            var indx = that.freezeCols - 1 + that.initH;
            for (var i = that.freezeCols; i <= indx; i++) {
                if (that.colModel[i].hidden) {
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
                        that._refreshSortingDataAndView({sorting:true});
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
	fn._fixFireFoxContentEditableIssue=function(){
        if(!$.browser.msie){
			this.$grid_inner.focus(); 	
		}							
	}
    fn.selectCellRowCallback = function (fn) {
        var rowIndx, colIndx;
		if (this.$td_edit) {
			this.quitEditMode();
		}
        var that = this;
        $.measureTime(function () {
            fn.call(that); 
        }, '_generateTables');
		if(this.options.flexHeight){
			this._setGridHeightFromTable();
		}				
		if(this.options.flexWidth){
			this._setGridWidthFromTable();
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
    fn._refreshDataIndices=function(){
		if(this.options.getDataIndicesFromColIndices==false){
			return;
		}			
		var thisColModel=this.colModel;
		for(var i=0;i<thisColModel.length;i++)
		{
			var column=thisColModel[i];
			if(column.dataIndx==null){
				column.dataIndx=i;
			}
		}
	}
    fn._refresh = function () {
        var that = this;		
		this._refreshDataIndices();
        this._refreshResizable();
        this._refreshDraggable();
        this._bufferObj_calcInitFinalH();
        this._refreshHideArrHS();
		this._computeOuterWidths(true);
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
        this._setVScrollHeight();
		this.selectCellRowCallback(function(){
        	this._generateTables();
        	this._computeOuterWidths(); 
		})
        this._refreshHeaderSortIcons();
        this._setRightGridHeight();
        this._setVScrollHeight(); 
        this._setHScrollWidth(); 
        this._refreshPager();
    }
    fn.refreshSortingDataAndView = function () {
        this._refreshSortingDataAndView({
			sorting: true
		});
    }
    fn.refreshDataAndView = function (keepSelection) {
        this.data = null;
		this.sRows.setDirty();
		this.sCells.setDirty();
        var DM = this.options.dataModel;
        if (DM.location == "remote") {
            DM.data = null;
            this.remoteRequest();
        } else {
            this._refreshSortingDataAndView({keepSelection:keepSelection});
        }
    }
	fn.getColIndxFromDataIndx=function(dataIndx){
		var thisColModel=this.colModel;
		for(var i=0;i<thisColModel.length;i++){
			if(thisColModel[i].dataIndx==dataIndx){
				return i;
			}
		}				
	}
    fn._refreshSortingDataAndView = function (obj) {
		var sorting=obj.sorting,
			fn=obj.fn,
			keepSelection=obj.keepSelection;
		if(!keepSelection){
			this.sRows.removeAll({
				raiseEvent: true
			});
			this.sCells.removeAll({raiseEvent: true});			
		}
		var DM = this.options.dataModel,
			thisColModel=this.colModel,
        	indx = DM.sortIndx,
			colIndx = this.getColIndxFromDataIndx(indx);
        var dir = DM.sortDir;
        var that = this;
        if (sorting == true) {
			if(indx==null||colIndx==null){
				return;
			}
            if (DM.sorting == "remote") {
                this.remoteRequest(fn);
            } else {
				var column=thisColModel[colIndx];
                var dataType = column.dataType;
				this._sortLocalData(indx, dir, dataType);
				this.sRows.setDirty();
				this.sCells.setDirty();
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
    fn._computeOuterWidths = function (basedOnWidthsOnly) {
		var options=this.options,
			columnBorders=options.columnBorders,
			thisColModel=this.colModel,
			thisColModelLength=thisColModel.length;
            for (var i = 0; i < thisColModelLength; i++) {
				var column=thisColModel[i];
					this.outerWidths[i] = parseInt(column.width) + ((columnBorders)?1:0);
            }
            this.numberCell_outerWidth = this.numberCellWidth+1;
            return;
    }
    fn._setOption = function (key, value) {
		this.refreshRequired=true;
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
                this.options.freezeCols= this.freezeCols = parseInt(value);
                this._refreshFreezeLine(); 
                this._setHScrollWidth();
                $.Widget.prototype._setOption.call(this, key, value);				
            }
        } else if (key == "resizable") {
            $.Widget.prototype._setOption.call(this, key, value);
        } else if (key == "scrollModel") {
			var obj=value;
			for(var key in obj){
				this.options.scrollModel[key]=obj[key];	
			}
        } else if (key == "dataModel") {
            $.Widget.prototype._setOption.call(this, key, value);
            this._refreshSortingDataAndView({});
			this.refreshRequired=false;
        }
        else if (key == "selectionModel") {
			var obj=value;
			for(var key in obj){
				this.options.selectionModel[key]=obj[key];	
			}
			this.refreshRequired=false;
        }				
        else if (key == "colModel") {
            $.Widget.prototype._setOption.call(this, key, value);
        }		
		else if(key=="disabled"){
			if(value==true){
				this._disable();
			}
			else{
				this._enable();
			}
			this.refreshRequired=false;
		}
		else{
			$.Widget.prototype._setOption.call(this, key, value);
		}
    }
    fn._setOptions = function () {
        $.Widget.prototype._setOptions.apply(this, arguments); 
		if(this.refreshRequired){
			this._refresh(); 
		}
        this.refreshRequired=true;	
    }   
	fn._generateCellRowOutline=function(obj){
		var $td=obj.$td,
			$tr=obj.$tr,
			that=this;
		if($tr){
	        var wd = that._calcRightEdgeCol(that.colModel.length - 1);
	        wd -= 4; 
	        var ht = $tr[0].offsetHeight - 4;
	        var $table = $($tr[0].offsetParent);
	        var offsetParent = $table[0].offsetParent;
	        var lft = $tr[0].offsetLeft + $table[0].offsetLeft;
	        var top = $tr[0].offsetTop + $table[0].offsetTop;			
			that._generateCellHighlighter(offsetParent, lft, top, wd, ht);			
		}
		else if($td){
	        var $table = $($td[0].offsetParent);
	        var offsetParent = $table[0].offsetParent;
	        var wd = $td[0].offsetWidth - 4;
	        var ht = $td[0].offsetHeight - 4;
	        var lft = $td[0].offsetLeft + $table[0].offsetLeft;
	        var top = $td[0].offsetTop + $table[0].offsetTop;
			that._generateCellHighlighter(offsetParent, lft, top, wd, ht);			
		}	
	}
	fn._removeCellRowOutline=function(){
		if(this.$div_focus){
			this._fixFireFoxContentEditableIssue();
			this.$div_focus.remove();
			this.$div_focus=null;				
		}
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
    fn.selectRow = function (obj) {
		var rowIndx=obj.rowIndx,
			evt=obj.evt,
			offset=obj.offset;
		if(evt && (evt.type=="keydown" || evt.type=="keypress")){
			if (this.sRows.replace(obj) == false) {	
	            return false;
	        }
		}			
		else if (this.sRows.add(obj) == false) {
			return false;
		}
		if(evt!=null)this._setGridFocus();
        return true;
    }
    fn.scrollY=function(rowIndx){
		this.$vscroll.pqScrollBar("option", "cur_pos", rowIndx).pqScrollBar("scroll");
	}
    fn._bringRowIntoView = function (obj) {
		var rowIndxPage=obj.rowIndxPage;
        if (rowIndxPage < this._bufferObj_getInit()) {
            this.$vscroll.pqScrollBar("option", "cur_pos", rowIndxPage).pqScrollBar("scroll");
        }
        var $tr = this.$tbl.find("tr[pq-row-indx=" + rowIndxPage + "]");
        if ($tr[0] == undefined) {
            this.$vscroll.pqScrollBar("option", "cur_pos", rowIndxPage).pqScrollBar("scroll");
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
                if (this.init + indx + 1 > rowIndxPage) {
                    indx = rowIndxPage - 1 - this.init;
                }
                this.$vscroll.pqScrollBar("option", "cur_pos", this.init + indx + 1).pqScrollBar("scroll");
            }
        }
    }
	fn._bringCellIntoView=function(obj){
		var rowIndxPage=obj.rowIndxPage,
			colIndx=obj.colIndx,
			tdneedsRefresh=false;
        var $td;			
        if (this.hidearrHS[colIndx]) {
            this.hidearrHS[colIndx] = false; 
            var cur_pos = colIndx - this.freezeCols - this._calcNumHiddenUnFrozens(colIndx);
            this.$hscroll.pqScrollBar("option", "cur_pos", cur_pos).pqScrollBar("scroll");
			tdneedsRefresh=true;
        } else {
	        var $td = this.$tbl.find("tr[pq-row-indx=" + rowIndxPage + "]>td[pq-col-indx=" + colIndx + "]");			
	        if ($td.length == 0) {
	            return false;
	        }
            var td_right = this._calcRightEdgeCol(colIndx);
			var wd_scrollbar=17;
			if(this.$vscroll.css("visibility")=="hidden" || this.$vscroll.css("display")=="none"){
				wd_scrollbar=0;
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
				tdneedsRefresh=true;
            }
        }
		if(tdneedsRefresh){
            var $td = this.$tbl.find("tr[pq-row-indx=" + rowIndxPage + "]>td[pq-col-indx=" + colIndx + "]");
			return $td;			
		}
		else{
			return $td;
		}				
	}
	fn.selection=function(obj){
		var rowIndx=obj.rowIndx,
			colIndx=obj.colIndx,
			method=obj.method,
			type=obj.type;
			if(type=='row'){
				return this['sRows'][method](obj);	
			}	
			else if(type=='cell'){
				return this['sCells'][method](obj);
			}							
			return;		
	}
	fn.setSelection = function(obj){
		if(obj==null || obj.rowIndx==null){
			this.sRows.removeAll({raiseEvent:true});
			this.sCells.removeAll({raiseEvent:true});
			return;
		}
		this._bringPageIntoView(obj);
		return this._setSelection(obj);
	}
	fn._bringPageIntoView=function(obj){
		var rowIndx=obj.rowIndx,that=this;
		var DM = this.options.dataModel;
        if (DM.paging == "local" && rowIndx >= 0) {
            var curPage = DM.curPage;
            var rPP = DM.rPP;
            var begIndx = (curPage - 1) * rPP;
            var endIndx = curPage * rPP;
            if (rowIndx >= begIndx && rowIndx < endIndx) {
            }
            else {
                DM.curPage = Math.ceil((rowIndx + 1)/ rPP);
                this.refreshDataAndView(true);
                $.measureTime(function () {
                    that.selectCellRowCallback(that._generateTables);
                }, 'that.selectCellRowCallback(that._generateTables)');
            }
            rowIndxPage = (rowIndx % rPP);
        }		
	}
    fn._setSelection = function (obj) {
		if(obj==null){
			this.sRows.removeAll({raiseEvent:true});
			this.sCells.removeAll({raiseEvent: true});	
			return false;		
		}
		var offset=obj.offset= (obj.offset==null)?this.getRowIndxOffset():obj.offset,
			rowIndx=obj.rowIndx= (obj.rowIndx==null)?obj.rowIndxPage+offset:obj.rowIndx,
			rowIndxPage=obj.rowIndxPage= (obj.rowIndxPage==null)?obj.rowIndx-offset:obj.rowIndxPage,		
			colIndx=obj.colIndx,			
			evt=obj.evt;
        if (rowIndxPage < 0 || colIndx < 0) {
            return false;
        }
        if (this.data == null || this.data.length == 0) {
            return false;
        }
        if (rowIndxPage >= this.data.length || colIndx >= this.colModel.length) {		
            return false;
        }
        this._bringRowIntoView({rowIndxPage:rowIndxPage});
        if (colIndx == null) {
            return this.selectRow({rowIndx:rowIndx, evt:evt}); 
        }
		this._bringCellIntoView({rowIndxPage:rowIndxPage,colIndx:colIndx});
        return this.selectCell({rowIndx:rowIndx, colIndx:colIndx, evt:evt});
    }
	fn.saveEditCell = function () {
        if (this.$td_edit == null) return;
        var $td = this.$td_edit,
        	obj = this.getCellIndices($td),
        	offset = this.getRowIndxOffset(),
			colIndx=obj.colIndx,
			rowIndxPage=obj.rowIndxPage,
			rowIndx = obj.rowIndx = rowIndxPage + offset,
			thisColModel=this.colModel,
			column= obj.column = thisColModel[colIndx],
			dataIndx=obj.dataIndx=column.dataIndx,
			prevVal = this.data[rowIndxPage][dataIndx];				
        if (rowIndxPage != null) {                    						
			var dataCell=this._getEditCellData(obj);
			if(dataCell!=prevVal){
				this.data[rowIndxPage][dataIndx] = dataCell;
				obj.data=this.data;				
				if(this._trigger("cellSave",null,obj)==false){
					return;
				}							
				this.refreshRow(obj);
				var that=this;
				if(that.options.flexHeight){
					that._setGridHeightFromTable();
					that._fixIEFooterIssue();
				}					
			}					
        }
    }
	fn._fixIEFooterIssue=function(){
		$(".pq-grid-footer").css({position:"absolute"});
		$(".pq-grid-footer").css({position:"relative"});														
	}
	fn.refreshColumn = function(obj){
		var colIndx=obj.colIndx= (obj.colIndx==null)?this.getColIndxFromDataIndx(obj.dataIndx):obj.colIndx,
			offset = this.getRowIndxOffset();
		for(var row=this.init;row<=this["final"];row++){
			var rowIndxPage = obj.rowIndxPage=row;
			obj.rowIndx =rowIndxPage+offset;
			var column=obj.column=this.colModel[colIndx];			
			obj.$td=this.getCell(obj);
			obj.rowData=this.data[rowIndxPage];
			this._renderCell(obj);	
		}		
	}
	fn.refreshCell = function(obj){
		var offset=obj.offset= (obj.offset==null)?this.getRowIndxOffset():obj.offset,
			rowIndx=obj.rowIndx= (obj.rowIndx==null)?obj.rowIndxPage+offset:obj.rowIndx,
			rowIndxPage=obj.rowIndxPage= (obj.rowIndxPage==null)?obj.rowIndx-offset:obj.rowIndxPage,			
			dataIndx=obj.dataIndx,			
			colIndx=obj.colIndx=(obj.colIndx==null)?this.getColIndxFromDataIndx(dataIndx):obj.colIndx,
			$td=obj.$td=(obj.$td==null)?this.getCell(obj):obj.$td,			
			column=obj.column=this.colModel[colIndx];
			var objRender=obj;
			objRender.rowData=this.data[rowIndxPage];
		if ($td && $td.length > 0) this._renderCell(objRender);	
	}
	fn.refreshRow=function(obj){
		var offset=obj.offset= (obj.offset==null)?this.getRowIndxOffset():obj.offset,
			rowIndx=obj.rowIndx= (obj.rowIndx==null)?obj.rowIndxPage+offset:obj.rowIndx,
			rowIndxPage=obj.rowIndxPage= (obj.rowIndxPage==null)?obj.rowIndx-offset:obj.rowIndxPage,
			$tr=(obj.$tr==null)?this.getRow(obj):obj.$tr,			
			thisColModel=this.colModel;
		var objRender={rowIndx:rowIndx,rowIndxPage:rowIndxPage,rowData:this.data[rowIndxPage]};
        for (var colIndx = 0; colIndx < thisColModel.length; colIndx++) {
			var column=thisColModel[colIndx];		
            var $td = $tr.find("td[pq-col-indx=" + colIndx + "]");
			objRender.$td=$td;
			objRender.colIndx=colIndx;
			objRender.column=column;
            if ($td && $td.length > 0) this._renderCell(objRender);
        }		
	}
    fn.quitEditMode = function (evt) {
        if (this.$td_edit) {
			var $td=this.$td_edit;
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
    fn.getData = function () {
        return this.data;
    }
    fn.getViewPortRowsIndx=function(){
		this._bufferObj_calcInitFinal();
		return {beginIndx:this.init,endIndx:this['final']};
	}
	fn.getRowIndxOffset=function(){
		var DM = this.options.dataModel,
        	paging = DM.paging,
			offset=0;
        if (paging == "local" || paging=="remote") {
            var curPage = DM.curPage;
            var rPP = DM.rPP;
            offset= (rPP * (curPage - 1));
        }
		return offset;		
	}
	fn._cellblurred=function(){
		this.$div_focus.remove();
		this.$div_focus=null;
		this.$td_focus=null;
		this.$tr_focus=null;		
	}
    fn.selectCell = function (obj) {
		var rowIndx=obj.rowIndx,
			colIndx=obj.colIndx,
			evt=obj.evt;
		if(evt && (evt.type=="keydown" || evt.type=="keypress")){
			if (this.sCells.replace(obj) == false) {	
	            return false;
	        }
		}
		else{
			if (this.sCells.add(obj) == false) {	
	            return false;
	        }			
		}		
		if(evt!=null)this._setGridFocus();
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
	fn.getEditCell=function(){
		if(this.$td_edit){
			return $td_edit;
		}
		else{
			return false;
		}		
	}
    fn.editCell = function (obj) {
        var $td = this.getCell(obj);
        if ($td != null && $td.length == 1) {
			if(this.$td_edit && this.$td_edit[0] != $td[0])
			{
				this.quitEditMode();
			}			  
			this._editCell($td);
			return $td;
        } 		
    }
	fn.getFirstEditableColIndx=function(){
		if(!this.options.editable){
			return -1;
		}		
		var colModel=this.colModel;
		for(var i=0;i<colModel.length;i++){
			var column=colModel[i];
			if(column.editable==false){
				continue;
			}
			return i;
		}
		return -1;
	}
	fn._editFirstCellInRow=function(obj){		
		var colIndx=this.getFirstEditableColIndx();
		if(colIndx!=-1){
			var rowIndxPage=obj.rowIndxPage;
			obj.colIndx=colIndx;
			this._bringRowIntoView(obj);
			var $td=this._bringCellIntoView(obj);
			if($td && $td.length>0)
				this._editCell($td);	
		}		
	}	
    fn._editCell = function ($td) {
        var that = this;
        var obj = that.getCellIndices($td);
        var rowIndxPage = obj.rowIndxPage,
			offset = this.getRowIndxOffset(),
			rowIndx = rowIndxPage+offset,
        	colIndx = obj.colIndx,
			column = this.colModel[colIndx],
			dataIndx = column.dataIndx;
        if (this.$td_edit && this.$td_edit[0] == $td[0]) { 
            return false;
        }
        this.$td_edit = $td;
        this.enableSelection();
		this._removeCellRowOutline();	
		this._generateCellRowOutline({$td:$td});		
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
            $cell.html("<div contenteditable='true' tabindx='0' style='background:#fff;padding:2px;'></div>");
            var that = this;
            $cell.children().html(that.data[rowIndxPage][dataIndx]);
        }
        var that = this;
        window.setTimeout(function () {
            if (that.$td_edit != null){
				var $cell=that.$div_focus;
				$cell.children().focus();
			} 
        }, 0)
    }
    fn.getRow = function (obj) {
		var rowIndxPage=obj.rowIndxPage;
        var $tr;
        if (this.$tbl != undefined) $tr = this.$tbl.find("tr[pq-row-indx=" + rowIndxPage + "]");
        return $tr;
    }
    fn.getCell = function (obj) {
		var rowIndxPage=(obj.rowIndxPage==null)?(obj.rowIndx-this.getRowIndxOffset()):obj.rowIndxPage,
			colIndx=obj.colIndx;		
        var $td;
        if (this.$tbl != undefined) $td = this.$tbl.find("tr[pq-row-indx=" + rowIndxPage + "]>td[pq-col-indx=" + colIndx + "]");
        return $td;
    }
	fn.getEditCellData=function(){
		if(this.$td_edit){
			var obj=this.getCellIndices(this.$td_edit);
			return this._getEditCellData(obj);	
		}
		else{
			return null;
		}				
	}
	fn._getEditCellData=function(obj){
		var colIndx=obj.colIndx,
			rowIndxPage=obj.rowIndxPage,
			rowIndx=(obj.rowIndx!=null)?obj.rowIndx:rowIndxPage+this.getRowIndxOffset(),					
			column=(obj.column)?obj.column:this.colModel[colIndx],
			$cell=(obj.$cell)?obj.$cell:this.$div_focus;
        if (column.getEditCellData) {
            var dataCell = column.getEditCellData({
                $cell: $cell,
                data: this.data,
				dataIndx:column.dataIndx,
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
    fn.getCellIndices = function ($td) {
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
	fn._incrIndx=function(rowIndxPage,colIndx) {
		var that=this;
		if(colIndx==null){				
			if(rowIndxPage==that.data.length-1){
				return null;
			}
			rowIndxPage++;
			return {rowIndxPage:rowIndxPage};				
		}
		var column;
	    do {
	        colIndx++;
	        if (colIndx >= that.colModel.length) {
				if(rowIndxPage==that.data.length-1){
					return null;
				}
	            rowIndxPage++;
	            colIndx = 0;
	        }
			column=that.colModel[colIndx];								
	    } while (column && column.hidden);
		return {rowIndxPage:rowIndxPage,colIndx:colIndx};			
	}
	fn._decrIndx=function (rowIndxPage,colIndx) {
		var that=this;
		if(colIndx==null){				
			if(rowIndxPage==0){
				return null;
			}				
			rowIndxPage--;
			return {rowIndxPage:rowIndxPage};				
		}			
		var column;
	    do {
	        colIndx--;
	        if (colIndx < 0) {
				if(rowIndxPage==0){
					return null;				
				}
	            rowIndxPage--;
	            colIndx = that.colModel.length -1;
	        }				
			column=that.colModel[colIndx];				
	    } while (column && column.hidden);	
		return {rowIndxPage:rowIndxPage,colIndx:colIndx};
	}		
	fn._incrEditIndx=function (rowIndxPage,colIndx) {
		var that=this;
		var column;
	    do {
	        colIndx++;
	        if (colIndx >= that.colModel.length) {
				if(rowIndxPage==that.data.length-1){
					return null;
				}
	            rowIndxPage++;
	            colIndx = 0;
	        }
			column=that.colModel[colIndx];								
	    } while (column && (column.hidden || column.editable===false));
		return {rowIndxPage:rowIndxPage,colIndx:colIndx};			
	}
	fn._decrEditIndx=function (rowIndxPage,colIndx) {
		var that=this;
		var column;
	    do {
	        colIndx--;
	        if (colIndx < 0) {
				if(rowIndxPage==0){
					return null;				
				}
	            rowIndxPage--;
	            colIndx = that.colModel.length -1;
	        }				
			column=that.colModel[colIndx];				
	    } while (column && (column.hidden || column.editable===false));	
		return {rowIndxPage:rowIndxPage,colIndx:colIndx};
	}
    fn.keyPressDown = function (evt) {
        var that = this,
			selectedCells=this.sCells.getSelection(),
			selectedRows=this.sRows.getSelection(),
			offset = that.getRowIndxOffset(),
			selectionModel=that.options.selectionModel,
	        rowIndx,colIndx;
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
        if (that.$td_edit) {
            var $td = $(that.$td_edit[0]);
			var obj = that.getCellIndices($td),
            	rowIndxPage = obj.rowIndxPage,				
				rowIndx = rowIndxPage + offset,
            	colIndx = obj.colIndx,
				column=this.colModel[colIndx],
				colSaveKey=(column.editModel)?column.editModel.saveKey:null;				
            if (evt.keyCode == keyCodes.tab) { 
				var obj;
                if (evt.shiftKey) {
                    obj=that._decrEditIndx(rowIndxPage,colIndx);
                } else {
                    obj=that._incrEditIndx(rowIndxPage,colIndx);
                }
				if(obj==null){
	                evt.preventDefault();
	                return false;
				}
                that.saveEditCell();
                that.quitEditMode(evt);
				if (this.options.selectionModel.type == 'row') {
					if(obj.rowIndxPage != rowIndxPage){
						that._setSelection(null);
						that._setSelection({
							rowIndxPage: obj.rowIndxPage
						});						
					}					
					that._bringCellIntoView({rowIndxPage:obj.rowIndxPage, colIndx:obj.colIndx});
				}
				else 
					if ((obj.rowIndxPage != rowIndxPage || obj.colIndx != colIndx) && this.options.selectionModel.type == 'cell') {
						that._setSelection(null);
						that._setSelection({
							rowIndxPage: obj.rowIndxPage,
							colIndx:obj.colIndx
						});						
					}
				rowIndxPage=obj.rowIndxPage;
				colIndx=obj.colIndx;				
                var $td2=this.getCell( {rowIndxPage:obj.rowIndxPage, colIndx:obj.colIndx} );
				this._editCell($td2);
                evt.preventDefault();
                return false;
			} else if (evt.keyCode == colSaveKey) {
                that.saveEditCell();
                that.quitEditMode(evt);				
			} else if (colSaveKey==null && evt.keyCode == this.options.editModel.saveKey) {
                that.saveEditCell();
                that.quitEditMode(evt);																			
            } else if (evt.keyCode == keyCodes.esc) {
                that.quitEditMode(evt);
                evt.preventDefault();
                return false;															
            }
			else if (evt.keyCode==keyCodes.pageUp||evt.keyCode==keyCodes.pageDown){
                evt.preventDefault();
                return false;																			
			}
            return; 
        }
		else if (selectedRows.length > 0 && selectionModel.type=='row') {
			var obj = selectedRows[selectedRows.length - 1], 
			rowIndx = obj.rowIndx, rowIndxPage = rowIndx - offset;			
		}
		else {
			if (selectedCells.length > 0 && selectionModel.type=='cell') {
				var obj = selectedCells[selectedCells.length - 1], 
					rowIndx = obj.rowIndx, 
					rowIndxPage = rowIndx - offset,
					dataIndx=obj.dataIndx, 
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
			}
			else {
				return;
			}			
		}
        if (evt.keyCode == keyCodes.left) {
            var obj=that._decrIndx(rowIndxPage,colIndx);
            if(obj)that._setSelection({rowIndxPage:obj.rowIndxPage, colIndx:obj.colIndx, evt:evt});
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.right) {
            var obj=that._incrIndx(rowIndxPage,colIndx);
            if(obj)that._setSelection({rowIndxPage:obj.rowIndxPage, colIndx:obj.colIndx, evt:evt});
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.tab) {
			var obj;
            if (evt.shiftKey) {
				obj=that._decrIndx(rowIndxPage,colIndx);            
			} else {
            	obj=that._incrIndx(rowIndxPage,colIndx);            		
            }
            if(obj)that._setSelection({rowIndxPage:obj.rowIndxPage, colIndx:obj.colIndx, evt:evt});
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.up) {
            rowIndx = (rowIndxPage > 0) ? rowIndx - 1 : rowIndx;
            that._setSelection({rowIndx:rowIndx, colIndx:colIndx, evt:evt});
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.down) {
            rowIndx = (rowIndxPage < that.data.length - 1) ? (rowIndx + 1) : rowIndx;
            that._setSelection({rowIndx:rowIndx, colIndx:colIndx, evt:evt});
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.pageDown) {
			rowIndxPage = that.init + 10 ;            
            if (rowIndxPage > that.data.length - 1) {
                rowIndxPage = that.data.length - 1;				
            }
			var rowIndx = rowIndxPage + offset;
            that.$vscroll.pqScrollBar("option", "cur_pos", rowIndx).pqScrollBar("scroll");
            var $td = that.$tbl.find("tr[pq-row-indx=" + rowIndx + "]>td[pq-col-indx=" + colIndx + "]");
            that._setSelection({rowIndx:rowIndx, colIndx:colIndx, evt:evt});
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.pageUp) {
            rowIndxPage = that.init - 10;
            if (rowIndxPage < 0) {
                rowIndxPage = 0;
            }
			var rowIndx = rowIndxPage + offset;
            that.$vscroll.pqScrollBar("option", "cur_pos", rowIndx).pqScrollBar("scroll");
            var $td = that.$tbl.find("tr[pq-row-indx=" + rowIndx + "]>td[pq-col-indx=" + colIndx + "]");
            that._setSelection({rowIndx:rowIndx, colIndx:colIndx, evt:evt});
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.home) {
            rowIndx = 0 + offset;
            that._setSelection({rowIndx:rowIndx, colIndx:colIndx, evt:evt});
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.end) {
            rowIndx = that.data.length - 1 + offset;
            that._setSelection({rowIndx:rowIndx, colIndx:colIndx, evt:evt});
            evt.preventDefault();
            return;
        } else if (evt.keyCode == keyCodes.enter) {
			if(this.options.selectionModel.type=='row'){
				var $tr,$td;
				if(selectedRows.length>0){
					that._editFirstCellInRow({rowIndxPage:rowIndxPage});										
				}				
			}
			else{
				if (selectedCells.length > 0) {
					var $td = this.getCell({rowIndxPage:rowIndxPage,colIndx:colIndx});
					if($td && $td.length>0){
						if(this.isEditableCell({colIndx:colIndx})){
							that._editCell($td);
						}							
					}
				}				
			}			
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
        var len = (colIndx!=null) ? colIndx : this.colModel.length;
        for (var i = this.freezeCols; i < len; i++) {
            if (this.colModel[i].hidden) {
                num_hidden++;
            }
        }
        return num_hidden;
    }
    fn._setHScrollWidth = function () {
		if(!this.options.scrollModel.horizontal){
			this.$hscroll.css("visibility","hidden");
			this.$hvscroll.css("visibility","hidden");
			return;
		}
        var wd = this.$cont[0].offsetWidth;        
        if (this.numberCell) {
            wd -= this.numberCell_outerWidth;
        }
        for (var i = 0; i < this.freezeCols; i++) {						
            wd -= this.outerWidths[i];            
        }
        var width_vscroll = 0;
        if (this.$vscroll.css("display") == "none" || this.$vscroll.css("visibility") == "hidden") {
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
        var htSB = 17;
        if (this.$hscroll.css("visibility") == "hidden" || !this.options.scrollModel.horizontal) {
			htSB = 0;
		}
		this.$vscroll.css("bottom", htSB);
        this.$vscroll.pqScrollBar("option", "length", (ht - htSB));
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
		this.$header_o.height(this.$header_left.height()-2);
		var ht = (this.element[0].offsetHeight - this.$header_o[0].offsetHeight - this.$top[0].offsetHeight - this.$bottom[0].offsetHeight);
        this.$cont.height(ht + "px");
    }
	fn._setGridHeightFromTable=function(){
		if(this.$tbl){
			var htSB=17;
			if(this.$hscroll.css("visibility")=="hidden"){
				htSB=0;
			}
			var ht_tbl =this.$tbl[0].offsetHeight + htSB;
			this.$cont.height(ht_tbl + "px");
			var ht = (this.$header_o[0].offsetHeight + this.$top[0].offsetHeight + this.$bottom[0].offsetHeight+ ht_tbl);
			this.element.height(ht);
			this._setInnerGridHeight();
			this.$vscroll.css("visibility","hidden");			
		}		
	}
	fn._setGridWidthFromTable=function(){
		if(this.$tbl){
			var wdSB=17;
			if(this.$vscroll.css("visibility")=="hidden"){
				wdSB=0;
			}
			this.element.width((this.$tbl[0].offsetWidth + wdSB) + "px");	
		}		
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
        } 
		else if(this.options.flexHeight){
			this.init=0;
			this['final']=this.data.length-1;
		}
		else {
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
        var lft = ele.offsetLeft+ ((indx>this.options.freezeCols)?parseInt(this.$header[1].style.left):0);
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
		var $head = that.$header_left;
		if(indx>=this.options.freezeCols){
			$head = that.$header_right;
		}
        var $pQuery_drag = $head.find("div.pq-grid-col-resize-handle[pq-grid-col-indx=" + indx + "]");
        var $pQuery_col = $head.find("td.pq-grid-col[pq-grid-col-indx=" + indx + "]");
        var cont_left = $pQuery_col.offset().left + that.minWidth;
		var wdSB=17;
		if(this.options.flexHeight || this.$vscroll.css("visibility")=="hidden"){
			wdSB=0;
		}
        var cont_right = that.$cont.offset().left + that.$cont[0].offsetWidth - wdSB + 20; 
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
	fn.nestedCols=function(colMarr,_depth,_hidden){		
		var len=colMarr.length;
		var arr=[];
		if(_depth==null)_depth=1;
		var new_depth=_depth,colSpan=0,width=0,childCount=0;
		for(var i=0;i<len;i++){
			var colM=colMarr[i];
			if(_hidden==true){
				colM.hidden=_hidden;
			}			
			if(colM.colModel!=null){
				var obj=this.nestedCols(colM.colModel,_depth+1,colM.hidden);
				arr=arr.concat(obj.colModel);
				if(obj.colSpan>0){					
					if(obj.depth>new_depth){
						new_depth=obj.depth;
					}
					colM.colSpan=obj.colSpan;				
					colSpan+=obj.colSpan;
				}
				else{
					colM.colSpan=0;
					colM.hidden=true;
				}				
				colM.childCount=obj.childCount;
				childCount += obj.childCount;
			}
			else{				
				if (colM.hidden) {
					colM.colSpan=0;
				}
				else{
					colM.colSpan=1;
					colSpan++;																																	
				}
				colM.childCount=0;	
				childCount++;
				arr.push(colM);
			}			
		}		
		return {depth:new_depth,colModel:arr,colSpan:colSpan,width:width,childCount:childCount};
	}	
	fn.getHeadersCells=function(){
		var optColModel=this.options.colModel,
			thisColModelLength=this.colModel.length,
			depth=this.depth;
		var arr=[];		
		for(var row=0;row<depth;row++){
			arr[row]=[];
			var k=0;
			var colSpanSum=0,childCountSum=0;
			for(var col=0;col<thisColModelLength;col++){
				var colModel;
				if(row==0){
					colModel=optColModel[k];	
				}
				else{
					var parentColModel=arr[row-1][col];
					var children=parentColModel.colModel;
					if(children==null){
						colModel=parentColModel;
					}
					else{
						var diff=(col-parentColModel.leftPos);
						var colSpanSum2=0,childCountSum2=0;
						var tt=0;
						for(var t=0;t<children.length;t++){
							childCountSum2+=(children[t].childCount>0)?children[t].childCount:1;
							if(diff<childCountSum2){	
								tt=t;
								break;
							}
						}
						colModel=children[tt];
					}
				}				
				var childCount=(colModel.childCount)?colModel.childCount:1;											
				if(col==childCountSum){
					colModel.leftPos=col;
					arr[row][col]=colModel;
					childCountSum +=childCount;
					k++;	
				}		
				else{
					arr[row][col]=arr[row][col-1];
				}								
			}
		}
		this.headerCells=arr;
		return arr;
	}	
	fn.assignRowSpan=function(){
		var optColModel=this.options.colModel,
			thisColModelLength=this.colModel.length,
			headerCells=this.headerCells,
			depth=this.depth;
		for(var col=0;col<thisColModelLength;col++){
			for(var row=0;row<depth;row++){
				var colModel=headerCells[row][col];
				if(col>0 && colModel==headerCells[row][col-1]){
					continue;
				}
				else if(row>0 && colModel==headerCells[row-1][col]){
					continue;
				}				
				var rowSpan=1;
				for(var row2=row+1;row2<depth;row2++){
					var colModel2=headerCells[row2][col];
					if(colModel==colModel2){
						rowSpan++;
					}
				}	
				colModel.rowSpan=rowSpan;
			}
		}				
		return headerCells;
	}
	fn._refreshHeader=function(){
		var obj=this.nestedCols(this.options.colModel);
		this.colModel=obj.colModel;
		this.depth=obj.depth;
		this.getHeadersCells();
		this.assignRowSpan();		
	}
    fn._createHeader = function () {
        var that = this;
        var str = "<table class='pq-grid-header-table' cellpadding=0 cellspacing=0>";
        var hidearrHS1 = [];
		var optColModel=this.options.colModel,
			optColModelLength =optColModel.length,
			thisColModel=this.colModel,
			thisColModelLength=thisColModel.length,
			depth=this.depth,
			headerCells=this.headerCells;
		if(depth>=1){
			str += "<tr>";
	        if (this.numberCell) {
	            str += "<td style='width:" + this.numberCellWidth + "px;visibility:hidden;' ></td>";
	        }			
			for(var col=0;col<thisColModelLength;col++){
				var column=thisColModel[col];
				if(column.hidden){
					continue;
				}
				var wd=parseInt(column.width)-((this.columnBorders)?0:1);
				str+="<td style='width:"+ wd +"px;visibility:hidden;'></td>";
			}
			str += "</tr>";
		}
		for (var row = 0; row < depth; row++) {
			str += "<tr>";
	        if (row==0 && this.numberCell) {
	            str += "<td rowspan='"+depth+"'>\
				<div class='pq-grid-header-table-div'>&nbsp;</div></td>";
	        }
			for (var col = 0; col < thisColModelLength; col++) {
				var column= headerCells[row][col];
				var colSpan= column.colSpan;
				if(row>0 && column==headerCells[row-1][col]){
					continue;
				}
				else if(col>0 && column==headerCells[row][col-1]){
					continue;				
				}
				if (column.hidden) { 
					continue;
				}
				var cls = "pq-grid-col";
				if (column.align == "right") {
					cls += ' pq-align-right';
				}
				else 
					if (column.align == "center") {
						cls += ' pq-align-center';
					}
				if (col == that.freezeCols - 1 && depth==1) {
					cls += " pq-last-freeze-col";
				}
				var colIndx="",dataIndx="";
				if(column.colModel==null){
					colIndx="pq-grid-col-indx='" + col + "'";
				}
				str += "<td " + colIndx+ " "+ dataIndx +" class='" + cls + "' rowspan="+column.rowSpan+" colspan="+colSpan+">\
				<div class='pq-grid-header-table-div' >" +
				column.title +
				"<span class='pq-col-sort-icon'>&nbsp;</span></div></td>";
			}
			str += "</tr>";
		}
        str += "</table>";
        this.$header.empty();
        this.$header.append(str);
		var $header_left=$(this.$header[0]);
		var $header_right=$(this.$header[1]);
		var freezeCols=parseInt(this.options.freezeCols);
		var wd=this._calcWidthCols(freezeCols-1);
		$header_left.css({width:wd,zIndex:1});
		var lft=0;
		for(var i=freezeCols;i<(this.initH+freezeCols);i++){
			var column=thisColModel[i];
			if(column.hidden){
				continue;				
			}
			var oW=this.outerWidths[i];
			if(oW==null){
				throw("Assert: unknown width");
			}
			lft+=oW;
		}		
		$header_right.css({left:"-"+lft+"px"});
        this.$header.find("td").click(function () {
            if (!that.options.sortable) {
                return; 
            }
            var colIndx = $(this).attr("pq-grid-col-indx");
			if(colIndx==null){
				return;
			}
			var column=that.colModel[colIndx];			
            if (column.sortable==false) {
                return; 
            }			
			var dataIndx=column.dataIndx;
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
				keepSelection:true,
				fn: function(){
					that._trigger("sort", null, {
						dataModel: that.dataModel,
						data: that.data
					});
				}
			});
        })
        var lft = 0;
		var hd_ht=that.$header[0].offsetHeight;
		for(var i=0;i<this.colModel.length;i++){	
			var colModel=that.colModel[i];
            if (that.hidearrHS[i]) {
				continue;
            } else if (colModel.hidden) {
				continue;
            }
            if (colModel.resizable != undefined && colModel.resizable == false) {
				continue;
            }
			var $head=that.$header_left;
			if(i>=that.options.freezeCols){
				$head=that.$header_right;
			}
            var $handle = $("<div pq-grid-col-indx='" + i + "' class='pq-grid-col-resize-handle'>&nbsp;</div>")
				.appendTo($head);
            var pq_col = that.$header_right.find("td[pq-grid-col-indx=" + i + "]")[0];
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
                var colIndx = parseInt($target.attr("pq-grid-col-indx"));
				var column=that.colModel[colIndx];
				column.width=parseInt(column.width)+dx;
				that._computeOuterWidths(true);
                that._refresh();
            }
        });
    }
    fn._refreshHeaderSortIcons = function () {
        var DM = this.options.dataModel;
		if (DM.sortIndx == undefined) return;
        var $pQuery_cols = this.$header.find(".pq-grid-col");
        $pQuery_cols.removeClass("pq-col-sort-asc pq-col-sort-desc");
		var sortIndx=DM.sortIndx;
		var colIndx=this.getColIndxFromDataIndx(sortIndx);
		this.$header.find(".pq-grid-col[pq-grid-col-indx=" + colIndx + "]").addClass("pq-col-sort-" + (DM.sortDir == "up" ? "asc" : "desc"))
    }
    fn._generateTables = function () {
        var noColumns = this.colModel.length;
        var top = 0;
        this._bufferObj_calcInitFinal();
        var init = this.init,
            finall = this['final'],
			offset=this.getRowIndxOffset();			
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
        var const_cls = "pq-grid-cell ";
        if (this.columnBorders) const_cls += "pq-grid-td-border-right ";
        if (this.options.wrap == false) const_cls += "pq-wrap-text ";
        var buffer = ["<table style='table-layout:fixed;width:0px;position:absolute;top:0px;' cellpadding=0 cellspacing=0>"];
		var thisColModel=this.colModel;
        for (var row = init; row <= finall; row++) {
			var rowData=this.data[row],
				objPQData=rowData[rowData.length-1];
            var row_cls = "pq-grid-row";
            if (row / 2 == parseInt(row / 2)) row_cls += " pq-grid-oddRow";
			if(objPQData.pqData && objPQData.selectedRow){
				row_cls += " pq-row-select";
			}			
            var row_str = "<tr pq-row-indx='" + row + "' class='" + row_cls + "'>"
            buffer.push(row_str);
            if (this.numberCell) {
                buffer.push("<td style='width:" + this.numberCellWidth + "px;' class='pq-grid-number-cell pq-row-selector'>\
			<div class='pq-td-div'>" + (row + 1) + "</div></td>") 
            }
			var objRender={rowIndx:row+offset,rowIndxPage:row,rowData:rowData};
            var hidearrHS1 = [];
            for (var col = 0; col < noColumns; col++) {
				var column=thisColModel[col],
					dataIndx=column.dataIndx;
				objRender.column=column;
				objRender.colIndx=col;					
				{		
					var cellSelection=false;								
					var selectedDataIndices = objPQData.selectedDataIndices;
					if (selectedDataIndices) {						
						cellSelection = selectedDataIndices[dataIndx];													
					}
				}
                if (column.hidden) { 
                    continue;
                } else if (this.hidearrHS[col]) {
                    hidearrHS1.push(col)
                    continue;
                }
                var strStyle = "";
                if (row == init) { 
					strStyle = "width:" + column.width + "px;";
                }
                var cls = const_cls; 
                if (column.align == "right") {
                    cls += ' pq-align-right';
                } else if (column.align == "center") {
                    cls += ' pq-align-center';
                }
                if (col == this.freezeCols - 1 && this.columnBorders) {
                    cls += " pq-last-freeze-col";
                }
				if(column.className){
					cls = cls+ " "+column.className;
				}
				if(cellSelection){
					cls = cls+ " pq-cell-select";
				}
                var str = "<td class='" + cls + "' style='" + strStyle + "' pq-col-indx='" + col + "'>\
				" + this._renderCell(objRender) + "</td>";
                buffer.push(str)
            }
            for (var k = 0; k < hidearrHS1.length; k++) {
                var col = hidearrHS1[k];
				var column = thisColModel[col];
				objRender.column=column;
				objRender.colIndx=col;					
                var strStyle = "";
                if (row == init) {
					strStyle = "width:" + column.width + "px;";
                }
                strStyle += "visibility:hidden;";
                var cls = const_cls; 
                if (column.align == "right") {
                    cls += ' pq-align-right';
                } else if (column.align == "center") {
                    cls += ' pq-align-center';
                }
                var str = "<td class='" + cls + "' style='" + strStyle + "' pq-col-indx='" + col + "'>\
				" + this._renderCell(objRender) + "</td>";
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
				this.quitEditMode();
			}			
            this.$cont.empty();
            this.$tbl = $(str);
            this.$cont.append(this.$tbl)
        }
		var that=this;
		window.setTimeout(function(){
	        that._trigger("refresh", null, {
	            dataModel: that.dataModel,
	            data: that.data
	        });													
		},0);
    }
	fn._renderCell = function (objP) {	        
		var rowIndxPage=objP.rowIndxPage,
			rowIndx=objP.rowIndx,
			rowData=objP.rowData,
			colIndx=objP.colIndx,		
			$td=objP.$td,
			column=objP.column,
			customData=(objP.customData)?objP.customData:this.options.customData;
		var dataCell;
		var dataIndx=column.dataIndx;
        if (column.render) {            
            dataCell = column.render({
                data: this.data,
				dataModel: this.dataModel,
				rowData:rowData,
                rowIndxPage: rowIndxPage,
				rowIndx:rowIndx,
                colIndx: colIndx,
				column: column,
				dataIndx: dataIndx,
				customData:customData
            });
        }
		else{
			dataCell = rowData[dataIndx];
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
    fn._sortLocalData = function (dataIndx, dir, dataType) {
        var m_sort_dir = dir;
        var data = this.options.dataModel.data; 
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
                var val1 = (obj1[dataIndx]+"").replace(/,/g, ""); 
                var val2 = (obj2[dataIndx]+"").replace(/,/g, "");
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

// Limit scope pollution from any deprecated API
(function() {

var uaMatch, matched, browser;

// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
uaMatch = function( ua ) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};

matched = uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
	browser[ matched.browser ] = true;
	browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
	browser.webkit = true;
} else if ( browser.webkit ) {
	browser.safari = true;
}

jQuery.browser = browser;

})();
