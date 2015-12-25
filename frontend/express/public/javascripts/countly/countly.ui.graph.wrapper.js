var GraphWrapper = React.createClass({

    getInitialState() {

        return {
            big_numbers : this.props.big_numbers,
            active : true
        };
    },

    render_big_number: function() {

        var self = this;

        return _.map(this.state.big_numbers, function(item, id) {

            console.log("map cur_id:", id);

            return <BigNumber
                      title={item.title}
                      value={item.total}
                      color={item.color}
                      active={item.active}
                      on_click={self.update}
                      id={id} />
        });
    },

    update(id, granularity_changed){

        console.log(">>>>>>>>. update .>>>>>>>>>>.", id, granularity_changed);
        console.log(this.state.big_numbers);

        var big_numbers = this.state.big_numbers;

        if (id > -1)
        {

            big_numbers[id].active = !big_numbers[id].active;

            var active = false;

            for (var i = 0; i < big_numbers.length; i++)
            {
                if (big_numbers[i].active)
                {
                    active = true;
                    break;
                }
            }
        }

        this.setState({
            big_numbers : big_numbers,
            active : active
        });

    },

    render() {

        var graph_style = {
            "width"       : this.props.width + "px",
            "height"      : this.props.height + "px",
            "margin-left" : this.props.margin_left + "px"
        }

        var axis_right_style = {
            "left" : (this.props.graph_width - 60) + "px"
        }

        var nodata_block_style = {
            "height"      : "100px", // todo: move above
            "padding-top" : "140px"
        }

        if (this.state.active)
        {
            nodata_block_style.display = "block";
            var granularity_class_name = "granularity hidden";
            /*document.getElementById('no_data_wrapper').style.display = "block";
            document.getElementsByClassName('granularity')[0].className = "granularity hidden";
            var no_data = true;*/
        }
        else
        {
            nodata_block_style.display = "none";
            var granularity_class_name = "granularity";
            /*document.getElementById('no_data_wrapper').style.display = "none";
            document.getElementsByClassName('granularity')[0].className = "granularity";
            var no_data = false;*/
        }

        return (
            <div>
                <div className="trend_name">{this.props.trend_sign}</div>
                <granularity
                    className={granularity_class_name}
                    data={this.props.data}
                    graph_width={this.props.graph_width}
                    type={this.props.granularity}
                    period={this.props.period} />

                <div id="dashboard-graph" style={graph_style}>

                    <div id="axis_left"></div>
                    <div id="axis_right" style={axis_right_style}></div>

                    <div id="no_data_wrapper" style={nodata_block_style}>
                        <div className="big_sign">You need to choose data to visualize it</div>
                        <div className="small_sign">Use checkboxes below to visualize data you want.</div>
                    </div>

                </div>

                <div className="big-numbers-container">{this.render_big_number()}</div>

            </div>
        )
    },

});

console.log(">>> finish load GraphWrapper  >>>");
