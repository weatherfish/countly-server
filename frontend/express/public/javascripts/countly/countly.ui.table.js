//"use strict";

var Column = FixedDataTable.Column;
var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;

var SortTypes = {
    ASC: 'ASC',
    DESC: 'DESC',
};

var SortTable = React.createClass({

    getInitialState() {

        var headers = JSON.parse(JSON.stringify(this.props.headers));

        headers.unshift({
            "title" : this.props.date_sign,
            //"help"  : "sessions.unique-sessions", // todo: add translate
            "short" : "date",
        })

        var rows = this.convert_data_rows(this.props.rows);

        return {
            sortBy  : 'date',
            sortDir : 'ASC',
            headers : headers,
            rows    : rows,
        };
    },

    componentWillMount: function() {

        $(event_emitter).on('granularity', function(e, granularity_type){

            var rows = this.props.data_function().get_current_data(granularity_type);
            var rows = this.convert_data_rows(rows);

            this.setState({
                rows : rows
            });

        }.bind(this));

        //$(event_emitter).on('date_choise', function(e, period){ // todo: rename to date_change
        $(event_emitter).on('granularity_data', function(e, data){

            var granularity = data.new_granularity;

            //console.log("==== date_choise ====", period);
            var rows = this.props.data_function().get_current_data(granularity);

            var rows = this.convert_data_rows(rows);

            this.setState({
                rows : rows
            });

        }.bind(this));

/*
        $(event_emitter).on('data_changed', function(e, data){

            this.update(-1, this.state.granularity_type);

        }.bind(this));*/
    },
/*
    componentWillUpdate : function()
    {

        console.log("+++++++++++++ will update ++++++++++++");

        if (this.props.filter)
        {
            if (!this.state.orig_rows)
            {
                var orig_rows = this.state.rows;
            }
/*
            this.setState({
                //orig_rows : orig_rows,
                rows : this.state.rows
            });*/
/*
        }

    },*/

    sort_rows_by(cellDataKey) {

        if (this.state.rows)
        {
            var rows = this.state.rows;
        }
        else
        {
            var rows = this.props.rows;
        }

        var sortDir = this.state.sortDir;
        var sortBy = cellDataKey;
        if (sortBy === this.state.sortBy) {
            sortDir = this.state.sortDir === SortTypes.ASC ? SortTypes.DESC : SortTypes.ASC;
        } else {
            sortDir = SortTypes.DESC;
        }

        console.log("sort by cellDataKey:", cellDataKey);

        //var rows = this.state.rows.slice();

        if (sortBy == "date")
        {

            var sort_by = "timestamp";

            rows.sort((a, b) => {

                var sortVal = 0;

                //console.log("a:", a, " : b :", b);

                if (a[sort_by] > b[sort_by]) {
                    sortVal = 1;
                }
                if (a[sort_by] < b[sort_by]) {
                    sortVal = -1;
                }

                if (sortDir === SortTypes.DESC) {
                    sortVal = sortVal * -1;
                }

                return sortVal;
            });
        }
        else
        {
            rows.sort((a, b) => {
                return this.props.sort_functions[sortBy](a, b, sortBy, sortDir);
            });
        }

        this.setState({
            rows,
            sortBy,
            sortDir,
        });
    },

    convert_data_rows : function(rows)
    {

        var converted_rows = [];

        for (var i = 0; i < rows[0].data.length; i++)
        {

            var date = rows.format_date(rows[0].data[i][0], rows[0].data[i][2]);

            date = date.split(" ");

            if (date.length == 3) // "1 Jan 2016" or "13:00"
            {
                date.pop(); // remove year
            }

            date = date.join(' ');

            converted_rows[i] = {
                "date" : date,
                "timestamp" : rows[0].data[i][0]
            };

            for (var j = 0; j < rows.length; j++)
            {
                converted_rows[i][rows[j].short] = rows[j].data[i][1];
            }
        }

        return converted_rows;

    },

    header_render(label, cellDataKey) {

        if (cellDataKey == this.state.sortBy && this.state.sortDir == "ASC")
        {
            var sort_icons = <div><div className="up_icon active"></div><div className="down_icon"></div></div>;
        }
        else if (cellDataKey == this.state.sortBy && this.state.sortDir == "DESC")
        {
            var sort_icons = <div><div className="up_icon"></div><div className="down_icon active"></div></div>;
        }
        else
        {
            var sort_icons = <div><div className="up_icon"></div><div className="down_icon"></div></div>;
        }

        //console.log("header_render label 1:", label);

        var label = label.toLowerCase().replace(/\w\S*/g, function(txt){
          //console.log("---> process txt -->>>", txt);
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });

        return (
            <div className="header_sort_button">
                <a onClick={this.sort_rows_by.bind(null, cellDataKey)}>{label}</a>
                {sort_icons}
            </div>
        );
    },

    row_getter : function(rowIndex) {

        var value = JSON.parse(JSON.stringify(this.state.rows[rowIndex]));
        return value;
    },

    columns_render : function(headers, sortDirArrow) {

        var self = this;

        return _.map(headers, function(header, id) {

            return <Column
                label =  {header.title + sortDirArrow}
                width = {self.props.width / headers.length}
                dataKey = {header.short}
                headerClassName = "table_header"
                footerClassName = "table_footer"
                cellClassName = "table_content"
                headerRenderer = {self.header_render}
                allowCellsRecycling={true}
                cellRenderer={self.cellRenderer}
            />
        });
    },

    cellRenderer : function(cellData, cellDataKey, rowData, rowIndex, columnData, width) {

        var class_name = "cell";

        if (this.state.sortBy == cellDataKey || this.state.sortBy == "date")
        {
            class_name += " sorted";
        }

        if (cellDataKey == "date" || cellDataKey == "timestamp")
        {
            return (
                <div className={class_name}>
                    {cellData}
                    <div className="border_right"></div>
                </div>
            );
        }

        if (Object.prototype.toString.call(cellData) === '[object Array]')
        {
            var cell_data = cellData[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var cell_label = cellData[1];
        }
        else
        {
            var cell_data = cellData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var cell_label = "";
        }

        return (
            <div className={class_name}>
                {cell_data}
                <span className="cell_label">{cell_label}</span>
                <div className="border_right"></div>
            </div>
        );

    },

    onCellMouseEnter : function(row_id, cell_id){

        if (cell_id == "date")
        {
            return false;
        }

        for (var i = 0; i < this.props.rows.length; i++)
        {
            if (this.props.rows[i].short == cell_id){

                var label = this.props.rows[i].label;
                break;
            }
        }

        var rows = this.state.rows;

        rows[row_id][cell_id] = [rows[row_id][cell_id], label];

        this.setState({ rows : rows })

    },

    onCellMouseLeave : function(row_id, cell_id){

        if (cell_id == "date")
        {
            return false;
        }

        var rows = this.state.rows;

        rows[row_id][cell_id] = rows[row_id][cell_id][0];

        this.setState({ rows : rows })
    },

    render() {

        var row_height = this.props.row_height;

        var sortDirArrow = '';

        if (this.state.sortDir !== null)
        {
            //sortDirArrow = this.state.sortDir === SortTypes.DESC ? ' ↓' : ' ↑';
            sortDirArrow = this.state.sortDir === SortTypes.DESC ? '.' + this.state.sortBy : '..' + this.state.sortBy;
        }

        var headers = this.state.headers;

        return (
            <Table
                rowHeight = {row_height}
                rowGetter = {this.row_getter}
                rowsCount = {this.state.rows.length}
                width     = {this.props.width}
                height    = {row_height * (this.state.rows.length + 1) + 2 }
                headerHeight = {row_height}
                onCellMouseEnter={this.onCellMouseEnter}
                onCellMouseLeave={this.onCellMouseLeave}
            >
                {this.columns_render(headers, sortDirArrow)}
            </Table>
        );
    }

});
