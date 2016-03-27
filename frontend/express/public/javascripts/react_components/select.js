var SimpleSelectBlock = React.createClass({

    getInitialState : function() {

        var active_selector = this.props.selectors[0];

        if (this.props.active_selector_key)
        {
            for (var i = 0; i < this.props.selectors.length; i++)
            {

                if (this.props.selectors[i].key == this.props.active_selector_key)
                {
                    active_selector = this.props.selectors[i];
                    break;
                }

            }
        }

        return({
            selectors : this.props.selectors,
            selectors_hash : JSON.stringify(this.props.selectors).hashCode(),
            active_selector : active_selector,
            open : false
        });
    },

    componentWillReceiveProps : function(nextProps){

        var new_state = {};

        if (nextProps.active_selector_key && nextProps.active_selector_key != this.state.active_selector.key)
        {

            var active_selector = false;

            for (var i = 0; i < nextProps.selectors.length; i++)
            {

                if (nextProps.selectors[i].key == nextProps.active_selector_key)
                {
                    active_selector = nextProps.selectors[i];
                    break;
                }

            }

            new_state.active_selector = active_selector;

        }

        if (this.state.selectors_hash != JSON.stringify(nextProps.selectors).hashCode())
        {
            new_state.selectors = nextProps.selectors;
            new_state.selectors_hash = JSON.stringify(nextProps.selectors).hashCode();

            for (var i = 0; i < new_state.selectors.length; i++)
            {
                if (new_state.selectors[i].key == this.state.active_selector.key){

                    new_state.active_selector = new_state.selectors[i];
                    break;
                }
            }

        }

        this.setState(new_state);

    },

    show_selectors : function() {

        this.setState({
            "open" : !this.state.open
        })

    },

    select : function(selector) {

        console.log("select 1:", selector);

        if (this.props.setting)
        {
            this.props.onChange(this.props.setting, selector.key);
        }
        else
        {
            this.props.onChange(selector.key);
        }

        console.log("select 2:", selector);

        this.setState({
            "active_selector" : selector,
            "open" : false
        });

    },

    render : function(){

        var self = this;

        var selectors_style = {};

        if (!this.state.open) selectors_style.display = "none";

        var class_name = "selectors_block";

        if (this.props.className)
        {
            class_name += " " + this.props.className;
        }

        return(
            <div className={class_name} style={this.props.style}>

                <div className="current" onClick={this.show_selectors}>
                    <span className="sign">{self.state.active_selector.label}</span>
                    <span className="arrow"/>
                </div>

                <div className="selectors_items" style={selectors_style}>
                    <div className="top_arrow"/>
                    {
                        _.map(self.state.selectors, function(selector, id) {

                            if (selector.key == self.state.active_selector.key)
                            {
                                var class_name = "active";
                            }
                            else
                            {
                                var class_name = "";
                            }

                            return (<span className={class_name} onClick={self.select.bind(self, selector)}>{selector.label}</span>)

                        })
                    }
                </div>
            </div>
        )
    }
});
