/** @jsx React.DOM */

var TopBar = React.createClass({

    getInitialState: function() {
        return {
            fstmenu : "1stmenu",
            sndmenu : "2ndmenu"
        };
    },

    componentDidMount: function(){

        $(event_emitter).on('select', function(e, data){
          
            this.setState({
                fstmenu : data.fstmenu,
                sndmenu : data.sndmenu,
            });

        }.bind(this));

    },
    componentWillUnmount: function () {
        $(event_emitter).off('select');
    },

    render : function() {

        return (
              <div className="navigation">
                  <span className="fstmenu">{this.state.fstmenu}</span>
                  <div className="arrow_icon"></div>
                  <span className="sndmenu">{this.state.sndmenu}</span>
                  <div className="hint_icon"></div>
              </div>
        );
    }
});

React.render(
    <TopBar />,
    document.getElementById("top_bar")
);
