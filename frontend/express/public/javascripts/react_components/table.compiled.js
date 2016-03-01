"use strict";

var Column = FixedDataTable.Column;
var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;

var SortTypes = {
    ASC: 'ASC',
    DESC: 'DESC'
};

class MyCell extends React.Component {
    render() {
        return React.createElement(
            'div',
            null,
            data[rowIndex][field]
        );
        /*
        var {rowIndex, data, field, ...props} = this.props;
        return (
          <Cell {...props}>
            {data[rowIndex][field]}
          </Cell>
        );*/
    }
}

var SortTable = React.createClass({
    displayName: 'SortTable',

    getInitialState() {

        var headers = JSON.parse(JSON.stringify(this.props.headers));

        headers.unshift({
            "title": this.props.date_sign,
            //"help"  : "sessions.unique-sessions", // todo: add translate
            "short": "date"
        });

        var rows = this.convert_data_rows(this.props.rows);

        return {
            sortBy: 'date',
            sortDir: 'ASC',
            headers: headers,
            rows: rows
        };
    },

    componentWillMount: function () {

        /*
                $(event_emitter).on('granularity', function(e, granularity_type){
        
                    var rows = this.props.data_function().get_current_data(granularity_type);
                    var rows = this.convert_data_rows(rows);
        
                    this.setState({
                        rows : rows
                    });
        
                }.bind(this));
        */

        //$(event_emitter).on('date_choise', function(e, period){ // todo: rename to date_change
        $(event_emitter).on('granularity_data', function (e, data) {

            var self = this;

            var granularity = data.new_granularity;

            //console.log("==== date_choise ====", period);
            var rows = this.props.data_function().get_current_data(granularity);

            var rows = this.convert_data_rows(rows);

            if (rows.length > 50) {
                var splitted = split(rows, 10);

                console.log("-------- splitted --------");
                console.log(splitted);

                var combined = [];

                var i = 0;

                var load_part = function () {
                    setTimeout(function () {

                        //console.log("======== load part ==========");

                        combined = combined.concat(splitted[i]);

                        //console.log(combined);

                        self.setState({
                            rows: combined
                        });

                        i++;

                        if (i < splitted.length) {
                            load_part();
                        }
                    }, 3000);
                };

                load_part();
            } else {
                this.setState({
                    rows: rows
                });
            }
        }.bind(this));

        function split(a, n) {
            var len = a.length,
                out = [],
                i = 0;
            while (i < len) {
                var size = Math.ceil((len - i) / n--);
                out.push(a.slice(i, i += size));
            }
            return out;
        }

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

        if (this.state.rows) {
            var rows = this.state.rows;
        } else {
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

        if (sortBy == "date") {

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
        } else {
            rows.sort((a, b) => {
                return this.props.sort_functions[sortBy](a, b, sortBy, sortDir);
            });
        }

        this.setState({
            rows,
            sortBy,
            sortDir
        });
    },

    convert_data_rows: function (rows) {

        var converted_rows = [];

        for (var i = 0; i < rows[0].data.length; i++) {

            var date = rows.format_date(rows[0].data[i][0], rows[0].data[i][2]);

            date = date.split(" ");

            if (date.length == 3) // "1 Jan 2016" or "13:00"
                {
                    date.pop(); // remove year
                }

            date = date.join(' ');

            converted_rows[i] = {
                "date": date,
                "timestamp": rows[0].data[i][0]
            };

            for (var j = 0; j < rows.length; j++) {
                converted_rows[i][rows[j].short] = rows[j].data[i][1];
            }
        }

        return converted_rows;
    },

    row_getter: function (rowIndex) {

        var value = JSON.parse(JSON.stringify(this.state.rows[rowIndex]));
        return value;
    },

    onCellMouseEnter: function (row_id, cell_id) {

        return false;

        if (cell_id == "date") {
            return false;
        }

        for (var i = 0; i < this.props.rows.length; i++) {
            if (this.props.rows[i].short == cell_id) {

                var label = this.props.rows[i].label;
                break;
            }
        }

        var rows = this.state.rows;

        rows[row_id][cell_id] = [rows[row_id][cell_id], label];

        this.setState({ rows: rows });
    },

    onCellMouseLeave: function (row_id, cell_id) {

        return false;

        if (cell_id == "date") {
            return false;
        }

        var rows = this.state.rows;

        rows[row_id][cell_id] = rows[row_id][cell_id][0];

        this.setState({ rows: rows });
    },

    header_render(label, cellDataKey) {

        if (cellDataKey == this.state.sortBy && this.state.sortDir == "ASC") {
            var sort_icons = React.createElement(
                'div',
                null,
                React.createElement('div', { className: 'up_icon active' }),
                React.createElement('div', { className: 'down_icon' })
            );
        } else if (cellDataKey == this.state.sortBy && this.state.sortDir == "DESC") {
            var sort_icons = React.createElement(
                'div',
                null,
                React.createElement('div', { className: 'up_icon' }),
                React.createElement('div', { className: 'down_icon active' })
            );
        } else {
            var sort_icons = React.createElement(
                'div',
                null,
                React.createElement('div', { className: 'up_icon' }),
                React.createElement('div', { className: 'down_icon' })
            );
        }

        //console.log("header_render label 1:", label);

        var label = label.toLowerCase().replace(/\w\S*/g, function (txt) {
            //console.log("---> process txt -->>>", txt);
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });

        return React.createElement(
            Cell,
            { className: 'header_sort_button' },
            React.createElement(
                'a',
                { onClick: this.sort_rows_by.bind(null, cellDataKey) },
                label
            ),
            sort_icons
        );
    },

    cellRenderer: function (cellData, cellDataKey, rowData, rowIndex, columnData, width) {

        var class_name = "cell";

        if (this.state.sortBy == cellDataKey || this.state.sortBy == "date") {
            class_name += " sorted";
        }

        if (cellDataKey == "date" || cellDataKey == "timestamp") {
            return React.createElement(
                'div',
                { className: class_name },
                cellData,
                React.createElement('div', { className: 'border_right' })
            );
        }

        if (Object.prototype.toString.call(cellData) === '[object Array]') {
            var cell_data = cellData[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var cell_label = cellData[1];
        } else {
            var cell_data = cellData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var cell_label = "";
        }

        var key = rowData.date.replace(new RegExp(" ", 'g'), '') + cellDataKey;

        //console.log("cell key:", key);

        return React.createElement(
            'div',
            { className: class_name, key: key },
            cell_data,
            React.createElement(
                'span',
                { className: 'cell_label' },
                cell_label
            ),
            React.createElement('div', { className: 'border_right' })
        );
    },

    columns_render: function (headers, sortDirArrow) {

        var self = this;

        // headerRenderer = {self.header_render}
        // cellRenderer={self.cellRenderer}
        // header={self.header_render}
        // allowCellsRecycling={true}
        // dataKey = {header.short}

        return _.map(headers, function (header, id) {

            return React.createElement(Column, {
                label: header.title + sortDirArrow,
                width: self.props.width / headers.length,
                headerClassName: 'table_header',
                footerClassName: 'table_footer',
                cellClassName: 'table_content',
                cell: React.createElement(MyCell, { data: self.state.rows, col: header.short })
            });
        });
    },

    render() {

        var row_height = this.props.row_height;

        var sortDirArrow = '';

        if (this.state.sortDir !== null) {
            //sortDirArrow = this.state.sortDir === SortTypes.DESC ? ' ↓' : ' ↑';
            sortDirArrow = this.state.sortDir === SortTypes.DESC ? '' + this.state.sortBy[0] : '.' + this.state.sortBy[0];
        }

        var headers = this.state.headers;

        return React.createElement(
            Table,
            {
                rowHeight: row_height,
                rowGetter: this.row_getter,
                rowsCount: this.state.rows.length,
                width: this.props.width,
                height: row_height * (this.state.rows.length + 1) + 2,
                headerHeight: row_height,
                onCellMouseEnter: this.onCellMouseEnter,
                onCellMouseLeave: this.onCellMouseLeave
            },
            this.columns_render(headers, sortDirArrow)
        );
    }

});
