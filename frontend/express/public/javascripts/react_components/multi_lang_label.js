var MultiLangLabel = React.createClass({

    height : false,

    getInitialState: function() {

        return ({
            height : false,
        })
    },

    componentDidMount : function(){

        var height = React.findDOMNode(this).offsetHeight;

        this.height = height;

        this.props.onHeightChange(height);

    },

    componentDidUpdate : function(){

        var height = React.findDOMNode(this).offsetHeight;

        if (height != this.height)
        {
            this.height = height;
            this.props.onHeightChange(height);
        }

    },

    render : function(){

        return(
            <span>
                {this.props.label}
            </span>
        )
    }

});
