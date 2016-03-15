var MultiSelectBlock = React.createClass({

    getInitialState : function() {

        //var active_selector = this.props.selectors[0];

        var active_selectors = [];

        if (this.props.active_selectors_keys)
        {
            for (var a = 0; a < this.props.active_selectors_keys.length; a++)
            {
                for (var i = 0; i < this.props.selectors.length; i++)
                {
                    if (this.props.selectors[i].key == this.props.active_selectors_keys[a])
                    {
                        //active_selector = this.props.selectors[i];

                        active_selectors.push(this.props.selectors[i]);

                        break;
                    }
                }
            }
        }

        return({
            selectors : this.props.selectors,
            active_selectors : active_selectors,
            open : false
        });
    },

    componentWillReceiveProps : function(nextProps){

        if (nextProps.active_selector_key)
        {
            for (var i = 0; i < nextProps.selectors.length; i++)
            {

                if (nextProps.selectors[i].key == nextProps.active_selector_key)
                {
                    active_selector = nextProps.selectors[i];
                    break;
                }

            }

            this.setState({
                active_selector : active_selector
            });
        }

    },

    show_selectors : function() {

        this.setState({
            "open" : !this.state.open
        })

    },

    select : function(selector) {

        var active_selectors = this.state.active_selectors;

        var is_found = false;

        for (var i = 0; i < active_selectors.length; i++)
        {
            if (active_selectors[i].key == selector.key)
            {
                active_selectors.splice(i, 1);
                i--;
                is_found = true;
            }
        }

        if (!is_found)
        {
            active_selectors.push(selector);
        }

        var active_selectors_keys = [];

        active_selectors.forEach(function(element){

            active_selectors_keys.push(element.key);

        });

        if (this.props.setting)
        {
            this.props.onChange(this.props.setting, active_selectors_keys);
        }
        else
        {
            this.props.onChange(active_selectors_keys);
        }

        this.setState({
            "active_selectors" : active_selectors
        });

    },

    render : function(){

        var self = this;

        var selectors_style = {};

        if (!this.state.open) selectors_style.display = "none";

        var class_name = "multi_selectors_block";

        if (this.props.className)
        {
            class_name += " " + this.props.className;
        }

        var active_selectors_sign = "";

        for (var i = 0; i < self.state.active_selectors.length; i++)
        {
            active_selectors_sign += self.state.active_selectors[i].label + " ";
        }

        return(
            <div className={class_name} style={this.props.style}>

                <div className="current" onClick={this.show_selectors}>
                    <span className="sign">{active_selectors_sign}</span>
                    <span className="arrow"/>
                </div>

                <div className="selectors_items" style={selectors_style}>
                    <div className="top_arrow"/>
                    {
                        _.map(self.state.selectors, function(selector, id) {

                            var class_name = "";

                            for (var i = 0; i < self.state.active_selectors.length; i++)
                            {
                                if (selector.key == self.state.active_selectors[i].key)
                                {
                                    class_name = "active";
                                    break;
                                }
                            }

                            return (<span className={class_name} onClick={self.select.bind(self, selector)}>{selector.label}</span>)

                        })
                    }
                </div>
            </div>
        )
    }
});
