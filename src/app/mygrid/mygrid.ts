/*
	do sorting on the web workers
*/
/*
 import moment  from 'moment';
 import numeral from 'numeraljs';
 import $ from 'jquery';
*/
// import {ColumnDef, GridOptions, SortClasses, DefaultFormats, rowObject, 
// 		GridHdrClasses, HAlignmentClasses} from './mygridDefs';

import {ColumnDef, GridOptions, SortClasses, rowObject, 
		GridHdrClasses, HAlignmentClasses} from './mygridDefs';

declare var $: any;
declare var numeral: any;
declare var moment: any;
declare var postMessage: any;

export class Grid {
	gridContainer: any;
	gridOptions: GridOptions;
	tableBodyCenter: any;
	tableHeaderCenter: any;
	columnDefs: ColumnDef[];
	theGrid: any;
	gridHeader: any;
	gridBody: any;
	theGridTdCenterPane: any;
	theGridTdLeftPane: any;
	theGridCenter: any;
	headerContainerCenter: any;
	headerContainerInnerCenter: any;
	bodyContainerCenter: any;
	bodyContainerYscrollCenter: any;	
	busyLoader: any;

	theGridLeft: any;
	headerLeftPane: any;
	headerContainerLeft: any; 
	headerContainerInnerLeft: any; 
	tableHeaderLeft: any;
	
	bodyContainerLeft: any; 
	bodyContainerYscrollLeft: any; 
	tableBodyLeft: any;	
	hasInitCcompleted: boolean;
	sortWebWorker: any;
	// scrollbars
	hScrollBarContainer: any;
	hScrollBarContainerLeft: any;
	hScrollBarContainerCenter: any;
	hScrollBarContainerRight: any;

