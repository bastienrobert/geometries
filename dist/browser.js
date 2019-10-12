!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).Geometries={})}(this,function(t){"use strict";var e=function(){function t(t){var e=void 0===t?{}:t,h=e.width,i=void 0===h?1:h,s=e.height,n=void 0===s?1:s,o=e.widthSegments,r=void 0===o?1:o,d=e.heightSegments,g=void 0===d?1:d;this.width=i,this.height=n,this.widthSegments=Math.floor(r),this.heightSegments=Math.floor(g),this.vertices=[],this.uvs=[],this.normals=[],this.index=[],this.generate()}return t.prototype.generate=function(){var e=t.compute("x","y","z",1,-1,this.width,this.height,0,this.widthSegments,this.heightSegments),h=e.vertices,i=e.index,s=e.normals,n=e.uvs;this.vertices=h,this.index=i,this.normals=s,this.uvs=n},t.compute=function(t,e,h,i,s,n,o,r,d,g,a){void 0===a&&(a=0);for(var c=[],m=[],v=[],f=[],u=n/d,p=o/g,S={},l=0;l<=g;l++)for(var w=l*p-o/2,x=0;x<=d;x++){var y=x*u-n/2;S[t]=y*i,S[e]=w*s,S[h]=r/2,c.push(S.x,S.y,S.z),S[t]=0,S[e]=0,S[h]=r>0?1:-1,v.push(S.x,S.y,S.z),f.push(x/d),f.push(1-l/g)}for(l=0;l<g;l++)for(x=0;x<d;x++){var M=a+x+(d+1)*l,z=a+x+(d+1)*(l+1),b=a+x+1+(d+1)*(l+1),P=a+x+1+(d+1)*l;m.push(M,z,P),m.push(z,b,P)}return{vertices:c,normals:v,uvs:f,index:m}},t}(),h=function(){function t(t){var e=void 0===t?{}:t,h=e.width,i=void 0===h?1:h,s=e.height,n=void 0===s?1:s,o=e.depth,r=void 0===o?1:o,d=e.widthSegments,g=void 0===d?1:d,a=e.heightSegments,c=void 0===a?1:a,m=e.depthSegments,v=void 0===m?1:m;this.width=i,this.height=n,this.depth=r,this.widthSegments=Math.floor(g),this.heightSegments=Math.floor(c),this.depthSegments=Math.floor(v),this.faces={},this.vertices=[],this.index=[],this.normals=[],this.uvs=[],this.generate()}return t.prototype.generate=function(){var t=0;for(var h in this.faces.left=e.compute("z","y","x",-1,-1,this.depth,this.height,this.width,this.depthSegments,this.heightSegments,t),t+=this.faces.left.vertices.length/3,this.faces.right=e.compute("z","y","x",1,-1,this.depth,this.height,-this.width,this.depthSegments,this.heightSegments,t),t+=this.faces.right.vertices.length/3,this.faces.top=e.compute("x","z","y",1,1,this.width,this.depth,this.height,this.widthSegments,this.depthSegments,t),t+=this.faces.top.vertices.length/3,this.faces.bottom=e.compute("x","z","y",1,-1,this.width,this.depth,-this.height,this.widthSegments,this.depthSegments,t),t+=this.faces.bottom.vertices.length/3,this.faces.front=e.compute("x","y","z",-1,-1,this.width,this.height,-this.depth,this.widthSegments,this.heightSegments,t),t+=this.faces.front.vertices.length/3,this.faces.back=e.compute("x","y","z",1,-1,this.width,this.height,this.depth,this.widthSegments,this.heightSegments,t),t+=this.faces.back.vertices.length/3,this.faces){var i=this.faces[h],s=i.vertices,n=i.index,o=i.normals,r=i.uvs;this.vertices=this.vertices.concat(s),this.index=this.index.concat(n),this.normals=this.normals.concat(o),this.uvs=this.uvs.concat(r)}},t}(),i=function(){function t(t){var e=void 0===t?{}:t,h=e.radius,i=void 0===h?1:h,s=e.widthSegments,n=void 0===s?10:s,o=e.heightSegments,r=void 0===o?10:o;this.widthSegments=Math.floor(n),this.heightSegments=Math.floor(r),this.radius=i,this.vertices=[],this.index=[],this.normals=[],this.uvs=[],this.generate()}return t.prototype.generate=function(){for(var t=0;t<=this.widthSegments;t++)for(var e=t*Math.PI/this.widthSegments,h=Math.sin(e),i=Math.cos(e),s=0;s<=this.heightSegments;s++){var n=2*s*Math.PI/this.heightSegments,o=Math.sin(n),r=Math.cos(n)*h,d=i,g=o*h,a=1-s/this.heightSegments,c=1-t/this.widthSegments;this.vertices.push(this.radius*r,this.radius*d,this.radius*g),this.normals.push(r,d,g),this.uvs.push(a,c)}for(t=0;t<this.widthSegments;t++)for(s=0;s<this.heightSegments;s++){var m=t*(this.heightSegments+1)+s,v=m+this.heightSegments+1;this.index.push(v,m,m+1,v+1,v,m+1)}},t}();t.Box=h,t.Plane=e,t.Sphere=i,Object.defineProperty(t,"__esModule",{value:!0})});