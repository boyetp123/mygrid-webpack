import {Grid } from './mygrid/mygrid';
import {Observable } from 'rxjs';

// declare var console: any;
declare var fetch: any;

export class GridTest {
    atheleteColumnDefs: any = [
        {headerName: 'Athlete', field: 'athlete', width: '100px', sortable:true, sort: 'desc'},
        {headerName: 'Age', field: 'age', width: '90px' ,type:'number', sortable:true, format:'0'},
        {headerName: 'Country', field: 'country', width: '120px', sortable:true},
        {headerName: 'Year', field: 'year', width: '90px' ,type:'number', format:'0', sortable:true },
        {headerName: 'Date', field: 'date', width: '110px', type:'text', sortable:true},
        {headerName: 'Sport', field: 'sport', width: '200px'},
        {headerName: 'Gold', field: 'gold', width: '100px', type:'number', format:'0,0.00'},
        {headerName: 'Silver', field: 'silver', width: '100px', type:'number', format:'0,0.00'},
        {headerName: 'Bronze', field: 'bronze', width: '100px', type:'number', format:'0,0.00'},
        {headerName: 'Total', field: 'total', width: '100px', type:'number', format:'0,0.00'}
    ];
    filesColumnDefs: any = [
        {headerName: 'Name', field: 'name', width: '100px', sortable:true, sort: 'desc'},
        {headerName: 'Size', field: 'size', width: '90px' ,type:'number', sortable:true, format:'0'},
        {headerName: 'Type', field: 'type', width: '120px'},
        {headerName: 'Modified', field: 'dateModified', width: '90px' ,type:'text', format:'0' }
    ];
    gridOptions: any = {
        columnDefs: [],
        rowData: [],
        width:'800px',
        height:'400px',
        rowHeight:'40px',
        pinnedLeftCount:1,
        disableVerticalScroll:false,
        disableHorizontalScroll:false,
        onReady:function(api){
            // api.setDataRow( olympicAthletes );
        }
    };
    gridOptions2: any = {
        columnDefs: [],
        rowData: [],
        width:'800px',
        height:'400px',
        rowHeight:'40px',
        pinnedLeftCount:1,
        disableVerticalScroll:false,
        disableHorizontalScroll:false,
        onReady:function(api){
            // api.setDataRow( olympicAthletes );
        }
    };
    grid: Grid;
    grid2: Grid;
    constructor() {
        console.info('GridTest constructor');
        this.onReady({});
    }
    onReady(event) {
        console.info('GridTest onReady')
        // document.querySelector('#loadAthletes').addEventListener('click',this.loadAthletes.bind(this));
        // document.querySelector('#loadAthletesDef').addEventListener('click',this.loadAthletesDef.bind(this));
        // document.querySelector('#loadFilesDef').addEventListener('click',this.loadFilesDef.bind(this));
        // document.querySelector('#loadFiles').addEventListener('click',this.loadGroup.bind(this) );
        this.grid = new Grid('#mygrid-test', this.gridOptions);
        this.grid2 = new Grid('#mygrid-test2', this.gridOptions2);
        this.loadFilesDef();
        this.loadAthletesDef();
        this.loadGroup();
        this.loadAthletes();
    }
    loadAthletes() {
        fetch('/data/olympicAthletes.json')
        .then(response => response.json())
        .then(data => {
            this.gridOptions.api.setDataRow(data.data.slice(0,200) );
        }).catch(err => {
            console.error('fail',err);
        });
    }
    loadAthletesDef() {
        this.gridOptions.isGrouped = false;
        this.gridOptions.isDataAlreadyGrouped = false;
        this.gridOptions.api.setColumnDefs(this.atheleteColumnDefs );
        this.gridOptions.pinnedLeftCount = 1;
    }
    loadGroup() {
        fetch('/data/group.json')
        .then(response => response.json() )
        .then(data => {
            this.gridOptions2.api.setDataRow(data.data);
        } )
        .catch(err => {
            console.log('fail');
        });
    }
    loadFilesDef() {
        this.gridOptions2.isGrouped = true;
        this.gridOptions2.isDataAlreadyGrouped = true;
        this.gridOptions2.pinnedLeftCount=1;
        this.gridOptions2.api.setColumnDefs(this.filesColumnDefs);
    }
}
