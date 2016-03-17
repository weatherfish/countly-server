var PieChart = React.createClass({

    element_id : false,

    getInitialState: function() {

        this.element_id = this.makeid();

        var data = this.props.data_function();

        var formatted_data = [];

        for (var i = 0; i < data.length; i++)
        {
            formatted_data.push({ label : data[i]['name'], value: Math.round(data[i]["percent"]) })
        }

        return {
            data : formatted_data
        };
    },

    draw : function(container)
    {

        //return false;

        var pie = new d3pie("#" + this.element_id, {
            size: {
                canvasHeight : this.props.height,
                canvasWidth  : this.props.width
            },
            data: {
                content :  this.state.data
            }});

    },

    render : function(){

        var style = {
            width : this.props.width,
            height : this.props.height
        }
        return (
            <svg className="pie_chart" style={style} id={this.element_id}>
            </svg>
        );
    },

    componentDidMount : function()
    {
        this.draw("#" + this.element_id);
    },

    componentDidUpdate : function()
    {
        this.draw("#" + this.element_id);
    },

    makeid : function()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 7; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

});
