/** @jsx React.DOM */

var DataDateSign = React.createClass({

    getInitialState: function() {

        return {
            date_string : global_controller.date_string,
        };
    },

    componentDidMount: function(){

        var self = this;

        var date_event = function(e, data){

            console.log("::::::::::: component period ::::::::::::", data.period);

            console.log(data.state);

            var date_string = data.state.from_string + " - " + data.state.to_string;

            self.setState({
                date_string : date_string,
            });

        };

        $(event_emitter).on('date_init',   date_event.bind(this));
        $(event_emitter).on('date_choise', date_event.bind(this));

    },

    render : function() {

        return (
          <div>
              {this.state.date_string}
          </div>
        );
    }
});
