/*
interface Map<K, V> {
    clear(): void;
    delete(key: K): boolean;
    // entries(): IterableIterator<[K, V]>;
    forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(key: K): V;
    has(key: K): boolean;
    // keys(): IterableIterator<K>;
    set(key: K, value?: V): Map<K, V>;
    size: number;
    // values(): IterableIterator<V>;
    // [Symbol.iterator]():IterableIterator<[K,V]>;
    // [Symbol.toStringTag]: string;
}

interface MapConstructor {
    new <K, V>(): Map<K, V>;
    // new <K, V>(iterable: Iterable<[K, V]>): Map<K, V>;
    prototype: Map<any, any>;
}
declare var Map: MapConstructor;

var AlignmentClasses = new Map();
AlignmentClasses.set("NUMBER",'text-right');
AlignmentClasses.set("TEXT",'text-left');
AlignmentClasses.set("DATE",'text-center');
*/

export let HAlignmentClasses = {
	NUMBER : 'text-right',
	TEXT : 'text-left',
	DATE : 'text-center',
	DATETIME : 'text-center'
};

export let GridHdrClasses = {
	GRID_HDR_CELL : 'grid-hdr-cell'
};

export let SortClasses = Object.freeze({
	SORT_DESC  : 'sort-descending',
	SORT_ASC   : 'sort-ascending',
	SORT_ICONS : 'sort-icons',
	SORTABLE   : 'sortable'
});

export let DefaultFormats = Object.freeze({
	NUMBER : '0,0.0000',
	TEXT : '',
	DATE : 'MM/DD/YYYY',
	DATETIME :'MM/DD/YYYY h:mm:ss'	
});

export interface IIcons {
	sortDescending:string,
	sortAscending:string,
	groupCollapsed:string, 
	groupExpanded:string	
}

export interface GridOptions {
	columnDefs: Array<ColumnDef>,
	rowData: Array<Object>,
	pinnedLeftCount?:number,
	pinnedRightCount?:number,
	// events: Object
	width: string,
	height: string,
	api:Object,
	onReady?:Function,
	onSort?:Function,
	rowHeight:string,
	flexRow?:boolean,
	disableVerticalScroll?:boolean,
	disableHorizontalScroll?:boolean,
	disableSorting?:boolean,
	icons:IIcons,
	equalRowHeights:boolean,
	isGrouped:boolean,
	isDataAlreadyGrouped:boolean
}

// tslint:disable-next-line:class-name
export interface rowObject {
	data: any,
	group: boolean,
	expanded: boolean,
	children: Array<Object>,
	parent: any
}
export class ColumnDef {
	field: string;
	headerName: string; 
	type:string='text';
	format: string;
	cellFormatter: Function;
	headerCellFormatter: Function;
	sortable: boolean;
	width: string='auto';    // string like '100px' or '100%' or auto
	headerClasses: any;  // string or function that return string
	cellClasses: any;   // string or function that return string
		
	constructor(field: string,	
				headerName:string, 
				type = 'text', 
				format?: string, 
				cellFormatter: Function=null, 
				headerCellFormatter: Function=null,
				sortable = false,
				width = 'auto',   
				headerClasses?: any, 
				cellClasses?: any) {
		this.field = field;
		this.headerName = headerName; 
		this.type = type;
		this.format = format || DefaultFormats[ type.toLowerCase() ];
		this.cellFormatter = cellFormatter;
		this.sortable = sortable || false;
		this.width  = width;    
		this.headerClasses = headerClasses;  
		this.cellClasses =cellClasses;   					
	}
}
