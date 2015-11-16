var TableFilter = React.createClass({

    getInitialState() {
        return {
            sortDir : null,
        };
    },
    change_input: function(event) {
        var value = event.target.value;
        this.props.filter_function(value);
        this.setState({ value : value });
    },
    render() {
        return (
            <div className="wrp table_filter_wrapper">
                <div className="icon"></div>
                <input type="search" className="table_filter" placeholder="Search the Data" onKeyUp={this.change_input}/>
            </div>
        );
    },

});
