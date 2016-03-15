var SelectBlock = React.createClass({

    getInitialState : function() {

        var active_selector = this.props.selectors[0];

        for (var i = 0; i < this.props.selectors.length; i++)
        {

            if (this.props.selectors[i].key == this.props.active_selector_key)
            {
                active_selector = this.props.selectors[i];
                break;
            }

        }

        return({
            current_selectors : this.props.selectors,
            all_selectors : this.props.selectors,
            active_selector : active_selector,
            open : false
        });
    },

    show_selectors : function() {

        this.setState({
            "open" : !this.state.open
        })

    },

    select : function(selector) {

        this.props.onChange(this.props.setting, selector.key);

        this.setState({
            "active_selector" : selector,
            "open" : false
        });

    },

    change_search_input : function(event) {

        var value = event.target.value;

        if (!value)
        {
            return this.setState({
                current_selectors : this.state.all_selectors
            })
        }

        var current_selectors = [];

        this.state.all_selectors.forEach(function(selector){

            if (selector.label.toLowerCase().indexOf(value) > -1)
            {
                current_selectors.push(selector);
            }

        });

        this.setState({
            "current_selectors" : current_selectors
        });
    },

    render : function(){

        var self = this;

        var selectors_style = {};

        if (!this.state.open) selectors_style.display = "none";

        return(
            <div className="setting_block">

                <div className="setting_label">{this.props.label}</div>

                <div className="selectors_block">

                    <div className="current" onClick={this.show_selectors}>
                        <span className="sign">{self.state.active_selector.label}</span>
                        <span className="arrow"/>
                    </div>

                    <div className="selectors" style={selectors_style}>
                        <div className="top_arrow"/>

                        <span className="search_block"><input onKeyUp={this.change_search_input}/></span>
                        {
                            _.map(self.state.current_selectors, function(selector, id) {

                                if (selector.key == self.state.active_selector.key)
                                {
                                    var class_name = "active";
                                }
                                else
                                {
                                    var class_name = "";
                                }

                                return (<span className={class_name} onClick={self.select.bind(self, selector)} key={id}>{selector.label}</span>)

                            })
                        }
                    </div>

                </div>

            </div>
        )
    }
});
