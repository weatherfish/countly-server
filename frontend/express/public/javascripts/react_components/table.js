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

var HeaderLabel = React.createClass({

    width : false,

    getInitialState: function() {

        return ({
            width : false,
            //email_key : this.props.email
        })
    },
    
    get_width : function()
    {
        /*
        if (React.findDOMNode(this).findDOMNode() > 1)
        {
            console.log("React.findDOMNode(this):", React.findDOMNode(this));
        }
        */
    
        if (React.findDOMNode(this).children.length > 0)
        {                        
            var childrens = React.findDOMNode(React.findDOMNode(this).children[0]).children;
            
            if (childrens.length > 0)
            {                                   
                if (React.findDOMNode(childrens[0]).children.length > 0) // date type cell
                {         
                    /*
                        <div>
                            <div><span></span>/<div>
                            <div><span></span></div>
                        </div>                
                    */
                    
                    if (React.findDOMNode(React.findDOMNode(childrens[1]).children[0]).offsetWidth > React.findDOMNode(React.findDOMNode(childrens[0]).children[0]).offsetWidth)
                    {
                        var width = React.findDOMNode(React.findDOMNode(childrens[1]).children[0]).offsetWidth;
                    }
                    else
                    {
                        var width = React.findDOMNode(React.findDOMNode(childrens[0]).children[0]).offsetWidth;
                    }                        
                }
                else
                {                    
                    /*
                        <div>
                            <span></span>
                            <span></span>
                        </div>                
                    */
                    
                    //if (React.findDOMNode(childrens[0]).offsetWidth)
                    
                    var width = React.findDOMNode(childrens[0]).offsetWidth;                    
                }                    
            }
            else
            {
                var width = React.findDOMNode(this).offsetWidth;
            }
            
            //var width = React.findDOMNode(this).offsetWidth;
        }
        else
        {
            var width = React.findDOMNode(this).offsetWidth;
        }        
        
        return width;
    },

    componentDidMount : function(){
        
        var width = this.get_width();
        
        this.width = width;
        
        switch (this.props.type)
        {
            case "header":
                this.props.onWidthChange(this.props.id, width);
            break;
            
            case "cell":                           
                this.props.onWidthChange(this.props.column_id, this.props.cell_id, width);
            break;
        }    

    },

    componentDidUpdate : function(){

        var width = this.get_width();

        if (width != this.width)
        {
            this.width = width;
            
            switch (this.props.type)
            {
                case "header":
                    this.props.onWidthChange(this.props.id, width);
                break;
                
                case "cell":                           
                    this.props.onWidthChange(this.props.column_id, this.props.cell_id, width);
                break;
            } 
        }

    },

    render : function(){      
        return(
            <span style={this.props.style}>
                {this.props.label}
            </span>
        )
    }

});

