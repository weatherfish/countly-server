//"use strict";

var Column = FixedDataTable.Column;
var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;

var SortTypes = {
    ASC: 'ASC',
    DESC: 'DESC',
};

function renderDate(/*object*/ cellData) {
    return <span>{cellData.toLocaleString()}</span>;
}

var SortTable = React.createClass({

    getInitialState() {

        var headers = JSON.parse(JSON.stringify(this.props.headers));

        console.log("++++++ table headers +++++++");
        console.log(headers);

        headers.unshift({
            "title" : "Date",
            //"help"  : "sessions.unique-sessions", // todo: add translate
            "short" : "date",
        })

        var rows = this.convert_data_rows(this.props.rows);

        return {
            sortBy  : 'date',
            sortDir : null,
            headers : headers,
            rows    : rows
        };
    },

    componentWillMount: function() {

        $(event_emitter).on('granularity', function(e, granularity_type){

            var rows = countlySession.getSessionDP().get_current_data(granularity_type);
            var rows = this.convert_data_rows(rows);

            this.setState({
                rows : rows
            });

        }.bind(this));
    },

    _sortRowsBy(cellDataKey) {

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

        //var rows = this.state.rows.slice();

        rows.sort((a, b) => {

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
            converted_rows[i] = {
                "date" : rows.format_date(rows[0].data[i][0], 2)
            };

            for (var j = 0; j < rows.length; j++)
            {
                converted_rows[i][rows[j].short] = rows[0].data[i][1];
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

        return (
            <div className="header_sort_button">
                <a onClick={this._sortRowsBy.bind(null, cellDataKey)}>{label}</a>
                {sort_icons}
            </div>
        );
    },

    row_getter : function(rowIndex) {

        if (this.state.rows)
        {
            var value = this.state.rows[rowIndex];
        }
        else
        {
            var value = this.props.rows[rowIndex];
        }

        //value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return value;

    },

    columns_render : function(headers, sortDirArrow) {

        var self = this;

        return _.map(headers, function(header, id) {

            var title = header.title.toLowerCase().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

            return <Column
                label =  {title + sortDirArrow}
                width = {self.props.width / headers.length}
                dataKey = {header.short}
                headerClassName = "table_header"
                footerClassName = "table_footer"
                table_content = "table_content"
                headerRenderer={self.header_render}
            />
        });
    },

    render() {

        var row_height = this.props.row_height;

        var sortDirArrow = '';

        if (this.state.sortDir !== null)
        {
            sortDirArrow = this.state.sortDir === SortTypes.DESC ? ' ↓' : ' ↑';
        }

        var headers = this.state.headers;

        return (
            <Table
                rowHeight = {row_height}
                rowGetter = {this.row_getter}
                rowsCount = {this.state.rows.length}
                width     = {this.props.width}
                height    = {row_height * (this.state.rows.length + 1)}
                headerHeight = {row_height}
            >
                {this.columns_render(headers, sortDirArrow)}
            </Table>
        );
    }

});
