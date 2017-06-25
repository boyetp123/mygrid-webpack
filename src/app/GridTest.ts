import {Grid } from './mygrid/mygrid';
// import {Observable } from 'rxjs';
declare var fetch: any;
declare var postMessage: any;

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
        {headerName: 'Name', field: 'name', width: '105px', sortable:true, sort: 'desc'},
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
        width:'400px',
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
    bigData: any;
    webWorker: any;

    constructor() {
        console.info('GridTest constructor');
        this.onReady({});
    }
    onReady(event) {
        console.info('GridTest onReady')
        document.querySelector('#loadWW').addEventListener('click',this.loadWebWorker.bind(this) );
        document.querySelector('#stopWW').addEventListener('click',this.stopWebWorker.bind(this) );        
        this.grid = new Grid('#mygrid-test', this.gridOptions);
        this.grid2 = new Grid('#mygrid-test2', this.gridOptions2);
        this.loadGroup();
        this.loadAthletes();
    }
    loadWebWorker() {
        // this.webWorker = this.wwLoader(this.sampleWebWorker);
        this.webWorker = new Worker(URL.createObjectURL(new Blob(['('+ this.sampleWebWorker +')()'])));
        this.webWorker.onmessage = this.acceptMessage;
        setTimeout(()=> {
            this.webWorker.postMessage('start the thread');
        },500);
    }
    // wwLoader (fn ) {
    //     return new Worker(URL.createObjectURL(new Blob(['('+ fn +')()'])));
    // }
    sampleWebWorker() {
        self.addEventListener('message', function( e ){
            console.info('message pass to start',e );
        });

        let ctr = 0;
        setInterval( () => {
            postMessage( 'count ' + ctr++ );
        },200);
    }
    stopWebWorker() {
        this.webWorker.terminate();
    }
    acceptMessage( msg ) {
        console.info('got message ', msg.data);
    }
    loadAthletes() {
        (new Promise( (resolve, reject) => {
            this.gridOptions.isGrouped = false;
            this.gridOptions.isDataAlreadyGrouped = false;
            this.gridOptions.api.setColumnDefs(this.atheleteColumnDefs );
            this.gridOptions.pinnedLeftCount = 1;
            resolve('definition-loded')
        })).then( result => {
            this.gridOptions.api.showBusyIcon();
            if (result === 'definition-loded' ) {
                return (new Promise( (resolve, reject) => {
                    fetch('/data/olympicAthletes.json')
                    .then(response => response.json())
                    .then(data => {
                        resolve(data);
                    }).catch(err => {
                        console.error('fail',err);
                        reject(err);
                    });
                }));
            }
        }).then( (result: any ) => {
            if (result) {
                this.bigData = result.data;
                this.gridOptions.api.setDataRow(result.data.slice(0,2000) );
                this.gridOptions.api.hideBusyIcon();
                
            }
        })
        // fetch('/data/olympicAthletes.json')
        // .then(response => response.json())
        // .then(data => {
        //     this.gridOptions.api.setDataRow(data.data.slice(0,200) );
        // }).catch(err => {
        //     console.error('fail',err);
        // });
    }
    // loadAthletesDef() {
        // this.gridOptions.isGrouped = false;
        // this.gridOptions.isDataAlreadyGrouped = false;
        // this.gridOptions.api.setColumnDefs(this.atheleteColumnDefs );
        // this.gridOptions.pinnedLeftCount = 1;
    // }
    loadGroup() {
        (new Promise( (resolve, reject) => {
            this.gridOptions2.isGrouped = true;
            this.gridOptions2.isDataAlreadyGrouped = true;
            this.gridOptions2.pinnedLeftCount=1;
            this.gridOptions2.api.setColumnDefs(this.filesColumnDefs);
            this.gridOptions2.api.showBusyIcon();
            resolve('definition-loded')
        })).then( result => {
            fetch('/data/group.json')
            .then(response => response.json() )
            .then(data => {
                this.gridOptions2.api.setDataRow(data.data);
                this.gridOptions2.api.hideBusyIcon();
            })
            .catch(err => {
                console.log('fail');
            });
        });
    }
    // loadFilesDef() {
    //     this.gridOptions2.isGrouped = true;
    //     this.gridOptions2.isDataAlreadyGrouped = true;
    //     this.gridOptions2.pinnedLeftCount=1;
    //     this.gridOptions2.api.setColumnDefs(this.filesColumnDefs);
    // }
}
