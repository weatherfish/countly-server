/** @jsx React.DOM */

var DataDateSign = React.createClass({

    getInitialState : function() {

        console.log(">> init DataDateSign >>");

        return {
            date_string : global_controller.date_string,
        };
    },

    componentDidMount : function(){

        $(event_emitter).on('date_init',   this.date_change_event.bind(this));
        $(event_emitter).on('date_change', this.date_change_event.bind(this));

    },

    date_change_event : function(e, data){

        var date_string = data.state.from_string + " - " + data.state.to_string;

        console.log("//////// date_change_event /////////", date_string);

        this.setState({
            date_string : date_string,
        });
    },

    render : function() {

        return (
          <div>
              {this.state.date_string}
          </div>
        );
    }
});