var TableHeader = (function (_React$Component) {

    _inherits(TableHeader, _React$Component);

    function TableHeader() {
        _classCallCheck(this, TableHeader);
        _get(Object.getPrototypeOf(TableHeader.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(TableHeader, [
        {
            key : 'componentDidMount',
            value : function componentDidMount(){    
                /*
                var label = this.props.label.toLowerCase();                            
                var width = this.getTextWidth(label) + 15 /*padding left*//* + 20 /* sort buttons *//*;   
                
                console.log("label:", label, ", width:", width);
                                            
                this.props.onWidthChange(this.props.id, width);*/                   
            }
        },
        {
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

            var label = this.props.label.toLowerCase(); //.toLowerCase().replace(/\w\S*/g, function(txt){
            
            if (this.props.adaptive)
            {
                label = label.split(" ");
            
                if (label.length > 1)
                {
                    
                    var style = {
                        "line-height" : "25px",
                        "display" : "block",
                        "position" : "relative"
                    };
                    
                    var top_style = JSON.parse(JSON.stringify(style));
                    var bottom_style = JSON.parse(JSON.stringify(style));
                    
                    top_style.top = "4px";
                    bottom_style.top = "-4px";       
                    /*
                    var header_label = <div><HeaderLabel type={'header'} label={label[0]} style={top_style} id={this.props.id} onWidthChange={this.props.onWidthChange}/><HeaderLabel type={'header'} label={label[1]} style={bottom_style} id={this.props.id} onWidthChange={this.props.onWidthChange}/></div>;
                    */
                    
                    var html = <div>
                                    <div style={top_style}><span>{label[0]}</span></div>
                                    <div style={bottom_style}><span>{label[1]}</span></div>
                                </div>;
                    
                    var header_label = <HeaderLabel type={'header'} label={html} id={this.props.id} onWidthChange={this.props.onWidthChange}/>;
                                                    
                }
                else
                {
                    var style = {};
                    
                    var header_label = <HeaderLabel type={'header'} label={label[0]} style={style} id={this.props.id} onWidthChange={this.props.onWidthChange}/>; 
                                    
                }
            }
            else
            {
                var header_label = label;
            }
                       
            return (
                    <div className="table_header" onClick={this.props.sort_function.bind(null, this.props.data_key)}>
                        <a>
                            {header_label}
                        </a>
                        {sort_icons}
                    </div>
            );
        }},
        {
            key : 'getTextWidth',
            value : function getTextWidth(text){                
                // re-use canvas object for better performance
                var canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement("canvas"));
                var context = canvas.getContext("2d");
                context.font = "Lato-Medium";
                context['font-size'] = "14px";   
                context['text-transform'] = "Capitalize";                
                var metrics = context.measureText(text);
                return metrics.width;     
            }
        },
    ]);

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

            var cell_width = this.props.width

            var _props = this.props;
            var rowIndex = _props.rowIndex;
            var data = _props.data;
            var field = _props.field;

            var props = _objectWithoutProperties(_props, ['rowIndex', 'data', 'field']);

            if (data[rowIndex][field])
            {
                var cell_data = data[rowIndex][field];
            }
            else
            {
                var cell_data = "0";
            }

            if (props.formatting_function)
            {
                cell_data = props.formatting_function(cell_data, cell_width);
            }
            else if (cell_data !== null && typeof cell_data === 'object')
            {
                if (cell_data.type == "percent"){

                    var wrapper_style = {
                        width : (cell_width - 15 - 40 - 15 - 15) + "px", //todo: - cell padding left - text block width - bar margin right - bar margin left
                        /*"background-color" : "green"*/
                    }

                    var bar_style = {
                        width : cell_data.value + "%"
                    }

                    cell_data = <div><span className="cell_value">{cell_data.value + "%"}</span><div style={wrapper_style} className="percent_cell"><div style={bar_style}></div></div></div>;
                }
                else if (cell_data.type == "img"){

                    var wrapper_style = {
                        width : "40px",
                        height : "40px"
                    }

                    cell_data = <div className="img_cell"><img src={cell_data.src}/><span className="img_text">{cell_data.value}</span></div>;
                }
            }
            else if (cell_data === parseInt(cell_data, 10)) // is int
            {
                cell_data = cell_data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
                        
            //var react_data_key = cell_data + rowIndex + field;
            //key={react_data_key}
            
            var react_data_key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
            
            //console.log("render cell:", this.props.id, " .. ", rowIndex);
            
            if (this.props.adaptive)
            {
                var cell_label = <HeaderLabel type={'cell'} label={cell_data} column_id={this.props.id} cell_id={rowIndex} onWidthChange={this.props.onCellWidthChange}/>;            
            }
            else
            {
                var cell_label = cell_data;
            }                        
            
            return (
                <Cell className="table_content header_sort_button" dataKey={react_data_key}>
                    {cell_label}
                </Cell>
            );
        }
    }]);

    return TableCell;

})(React.Component);

