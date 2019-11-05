export class UrlHelper {
	static getQueryVariable(variable)
	{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(null);
	}
}

export class Interactive{

	static getPosition(el) {
		let xPosition = 0;
		let yPosition = 0;
		while (el) {
			if (el.tagName == "BODY") {
				// deal with browser quirks with body/window/document and page scroll
				let xScrollPos = el.scrollLeft || document.documentElement.scrollLeft;
				let yScrollPos = el.scrollTop || document.documentElement.scrollTop;
				xPosition += (el.offsetLeft - xScrollPos + el.clientLeft);
				yPosition += (el.offsetTop - yScrollPos + el.clientTop);
			} else {
				xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
				yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
			}
			el = el.offsetParent;
		}
		return {
			x: xPosition,
			y: yPosition
		};
	}

	static getRectSon(el){
		let rect =  el.getBoundingClientRect();
		if(rect.x == undefined) rect.x = rect.left;
		if(rect.y == undefined) rect.y = rect.top;
		return rect;
	}

	/**
     * scroll window to the stop.
     * @param  {int} scrollDuration duration in seconds
     * @return void
     */
    static scrollToTop(scrollDuration) {
        const   scrollHeight = window.pageYOffset,
                scrollStep = Math.PI / ( scrollDuration / 15 ),
                cosParameter = scrollHeight / 2;
        var     scrollCount = 0,
                scrollMargin,
                scrollInterval = setInterval( function() {
                    if ( window.pageYOffset != 0 ) {
                        scrollCount = scrollCount + 1;  
                        scrollMargin = cosParameter - cosParameter * Math.cos( scrollCount * scrollStep );
                        window.scrollTo( 0, ( scrollHeight - scrollMargin ) );
                    } 
                    else clearInterval(scrollInterval); 
                }, 15 );
    }
}