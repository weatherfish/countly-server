var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var RightPart = React.createClass({

    getInitialState: function() {
        return {
            transition_finish : false,
        };
    },

    /*
        change menu items animation
        call when transition is finished
    */

    transitionEnd: function (event){

        if (event.propertyName != "opacity")
        {
            return false;
        }

        this.props.handle_changed();
        event.target.removeEventListener(event.type, this.transition_end);
    },

    componentDidUpdate: function() {

        if ( this.props.transition && this.props.change_i == -1)
        {
            return this.props.handle_changed();
        }

        activeEl = document.getElementsByClassName('transition');

        if (activeEl.length > 0)
        {

            console.log("active elem:", activeEl.length);

            transitionEvent = this.whichTransitionEvent(activeEl[0]);

            if(transitionEvent){
                activeEl[0].addEventListener(transitionEvent, this.transitionEnd);
            }
        }

    },

    render: function() {

        var nav_nodes = false;
        var head_node = false;

        var class_name       = "navitem";
        var head_class_name  = "head";
        var items_class_name = "menu_element";

        if (this.props.nav_key)
        {

            if (this.props.transition)
            {
                head_class_name += " transition";
            }

            var head_node = <div key={this.props.nav_key} className={head_class_name}>
                                <span className="sign">{this.props.nav_key}</span>
                                <span className="close_icon" onClick={this.props.handleClose}></span>
                            </div>
        }

        if (this.props.navigation)
        {

            if (this.props.transition)
            {
                items_class_name += " transition";
            }
            else
            {
                items_class_name += " finish_transition";
            }

            // <div key={nav_item} className={items_class_name}> todo !

            var nav_nodes = this.props.navigation.map(function (nav_item, i) {

                return (
                    <div className={items_class_name}>
                        <a className="item">
                            {nav_item}
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

        return (
            <div className={class_name} ref="test">
                {head_node}
                {nav_nodes}
                <div className="description"><span>{this.props.description}</span></div>
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
