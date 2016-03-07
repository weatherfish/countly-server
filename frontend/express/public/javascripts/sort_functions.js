var math_sort = function(a, b, sortBy, sortDir) // todo: move somewhere
{
    var sortVal = 0;
/*
    var a = a[sortBy];
    var b = b[sortBy];
*/
    if (a > b) {
        sortVal = 1;
    }
    if (a < b) {
        sortVal = -1;
    }

    if (sortDir === SortTypes.DESC) {
        sortVal = sortVal * -1;
    }

    return sortVal;
}

/*
function natural_sort(aa, bb, sortBy, sortDir){
    var a= aa[0], b= bb[0], a1, b1, i= 0, n, L= a.length;
    while(i<L){
        if(!b[i]) return 1;
        a1= a[i];
        b1= b[i++];
        if(a1!== b1){
            n= a1-b1;
            if(!isNaN(n)) return n;
            return a1>b1? 1: -1;*/
/*
            if (sortDir === SortTypes.DESC) {
                sortVal = sortVal * -1;
            }
*/
         /*   if (a1>b1)
            {
               return 1
            }
            else {
               return -1;
            }*/

   /*     }
    }

    console.log("========== sort ==========");
    return b[i]!= undefined? -1: 0;
}*/
/*
var natural_sort = function(a, b, sortBy, sortDir) // todo: move somewhere
{
    var sortVal = 0;

    if (a > b) {
         console.log("as:", a, ">", ", bs:", b);
        sortVal = 1;
    }
    if (a < b) {
      console.log("as:", a, "<", ", bs:", b);
        sortVal = -1;
    }

    if (sortDir === SortTypes.DESC) {
        sortVal = sortVal * -1;
    }

    return sortVal;
}
*/


function natural_sort(as, bs, sortBy, sortDir){


/*
   var as = as[sortBy];
   var bs = bs[sortBy];
*/
   var a, b, a1, b1, i= 0, n, L,
   rx=/(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;
   if(as=== bs){
       var retval = 0;
   }

   a= as.toLowerCase().match(rx);
   b= bs.toLowerCase().match(rx);
   L= a.length;
   while(i<L){
           if(!b[i]){
               var retval = 1;
           }
           a1= a[i],
           b1= b[i++];
           if(a1!== b1){
               n= a1-b1;

               //console.log("n:", n);

               //if(!isNaN(n)) return n;

               if (a1 > b1)
               {

                   console.log("as:", as, ">", ", bs:", bs);

                   if (sortDir === SortTypes.DESC)
                   {
                       return -1;
                   }
                   else
                   {
                       return 1;
                   }
               }
               else
               {

                   console.log("as:", as, "<", ", bs:", bs);

                   if (sortDir === SortTypes.DESC)
                   {
                       return 1;
                   }
                   else
                   {
                       return -1;
                   }
               }
           }
   }
   if (b[i])
   {
       if (sortDir === SortTypes.DESC)
       {
           return -1;
       }
       else
       {
           return 1;
       }
   }
   else {
       return 0;
   }

}
