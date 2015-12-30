var TableWrapper = React.createClass({

    getInitialState : function() {

        return {
            sortBy  : 'date',
            sortDir : null,
        };
    },

    filterFunction : function(filter)
    {

        var rows = this.props.rows;

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

    },

    render : function() {

        var Table  = FixedDataTable.Table;
        var Column = FixedDataTable.Column;

        if (this.state.rows)
        {
            var rows = this.state.rows;
        }
        else
        {
            var rows = this.props.rows;
        }


        return (
            <div className="table_wrapper">

                <div className="data_sign">DATA</div>
                <DataDateSign/>

                <TableFilter filter_function={this.filterFunction} className="table_filter_wrapper" />

                <div className="sort_table_wrapper">
                    <SortTable
                        rows={rows}
                        width={this.props.width}
                        headers={this.props.headers}
                        row_height={this.props.row_height}
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
