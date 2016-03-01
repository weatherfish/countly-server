/** @jsx React.DOM */

var GraphTimeExtension = React.createClass({

    getInitialState: function() {
        return {
            is_open : true
        };
    },

    handle_click : function()
    {
        this.setState({
            is_open : !this.state.is_open
        });
    },    

    render : function() {

        var elem_style = { };

        if (this.props.show)
        {
            elem_style.display = "block";
        }
        else
        {
            elem_style.display = "none";
        }

        if (this.state.is_open)
        {
            return (
                <div style={elem_style}>
                    <div className="icon" onClick={this.handle_click}>( i )</div>
                    <div id='info_hover_block'>
                        <span className='big'>Time range contains an Incomplete week</span>
                        <span className='small'>Click to extend to full week</span>
                        <div className="left_arrow">
                        </div>
                    </div>
                </div>
            );
        }
        else
        {
            return (
                <div style={elem_style}>
                    <div className="icon" onClick={this.handle_click}>( i )</div>
                </div>
            );
        }
    }
});
