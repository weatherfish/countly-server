var GraphWrapper = React.createClass({

    getInitialState() {

        return {

        };
    },

    render_big_number: function() {

      var self = this;

        var i = 0;

        return _.map(this.props.big_numbers, function(item) {

            var id = i;

            i++;

            return <BigNumber
                      title={item.title}
                      value={item.total}
                      color={item.color}
                      active={true}
                      on_click={self.props.big_number_click}
                      id={id} />
        });
    },

    render() {

        var graph_style = {
            "width"       : this.props.width + "px",
            "height"      : this.props.height + "px",
            "margin-left" : this.props.margin_left + "px"
        }

        return (
            <div>
                <div className="trend_name">{this.props.trend_sign}</div>
                <granularity
                    className="granularity"
                    data={this.props.session_dp}
                    graph_width={this.props.graph_width}
                    type={this.props.granularity}
                    period={this.props.period} />

                <div id="dashboard-graph" style={graph_style}>

                    <div id="axis_left"></div>
                    <div id="axis_right"></div>

                    <div id="no_data_wrapper">
                        <div className="big_sign">You need to choose data to visualize it</div>
                        <div className="small_sign">Use checkboxes below to visualize data you want.</div>
                    </div>

                </div>

                <div className="big-numbers-container">{this.render_big_number()}</div>

            </div>
        )
    },

});
