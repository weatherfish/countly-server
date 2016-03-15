var BigNumber = React.createClass({

    getInitialState: function() {
        return {
            selected : true
        };
    },

    handle_click : function()
    {
        this.setState({
            selected : !this.state.selected
        });

        this.props.on_click(this.props.id);

        $(event_emitter).trigger('big_number_state', {});

    },

    //  style="background-image:url('images/dashboard/{this.props.trend}trend.png');"

    onhover : function()
    {

        this.setState({
            onhover : true
        });

        if (!this.state.selected)
        {
            return true;
        }

        var data = {
            title : this.props.title,
            color : this.props.color,
            hover : true
        }

        //$(event_emitter).trigger('big_number_hover', data);
        this.props.on_hover(data);
    },

    onhoverend : function()
    {

        this.setState({
            onhover : false
        });

        if (!this.state.selected)
        {
            return true;
        }

        var data = {
            title : this.props.title,
            color : this.props.color,
            hover : false
        }

        //$(event_emitter).trigger('big_number_hover', data);
        this.props.on_hover(data);
    },

    render : function() {

        var select_font_color = "#3d3d3d";
        var number_font_color = "#132737";

        if (this.state.selected)
        {
            var bg_color     = this.props.color;
            var border_color = this.props.color;
        }
        else
        {
            var bg_color     = "white";
            var border_color = "gray";

            if (this.state.onhover)
            {
                select_font_color = this.props.color;
                number_font_color = this.props.color;
            }
        }

        var divStyle = {
            "border-color"     : border_color,
            "background-color" : bg_color
        };

        var select_style = {
            "color" : select_font_color
        }

        var number_style = {
            "color" : number_font_color
        }

        var title = this.props.title.toLowerCase().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

        var value = this.props.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        var style = {
            width : this.props.width
        }

        return (
            <div className="big-number" style={style} onMouseEnter={this.onhover} onMouseLeave={this.onhoverend} onClick={this.handle_click} data-help-localize="help.{{this.help}}">
                <div className="tick_wrp">
                    <div style={divStyle} className="tick">
                        <div className="tick_img"></div>
                    </div>
                </div>
                <div className="info_wrp">
                    <div style={select_style} className="select">{title}</div>
                    <div style={number_style} className="number">{value}</div>
                </div>
            </div>
        );
    }
});
