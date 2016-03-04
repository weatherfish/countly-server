var Loader = React.createClass({

    render : function(){

        var wrapper_style = {
            width  : get_viewport_width(),
            height : $(document).height()
        }

        return (<div id='loader_wrapper' style={wrapper_style}><div id='loader'></div></div>);
    }
})
