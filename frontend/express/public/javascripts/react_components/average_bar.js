var AverageBar = React.createClass({

    getInitialState : function() {

        return({
            
        });
    },

    render : function(){

        var width  = this.props.max - this.props.min;

        var bar_style = {
            "margin-left" : this.props.min + "%",
            "width" : width + "%"
        }

        var point_style = {
            "left" : (this.props.average - 2) + "%" // todo: 2px is Radius
        }

        return (
            <div className="average_bar">
                <div style={bar_style} className="inner_bar"/>
                <div style={point_style} className="average_point" />
            </div>
        );
    }

});
