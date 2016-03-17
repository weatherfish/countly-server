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

        var element_width = this.props.blockWidth - 20;

        var active_selectors_sign = '';

        for (var i = 0; i < active_selectors.length; i++)
        {
            active_selectors_sign += active_selectors[i].label;

            if (i == active_selectors.length - 1)
            {
                active_selectors_sign += "";
            }
            else
            {
                active_selectors_sign += ", ";
            }

        }

        //var element_width = this.state.blockWidth - 20 * 2;

        var text_width = Math.round(this.getTextWidth(active_selectors_sign, "normal 14px Lato-Semibold"));

        var rows = Math.ceil(text_width / (element_width - 50)); // todo: var

        return({
            selectors : this.props.selectors,
            active_selectors : active_selectors,
            open : false,
            blockWidth : this.props.blockWidth,
            element_width : element_width,
            row_height : 30,
            rows : rows,
            active_selectors_sign : active_selectors_sign,
            parent_height : this.props.parent_height
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

        var active_selectors_sign = '';

        for (var i = 0; i < this.state.active_selectors.length; i++)
        {
            active_selectors_sign += this.state.active_selectors[i].label;

            if (i == this.state.active_selectors.length - 1)
            {
                active_selectors_sign += "";
            }
            else
            {
                active_selectors_sign += ", ";
            }

        }

        //var element_width = this.state.blockWidth - 20 * 2;

        var text_width = Math.round(this.getTextWidth(active_selectors_sign, "normal 14px Lato-Semibold"));

        var rows = Math.ceil(text_width / (this.state.element_width - 50)); // todo: var

        this.setState({
            //element_width : element_width,
            rows : rows,
            active_selectors_sign : active_selectors_sign,
            parent_height : nextProps.parent_height
        })

    },

    shouldComponentUpdate(nextProps, nextState){

        if (this.state.active_selectors_sign == nextState.active_selectors_sign && this.state.rows == nextState.rows && this.state.open == nextState.open && this.state.parent_height == nextState.parent_height)
        {
            return false;
        }

        if (this.props.onHeightChange) this.props.onHeightChange(this.props.label, nextState.row_height * nextState.rows + 10);

        return true;

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

        var arrow_width = 20;

        var current_block_style = {
            width : this.state.element_width + "px",
            //height : (this.state.row_height * this.state.rows) + 10 + "px"
        };

/*
        if (this.props.parent_height)
        {
            current_block_style.height = this.props.parent_height;
        }
        else
        {
            current_block_style.height = (this.state.row_height * this.state.rows) + 10 + "px";
        }
*/

        console.log("this.props.parent_height:", this.props.parent_height);

        var own_height = (this.state.row_height * this.state.rows) + 10;

        if (this.props.parent_height > own_height)
        {
            current_block_style.height = this.props.parent_height + "px";
            selectors_style.top = this.props.parent_height + 10 + "px";
        }
        else
        {
            current_block_style.height = own_height + "px";
            selectors_style.top = own_height + 10 + "px";
        }


        selectors_style.width = this.state.element_width + "px";

        var arrow_style = {
            "left" : this.state.element_width / 2 - arrow_width / 2
        }

        return(
            <div className={class_name}>

                <div className="current" onClick={this.show_selectors} style={current_block_style}>
                    <span className="sign">{this.state.active_selectors_sign}</span>
                    <span className="arrow" style={arrow_style}/>
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
    },

    getTextWidth : function(text, font) {
        // re-use canvas object for better performance
        var canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement("canvas"));
        //canvas.width = "120px";
        var context = canvas.getContext("2d");
        context.font = font;
        context["letter-spacing"] = "0.98px";
        var metrics = context.measureText(text);
        return metrics.width;
    },

});
