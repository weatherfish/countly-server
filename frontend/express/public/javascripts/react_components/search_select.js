var SelectBlock = React.createClass({

    mixins: [OutsideClickClose],

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

        var new_open_state = !this.state.open;

        console.log("new_open_state:", new_open_state);

        if (new_open_state)
        {

            var self = this;

            document.onclick = function(event) {

                if(self.clickedOutsideElement(event, React.findDOMNode(self).getAttribute("data-reactid")))
                {

                    console.log("--- click outside ----");

                    document.onclick = false;

                    self.setState({
                        "open" : false
                    })
                }
            }
        }

        this.setState({
            "open" : new_open_state
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

        var style = {};
        var top_arrow_style = {};

        if (this.props.width) {

            style.width = this.props.width;
            top_arrow_style.left = this.props.width - 23;

        }

        return(
            <div className="setting_block">

                <div className="setting_label">{this.props.label}</div>

                <div className="search_selectors_block">

                    <div className="current" onClick={this.show_selectors} style={style}>
                        <span className="sign">{self.state.active_selector.label}</span>
                        <span className="arrow"/>
                    </div>

                    <div className="selectors_wrapper" style={selectors_style}>

                        <div className="top_arrow" style={top_arrow_style} />

                        <div className="search_block">
                            <div className="search_icon"/>
                            <input onKeyUp={this.change_search_input}/>
                        </div>

                        <div className="selectors">

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
            </div>
        )
    }
});
