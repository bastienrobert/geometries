'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Plane = /** @class */ (function () {
    function Plane(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.width, width = _c === void 0 ? 1 : _c, _d = _b.height, height = _d === void 0 ? 1 : _d, _e = _b.widthSegments, widthSegments = _e === void 0 ? 1 : _e, _f = _b.heightSegments, heightSegments = _f === void 0 ? 1 : _f;
        this.width = width;
        this.height = height;
        this.widthSegments = Math.floor(widthSegments);
        this.heightSegments = Math.floor(heightSegments);
        this.vertices = [];
        this.uvs = [];
        this.normals = [];
        this.index = [];
        this.generate();
    }
    Plane.prototype.generate = function () {
        var _a = Plane.compute('x', 'y', 'z', 1, -1, this.width, this.height, 0, this.widthSegments, this.heightSegments), vertices = _a.vertices, index = _a.index, normals = _a.normals, uvs = _a.uvs;
        this.vertices = vertices;
        this.index = index;
        this.normals = normals;
        this.uvs = uvs;
    };
    Plane.compute = function (u, v, w, udir, vdir, width, height, depth, gridX, gridY, firstIndex) {
        if (firstIndex === void 0) { firstIndex = 0; }
        var vertices = [];
        var index = [];
        var normals = [];
        var uvs = [];
        var segmentWidth = width / gridX;
        var segmentHeight = height / gridY;
        var vec3 = {};
        for (var i = 0; i <= gridY; i++) {
            var y = i * segmentHeight - height / 2;
            for (var j = 0; j <= gridX; j++) {
                var x = j * segmentWidth - width / 2;
                vec3[u] = x * udir;
                vec3[v] = y * vdir;
                vec3[w] = depth / 2;
                vertices.push(vec3.x, vec3.y, vec3.z);
                vec3[u] = 0;
                vec3[v] = 0;
                vec3[w] = depth > 0 ? 1 : -1;
                normals.push(vec3.x, vec3.y, vec3.z);
                uvs.push(j / gridX);
                uvs.push(1 - i / gridY);
            }
        }
        for (var i = 0; i < gridY; i++) {
            for (var j = 0; j < gridX; j++) {
                var a = firstIndex + j + (gridX + 1) * i;
                var b = firstIndex + j + (gridX + 1) * (i + 1);
                var c = firstIndex + j + 1 + (gridX + 1) * (i + 1);
                var d = firstIndex + j + 1 + (gridX + 1) * i;
                index.push(a, b, d);
                index.push(b, c, d);
            }
        }
        return {
            vertices: vertices,
            normals: normals,
            uvs: uvs,
            index: index
        };
    };
    return Plane;
}());

var BoxGeometry = /** @class */ (function () {
    function BoxGeometry(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.width, width = _c === void 0 ? 1 : _c, _d = _b.height, height = _d === void 0 ? 1 : _d, _e = _b.depth, depth = _e === void 0 ? 1 : _e, _f = _b.widthSegments, widthSegments = _f === void 0 ? 1 : _f, _g = _b.heightSegments, heightSegments = _g === void 0 ? 1 : _g, _h = _b.depthSegments, depthSegments = _h === void 0 ? 1 : _h;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.widthSegments = Math.floor(widthSegments);
        this.heightSegments = Math.floor(heightSegments);
        this.depthSegments = Math.floor(depthSegments);
        this.faces = {};
        this.vertices = [];
        this.index = [];
        this.normals = [];
        this.uvs = [];
        this.generate();
    }
    BoxGeometry.prototype.generate = function () {
        var i = 0;
        this.faces.left = Plane.compute('z', 'y', 'x', -1, -1, this.depth, this.height, this.width, this.depthSegments, this.heightSegments, i); // prettier-ignore
        i += this.faces.left.vertices.length / 3;
        this.faces.right = Plane.compute('z', 'y', 'x', 1, -1, this.depth, this.height, -this.width, this.depthSegments, this.heightSegments, i); // prettier-ignore
        i += this.faces.right.vertices.length / 3;
        this.faces.top = Plane.compute('x', 'z', 'y', 1, 1, this.width, this.depth, this.height, this.widthSegments, this.depthSegments, i); // prettier-ignore
        i += this.faces.top.vertices.length / 3;
        this.faces.bottom = Plane.compute('x', 'z', 'y', 1, -1, this.width, this.depth, -this.height, this.widthSegments, this.depthSegments, i); // prettier-ignore
        i += this.faces.bottom.vertices.length / 3;
        this.faces.front = Plane.compute('x', 'y', 'z', -1, -1, this.width, this.height, -this.depth, this.widthSegments, this.heightSegments, i); // prettier-ignore
        i += this.faces.front.vertices.length / 3;
        this.faces.back = Plane.compute('x', 'y', 'z', 1, -1, this.width, this.height, this.depth, this.widthSegments, this.heightSegments, i); // prettier-ignore
        i += this.faces.back.vertices.length / 3;
        for (var key in this.faces) {
            var face = this.faces[key];
            var vertices = face.vertices, index = face.index, normals = face.normals, uvs = face.uvs;
            this.vertices = this.vertices.concat(vertices);
            this.index = this.index.concat(index);
            this.normals = this.normals.concat(normals);
            this.uvs = this.uvs.concat(uvs);
        }
    };
    return BoxGeometry;
}());

var SphereGeometry = /** @class */ (function () {
    function SphereGeometry(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.radius, radius = _c === void 0 ? 1 : _c, _d = _b.widthSegments, widthSegments = _d === void 0 ? 10 : _d, _e = _b.heightSegments, heightSegments = _e === void 0 ? 10 : _e;
        this.widthSegments = Math.floor(widthSegments);
        this.heightSegments = Math.floor(heightSegments);
        this.radius = radius;
        this.vertices = [];
        this.index = [];
        this.normals = [];
        this.uvs = [];
        this.generate();
    }
    SphereGeometry.prototype.generate = function () {
        for (var width = 0; width <= this.widthSegments; width++) {
            var theta = (width * Math.PI) / this.widthSegments;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            for (var height = 0; height <= this.heightSegments; height++) {
                var phi = (height * 2 * Math.PI) / this.heightSegments;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);
                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;
                var u = 1 - height / this.heightSegments;
                var v = 1 - width / this.widthSegments;
                this.vertices.push(this.radius * x, this.radius * y, this.radius * z);
                this.normals.push(x, y, z);
                this.uvs.push(u, v);
            }
        }
        for (var width = 0; width < this.widthSegments; width++) {
            for (var height = 0; height < this.heightSegments; height++) {
                var first = width * (this.heightSegments + 1) + height;
                var second = first + this.heightSegments + 1;
                this.index.push(second, first, first + 1, second + 1, second, first + 1);
            }
        }
    };
    return SphereGeometry;
}());

exports.Box = BoxGeometry;
exports.Plane = Plane;
exports.Sphere = SphereGeometry;
