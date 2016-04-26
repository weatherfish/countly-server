var Alert = React.createClass({

    element_id : "svg_wrapper",

    full_line_data : [
                { x : 5, y : 85},
                {x : 15, y : 50},
                {x : 25, y : 70},
                {x : 35, y : 36},
                {x : 45, y : 64},
                {x : 55, y : 22},
                {x : 65, y : 50},
                {x : 75, y : 25},
                {x : 85, y : 30},
                {x : 95, y : -10},
              ],

    getInitialState: function() {

        //this.element_id = this.makeid();

        return ({
            lines_data : [],
            points_data : [],
            mounted : false
        });

    },
    
    componentDidMount : function()
    {

        var self = this;

        var add_point = function(){

            var lines_data = self.state.lines_data;
            var points_data = self.state.points_data;
            
            if (self.full_line_data[self.state.lines_data.length + 1])
            {
                /*
                lines_data.push({ 
                    "start" : self.full_line_data[self.state.line_data.length], 
                    "end" : self.full_line_data[self.state.line_data.length + 1]
                });*/
                
                lines_data.push([
                    self.full_line_data[self.state.lines_data.length], 
                    self.full_line_data[self.state.lines_data.length + 1]
                ]);
            }
                        
            points_data.push(self.full_line_data[self.state.points_data.length]);
        
            self.setState({
                points_data : points_data,
                lines_data : lines_data
            });
           
            if (self.state.points_data.length < self.full_line_data.length){
              
                setTimeout(function(){

                    add_point();

                }, 50);
            }
        }

        add_point();
        
        this.setState({
            mounted : true
        })

        //this.draw("#" + this.element_id);
    },

    componentDidUpdate : function()
    {
        this.draw("#" + this.element_id);
    },

    draw : function(element_id) {

        var self = this;

        var width = document.body.clientWidth - 200;
        var vis_height = 130;// document.body.clientHeight;

        //var radius = Math.min(width, height) / 2;
    
        if (!this.vis)
        {
            this.vis = d3.select(element_id)
    			.append("svg:svg")
    			.attr('width', width + "px")
    			.attr('height', (vis_height) + "px")
                .attr("class", "alert_svg")
                .style("left", 101)
                .style("background-color", "#ffffff"/*"#FF6138"*/)  // #FF6138
                //.style("border", "1px solid #FF6138")  // #FF6138
                //.style("border-bottom", "1px solid #ffffff")
        }

        var x = d3.scale.linear().range([0, width]).domain([0, 100]);
        var y = d3.scale.linear().range([0, vis_height - 30]).domain([100, 0]);


        var line = d3.svg.line()
            .x(function(d) {
              return x(d.x);
            })
            .y(function(d) { return y(d.y) + 20; })
            .interpolate('linear').tension(0.8);  // 'cardinal',
/*
        vis.selectAll("path")
          	.data(data)
          	.enter().append("svg:path")
            .attr("d", line)*/
            
        var color = "#ffffff";
        var color = "#FF6138";

        var enter_path = this.vis.selectAll('.line')
            .data(this.state.lines_data)
            .enter() 
                .append("path")          
                .attr("class", "line")
                .attr("d", line)
                .attr("stroke", color)
                .attr("stroke-width", "2px")
                .attr("fill", "none")
                .style("opacity", 0)

        enter_path.transition()
            .duration(500)
            .style("opacity", 1)


        var enter_points = this.vis.selectAll('.dot')
            .data(this.state.points_data)
            .enter()
            .append('g')
            .attr("class", "dot")
            .attr("transform", function(d) {
                return "translate(" + (Math.ceil(x(d.x))) + "," + (Math.ceil(y(d.y)) + 20) + ")"; } // tode: here in library is function for cross browser transform
            )
            .append('circle')
            .attr("r", 3)
            .attr('fill', color)
            .style("opacity", 0)

        enter_points.transition()
            .duration(500)
            .style("opacity", 1)



    },

    render : function()
    {

        //return false;

        var style= {
            "width" : document.body.clientWidth + "px",
            "height" : "700px", //document.body.clientHeight + "px",
            "opacity" : 0
        }
        
        if (this.state.mounted)
        {
            style.opacity = 1;
        }
        

        var info_style = {
            "width" : (document.body.clientWidth - 200) + "px",
            "height" : 130 + "px",
            "left" : 100 + 1 + "px"
        }

        return(
            <div style={style} className="alert_block" id={this.element_id}>
                <div id="back"/>
                <div id="svg_wrapper"/>
                <div id="info" style={info_style}>
                    <span>{this.props.sign}</span>
                    <div className="buttons_wrapper">                        
                        <div className="cancel" onClick={this.props.on_cancel}>{jQuery.i18n.map["common.cancel"]}</div>
                        <div className="confirm" onClick={this.props.on_confirm}>{jQuery.i18n.map["common.continue"]}</div>
                    </div>
                </div>
            </div>
        )
    },


    makeid : function()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for( var i=0; i < 7; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

});
