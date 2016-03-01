var PieChart = React.createClass({

    getInitialState: function() {

        var data = this.props.data_function();

        console.log("====== init data ========");
        console.log(data);

        data = data.chartDPTotal.dp;

        var formatted_data = [];

        for (var i = 0; i < data.length; i++)
        {
            formatted_data.push({ label : data[i]['label'], value: data[i]["data"][0][1] })
        }

        return {
            data : formatted_data
        };
    },

    componentWillMount: function() {

        $(event_emitter).on('date_choise', function(e, period){ // todo: rename to date_change
/*
            this.setState({
                data : data
            });
*/
            //this.draw_bars("#bar_chart");

        }.bind(this));

        $(event_emitter).on('data_changed', function(e, data){



        }.bind(this));

    },

    draw : function(container)
    {

        console.log("========== this.state.data =========");
        console.log(this.state.data);

        var pie = new d3pie("#pie_chart", {
          size: {
            canvasHeight: this.props.height,
            canvasWidth: this.props.width
          },
          data: {
            content :  this.state.data }
          });

    },

    render : function(){

        var style = {
            width : this.props.width,
            height : this.props.height
        }
        return (
            <svg className="pie_chart" style={style} id="pie_chart">
            </svg>
        );
    },

    componentDidMount : function()
    {
        this.draw("#pie_chart");
    },

    componentDidUpdate : function()
    {
        this.draw("#pie_chart");
    }

});
