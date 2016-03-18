var BoolPieChart = React.createClass({

    element_id : false,

    getInitialState: function() {

        this.element_id = this.makeid();

        var data = this.props.data_function();

        console.log("----- this.props --------");
        console.log(this.props);

        data = data[0];

/*
        var formatted_data = [];

        for (var i = 0; i < data.length; i++)
        {
            formatted_data.push({ label : data[i]['name'], value: Math.round(data[i]["percent"]) })
        }
*/
        return({
            label : data.name,
            value : data.percent
        })

    },

    draw : function() {

        var self = this;

        var width = this.props.width
        var height = this.props.height
        var radius = Math.min(width, height) / 2;

        var color = d3.scale.ordinal()
          .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var colors = ["#98abc5", "#ffffff"];

        var data = [{
                      "key" : "my_value",
                      "value" : this.state.value
                  },
                  {
                      "key" : "my_2value",
                      "value" : 100 - this.state.value
                  }];

        var arc = d3.svg.arc()
          .outerRadius(radius - 10)
          .innerRadius(radius - 32);

        var arc2 = d3.svg.arc()
              .outerRadius(radius - 12)
              .innerRadius(radius - 30);

        var labelArc = d3.svg.arc()
          .outerRadius(radius - 40)
          .innerRadius(radius - 40);



        var labelArc = d3.svg.arc()
              .outerRadius(radius - 40)
              .innerRadius(radius - 40);

        var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) { return d.value; });


        var svg = d3.select("#" + this.element_id)
              .attr("width", width)
              .attr("height", height)


        // -------------------------

        var empty_data = [
        {
            "key" : "empty",
            "value" : 100
        }]

        var gray_circle = svg
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var _gray_circle = gray_circle.selectAll(".arc")
                    .data(pie(empty_data))
                .enter().append("g")
                    .attr("class", "arc");

        _gray_circle.append("path")
                .attr("d", arc2)
                .style("fill", function(d, i) {
                    console.log("====== empty =======", i);
                    console.log(d);
                    return "#eeeeee";
                });

        _gray_circle.append("text")
                .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .text(function(d) { return d.key; });

        // ::::::::::::::::::::::::::::::::::::::::::::::::::::::

        var segment = svg
                      .append("g")
                      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var _segment = segment.selectAll(".arc")
                .data(pie(data))
              .enter().append("g")
                .attr("class", "arc");

        _segment.append("path")
            .attr("d", arc)
            .style("fill", function(d, i) {

                console.log("--- d ----");
                console.log(self.props);

                if (i == 0)
                {
                    return self.props.color;
                }
                else
                {
                    return "#ff00000";
                }

            })
            .style("fill-opacity", function(d, i) {
                if (i == 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            })

        _segment.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) { return d.key; });

    },

    render : function(){

        var svg_style = {
            width : this.props.width,
            height : this.props.height
        }

        var label_style = {
            height : this.props.height + "px",
            lineHeight : this.props.height + "px",
        }

        return (
            <div className="bool_pie_chart">
                <svg style={svg_style} id={this.element_id}>
                </svg>
                <span className="label" style={label_style}>{this.state.label}</span>
            </div>
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
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for( var i=0; i < 7; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

})
