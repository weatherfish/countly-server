var TableWrapper = React.createClass({

    getInitialState : function() {

        return {
            "filter" : false
        };
    },

    filterFunction : function(value) {

        console.log("::::::::: filterFunction :::::::");
        console.log(value);

        this.setState({
            "filter" : value
        });

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

        return (
            <div className="table_wrapper">

                <div className="data_sign">{this.props.data_sign}</div>
                <DataDateSign/>

                <TableFilter
                    filter_function={this.filterFunction.bind(this)}
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
                        rows_per_page={20}
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
