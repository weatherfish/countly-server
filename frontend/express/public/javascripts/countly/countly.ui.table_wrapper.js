var TableWrapper = React.createClass({

    getInitialState : function() {

        return {
            "filter" : false
        };
    },

    filterFunction : function(filter)
    {

        if (filter == "")
        {
            filter = false;
        }

        console.log("filter:", filter);

        this.setState({
            "filter" : filter
        });

        return false;
/*
        var rows = this.props.rows;

        console.log("======== rows ========");
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
*/
    },

    render : function() {

        if (this.state.rows)
        {
            var rows = this.state.rows;
        }
        else
        {
            var rows = this.props.rows;
        }

        console.log("rerender:", this.state.filter);

        return (
            <div className="table_wrapper">

                <div className="data_sign">{this.props.data_sign}</div>
                <DataDateSign/>

                <TableFilter
                    filter_function={this.filterFunction}
                    className="table_filter_wrapper"
                />

                <div className="sort_table_wrapper">
                    <SortTable
                        rows={rows}
                        width={this.props.width}
                        headers={this.props.headers}
                        row_height={this.props.row_height}
                        date_sign={this.props.date_sign}
                        data_function={this.props.data_function}
                        sort_functions={this.props.sort_functions}
                        filter={this.state.filter}
                        rows_per_page={5}
                        granularity={this.props.granularity}
                    />
                </div>

            </div>
        )
    },

    /*
    {{#if two-tables}}
    <table id="dataTableTwo" class="d-table help-zone-vb" cellpadding="0" cellspacing="0" data-help-localize="help.{{{table-helper}}}"></table>
    {{/if}}
    */
/*

*/
});
