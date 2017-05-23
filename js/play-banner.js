if(typeof $ === "undefined") {
    throw "The NeoJS library is not defined.";
}

var t = 0,
    r = !0,
    o = 1,
    s = window.navigator.userAgent,
    d = s.indexOf("MSIE 9"),
    c = s.indexOf("MSIE 10"),
    g = s.indexOf("Trident/"),
    f = s.indexOf("Edge/"),
    l = _window.width(),
    isFirefox = s.indexOf("Firefox/") > 0,
    isWebKit = 'WebkitAppearance' in document.documentElement.style,
    banner = $.select("play-banner", "id"),
    banner_video = banner.select("video"),
    supported = !(f > 0 || g > 0 || c > 0 || d > 0) && !isFirefox && isWebKit && typeof CSS !== "undefined" && $.isFunction(CSS.supports) && CSS.supports("clip-path", "url(#svgPath2)");

var nodes = $.select("div[class*=\"image-\"]", "query_all"),
    i = $.select(".image-fx");

/*
_document.bind("mousemove", function(t) {

    var r = Math.ceil(_window.width() / 2),
        s = Math.ceil(_window.height() / 2),
        d = t.pageX - r,
        c = t.pageY - s,
        l = c / s,
        m = -(d / r),
        u = Math.sqrt(Math.pow(l, 2) + Math.pow(m, 2)),
        h = 20 * u;

    return l >= o || m >= o ? !1 : (void nodes.each(function(node) {

        var a = node,
            e = a.data("offset") || 0;

        a.css("-webkit-transform", "rotate3d(" + parseFloat(l).toFixed(4) + ", " + parseFloat(m + e).toFixed(4) + ", 0, " + parseFloat(h * e).toFixed(4) + "deg)");
        a.css("transform", "rotate3d(" + parseFloat(l).toFixed(4) + ", " + parseFloat(m + e).toFixed(4) + ", 0, " + parseFloat(h * e).toFixed(4) + "deg)");

    }))

});
*/

$.select(window).bind("load", function() {

    if($.isDefined(banner_video) && banner_video.tagName() == "video") {

        var soundIconOn = banner.select(".sound-icon--on"),
            soundIconOff = banner.select(".sound-icon--off"),
            soundIcon = banner.select(".sound-icon");

        soundIcon.bind("click", function() {

            if(banner_video.origin.muted) {
                banner_video.origin.muted = false;
                soundIconOff.addClass("hidden");
                soundIconOn.removeClass("hidden");
            } else {
                banner_video.origin.muted = true;
                soundIconOff.removeClass("hidden");
                soundIconOn.addClass("hidden");
            }

        });

        if(!supported) {

            console.log("test");

            var v = document.getElementById("play_video");

            function pathToPolygon(path, samples){

                if(!samples) {
                    samples = 0;
                }

                var doc = path.ownerDocument;
                var poly = doc.createElementNS("http://www.w3.org/2000/svg", "polygon");

                for(var segs = [], s = path.pathSegList, i = s.numberOfItems - 1; i >= 0;--i) {
                    segs[i] = s.getItem(i);
                }

                var segments = segs.concat();
                var seg, lastSeg, points=[], x, y,
                    addSegmentPoint = function(s){

                        if(s.pathSegType != SVGPathSeg.PATHSEG_CLOSEPATH) {

                            if(s.pathSegType%2==1 && s.pathSegType>1) {
                                x += s.x; y+=s.y;
                            } else {
                                x = s.x; y=s.y;
                            }

                            var lastPoint = points[points.length-1];

                            if(!lastPoint || x!=lastPoint[0] || y!=lastPoint[1]) {
                                points.push([x,y]);
                            }

                        }

                    };

                for(var d = 0, len = path.getTotalLength(), step= len / samples; d <= len; d += step){

                    var seg = segments[path.getPathSegAtLength(d)];
                    var pt = path.getPointAtLength(d);

                    if(seg != lastSeg){
                        lastSeg = seg;
                        while (segs.length && segs[0]!=seg) addSegmentPoint(segs.shift());
                    }

                    var lastPoint = points[points.length-1];

                    if(!lastPoint || pt.x!=lastPoint[0] || pt.y!=lastPoint[1]) {
                        points.push([pt.x,pt.y]);
                    }

                }
                for(var i = 0, len = segs.length; i < len; ++i) {
                    addSegmentPoint(segs[i]);
                }

                for(var i = 0,len =points.length;i<len;++i) {
                    points[i] = points[i].join(',');
                }

                poly.setAttribute('points',points.join(' '));

                return poly;

            }

            var poly = pathToPolygon(document.querySelector("#svgPath2 path"), 1400),
                array = [];

            for(var j = poly.points.numberOfItems - 1; j >= 0; --j) {

                var pt = poly.points.getItem(j);

                array.push(pt.x);
                array.push(pt.y);

            }

            var canvas = document.getElementById("play_canvas");
            var context = canvas.getContext("2d");

            canvas.width = 609;
            canvas.height = 580;

            setInterval(function() {
                if(v.readyState === v.HAVE_ENOUGH_DATA) {
                    if(!supported) {
                        context.beginPath();
                        for(var i = 0; i < array.length; i += 2) {
                            context[i == 0 ? "moveTo" : "lineTo"](array[i], array[i + 1]);
                        }
                        context.clip();
                    }
                    context.drawImage(v, 0, 0, v.clientWidth, v.clientHeight);
                }
            }, 1000 / 60);

        }

    }

});