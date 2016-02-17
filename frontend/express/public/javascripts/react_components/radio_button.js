/** @jsx React.DOM */

var RadioButton = React.createClass({

    getInitialState: function() {
        return {
            onhover : false
        };
    },

    //  style="background-image:url('images/dashboard/{this.props.trend}trend.png');"

    onhover : function()
    {

        if (this.props.id == this.props.current_button_id)
        {
            return false;
        }

        this.setState({
            onhover : true
        });
    },

    onhoverend : function()
    {

        this.setState({
            onhover : false
        });
    },

    render : function() {

        if (this.state.onhover)
        {
            var select_font_color = this.props.data.color; // todo: move
            var number_font_color = this.props.data.color;
        }
        else
        {
            var select_font_color = "#3d3d3d"; // todo: move
            var number_font_color = "#132737";
        }


        var select_style = {
            "color" : select_font_color
        }

        var number_style = {
            "color" : number_font_color
        }

        var circle_style = {
            /*"background-color" : this.props.data.color*/
        }

        var inner_circle_style = { };

        var circle_select_style = { };

        var title = this.props.data.title.toLowerCase().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

        var value = this.props.data.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        //var circle_classname = "circle_select";

        if (this.props.id == this.props.current_button_id)
        {
            //circle_classname += " active";
            circle_style["background-color"] = this.props.data.color;
            //inner_circle_style["background-color"] = this.props.data.color;
            circle_select_style["background-color"] = this.props.data.color;
        }
        else
        {
            circle_style["background-color"] = "gray";
            //inner_circle_style["background-color"] = "white";
            circle_select_style["background-color"] = "white";
        }

        return(
                <div className={"radion_button"} onClick={this.props.on_click} onMouseEnter={this.onhover} onMouseLeave={this.onhoverend} >

                    <div className={"circles_wrapper"}>
                        <div style={circle_style} className={"circle_outside"}>
                            <div style={inner_circle_style} className={"circle_inside"}>
                                <div style={circle_select_style} className={"circle_select"}>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={"info_wrp"}>
                        <div style={select_style} className={"select"}>{title}</div>
                        <div style={number_style} className={"number"}>{value}</div>
                    </div>

                </div>
              )

    }
});