	constructor(selector:string, gridOptions:GridOptions ) {
		this.hasInitCcompleted = false;
		this.gridContainer = document.querySelector(selector);
		this.setUpProperties(gridOptions)
		this.createGridContainers();
		this.setUpGridDimensions();	
		this.render();
		this.setUpAPI();
		this.setEvents();

		if (this.gridOptions.onReady) {
			this.gridOptions.onReady(this.gridOptions.api);
		}
		this.hasInitCcompleted=true;
	}
	createGridContainers() {
		let innerHTMLs = ['<div class="mygrid">' ];
				innerHTMLs.push('<div class="mygrid-header">')

					innerHTMLs.push( '<table>' );
						innerHTMLs.push( '<tbody>' );
							innerHTMLs.push( '<tr>' );
								innerHTMLs.push( '<td class="left-pane" style="display:none">' );

									innerHTMLs.push( '<div class="mygrid-left">' );
										innerHTMLs.push( '<div class="mygrid-header">' );
											innerHTMLs.push( '<div class="mygrid-header-inner">' );
												innerHTMLs.push( '<table><thead><tr></tr></thead></table>' );
											innerHTMLs.push( '</div>' );
										innerHTMLs.push( '</div>' );
									innerHTMLs.push( '</div>' );
								
								innerHTMLs.push( '</td>' );
								innerHTMLs.push( '<td class="center-pane">' );

									innerHTMLs.push( '<div class="mygrid-center">' );	
										innerHTMLs.push( '<div class="mygrid-header">' );
											innerHTMLs.push( '<div class="mygrid-header-inner">' );
												innerHTMLs.push( '<table><thead><tr></tr></thead></table>' );
											innerHTMLs.push( '</div>' );
										innerHTMLs.push( '</div>' );
									innerHTMLs.push( '</div>' );

								innerHTMLs.push( '</td>' );
								innerHTMLs.push( '<td class="right-pane" style="display:none">' );
									innerHTMLs.push( '<div class="mygrid-right">' );	
										innerHTMLs.push( '<div class="mygrid-header">' );
											innerHTMLs.push( '<div class="mygrid-header-inner">' );
												innerHTMLs.push( '<table><thead><tr></tr></thead></table>' );
											innerHTMLs.push( '</div>' );
										innerHTMLs.push( '</div>' );
									innerHTMLs.push( '</div>' );

								innerHTMLs.push( '</td>' );
							innerHTMLs.push( '</tr>' );
						innerHTMLs.push( '</tbody>' );
					innerHTMLs.push( '</table>' );

				innerHTMLs.push('</div>')

				innerHTMLs.push('<div class="mygrid-scroll-container-body">')
					innerHTMLs.push( '<table>' );
						innerHTMLs.push( '<tbody>' );
							innerHTMLs.push( '<tr>' );
								innerHTMLs.push( '<td class="left-pane" style="display:none">' );
									innerHTMLs.push( '<div class="mygrid-left">' );	

										innerHTMLs.push( '<div class="mygrid-body">' );
											innerHTMLs.push( '<div class="mygrid-body-y-scroll">' );
												innerHTMLs.push( '<table><tbody></tbody></table>');
											innerHTMLs.push( '</div>' );
										innerHTMLs.push( '</div>' );
									innerHTMLs.push( '</div>' );									
								innerHTMLs.push( '</td>' );
								innerHTMLs.push( '<td class="center-pane">' );
									innerHTMLs.push( '<div class="mygrid-center">' );	

										innerHTMLs.push( '<div class="mygrid-body">' );
											innerHTMLs.push( '<div class="mygrid-body-y-scroll">' );
												innerHTMLs.push( '<table><tbody></tbody></table>');
											innerHTMLs.push( '</div>' );
										innerHTMLs.push( '</div>' );
									innerHTMLs.push( '</div>' );									
								innerHTMLs.push( '</td>' );
								innerHTMLs.push( '<td class="right-pane" style="display:none">' );
									innerHTMLs.push( '<div class="mygrid-right">' );	

										innerHTMLs.push( '<div class="mygrid-body">' );
											innerHTMLs.push( '<div class="mygrid-body-y-scroll">' );
												innerHTMLs.push( '<table><tbody></tbody></table>');
											innerHTMLs.push( '</div>' );
										innerHTMLs.push( '</div>' );
									innerHTMLs.push( '</div>' );									
								innerHTMLs.push( '</td>'	);
							innerHTMLs.push( '</tr>'	);	
						innerHTMLs.push( '</tbody>' );		
					innerHTMLs.push( '</table>' );
				innerHTMLs.push( '</div>' );	// <div class="mygrid-scroll-container-body">
				innerHTMLs.push( '<div class="mygrid-hscrollbar-container">' );
					innerHTMLs.push( '<div class="mygrid-hscrollbar-container-left"><div class="scroll-content">&nbsp;</div></div>' );
					innerHTMLs.push( '<div class="mygrid-hscrollbar-container-center"><div class="scroll-content">&nbsp;</div></div>' );
					innerHTMLs.push( '<div class="mygrid-hscrollbar-container-right"><div class="scroll-content">&nbsp;</div></div>' );
					// innerHTMLs.push('this will be the horizontal scroller')
				innerHTMLs.push( '</div>' );	// <div class="mygrid-scroller">
		innerHTMLs.push( '</div>');	

		this.gridContainer.innerHTML = innerHTMLs.join('');
		this.theGrid = this.gridContainer.querySelector('div.mygrid');
		this.gridHeader = this.theGrid.querySelector('.mygrid-header');
		this.gridBody = this.theGrid.querySelector('.mygrid-scroll-container-body');

		// header left pane
		this.headerLeftPane = this.gridHeader.querySelector('.left-pane'); 
		this.headerContainerLeft = this.headerLeftPane.querySelector('div.mygrid-header'); 
		this.headerContainerInnerLeft = this.headerContainerLeft.querySelector('div.mygrid-header-inner'); 
		this.tableHeaderLeft = this.headerContainerInnerLeft.querySelector('table > thead');

		// header center pane
		this.headerContainerCenter = this.gridHeader.querySelector('.center-pane div.mygrid-header'); 
		this.headerContainerInnerCenter = this.headerContainerCenter.querySelector('div.mygrid-header-inner'); 
		this.tableHeaderCenter = this.headerContainerInnerCenter.querySelector('table > thead');


		// body left pane
		this.theGridTdLeftPane  = this.gridBody.querySelector('td.left-pane');
		this.theGridLeft = this.theGridTdLeftPane.querySelector('div.mygrid-left');
		
		this.bodyContainerLeft = this.theGridLeft.querySelector('div.mygrid-body'); 
		this.bodyContainerYscrollLeft = this.bodyContainerLeft.querySelector('div.mygrid-body-y-scroll'); 
		this.tableBodyLeft = this.bodyContainerYscrollLeft.querySelector('table > tbody');		
		
		// body center pane
		this.theGridTdCenterPane  = this.gridBody.querySelector('td.center-pane');
		this.theGridCenter = this.theGridTdCenterPane.querySelector('div.mygrid-center');
		
		this.bodyContainerCenter = this.theGridCenter.querySelector('div.mygrid-body'); 
		this.bodyContainerYscrollCenter = this.bodyContainerCenter.querySelector('div.mygrid-body-y-scroll'); 
		this.tableBodyCenter = this.bodyContainerYscrollCenter.querySelector('table > tbody');

		// scrollbars
		this.hScrollBarContainer = this.theGrid.querySelector('div.mygrid-hscrollbar-container');
		this.hScrollBarContainerLeft = this.hScrollBarContainer.querySelector('.mygrid-hscrollbar-container-left');
		this.hScrollBarContainerCenter = this.hScrollBarContainer.querySelector('.mygrid-hscrollbar-container-center');
		this.hScrollBarContainerRight = this.hScrollBarContainer.querySelector('.mygrid-hscrollbar-container-right');		
	}
	setUpGridDimensions(): void {
		let scrollerBarWidth = 8;
		let gridOptions = this.gridOptions;
		let hScrollBarContainerHeight = this.hScrollBarContainer.offsetHeight;
		gridOptions.height = gridOptions.height || 'auto';
		this.theGrid.style.width = ((parseInt(gridOptions.width) + scrollerBarWidth) + 'px') || 'auto';
		// this.theGrid.style.height = !gridOptions.disableVerticalScroll ?( this.gridOptions.height || 'auto') : 'auto';
		
		if ( gridOptions.height !== 'auto' && !gridOptions.disableVerticalScroll) {
			let gridParamHeight = parseInt(gridOptions.height);
			let unit = gridOptions.height.replace('' + gridParamHeight, '');
			this.theGrid.style.height =  (gridParamHeight + hScrollBarContainerHeight) + unit;
		} else {
			this.theGrid.style.height = 'auto';
		}

		if (!gridOptions.disableVerticalScroll) {
			// let achars = this.gridOptions.height.regexp()
			let unit = 'px';
			this.theGrid.style.height = (hScrollBarContainerHeight + parseInt(this.gridOptions.height)) + unit;
		} else {
			this.theGrid.style.height = 'auto';
		}
		// this.theGrid.style.height = !gridOptions.disableVerticalScroll ?( this.gridOptions.height || 'auto') : 'auto';

		let totalGridWidth = this.theGrid.offsetWidth - scrollerBarWidth;
		// let pinnedLeftCount = this.gridOptions.pinnedLeftCount;
		let pinnedLeftCount = this.gridOptions.disableHorizontalScroll ? 0 :  this.gridOptions.pinnedLeftCount;;
		
		let totalLeftWidth = 0;
		if (pinnedLeftCount > 0 && this.columnDefs.length > 0 ) {
			this.theGridTdLeftPane.style.display = '';
			for(let i = 0; i <pinnedLeftCount ; i++) {
				totalLeftWidth = Number(this.columnDefs[i].width.replace('px','').replace('%',''));
			}
			this.theGridTdLeftPane.style.width =  (totalLeftWidth) + 'px';
			this.theGridLeft.style.width =  (totalLeftWidth) + 'px';
			this.headerContainerLeft.style.width =  (totalLeftWidth) + 'px';
			this.hScrollBarContainerLeft.style.width = (totalLeftWidth) + 'px';
			// this.bodyContainerLeft.style.width = (totalLeftWidth) + 'px';
		}
		this.theGridTdCenterPane.style.width =  (totalLeftWidth) + 'px';
		this.theGridCenter.style.width =  (totalGridWidth - totalLeftWidth) + 'px';
		this.headerContainerCenter.style.width =  (totalGridWidth - totalLeftWidth) + 'px';
		this.hScrollBarContainerCenter.style.width = (totalGridWidth - totalLeftWidth) + 'px';
		// this.bodyContainerCenter.style.width = (totalGridWidth - totalLeftWidth) + 'px';
		// this.hScrollBarContainerRight.style.width = 	
	}
	setUpProperties(gridOptions:GridOptions) {
		let icons = gridOptions.icons || {sortDescending:null,sortAscending:null, groupCollapsed:null, groupExpanded:null};		
		this.gridOptions = gridOptions;
		this.gridOptions.rowData = gridOptions.rowData || [];
		this.setColumnDefs(gridOptions.columnDefs);		
		this.gridOptions.rowHeight = gridOptions.rowHeight || '30px';
		this.gridOptions.pinnedLeftCount = gridOptions.pinnedLeftCount || 0;
		this.gridOptions.pinnedRightCount =  gridOptions.pinnedRightCount || 0;
		this.gridOptions.flexRow =  gridOptions.flexRow || false;
		this.gridOptions.disableVerticalScroll = gridOptions.disableVerticalScroll || false;
		this.gridOptions.disableHorizontalScroll = gridOptions.disableHorizontalScroll || false;
		this.gridOptions.disableSorting = gridOptions.disableSorting || true;
		this.gridOptions.equalRowHeights = gridOptions.equalRowHeights || false;
		this.gridOptions.isGrouped  = gridOptions.isGrouped || false;
		this.gridOptions.isDataAlreadyGrouped = gridOptions.isDataAlreadyGrouped || false;
		
		this.gridOptions.icons = {
			sortDescending: icons.sortDescending || '<span>&#x2193;</span>',
			sortAscending : icons.sortAscending  || '<span>&#x2191;</span>',
			groupCollapsed: icons.groupCollapsed || '', 
			groupExpanded : icons.groupExpanded  || ''
		}
		this.gridOptions.icons.sortDescending =  '<span class="'+ SortClasses.SORT_DESC +
				'" style="display:none">' + this.gridOptions.icons.sortDescending + '</span>';
		this.gridOptions.icons.sortAscending =  '<span class="'+ SortClasses.SORT_ASC +
				'" style="display:none">' + this.gridOptions.icons.sortAscending + '</span>';
	}
	setUpAPI() {
		this.gridOptions.api = {
			setDataRow : this.setDataRow.bind(this),
			setColumnDefs : this.setColumnDefs.bind(this),
			showBusyIcon: this.showBusyIcon.bind(this),
			hideBusyIcon: this.hideBusyIcon.bind(this),
			setSortFun: this.setSortFun.bind(this)
		};		
	}
	setColumnDefs(colDefs:ColumnDef[]) {
		this.columnDefs=[];
		this.columnDefs = colDefs.map(function(colDef:ColumnDef) {
			return new ColumnDef( colDef.field,
						colDef.headerName , 
						colDef.type ,
						colDef.format ,
						colDef.cellFormatter ,
						colDef.headerCellFormatter,
						colDef.sortable ,
						colDef.width,
						colDef.headerClasses ,
						colDef.cellClasses
					);
		});
		if (this.hasInitCcompleted) {
			this.setUpGridDimensions();
			this.render();
		}
	}	
	createHeader() {
		let arrCenter:Array<string> = [];
		let arrLeft:Array<string> = [];
		let pinnedLeftCount = this.gridOptions.disableHorizontalScroll ? 0 :  this.gridOptions.pinnedLeftCount;
		
		if (this.gridOptions.columnDefs) {			
			this.columnDefs.forEach( (colDef, colIdx) => {
				if (pinnedLeftCount - 1 >= colIdx) {
					arrLeft.push( this.createHeaderCell(colDef, colIdx));
				} else {
					arrCenter.push( this.createHeaderCell(colDef, colIdx));
				}
			},this);
		}
		// console.info('arrLeft.length ',arrLeft.length , arrLeft)
		if (arrLeft.length > 0) {
			this.showElement(this.headerLeftPane);
			this.tableHeaderLeft.innerHTML = '<tr>' + arrLeft.join('') + '</tr>';
		} 
		this.tableHeaderCenter.innerHTML = '<tr>' + arrCenter.join('') + '</tr>';
		
		if (!this.gridOptions.disableVerticalScroll) {
			this.gridBody.style.height = ( this.theGrid.offsetHeight 
											- this.gridHeader.offsetHeight 
											- this.hScrollBarContainer.offsetHeight ) + 'px';
		} else {
			this.gridBody.style.height = this.bodyContainerCenter.style.height ='auto';
		}
	}
	createHeaderCell( colDef:ColumnDef, colIdx:number ) {
		let styleArr:Array<string> = [];
		let classArr:Array<string> = [ GridHdrClasses.GRID_HDR_CELL ];
		let icons = this.gridOptions.icons;
		let val = (colDef.headerName || colDef.field);
	
		let params = {
			colIndex:colIdx,
			classes : classArr,
			colDef:colDef
		};
		
		if (colDef.width) {
			styleArr.push('width:'+colDef.width + '');
		}
		classArr.push( HAlignmentClasses[colDef.type.toUpperCase() ] );
		if (colDef.sortable) {
			classArr.push( SortClasses.SORTABLE  );
		}
		if (colDef.hasOwnProperty('headerCellFormatter') && typeof(colDef.headerCellFormatter) === 'function' ) {
			val = colDef.headerCellFormatter(params);
			classArr = params.classes;	
		}
		return '<th class="' + classArr.join(' ') + '" style="' +styleArr.join(';')+ '" col-idx="'+colIdx+'">'+
					'<div style="' +styleArr.join(';')+ '" >'+ 
						'<span>'+ val + '</span>' + '<span class="' + SortClasses.SORTABLE + '">' + 
							icons.sortDescending + icons.sortAscending + '</span>' +
					'</div>'+
				'</th>';
	}	
	createDataCell(rowObj: rowObject, colDef: ColumnDef,
				rowIndex: number, colIndex: number, isFirst: boolean,
				rowGroupLevel: number): string {
		let row = rowObj.data || rowObj;
		let val = row.hasOwnProperty(colDef.field)  ? row[ <string>colDef.field ]: '';
		let styleArr:Array<string> = [];
		let styleArrDiv:Array<string> = [];
		let classArr:Array<string> = ['grid-cell'];
		let isGrouped = rowObj.group && this.gridOptions.isGrouped;
		let isDataAlreadyGrouped = this.gridOptions.isDataAlreadyGrouped;
		let groupedIcon = '';

		if (isGrouped && isDataAlreadyGrouped && colIndex ===0) {
			let groupCollapsed = '<div class="group-collapse" style="display:'+ 
				( !rowObj.expanded?'':'none' ) +'">' + this.gridOptions.icons.groupCollapsed + '</div>'; 
			let groupExpanded =  '<div class="group-expand" style="display:'+(rowObj.expanded?'':'none')+'">' + 
								this.gridOptions.icons.groupExpanded + '</div>' ;
			groupedIcon = '<div class="grouped-icons">' + groupCollapsed + groupExpanded  + '</div>';
		} 
		if (colDef.width) {
			styleArr.push('width:'+colDef.width + '');
			styleArrDiv.push('width:'+colDef.width + '');
		}
		if (isFirst && this.gridOptions.rowHeight) {
			styleArr.push('height:'+this.gridOptions.rowHeight);

			// if (isGrouped && isDataAlreadyGrouped && colIndex ===0) {
			if (isDataAlreadyGrouped && colIndex ===0) {
				styleArr.push('padding-left:' + (3 + (rowGroupLevel * 5)) + 'px');
			}
		}
		classArr.push( HAlignmentClasses[colDef.type.toUpperCase() ]);
		let params = {
			data:row,
			rowIndex:rowIndex,
			colIndex:colIndex,
			classes : classArr,
			colDef:colDef
		};
		// types		
		if (colDef.hasOwnProperty('cellFormatter') && typeof(colDef.cellFormatter) === 'function' ) {
			val = colDef.cellFormatter(params);
			classArr = params.classes;
		} else if (row.hasOwnProperty(colDef.field) ) {
			if (colDef.type === 'number') {
				val = numeral(val).format( colDef.format);
			} else if (colDef.type === 'date') {
				val = moment(val).format( colDef.format );
			} else if (colDef.type === 'datetime') {
				val = moment(val).format( colDef.format);
			} 
		}
		// cellclasses
		if (colDef.hasOwnProperty('cellClasses') && colDef.cellClasses) {
			if ( typeof(colDef.cellClasses) === 'function' ) {
				classArr.push(colDef.cellClasses( params ));
			} else {
				classArr.push(colDef.cellClasses);
			}
		}
		return  '<td class="' + classArr.join(' ') + '" style="'+ styleArr.join(';') +'" col-idx="' +colIndex+ '">'+
					'<div style="'+ styleArr.join(';') +'">' + 
						groupedIcon + val +
					 '</div>'+
				'</td>';
	}
	createDataRow(row:any, rowIndex:number, rowGroupLevel:number, parentRowIndex:number, parentId:string) {
		let styleArr:Array<string> = [];
		let arrCenter:Array<string> = [];
		let arrLeft:Array<string> = [];
		let pinnedLeftCount = this.gridOptions.disableHorizontalScroll ? 0 :  this.gridOptions.pinnedLeftCount;;
		let returnObj:any = {};
		let rowStr = '';
		parentId = parentId || '';
	    let pid = (parentId ? parentId + '-' : '') + row.level + '|' + row.childIndex;
	
		this.columnDefs.forEach((colDef, colIdx) => {
			let rowData = row;
			if (pinnedLeftCount - 1 >= colIdx ) {
				rowStr = this.createDataCell(rowData, colDef, rowIndex, colIdx , colIdx === 0, rowGroupLevel);			
				arrLeft.push( rowStr );
			} else {
				rowStr = this.createDataCell(rowData, colDef, rowIndex, colIdx , (colIdx - pinnedLeftCount) === 0, rowGroupLevel );			
				arrCenter.push( rowStr );
			}
		},this);			
		
		if (arrCenter.length > 0) {
			returnObj.center ='<tr pid="'+ pid +'" style="'+styleArr.join(';')+'" pr-idx="'+ parentRowIndex +
							'" lvl="'+ rowGroupLevel +'" r-idx="'+rowIndex+'">' + arrCenter.join('') +'</tr>';
		}
		if (arrLeft.length > 0) {
			returnObj.left ='<tr pid="'+ pid +'" style="'+styleArr.join(';')+'" pr-idx="'+ parentRowIndex +
							'" lvl="'+ rowGroupLevel +'"  r-idx="'+rowIndex+'">' + arrLeft.join('') +'</tr>';
		}
		return 	returnObj;	
	}
	renderChildrenDataRows(rowData:any, rowGroupLevel:number, parentRowIndex:number, pid:string ) {
		let arrCenter:Array<string> = [];
		let arrLeft:Array<string> = [];

		rowData.children.forEach( (row:any, rowIndex:number) => {
			let obj = this.createDataRow(row, rowIndex, rowGroupLevel, parentRowIndex, pid);

			if (obj.center) {
				arrCenter.push(obj.center)
			} 
			if (obj.left) {
				arrLeft.push(obj.left)
			}
		}, this);
				
		if (arrLeft.length > 0) {
			$(this.tableBodyLeft).find('tr[pid="'+ pid +'"]').after( arrLeft.join('') );
		}
		$(this.tableBodyCenter).find('tr[pid="'+ pid  +'"]').after(arrCenter.join(''));

		if (this.gridOptions.equalRowHeights === true) {
			this.equalizeBodyHeights();
		}
	}	
	equalizeBodyHeights(): void {
		let pinnedLeftCount = this.gridOptions.pinnedLeftCount
		let centerColStartIdx=pinnedLeftCount;
		let tdsLeft = Array.prototype.slice.call( this.tableBodyLeft.querySelectorAll('tbody > tr > td[col-idx="0"]') , 0 );
		let tdsCenter = Array.prototype.slice.call(this.tableBodyCenter.querySelectorAll('tbody > tr > td[col-idx="'+centerColStartIdx+'"]'), 0);
		let len = tdsLeft.length;
		// let startTime = (new Date()).getTime();
		for(let i=0; i < len; i++) {
			let tdleft = tdsLeft[i];
			let tdCenter = tdsCenter[i];
			let lH = tdleft.offsetHeight ;
			let cH = tdCenter.offsetHeight;
			
			if (tdleft && tdCenter && lH !== cH ) {
				// console.info('equalizing height');
				let maxHeight = Math.max( cH , lH );
				tdleft.style.height =  tdCenter.style.height = maxHeight + 'px';
			}
		}
		// let endTime = (new Date()).getTime();
		// console.info('using array total time for ' + len + ' records ' + ( (endTime - startTime)/1000 ) + ' secs');
	}
	initSortWebWorker(): void {
		let self: any;
		let sortFun = () => {
			let sortFunc2: any, sortFunc: any, fparams: any;

			self.addEventListener('message', ( e ) => {
				// console.info('message past to start sorting', e.data );
				let data = e.data ;
				let sortedData;
				if (data.message === 'sort') {
					sortFunc2 = sortFunc(e.data);	
					console.info('message past to start sorting', e.data, 'sortFunc2', sortFunc2 );
					sortedData = data.rowData.sort(sortFunc2);					
					postMessage({sortedData: sortedData });
				} else if (data.message === 'setSortFunction') {
					let str: string = data.sortFunc;
					fparams = str.match(/\(.*\)/g)[0].replace(/\(|\)/g,'').split(',');
					let fbody = str.substring( str.indexOf('{') + 1, str.lastIndexOf('}') ).trim();
					// sortFunc = new Function(fparams[0], fparams[1], fbody);
					sortFunc = new Function(fparams[0], fbody);
					postMessage({ });
				}
			});
		}
		let strFun = '('+ sortFun +')()';
        this.sortWebWorker = new Worker(URL.createObjectURL(new Blob([strFun])));
        this.sortWebWorker.onmessage = this.onSortDone.bind(this);
	}
	onSortDone( msg ): void {
		// console.info('onSortDone', msg.data )
		if ( msg.data && msg.data.sortedData ) {
			this.setDataRow( msg.data.sortedData );			
		}
		this.hideBusyIcon();
	}
	setSortFun(fun: any = null): void { // if passed null, it will use the default sort function
		this.gridOptions.onSort = fun;
		if (this.gridOptions.sortOnWebWorker){
			let sortFun = this.gridOptions.onSort ? this.gridOptions.onSort : this.sortDefaultFun;
			let param = { message:'setSortFunction', sortFunc: sortFun.toString() };
			setTimeout( () => {
				this.sortWebWorker.postMessage( param );
			},10);	
		}
	}
	sortDefaultFun( params: any ): any {
		let field:string = params.field;
		let sortDir:string = params.sortingDir;

		return (a, b) => {
			let retval = 0;
			if (sortDir === 'asc') {
				if (a[field] > b[field]) {
					retval = 1;
				} else if (a[field] < b[field]) {
					retval = -1;
				} 
			} else {
				if (a[field] > b[field]) {
					retval = -1;
				} else if (a[field] < b[field]) {
					retval = 1;
				}	
			}
			return retval;
		};
		// return sortFun; 
	}
	removeData(startRow = 0, endRow = 0): void {
		if (startRow === 0 && endRow === 0) {
			this.gridOptions.rowData = [];
			this.tableBodyLeft.innerHTML = '';
			this.tableBodyCenter.innerHTML = '';
		} else {
			// remove the rows here
		}
	}
	createBodyData(rowData:any, rowGroupLevel:number, parentRowIndex:number, parentId:string): void {
		let arrCenter:Array<string> = [];
		let arrLeft:Array<string> = [];
		let startRowIndex = this.gridOptions.rowData.length;

		rowData.forEach( (row:any, rowIndex:number) => {
			let obj = this.createDataRow(row, startRowIndex + rowIndex, rowGroupLevel, parentRowIndex, parentId);

			if (obj.center) {
				arrCenter.push(obj.center)
			} 
			if (obj.left) {
				arrLeft.push(obj.left)
			}
		});	
				
		if (arrLeft.length > 0) {
			this.tableBodyLeft.innerHTML += arrLeft.join('');
			this.hScrollBarContainerLeft.querySelector('.scroll-content').style.width = this.tableBodyLeft.offsetWidth + 'px';
			
		}
		this.tableBodyCenter.innerHTML += arrCenter.join('');
		this.hScrollBarContainerCenter.querySelector('.scroll-content').style.width = this.tableBodyCenter.offsetWidth + 'px';

		if (this.gridOptions.equalRowHeights === true) {
			this.equalizeBodyHeights();
		}
	}
	alignHeadersAndDataCellsColumnWidths():void {
		this.columnDefs.forEach( (columnDef, idx, arr) => {
			if (columnDef.width === 'auto') {
				let th = this.tableHeaderCenter.querySelector('th[col-idx="'+idx+'"]');
				let td = this.tableBodyCenter.querySelector('td[col-idx="'+idx+'"]');
				td.style.width = th.style.width ='auto';
				let maxWidth = Math.max(th.offsetWdth, td.offsetWdth);
				td.style.width = th.style.width = maxWidth + 'px';
			}
		});	
	}
	alignDataRowHeights(): void {

	}
	render(): void {
		this.createHeader();
		if (this.gridOptions.rowData.length > 0) {
			this.createBodyData(this.gridOptions.rowData, 0, 0, '');
			this.alignHeadersAndDataCellsColumnWidths();
		}
	}
	getRowDataObj(level:number, rowIndex:number, parentRowIndex:number, trDomElem:any, parentId:string) {
		let levelRows:any = parentId.split('-');
		let out:any = this.gridOptions.rowData;

		for (let i=0; i < levelRows.length; i++) {
			let lr = levelRows[ i ].split('|');
			if (  out.children ) {
				out = out.children[ Number( lr[1] ) ];
			} else {
				out = out[ Number( lr[1] ) ];
			}
		}
		return out;
	}
	expandCollapseChildren(obj) {
		let pid = obj.trDomElem.getAttribute('pid');

		if (obj.isExpand) {
			let row = this.getRowDataObj(obj.level, obj.rowIndex, obj.parentRowIndex, obj.trDomElem, pid);
			this.renderChildrenDataRows(row, obj.level + 1, obj.rowIndex, pid);
		} else {
			this.removeChildrenDataRows(obj.rowIndex , obj.level + 1,pid);
		}
	}
	removeChildrenDataRows(rowIndex, lvl, pid) {
		$(this.tableBodyLeft).find('tr[pid^="'+ pid  +'-"]').remove();
		$(this.tableBodyCenter).find('tr[pid^="'+ pid  +'-"]').remove();
	}
	processData(rows, parentNode, level) {
		return rows.map((row, idx) => {
			row.parent = parentNode;
			row.level = level;
			row.childIndex = idx;

			if ( typeof(row.children) !== undefined &&  row.children instanceof Array ) {
				let children = this.processData(row.children, row, level + 1);
				row.children = children;
			}
			return row;
		});
	}
	setDataRow(dataRow) {
		if (dataRow.length > 0) {
			// this.gridOptions.rowData = dataRow;
			this.removeData(0, 0);
			// this.gridOptions.rowData = dataRow; //.slice(0,200) ;	
			let processedRows = this.processData(dataRow, null, 0);
			this.createBodyData(processedRows, 0, 0, '');
			this.gridOptions.rowData =  processedRows
			this.alignHeadersAndDataCellsColumnWidths();
		}
	}
	appenDataRow(dataRow) {
		if (dataRow.length > 0) {
			let addedRows = this.processData(dataRow, null, 0);
			this.createBodyData( addedRows, 0, 0, '');		
			this.gridOptions.rowData =  this.gridOptions.rowData.concat( );
			this.alignHeadersAndDataCellsColumnWidths();
		}
	}
	setEvents() {
		let currentLeft = 0;
		let headerContainerInner = this.headerContainerInnerCenter;

		if (this.gridOptions.sortOnWebWorker) {
			this.initSortWebWorker();			
		}
		this.setSortFun();

		let onScrollEvent = function(event) {
			let scrollLeft = event.currentTarget.scrollLeft;
			// if ( currentLeft !== scrollLeft ) {
				currentLeft = scrollLeft;
				headerContainerInner.style.left = (scrollLeft  * -1 ) + 'px';
			// }
		}
		this.bodyContainerCenter.addEventListener("scroll",onScrollEvent.bind(this)); 
		let sortingDir = '';

		let onClickHeader = function(event ) {
			let target = event.target;
			let th = $(target).parents('th')[0];
			let colIdx = Number(th.getAttribute('col-idx'));
			let columnDef = this.columnDefs[colIdx];
			sortingDir = sortingDir === 'asc' ? 'desc' : 'asc';

			if (columnDef.sortable) {
				this.showBusyIcon();
				// let startTime = Date.now();
				let ascDesc = '.' + SortClasses.SORT_ASC +', .' +  SortClasses.SORT_DESC;
				$(this.headerContainerInnerLeft).find(ascDesc).hide();
				$(this.headerContainerInnerCenter).find(ascDesc).hide();

				if (sortingDir === 'asc') {
					$(th).find('.' + SortClasses.SORT_ASC ).show();
				} else {
					$(th).find('.' + SortClasses.SORT_DESC).show();
				}

				let param = {message:'sort', rowData: this.gridOptions.rowData ,field: columnDef.field, sortingDir };
				if (this.gridOptions.sortOnWebWorker) {
					setTimeout( () => {
						this.sortWebWorker.postMessage( param );
					},10);
				} else {
					let sortedData: any, sortFun: any;

					if (this.gridOptions.onSort) {
						sortFun = this.gridOptions.onSort(param);
					} else {
						sortFun = this.sortDefaultFun(param);
					}
					(new Promise( (resolve, reject) => {
						console.log('sorting data start')
						sortedData = this.gridOptions.rowData.sort(sortFun);
						console.log('sorting data done')
						resolve(sortedData);				
					})).then( (data: any) => {
						new Promise((resolve, reject) => {
							console.log('injecting new sorted data')
							this.setDataRow( data );
							resolve('ok');						
						})
					}).then( () => {
						console.log('hideBusyIcon')
						this.hideBusyIcon();						
					})
					// console.info( 'sorting time elapse ', ( Date.now() - startTime ), 'ms' );
				}
			}
		}
		this.gridBody.addEventListener('click',this.onBodyClick.bind(this));
		this.headerContainerInnerLeft.addEventListener("click",onClickHeader.bind(this));
		this.headerContainerInnerCenter.addEventListener("click",onClickHeader.bind(this));
	}
	showBusyIcon(): void {
		// console.info('showBusyIcon')
		// setTimeout( ()=> {
			if (!this.busyLoader) {
				this.busyLoader = document.createElement('DIV');
				this.busyLoader.className = "loading-animator";
				this.theGrid.appendChild( this.busyLoader );
			}
			this.showElement( this.busyLoader );
		// }, 0);
	}
	hideBusyIcon( ):void {
		// console.info('hideBusyIcon')
		setTimeout( ()=> {
			this.hideElement( this.busyLoader );
		}, 10);
	}
	showElement(el) {
		if (el) {
			el.style.display = '';
		}
	}
	hideElement(el) {
		if (el) {
			el.style.display = 'none';
		}		
	}
	parent( elem, until ) {
		until = until || '';
		if (elem && (elem.tagName || '').toUpperCase() === until.toUpperCase() ) {
			return elem;
		} else if (elem && elem.parentNode) {
			return this.parent(elem.parentNode, until);
		}
		return null;
	}
	onBodyClick(event) {
		let target = event.target;

		if (target) {
			let $target = $(target);
			let $tr = $(target).parents('tr');
			// let tr = this.parent(target,'tr');
			if ($target.parents('.grouped-icons').length > 0  ) {
				let p = target.parentNode;
				let p2  = p.parentNode;
				let isExpand = false;
				if (p.classList.contains('group-collapse') || target.classList.contains('group-collapse') ) { // to expand
					this.hideElement(p2.querySelector('.group-collapse'));
					this.showElement(p2.querySelector('.group-expand'));
					isExpand=true;
				} else if (p.classList.contains('group-expand') || target.classList.contains('group-expand') ) { // to collapsed
					this.showElement(p2.querySelector('.group-collapse'));
					this.hideElement(p2.querySelector('.group-expand'));
					isExpand=false;
				}
				let $tr1 = $($tr[0]);
				let level = Number($tr1.attr('lvl') || '0');
				let rIndex = Number($tr1.attr('r-idx') || '0');
				let prIndex = Number($tr1.attr('pr-idx') || '0');
				this.expandCollapseChildren({isExpand:isExpand,level:level, rowIndex:rIndex, parentRowIndex:prIndex, trDomElem:$tr[0]});
			}
		}
	}
}
