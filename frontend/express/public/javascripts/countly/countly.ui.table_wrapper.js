var TableWrapper = React.createClass({

    getInitialState() {

        console.log("get initial state");

        return {
            sortBy  : 'date',
            sortDir : null,
        };
    },

    filterFunction(filter)
    {

        var rows = this.props.rows;

        console.log("==== filter ===");
        console.log(filter);
        console.log(rows);

        var filtered_rows = [];

        for (var i = 0; i < rows.length; i++)
        {
            if (rows[i].date.toLowerCase().indexOf(filter) > -1)
            {
                filtered_rows.push(rows[i]);
            }
        }

        this.setState({
            rows : filtered_rows
        });

        /*table = React.createElement(SortTable, {
            "width" : table_width,
            "rows"  : filtered_rows
        });

        React.render(table, document.getElementsByClassName('d-table')[0]);*/

    },

    render() {

        var Table  = FixedDataTable.Table;
        var Column = FixedDataTable.Column;

        //var window = window.innerWidth;

        var sidebar_width = 240;
        var margin_left = 30;
        var padding_left = 30;
        var margin_right = 30;

        var table_width = window.innerWidth - sidebar_width - margin_left - margin_right - padding_left;

        //var rows = sessionDP.chartData;

        /*var DataTable = React.createElement(SortTable, {
            "width" : table_width,
            "rows"  : this.props.rows
        });*/

        // <DataDateSign/>
        //  data-help-localize="help.{{{table-helper}}}"

        // <DataTable id="dataTableOne"  cellpadding="0" cellspacing="0"></DataTable>

        if (this.state.rows)
        {
            var rows = this.state.rows;
        }
        else
        {
            var rows = this.props.rows;
        }

        //

        return (
            <div className="table_wrapper">

                <div className="data_sign">DATA</div>
                <DataDateSign/>

                <TableFilter filter_function={this.filterFunction} className="table_filter_wrapper" />

                <div className="sort_table_wrapper">
                    <SortTable rows={rows} width={table_width}/>
                </div>

            </div>
        )
    },

    /*
    {{#if two-tables}}
    <table id="dataTableTwo" class="d-table help-zone-vb" cellpadding="0" cellspacing="0" data-help-localize="help.{{{table-helper}}}"></table>
    {{/if}}
    */

});
