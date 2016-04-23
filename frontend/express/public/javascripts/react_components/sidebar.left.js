var LeftPart = React.createClass({

    getInitialState: function() {
        return {
            //selected      : -1,
            active        : true,
            in_transition : false
        };
    },

    handleClick: function(i, href) {
/*
        this.setState({
            selected : i,
        });
*/
        this.props.handleClick(i, href);
    },

    componentDidUpdate: function() {

        // todo: remove jquery

        $(".item_wrap").unbind('mouseenter mouseleave');

        $(".item_wrap.hoverable").hover( function (elem) {
            $(elem.currentTarget).children(".menu_sign").css('font-family', "Lato-Regular");
        }, function (elem) {
            $(elem.currentTarget).children(".menu_sign").css('font-family', "Lato-Light");
        });
    },

    render : function() {

        var self = this;

        var handle_click  = this.props.handleClick;
        var is_active     = this.props.is_active;
        var in_transition = this.props.in_transition;
        var selected      = this.props.selected_i;

        var full_classname       = "navitem";
        var dashboard_sign_class = "item_wrap visible dashboard_sign";
        var menu_sign_class      = "menu_sign";

        var navNodes = this.props.navigation.map(function (nav_item, i) {

            if (Object.prototype.toString.call(nav_item.items[0]) === '[object Array]')
            {
                var sub_menu = true;
                var href = false;
            }
            else
            {
                var sub_menu = false;
                var href = nav_item.items[1];
            }

            var class_name      = "item_wrap hoverable";
            var icon_class_name = "icon";
            var sign_class_name = "menu_sign";

            if (i == selected) // highlight active icon
            {
                icon_class_name += " active " + nav_item.icon + "_active";
                class_name += " active";
            }
            else
            {
                icon_class_name += " " + nav_item.icon;
            }

            var icon = <div className={icon_class_name}></div>;

            if (is_active || in_transition)
            {
                var sign = <span className={sign_class_name}><span>{nav_item.key}</span></span>;
            }
            else
            {
                var sign = false;
            }

            if (is_active && sub_menu)
            {
                var arrow = <div className="arrow"></div>;
            }
            else
            {
                var arrow = false;
            }

            return (
                <div className={class_name} onClick={self.handleClick.bind(self, i, href)}>
                    {icon}{sign}{arrow}
                </div>
            );
        });

        if (is_active)
        {
            full_classname += " active";
        }

        if (selected == -1)
        {
            dashboard_sign_class += " selected";
        }
        else
        {
            dashboard_sign_class += " hoverable";
        }

        return (
            <div className={full_classname}>
                <div className={dashboard_sign_class} onClick={this.handleClick.bind(this, -1)}>
                    <div className="icon"></div>
                    <span className={menu_sign_class}><span>{jQuery.i18n.map["sidebar.dashboard"]}</span></span>
                </div>
                {navNodes}
            </div>
        );
    }
});
