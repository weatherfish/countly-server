/** @jsx React.DOM */

var TopBar = React.createClass({

    getInitialState: function() {
        return {
            fstmenu : "",
            sndmenu : "Dashboard"
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

        if (this.state.fstmenu)
        {
            var arrow_block = <div className="arrow_icon"></div>;
        }
        else
        {
            var arrow_block = "";
        }

        var sndmenu_class = "sndmenu";

        if (!this.state.fstmenu)
        {
            sndmenu_class += " dashboard";
        }

        return (
              <div className="navigation">
                  <span className="fstmenu">{this.state.fstmenu}</span>
                  {arrow_block}
                  <span className={sndmenu_class}>{this.state.sndmenu}</span>
                  <div className="hint_icon"></div>
              </div>
        );
    }
});

React.render(
    <TopBar />,
    document.getElementById("top_bar")
);
