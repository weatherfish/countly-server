var TableFilter = React.createClass({

    getInitialState() {
        return {
            sortDir : null,
            export_open : false
        };
    },

    change_input: function(event) {
        var value = event.target.value;
        this.props.filter_function(value);
        this.setState({ value : value });
    },

    exportBlockClick : function(){

        this.setState({
            "export_open" : !this.state.export_open
        });
    },

    exportCSV : function(){

        console.log("============export =====");
        console.log(this.props);
        console.log("======= full_rows =========");
        console.log(this.props.full_rows);

        var filename = "test_file_name.csv"

        //return false;

        var processRow = function (row) {

                 var finalVal = '';
                 //for (var j = 0; j < row.length; j++) {
                //     var innerValue = row[j] === null ? '' : row[j].toString();
                for (var key in row) {

                    var innerValue = row[key] === null ? '' : row[key].toString();

                    if (row[key] instanceof Date) {
                         innerValue = row[key].toLocaleString();
                    };
                    var result = innerValue.replace(/"/g, '""');
                    if (result.search(/("|,|\n)/g) >= 0)
                         result = '"' + result + '"';
                    if (key > 0)
                         finalVal += ',';
                    finalVal += result;
               }

               return finalVal + '\n';
        };

        var csvFile = '';
        for (var i = 0; i < this.props.full_rows.length; i++) {
            csvFile += processRow(this.props.full_rows[i]);
        }

        console.log("-------- csv created ------------");

        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                  // Browsers that support HTML5 download attribute
                  var url = URL.createObjectURL(blob);
                  link.setAttribute("href", url);
                  link.setAttribute("download", filename);
                  link.style.visibility = 'hidden';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
            }
        }

        this.setState({
            "export_open" : false
        });
    },

    exportExcel : function(){

        // write an XLSX file
        var xlsxWriter = new SimpleExcel.Writer.XLSX();
        var xlsxSheet = new SimpleExcel.Sheet();
        var Cell = SimpleExcel.Cell;
        xlsxSheet.setRecord([
              [new Cell('ID', 'TEXT'), new Cell('Nama', 'TEXT'), new Cell('Kode Wilayah', 'TEXT')],
              [new Cell(1, 'NUMBER'), new Cell('Kab. Bogor', 'TEXT'), new Cell(1, 'NUMBER')],
              [new Cell(2, 'NUMBER'), new Cell('Kab. Cianjur', 'TEXT'), new Cell(1, 'NUMBER')],
              [new Cell(3, 'NUMBER'), new Cell('Kab. Sukabumi', 'TEXT'), new Cell(1, 'NUMBER')],
              [new Cell(4, 'NUMBER'), new Cell('Kab. Tasikmalaya', 'TEXT'), new Cell(2, 'NUMBER')]
        ]);
        xlsxWriter.insertSheet(xlsxSheet);
        // export when button clicked
        //document.getElementById('fileExport').addEventListener('click', function () {
        xlsxWriter.saveFile(); // pop! ("Save As" dialog appears)
        //});

        this.setState({
            "export_open" : false
        });

    },

    render() {

        var select_block_style = {};

        if (this.state.export_open)
        {
            select_block_style.display = "block";
        }
        else
        {
            select_block_style.display = "none";
        }

        return (
            <div className="table_filter_wrapper">
                <div className="export_block">
                    <div onClick={this.exportBlockClick}>
                        <span>Export Data</span>
                        <span className="triangle"></span>
                    </div>
                    <div className="save_as" style={select_block_style}>
                        <div onClick={this.exportCSV.bind(this)}><span className="icon csv"></span><span>Save to .CSV</span></div>
                        <div onClick={this.exportExcel.bind(this)}><span className="icon excel"></span><span>Save for Excel</span></div>
                    </div>
                </div>
                <div className="filter_block">
                    <div className="icon"></div>
                    <input type="search" className="table_filter" placeholder="Search the Data" onKeyUp={this.change_input}/>
                </div>
            </div>
        );
    },

});
