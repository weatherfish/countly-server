var DateSign = React.createClass({

    getInitialState : function() {
        return {
            date_string : global_controller.date_string, // todo: remove GLOBAL variable
        };
    },

    componentDidMount : function(){

        $(event_emitter).on('date_init',   this.date_change_event.bind(this));
        $(event_emitter).on('date_choise', this.date_change_event.bind(this));

    },

    date_change_event : function(e, data){

        var date_string = data.state.from_string + " - " + data.state.to_string;

        this.setState({
            date_string : date_string,
        });
    },

    render : function() {

        return (
            <div className="date_sign_block">
                <div className="sign">{this.props.sign.toUpperCase()}</div>
                <div className="date">
                    {this.state.date_string}
                </div>
            </div>
        );
    }
});
