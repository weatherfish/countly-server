var NoDataBlock = React.createClass({

    element_id : false,

    getInitialState: function() {

        this.element_id = this.makeid();

        return ({

        });

    },

    render : function()
    {

        var style= {
            "display" : this.props.display,
            "width" : this.props.width
        }

        return(
            <div style={style} className="nodata_block">
                <span className={"zero"}></span>
                <span className={"sign"}>NO DATA</span>
            </div>
        )
    },

    makeid : function()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for( var i=0; i < 7; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

});
