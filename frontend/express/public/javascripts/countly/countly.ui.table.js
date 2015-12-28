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

        //var rows = this.convert_data_rows(this.props.rows);

        return {
            sortBy  : 'date',
            sortDir : null,
            //rows    : rows
        };
    },

    rowGetter : function(rowIndex) {

        if (this.state.rows)
        {
            return this.state.rows[rowIndex];
        }
        else
        {
            return this.props.rows[rowIndex];
        }

    },

    _renderHeader(label, cellDataKey) {

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

        console.log("=== set state ===");
        console.log(this.state);

        this.setState({
            rows,
            sortBy,
            sortDir,
        });
    },

    convert_data_rows : function(rows)
    {

        console.log("convert_data_rows:",);
        console.log(rows);

        return false;

        for (var i = 0; i < rows[0].data.length; i++)
        {

            var row = {};

            for (var i = 0; j < rows[i].length; j++)
            {
                row[rows[j].short] = 0;
            }
        }

        return converted_rows;
    },

    render() {

        var sortDirArrow = '';

        if (this.state.sortDir !== null){

            console.log("sort dir exit:", this.state.sortDir);

            sortDirArrow = this.state.sortDir === SortTypes.DESC ? ' ↓' : ' ↑';
        }

        console.log("==== table render ====", sortDirArrow);
        console.log("current sort:", this.state.sortBy);

        console.log("-------------- table  render rows --------------");
        console.log(this.props.rows);

        return  false;

        return (
            <Table
                rowHeight = {50}
                rowGetter = {this.rowGetter}
                rowsCount = {this.props.rows.length}
                width     = {this.props.width}
                height    = {5000}
                headerHeight = {50}
            >
                <Column
                    label   = {"Date" + sortDirArrow}
                    width   = {this.props.width / 100 * 40}
                    dataKey = "date"
                    headerClassName = "table_header"
                    footerClassName = "table_footer"
                    table_content   = "table_content"
                    headerRenderer={this._renderHeader}
                />
                <Column
                    label =  {"Total Sessions" + sortDirArrow}
                    width = {this.props.width / 100 * 20}
                    dataKey = "t"
                    headerClassName = "table_header"
                    footerClassName = "table_footer"
                    table_content = "table_content"
                    headerRenderer={this._renderHeader}
                />
                <Column
                    label   = {"New Sessions" + sortDirArrow}
                    width   = {this.props.width / 100 * 20}
                    dataKey = "n"
                    headerClassName = "table_header"
                    footerClassName = "footerClassName"
                    table_content   = "table_content"
                    headerRenderer={this._renderHeader}
                />
                <Column
                    label = {"Unique Sessions" + sortDirArrow}
                    width = {this.props.width / 100 * 20}
                    dataKey = "u"
                    headerClassName = "table_header"
                    footerClassName = "footerClassName"
                    table_content = "table_content"
                    headerRenderer={this._renderHeader}
                />
          </Table>
        );
    },
});
