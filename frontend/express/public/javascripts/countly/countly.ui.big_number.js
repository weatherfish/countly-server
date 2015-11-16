/** @jsx React.DOM */

var BigNumber = React.createClass({

    getInitialState: function() {
        return {
            "selected" : true
        };
    },

    handle_click : function()
    {
        this.setState({
            "selected" : !this.state.selected
        });

        this.props.on_click(this.props.id);

    },

    //  style="background-image:url('images/dashboard/{this.props.trend}trend.png');"

    render : function() {

        if (this.state.selected)
        {
            var color = this.props.color;
        }
        else {
            var color = "gray";
        }

        var divStyle = {
            "border-color"     : color,
            "background-color" : color
        };

        // this.props.on_click.bind(this, 77)

        return (
            <div className="big-number" onClick={this.handle_click} data-help-localize="help.{{this.help}}">
                <div className="tick_wrp">
                    <div style={divStyle} className="tick">
                        <div className="tick_img"></div>
                    </div>
                </div>
                <div className="info_wrp">
                    <div className="select">{this.props.title}</div>
                    <div className="number">{this.props.value}</div>
                </div>
            </div>
        );
    }
});