var SortTable = React.createClass({
    
    headers_width_rendered : [], // header labels fill this array     
    headers_inited : false,    
    cellWidthData : [],
    cellMaxWidthData : [],
    cells_inited : false,

    getInitialState() {
        
        this.table_width = this.props.width - 60; // todo
        
        var headers = this.props.headers;
        
        for (var i = 0; i < headers.length; i++)
        {      
            headers[i].width_px = Math.floor(this.table_width / 100 * headers[i].width_percent);
        }
              
        if (this.props.granularity)
        {
            var granularity = this.props.granularity;
            var with_granularity = true;
        }
        else
        {
            var granularity = 'daily';
            var with_granularity = false;
        }

        //var full_rows = this.props.data_function().get_current_data(granularity);

        if (this.props.data)
        {
            var data = this.props.data;
        }
        else
        {
            var data = this.props.data_function();
        }
              
        if (data.get_current_data)
        {
            var full_rows = data.get_current_data(granularity); // todo: only daily
        }
        else if (data.chartData)
        {
            var full_rows = data.chartData;
        }
        else
        {
            var full_rows = data; // /metrics/countries - city data
        }

        if (this.props.convert_data_function)
        {
            full_rows = this.convert_data_rows(full_rows);
        }

        var init_object = {
            sortBy  : this.props.initial_sort,
            sortDir : 'ASC',
            headers : headers,
            table_height : 700,
            rows_per_page : this.props.rows_per_page,
            with_granularity : with_granularity
        }

        var pagination = this.make_pagination(full_rows);

        for (var attrname in pagination) { init_object[attrname] = pagination[attrname]; }

        return init_object;
    },

    componentWillReceiveProps: function(nextProps) {
        
        if (nextProps.initial_sort != this.props.initial_sort)
        {
            
            this.setState({
                sortBy : false
            })
            
            return false;
        }

        /*if (nextProps.date != this.props.date) // todo !!!!!!!!!!!!!!!!!!!!!!
        {*/

            if (nextProps.data)
            {
                var data = nextProps.data;
            }
            else
            {
                var data = nextProps.data_function();
            }

            if (data.get_current_data)
            {
                var rows = data.get_current_data(nextProps.granularity);
            }
            else if (data.chartData)
            {
                var rows = data.chartData;
            }
            else
            {
                var rows = data; // /metrics/countries - city data
            }

            if (nextProps.convert_data_function)
            {
                rows = this.convert_data_rows(rows);
            }
           
            var pagination = this.make_pagination(JSON.parse(JSON.stringify(rows)));
                     
            if (nextProps.language != this.props.language){
                
                this.headers_width_rendered = [];
                this.headers_inited = false;  
                this.cellWidthData = [];
                this.cellMaxWidthData = [];
                this.cells_inited = false;
                
                pagination.headers = nextProps.headers;                
            }            

            this.setState(pagination);

        //}

    },

    filterFunction : function(filter)
    {
        this.filter = filter;        
        this.setState(this.make_pagination(this.state.full_rows, true));        
        return true;        
    },

    sort_rows_by(cellDataKey) {
        
        if (cellDataKey === this.state.sortBy) {
            var sortDir = this.state.sortDir === SortTypes.ASC ? SortTypes.DESC : SortTypes.ASC;
        } else {
            var sortDir = SortTypes.DESC;
        }
        
        this.setState({
            
            sortBy : cellDataKey,
            sortDir : sortDir
            
        }, function(){
            
            this.setState(this.make_pagination(this.state.full_rows, true));
            
        })       
        
        return true;
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

                if (rows[j].short)
                {
                    var short = rows[j].short;
                }
                else
                {
                    if (this.props.headers[j + 1])
                    {
                        var short = this.props.headers[j + 1].short;
                    }

                }

                if (short)
                {
                    converted_rows[i][short] = rows[j].data[i][1];
                }
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

    onRowMouseDown : function(event, row_id){

        if (!this.props.on_row_click)
        {
            return false;
        }

        var row_id = (this.state.active_page * this.props.rows_per_page) + row_id;

        this.props.on_row_click(this.state.full_rows[row_id]);

    },

    make_pagination : function(full_rows, old_data)
    {
        
        if (!old_data)
        {
            var original_full_rows = full_rows;
        }

        var sortDir = (this.state && this.state.sortDir) ? this.state.sortDir : 'ASC';    
        var sortBy = (this.state && this.state.sortBy) ? this.state.sortBy : this.props.initial_sort; 
    
        // --- filter ---
        
        //if (this.state && this.state.filter)
        if (this.filter)
        {
            if (this.props.filter_field)
            {
                var filter_field = this.props.filter_field;
            }
            else
            {
                var filter_field = "date";
            }
    
            var filtered_rows = [];
    
            for (var i = 0; i < full_rows.length; i++)
            {
                if (full_rows[i][filter_field].toLowerCase().indexOf(this.filter) > -1)
                {
                    filtered_rows.push(full_rows[i]);
                }
            }
            
            full_rows = filtered_rows;
        }        
    
        // --- sort ---
    
        if (sortBy == "date")
        {

            var sortBy = "timestamp";

            full_rows.sort((a, b) => {

                var sortVal = 0;

                if (a[sortBy] > b[sortBy]) {
                    sortVal = 1;
                }
                if (a[sortBy] < b[sortBy]) {
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
            full_rows.sort((a, b) => {

                //console.log(sortBy, "+ a:", a, " : b :", b);

                if (a[sortBy] !== null && typeof a[sortBy] === 'object')
                {

                    /*a = parseFloat(a[sortBy]['value']); // todo: somewhere is necessary parseFloat
                    b = parseFloat(b[sortBy]['value']);*/
                    a = a[sortBy]['value'];
                    b = b[sortBy]['value'];
                }
                else
                {
                    a = a[sortBy];
                    b = b[sortBy];
                }
                                
                return this.props.sort_functions[sortBy](a, b, sortBy, sortDir);
            });
        }

        // --------------------

        var active_page = (this.state && this.state.active_page) ? this.state.active_page : 0;

        var page_rows = full_rows.slice((active_page) * this.props.rows_per_page, (active_page + 1) * this.props.rows_per_page );

        var pages = [];
        var pages_length = Math.ceil(full_rows.length / this.props.rows_per_page);

        for (var i = 0; i < pages_length; i++) {
            pages.push(i);
        }

        var pagination = {
            rows : page_rows,
            active_page : active_page,
            pages : pages,          
        }
        
        if (!old_data)
        {
            pagination.full_rows = original_full_rows;
        }

        return pagination;

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
    
    //---------------------------------------------------------------------------------------------------------------------
           
    calculate_template : function(){
        
        if (!this.headers_inited || !this.cells_inited)
        {
            return false;
        }
        
        console.log("------ calculate template --------");
        console.log(this.headers_width_rendered);
        console.log("::: cellMaxWidthData ::");
        console.log(this.cellMaxWidthData);
        
        var max_sizes_array = [];
        
        for (var i = 0; i < this.cellMaxWidthData.length; i++)
        {
            if (this.cellMaxWidthData[i] > this.headers_width_rendered[i])
            {
                max_sizes_array[i] = this.cellMaxWidthData[i];
            }
            else
            {
                max_sizes_array[i] = this.headers_width_rendered[i];
            }
        }
        
        var headers = this.state.headers;
                
        var sum = 0;
        
        for (var i = 0; i < max_sizes_array.length; i++)
        {
            sum += max_sizes_array[i];
        }
                
        if (sum < this.table_width)
        {
            max_sizes_array[0] = max_sizes_array[0] + (this.table_width - sum); 
        }
        
        for (var j = 0; j < headers.length; j++)
        {
            headers[j].width_px = max_sizes_array[j];
        }
                
        this.setState({
            headers : headers
        }); 
        
        return false;
        
    },
       
    onHeaderWidthChange : function(header_id, width){
        
        //return false;
        
        //console.log("onHeaderWidthChange:", header_id, " > ", width);
        
        if (this.headers_inited)
        {
            return false;
        }
                
        width = width + 15 + 20; /*padding left*/ /* sort buttons */;   
        
        this.headers_width_rendered[parseInt(header_id)] = width;
                                
        if (this.headers_width_rendered.length == this.state.headers.length)
        {            
            //console.log(this.headers_width_rendered); 
            
            var new_array = [];
            
            // this.headers_width_rendered can be [62, 65, 81, 102, 5: 83, 6: 91, 7: 97, 8: 75]
            
            for (var i = 0; i < this.headers_width_rendered.length; i++)
            {
                
                if (this.headers_width_rendered[i])
                {
                    new_array.push(this.headers_width_rendered[i]);
                }
                else
                {
                    new_array.push(this.headers_width_rendered[(i+1).toString()]);
                }
                
            }
            
            this.headers_width_rendered = new_array;
            
            console.log("-- new arrray ---");
            console.log(new_array);
            
            this.headers_inited = true;            
            this.calculate_template();                
        }                 
    },
        
    onCellWidthChange : function(column_id, cell_id, width){
        
        //console.log("onCellWidthChange:", column_id, " > ", cell_id);
        
        if (this.cells_inited)
        {
            return false;
        }
        
        var per_page = 20;
        
        if (!this.cellWidthData[column_id])
        {            
            this.cellWidthData[column_id] = [];     
        }
        
        width += 15; // padding-left
        
        this.cellWidthData[column_id][cell_id] = width;    
                
        if (!this.cellMaxWidthData[column_id])
        {
            this.cellMaxWidthData[column_id] = width;
        }
        else if (width > this.cellMaxWidthData[column_id])
        {
            this.cellMaxWidthData[column_id] = width;
        }
                
        var filled = true;
        
        if (this.cellWidthData.length == this.state.headers.length)
        {            
            for (var i = 0; i < this.cellWidthData.length; i++)
            {
                if (this.cellWidthData[i].length != per_page)
                {                    
                    filled = false;                                        
                }
            }               
        }
        else
        {
            filled = false;
        }
        
        if (/*this.headers_width_rendered.length == this.state.headers.length && */filled)
        {            
            
            console.log("[[[[[[[[[[[ cellMaxWidthData ]]]]]]]]]]]]");
            console.log(this.cellMaxWidthData);
                   
            this.cells_inited = true;            
            this.calculate_template();            
                
        }        
        
        //this.cellMaxWidthData[column_id] = width;        
        
        /*
        if (!this.cellWidthData[column_id])
        {
            this.cellWidthData[cell_id] = {
                ready : 1
            };
            
            this.cellWidthData[cell_id].width = width;
        }
        else
        {
            if (width > this.cellWidthData[cell_id])
            {
                this.cellWidthData[cell_id] = {};
                this.cellWidthData[cell_id].width = width;
            }
        }
        
        this.cellWidthData[cell_id].ready++;
        
        if (this.cellWidthData.length == this.state.headers.length)
        {
            console.log("====== table half inited =========");
            console.log(this.cellWidthData)
        }        
        */
        //console.log("cellWidthData:", this.cellWidthData);
        
        //cellWidthData[cell_id] = ;
        
        //console.log("cell width change:", cell_id, " ++ ", width);       
            
    },

    columns_render : function columns_render(headers) {

        var self = this;

        return _.map(headers, function (header, id) {
            
            if (header.width_px)
            {                
                var width = header.width_px;
            } 
            else if (header.width_percent)
            {
                var width = Math.floor(self.table_width / 100 * header.width_percent);
            }
            else
            {
                var width = Math.floor(self.table_width / headers.length);
            }

            return React.createElement(Column, {
                label  : header.title,
                width  : width,
                header : React.createElement(TableHeader, {
                    label: header.title,
                    data_key : header.short,
                    sort_by : self.state.sortBy,
                    sort_dir : self.state.sortDir,
                    sort_function : self.sort_rows_by,
                    onWidthChange : self.onHeaderWidthChange,                    
                    id : id,
                    adaptive : self.props.adaptive
                }),
                cell : React.createElement(TableCell, {
                    data : self.state.rows,
                    field : header.short,
                    formatting_function : header.formatting_function,
                    onCellWidthChange : self.onCellWidthChange,
                    id : id,
                    adaptive : self.props.adaptive
                })
            });
        });
    },
   
    render() {

        var self = this;
        
        var row_height = this.props.row_height;
        
        /*if (this.state.sortDir !== null)
        {
            sortDirArrow = this.state.sortDir === SortTypes.DESC ? '' + this.state.sortBy[0] : '.' + this.state.sortBy[0];
        }*/

        var headers = this.state.headers;

        var pagination_style  = {
            width : this.table_width
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
            if (this.state.active_page < 3 || this.state.active_page > this.state.pages.length - 3)
            {
                var available_pages = this.state.pages.slice(0, 3); // show only first and last 3 pages links [1][2][3][...][50][51][52]
                var last_available_pages = this.state.pages.slice(this.state.pages.length - 3, this.state.pages.length);
                available_pages.push("...");
                var available_pages = available_pages.concat(last_available_pages);
            }
            else
            {
                var available_pages = this.state.pages.slice(0, 1);
                available_pages.push("...");
                available_pages.push(this.state.active_page - 1);
                available_pages.push(this.state.active_page);
                available_pages.push(this.state.active_page + 1);
                available_pages.push("...");
                available_pages.push(this.state.pages.length - 1);
            }

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

        <div className="table_wrapper">

            {(() => {

                if (self.props.additional_filter)
                {
                    return self.props.additional_filter;
                }
                else
                {
                    return(<div>
                              <div className="data_sign">{this.props.data_sign}</div>
                              <DataDateSign/>
                          </div>
                    );
                }

            })()}

            <TableFilter
                filter_function={this.filterFunction.bind(this)}
                full_rows={this.state.full_rows}
                className="table_filter_wrapper"
            />

            <div className="sort_table_wrapper">
                <Table
                    rowHeight = {row_height}
                    rowsCount = {this.state.rows.length}
                    width     = {this.table_width}
                    height    = {height}
                    headerHeight = {row_height}
                    onCellMouseEnter={this.onCellMouseEnter}
                    onCellMouseLeave={this.onCellMouseLeave}
                    onRowMouseDown={this.onRowMouseDown}
                >
                {this.columns_render(headers)}
                </Table>

                {(() => {
                    
                    if (this.state.rows.length == 0)
                    {
                        
                        var table_no_data_style = {
                            width : this.table_width
                        }
                        
                        return (<div className="table_no_data" style={table_no_data_style}>No data available in table</div>);
                    }

                    if (available_pages.length > 1){

                        return (<div className="pagination" style={pagination_style}>
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
                        </div>)

                    }

                })()}

            </div>
        </div>
        );
    },
});
