var OutsideClickClose = {

    clickedOutsideElement : function(event, reactid) {

        if (!event)
        {
            return false;
        }

        var theElem = this.getEventTarget(event);

        while(theElem != null) {
          //console.log("compare:", theElem.getAttribute("data-reactid"), " >> ", reactid);
          //if(theElem.getAttribute("data-reactid") == reactid)
          if(theElem.getAttribute("data-reactid") && theElem.getAttribute("data-reactid").indexOf(reactid) == 0)
            return false;
          theElem = theElem.offsetParent;
        }
        return true;
    },

    getEventTarget : function(evt) {
        var targ = (evt.target) ? evt.target : evt.srcElement;
        if(targ != null) {
          if(targ.nodeType == 3)
            targ = targ.parentNode;
        }
        return targ;
    },
};
