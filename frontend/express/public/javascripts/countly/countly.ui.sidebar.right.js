var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var RightPart = React.createClass({

    getInitialState: function() {

        if (this.props.selected_item)
        {

            var nav_data = {
                fstmenu : this.props.nav_key,
                sndmenu : this.props.selected_item.charAt(0).toUpperCase() + this.props.selected_item.slice(1),
            }

            $(event_emitter).trigger('select', nav_data);

        }

        return {
            selected_item : this.props.selected_item,
            transition_finish : false,
        };
    },

    /*
        change right side items animation
        call when transition is finished
    */
    transitionEnd: function (event){

        if (event.propertyName != "opacity")
        {
            return false;
        }

        this.props.handle_changed();
        event.target.removeEventListener(event.type, this.transitionEnd);
    },

    componentDidUpdate: function() {

        if (this.props.transition && this.props.change_i == -1)
        {
            return this.props.handle_changed();
        }

        var active_elements = document.getElementsByClassName('item_transition');

        if (active_elements.length > 0)
        {
            transitionEvent = this.whichTransitionEvent(active_elements[0]);

            /*
                need to change menu items style for change opacity
            */

            if(transitionEvent){
                active_elements[0].addEventListener(transitionEvent, this.transitionEnd);
            }
        }
    },

    /*
        items is simple links, and they change window location
    */

    onItemClick: function(item) {

        //event.preventDefault();

        this.setState({
            selected_item : item,
        });

        /*
            trigger ui.topbar.js
            todo: move to the root component
        */

        console.log("================== handle_right_changed ==================", item);

        $("#content-container").html("-- loading --");

        var nav_data = {
            fstmenu : this.props.nav_key,
            sndmenu : item,
        }

        $(event_emitter).trigger('select', nav_data);

    },

    render: function() {

        var self = this;

        var nav_nodes = false;
        var head_node = false;

        var class_name       = "navitem";
        var head_class_name  = "head";
        var items_class_name = "menu_element";

        if (this.props.nav_key)
        {

            if (this.props.transition)
            {
                head_class_name += " transition_head";
            }

            var head_node = <div key="head_item" className={head_class_name}>
                                <span className="sign">{this.props.nav_key}</span>
                                <span className="close_icon" onClick={this.props.handleClose}></span>
                            </div>
        }

        if (this.props.navigation)
        {
            if (this.props.transition)
            {
                items_class_name += " item_transition";
            }

            var nav_nodes = this.props.navigation.map(function (nav_item, i) {

                var action_path = "#" + nav_item[1];

                var node_class_name = items_class_name;

                if ((self.state.selected_item && self.state.selected_item.toLowerCase()) == nav_item[0].toLowerCase())
                {
                    node_class_name += " active";
                }

                return (
                    <div key={nav_item[0]} className={node_class_name}>
                        <a href={action_path} onClick={self.onItemClick.bind(self, nav_item[0])} className="item">
                            {nav_item[0]}
                        </a>
                    </div>
                );
            });
        }

        if (this.props.is_active && !this.props.closed)
        {
            class_name += " active";
        }

        if (this.props.transition)
        {
            class_name += " transition";
        }

        var screen_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var description_bottom = ((1500 - screen_height) + 60 + 40 + 50) + "px"; // todo

        var description_style = {
            bottom : description_bottom
        };

        /*<div style={description_style} className="description"><span>{this.props.description}</span></div>*/

        return (
            <div className={class_name}>
                {head_node}
                {nav_nodes}
            </div>
        );
    },

    whichTransitionEvent: function(el){

        var t;
        var transitions = {
            'transition'      : 'transitionend',
            'OTransition'     : 'oTransitionEnd',
            'MozTransition'   : 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };
        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }
});
