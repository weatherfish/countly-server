//"use strict";

var Column = FixedDataTable.Column;
var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;
var Cell = FixedDataTable.Cell;

var SortTypes = {
    ASC: 'ASC',
    DESC: 'DESC',
};

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TableHeader = (function (_React$Component) {

    _inherits(TableHeader, _React$Component);

    function TableHeader() {
        _classCallCheck(this, TableHeader);
        _get(Object.getPrototypeOf(TableHeader.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(TableHeader, [{
        key: 'render',
        value: function render() {

            //label: header.title, data_key : header.short

            if (this.props.data_key == this.props.sort_by && this.props.sort_dir == "ASC")
            {
                var sort_icons = <div className="header_sort_button"><div className="up_icon active"></div><div className="down_icon"></div></div>;
            }
            else if (this.props.data_key == this.props.sort_by && this.props.sort_dir == "DESC")
            {
                var sort_icons = <div className="header_sort_button"><div className="up_icon"></div><div className="down_icon active"></div></div>;
            }
            else
            {
                var sort_icons = <div className="header_sort_button"><div className="up_icon"></div><div className="down_icon"></div></div>;
            }

            //console.log("header_render label 1:", label);

            var label = this.props.label.toLowerCase().replace(/\w\S*/g, function(txt){
              //console.log("---> process txt -->>>", txt);
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });

            // onClick={this.sort_rows_by.bind(null, this.props.data_key)}

            // <Cell className="header_sort_button">
            // </Cell>

            return (
                    <div className="table_header" onClick={this.props.sort_function.bind(null, this.props.data_key)}>
                        <a>{label}</a>
                        {sort_icons}
                    </div>
            );

            /*var _props = this.props;
            var rowIndex = _props.rowIndex;
            var data = _props.data;
            var field = _props.field;

            var props = _objectWithoutProperties(_props, ['rowIndex', 'data', 'field']);
/*
            console.log("------------- render cell ---------------");
            //console.log(rowIndex, data, field);
            console.log(data[rowIndex]["date"]);
*/
/*
            var key = data[rowIndex].date.replace(new RegExp(" ", 'g'), '') + field;

            //console.log("key:", key);

            props.key = key + "toplevel";
            props.dataKey = key;

            return React.createElement(
                Cell,
                //_extends({}, props, { key: key, dataKey: key }),
                props,
                data[rowIndex][field]
            );*/
        }
    }]);

    return TableHeader;
})(React.Component);

var TableCell = (function (_React$Component) {

    _inherits(TableCell, _React$Component);

    function TableCell() {
        _classCallCheck(this, TableCell);
        _get(Object.getPrototypeOf(TableCell.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(TableCell, [{
        key: 'render',
        value: function render() {

            var _props = this.props;
            var rowIndex = _props.rowIndex;
            var data = _props.data;
            var field = _props.field;

            var props = _objectWithoutProperties(_props, ['rowIndex', 'data', 'field']);
/*
            console.log("------------- render cell ---------------");
            //console.log(rowIndex, data, field);
            console.log(data[rowIndex]["date"]);
*/

            var key = data[rowIndex].date.replace(new RegExp(" ", 'g'), '') + field;

            //console.log("key:", key);

            props.key = key + "toplevel";
            props.dataKey = key;

            props.className = "table_content";

            if (data[rowIndex][field])
            {
                var cell_data = data[rowIndex][field];
            }
            else
            {
                var cell_data = "";
            }

            var cell_data = cell_data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            return (
                <Cell className="table_content header_sort_button">
                    {cell_data}
                </Cell>
            );
/*
            return React.createElement(
                Cell,
                //_extends({}, props, { key: key, dataKey: key }),
                props,
                data[rowIndex][field]
            );*/
        }
    }]);

    return TableCell;
})(React.Component);


var SortTable = React.createClass({

    getInitialState() {

        var headers = JSON.parse(JSON.stringify(this.props.headers));

        headers.unshift({
            "title" : this.props.date_sign,
            //"help"  : "sessions.unique-sessions", // todo: add translate
            "short" : "date",
        })


        var full_rows = this.props.data_function().get_current_data(this.props.granularity);

        console.log("============= full_rows =========", this.props.granularity);
        console.log(full_rows);

        full_rows = this.convert_data_rows(full_rows);

        //var full_rows = this.convert_data_rows(this.props.rows);

        var page = 0;
        var rows_per_page = this.props.rows_per_page;
        //max_num = 4;

        var page_rows = full_rows.slice( (page) * rows_per_page, (page + 1) * rows_per_page );

        var pages = [];
        var pages_length = Math.ceil(full_rows.length / rows_per_page);

        for (var i = 0; i < pages_length; i++) {
            pages.push(i);
        }

        return {
            sortBy  : 'date',
            sortDir : 'ASC',
            headers : headers,
            rows    : page_rows,
            full_rows : full_rows,
            table_height : 700,
            active_page : page,
            rows_per_page : rows_per_page,
            pages : pages
        };
    },

    componentWillMount: function() {

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
        $(event_emitter).on('granularity_data', function(e, data){

            var self = this;

            var granularity = data.new_granularity;

            //console.log("==== date_choise ====", period);
            var rows = this.props.data_function().get_current_data(granularity);

            var rows = this.convert_data_rows(rows);

            if (rows.length > 50000)
            {
                var splitted = split(rows, 100);

                console.log("-------- splitted --------");
                console.log(splitted);

                var combined = [];

                var i = 0;

                var load_part = function()
                {

                    combined = combined.concat(splitted[i]);

                    //console.log(combined);

                    self.setState({
                        rows : combined
                    });

                    i++;

                    if (i < splitted.length)
                    {
                        setTimeout(function(){
                              load_part();
                        }, 100);
                    }
                }

                load_part();

            }
            else
            {

                var full_rows = rows;

                var page = 0;
/*
                max_num = 4;

                var page_rows = full_rows.slice( (page - 1) * max_num, page * max_num );

                var pages = [];
                var pages_length = Math.ceil(full_rows.length / rows_per_page);

                for (var i = 0; i < pages_length; i++) {
                    pages.push(i);
                }
*/

                var page_rows = full_rows.slice( (page) * this.state.rows_per_page, (page + 1) * this.state.rows_per_page );

                var pages = [];
                var pages_length = Math.ceil(full_rows.length / this.state.rows_per_page);

                for (var i = 0; i < pages_length; i++) {
                    pages.push(i);
                }

                console.log("================= pages ================");
                console.log(pages);

                this.setState({
                    full_rows : full_rows,
                    rows : page_rows,
                    active_page : 0,
                    pages : pages
                    //table_height : 700
                });
/*
                var self = this;

                var height    = 50 * (rows.length + 1) + 2;*/
/*
                setTimeout(function(){

                    self.setState({
                        table_height : height
                    })
*/
                //}, 3000);

            }

        }.bind(this));

        function split(a, n) {
            var len = a.length,out = [], i = 0;
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
/*
        if (this.state.rows)
        {
            var rows = this.state.rows;
        }
        else
        {
            var rows = this.props.rows;
        }
*/
        var rows = this.state.full_rows;

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

        console.log("============= sorted rows ==============");
        console.log(rows);

        var page = 0;

        var page_rows = rows.slice((page) * this.state.rows_per_page, (page + 1) * this.state.rows_per_page);

        this.setState({
            rows : page_rows,
            sortBy : sortBy,
            sortDir : sortDir,
            active_page : page,
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
/*
    row_getter : function(rowIndex) {

        var value = JSON.parse(JSON.stringify(this.state.rows[rowIndex]));
        return value;
    },
*/
    onCellMouseEnter : function(row_id, cell_id){

        return false;

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

        return false;

        if (cell_id == "date")
        {
            return false;
        }

        var rows = this.state.rows;

        rows[row_id][cell_id] = rows[row_id][cell_id][0];

        this.setState({ rows : rows })
    },

    columns_render : function columns_render(headers, sortDirArrow) {

        var self = this;

        // headerRenderer = {self.header_render}
        // cellRenderer={self.cellRenderer}
        // header={self.header_render}
        // allowCellsRecycling={true}
        // dataKey = {header.short}

        /*

        */

        return _.map(headers, function (header, id) {

            /*
            headerClassName: 'table_header',
            footerClassName: 'table_footer',
            cellClassName: 'table_content',
            */

            return React.createElement(Column, {
                label: header.title + sortDirArrow,
                width: self.props.width / headers.length,
                header:React.createElement(TableHeader, {
                    label: header.title,
                    data_key : header.short,
                    sort_by : self.state.sortBy,
                    sort_dir : self.state.sortDir,
                    sort_function : self.sort_rows_by
                }),
                cell: React.createElement(TableCell, { data: self.state.rows, field : header.short })

            });
        });
    },

    pagination : function(page)
    {
        if (page == "prev")
        {

            if (this.state.active_page > 0)
            {
                page = this.state.active_page - 1;
            }
            else
            {
                page = 0;
            }

        }
        else if (page == "next")
        {
            if (this.state.active_page < this.state.pages.length - 1) // todo: total pages
            {
                page = this.state.active_page + 1;
            }
            else
            {
                page = this.state.active_page;
            }
        }

        if (this.state.active_page == page)
        {
            return true;
        }

        var page_rows = this.state.full_rows.slice((page) * this.state.rows_per_page, (page + 1) * this.state.rows_per_page);

        this.setState({
            "active_page" : page,
            "rows" : page_rows
        })

    },

    infinity : function(page)
    {
        var page_rows = this.state.full_rows;

        var self = this;

        this.setState({
            "active_page" : 0,
            "rows" : page_rows,
            "infinity_mode" : this.props.row_height * (this.state.rows.length + 1) + 2
        })

        setTimeout(function(){

            self.setState({
                "infinity_mode" : self.props.row_height * (self.state.rows.length / 4 + 1) + 2
            })

        }, 500);

        setTimeout(function(){

            self.setState({
                "infinity_mode" : self.props.row_height * (self.state.rows.length / 2 + 1) + 2
            })

        }, 1500);

        setTimeout(function(){

            self.setState({
                "infinity_mode" : self.props.row_height * (self.state.rows.length + 1) + 2
            })

        }, 2500);

    },

    render() {

        var self = this;

        var row_height = this.props.row_height;

        var sortDirArrow = ''; // todo: the variable is not used

        if (this.state.sortDir !== null)
        {
            sortDirArrow = this.state.sortDir === SortTypes.DESC ? '' + this.state.sortBy[0] : '.' + this.state.sortBy[0];
        }

        var headers = this.state.headers;

        var pagination_style  = {
            width : this.props.width
        }

        var prev_page_style  = {}

        if (this.state.active_page == 0)
        {
            prev_page_style.color = "#9B9B9B";
            prev_page_style.cursor = "default";
        }

        var next_page_style  = {}

        if (this.state.active_page == this.state.pages.length - 1) // todo: total pages
        {
            next_page_style.color = "#9B9B9B";
            next_page_style.cursor = "default";
        }

        if (this.state.pages.length > 7)
        {
            var available_pages = this.state.pages.slice(0, 3); // show only first and last 3 pages links [1][2][3][...][50][51][52]
            var last_available_pages = this.state.pages.slice(this.state.pages.length - 3, this.state.pages.length);
            available_pages.push("...");
            var available_pages = available_pages.concat(last_available_pages);

        }
        else
        {
            var available_pages = this.state.pages;
        }

        if (this.state.infinity_mode)
        {
            var height = this.state.infinity_mode;
        }
        else
        {
            var height = row_height * (this.state.rows.length + 1) + 2;
        }

        return (
            <div>
                <Table
                    rowHeight = {row_height}
                    rowsCount = {this.state.rows.length}
                    width     = {this.props.width}
                    height    = {height}
                    headerHeight = {row_height}
                    onCellMouseEnter={this.onCellMouseEnter}
                    onCellMouseLeave={this.onCellMouseLeave}
                >
                {this.columns_render(headers, sortDirArrow)}
                </Table>
                <div className="pagination" style={pagination_style}>
                    <div className="prev_page" onClick={self.pagination.bind(null, "prev")} style={prev_page_style}>prev</div>
                    {
                        _.map(available_pages, function (page, i) {

                            if (page == "...")
                            {
                                return <div className="dots">...</div>
                            }

                            var class_name = "";

                            if (page == self.state.active_page){
                                class_name += "active"
                            }

                            return <div className={class_name} onClick={self.pagination.bind(null, page)}>{page + 1}</div>

                        })
                    }
                    <div className="next_page" style={next_page_style} onClick={self.pagination.bind(null, "next")}>next</div>
                    <div className="infinity" onClick={self.infinity.bind(null, "inf")}>inf</div>
                </div>
            </div>
        );


/*
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
        );*/
    },

    componentDidMount : function()
    {

    },

});
