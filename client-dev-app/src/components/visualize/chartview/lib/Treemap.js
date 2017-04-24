
/*
 * treemap-squarify.js - open source implementation of squarified treemaps
 *
 * Treemap Squared 0.5 - Treemap Charting library 
 *
 * https://github.com/imranghory/treemap-squared/
 *
 * Copyright (c) 2012 Imran Ghory (imranghory@gmail.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 *
 */
var Treemap={};
(function(){Treemap.generate=function(){function q(a,b,c,e){this.xoffset=a;this.yoffset=b;this.height=e;this.width=c;this.shortestEdge=function(){return Math.min(this.height,this.width)};this.getCoordinates=function(a){var b=[],c=this.xoffset,f=this.yoffset,m=l(a)/this.height,e=l(a)/this.width,d;if(this.width>=this.height)for(d=0;d<a.length;d++)b.push([c,f,c+m,f+a[d]/m]),f+=a[d]/m;else for(d=0;d<a.length;d++)b.push([c,f,c+a[d]/e,f+e]),c+=a[d]/e;return b};this.cutArea=function(a){this.width>=this.height?
(a/=this.height,a=new q(this.xoffset+a,this.yoffset,this.width-a,this.height)):(a/=this.width,a=new q(this.xoffset,this.yoffset+a,this.width,this.height-a));return a}}function r(a,b,c,e,h){var e="undefined"===typeof e?0:e,h="undefined"===typeof h?0:h,d=[],i=[],f;if(a[0]&&a[0].constructor===Array){for(f=0;f<a.length;f++)d[f]=k(a[f]);b=g(d,b,c,e,h);for(f=0;f<a.length;f++)i.push(r(a[f],b[f][2]-b[f][0],b[f][3]-b[f][1],b[f][0],b[f][1]))}else i=g(a,b,c,e,h);return i}function g(a,b,c,e,h){for(var e="undefined"===
typeof e?0:e,h="undefined"===typeof h?0:h,p=d,i=b*c,f=[],m=l(a),i=i/m,m=0;m<a.length;m++)f[m]=a[m]*i;a=p(f,[],new q(e,h,b,c),[]);b=[];for(c=0;c<a.length;c++)for(e=0;e<a[c].length;e++)b.push(a[c][e]);return b}function d(a,b,c,e){var h,p;if(0===a.length)e.push(c.getCoordinates(b));else{h=c.shortestEdge();p=a[0];var i;var f;0===b.length?i=!0:(f=b.slice(),f.push(p),i=j(b,h),h=j(f,h),i=i>=h);i?(b.push(p),d(a.slice(1),b,c,e)):(p=c.cutArea(l(b),e),e.push(c.getCoordinates(b)),d(a,[],p,e));return e}}function j(a,
b){var c=Math.min.apply(Math,a),d=Math.max.apply(Math,a),h=l(a);return Math.max(Math.pow(b,2)*d/Math.pow(h,2),Math.pow(h,2)/(Math.pow(b,2)*c))}function l(a){var b=0,c;for(c=0;c<a.length;c++)b+=a[c];return b}function k(a){var b,c=0;if(a[0]&&a[0].constructor===Array)for(b=0;b<a.length;b++)c+=k(a[b]);else c=l(a);return c}return r}()})();
(function(){Treemap.draw=function(){function q(g,d){for(var j in d)d.hasOwnProperty(j)&&(g[j]=d[j]);return g}function r(g,d,j,l,k){var a,b,c;if(d[0][0]&&d[0][0].constructor===Array)for(a=0;a<d.length;a++)b=k.slice(),b.push(a),r(g,d[a],j,l,b);else for(a=0;a<d.length;a++){b=k.slice();b.push(a);c=j;for(g=0;g<b.length;g++)c=c[b[g]];l.draw(d[a],c,b)}}return function(g,d,j,l,k,a){var b,c,e,a="undefined"===typeof a?[]:a;c=function(){function a(b){var c,d=0;if(b[0]&&b[0].constructor===Array)for(c=0;c<b.length;c++)d+=
a(b[c]);else for(c=0;c<b.length;c++)d+=b[c].length;return d}function b(a){var c,d=0;if(a[0]&&a[0].constructor===Array)for(c=0;c<a.length;c++)d+=b(a[c]);else for(c=0;c<a.length;c++)d+=1;return d}var c=a(k)/b(k);return function(a){a=Math.pow((a[2]-a[0])*(a[3]-a[1]),0.5);return{fill:"#FCFCFC","font-size":Math.min(a/c,20)}}}();e=function(){return function(d,e,i){var f=d[0],g=d[1],j=d[2],l=d[3],k,n,o;k=b.rect(f,g,j-f,l-g);n=a.box&&a.box.constructor===Function?a.box(d,i):a.box;o=["hsb(0,1,0.4)","hsb(0.2,1,0.4)",
"hsb(0.4,1,0.4)","hsb(0.6,1,0.4)","hsb(0.8,1,0.4)"];n=q({stroke:"FEFEFE",fill:1===i.length?o[2]:o[(i[0]+2)%5]},n);"fill-opacity"in n&&(o=Raphael.getRGB(n.fill),o.error||(n.fill="rgba("+o.r+","+o.g+","+o.b+","+n["fill-opacity"]+")"));k.attr(n);e=b.text((f+j)/2,(g+l)/2,e);k=a.label&&a.label.constructor===Function?a.label(d,i):a.label;k=q(c(d,i),k);e.attr(k);e.getBBox().width>j-f&&e.getBBox().width<=l-g&&e.rotate(-90)}}();a.background="undefined"===typeof a.background?{}:a.background;a.label="undefined"===
typeof a.label?{}:a.label;a.box="undefined"===typeof a.box?{}:a.box;a.draw="undefined"===typeof a.draw?e:a.draw;b=new Raphael(g,d,j);b.rect(0,0,d,j).attr(a.background);g=Treemap.generate(l,d,j);r(b,g,k,a,[])}}()})();

export default Treemap;