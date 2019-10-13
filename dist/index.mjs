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
        this.indices = [];
        this.generate();
    }
    Plane.prototype.generate = function () {
        var _a = Plane.compute('x', 'y', 'z', 1, -1, this.width, this.height, 0, this.widthSegments, this.heightSegments), vertices = _a.vertices, indices = _a.indices, normals = _a.normals, uvs = _a.uvs;
        this.vertices = vertices;
        this.indices = indices;
        this.normals = normals;
        this.uvs = uvs;
    };
    Plane.compute = function (u, v, w, udir, vdir, width, height, depth, gridX, gridY, firstIndice) {
        if (firstIndice === void 0) { firstIndice = 0; }
        var vertices = [];
        var indices = [];
        var normals = [];
        var uvs = [];
        var segmentWidth = width / gridX;
        var segmentHeight = height / gridY;
        var vec3 = {};
        for (var i = 0; i <= gridY; ++i) {
            var y = i * segmentHeight - height / 2;
            for (var j = 0; j <= gridX; ++j) {
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
        for (var i = 0; i < gridY; ++i) {
            for (var j = 0; j < gridX; ++j) {
                var a = firstIndice + j + (gridX + 1) * i;
                var b = firstIndice + j + (gridX + 1) * (i + 1);
                var c = firstIndice + j + 1 + (gridX + 1) * (i + 1);
                var d = firstIndice + j + 1 + (gridX + 1) * i;
                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }
        return {
            vertices: vertices,
            normals: normals,
            uvs: uvs,
            indices: indices
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
        this.indices = [];
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
            var vertices = face.vertices, indices = face.indices, normals = face.normals, uvs = face.uvs;
            this.vertices = this.vertices.concat(vertices);
            this.indices = this.indices.concat(indices);
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
        this.indices = [];
        this.normals = [];
        this.uvs = [];
        this.generate();
    }
    SphereGeometry.prototype.generate = function () {
        for (var width = 0; width <= this.widthSegments; ++width) {
            var theta = (width * Math.PI) / this.widthSegments;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            for (var height = 0; height <= this.heightSegments; ++height) {
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
        for (var width = 0; width < this.widthSegments; ++width) {
            for (var height = 0; height < this.heightSegments; ++height) {
                var first = width * (this.heightSegments + 1) + height;
                var second = first + this.heightSegments + 1;
                this.indices.push(second, first, first + 1, second + 1, second, first + 1);
            }
        }
    };
    return SphereGeometry;
}());

function normalize3(a) {
    var out = [];
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len = x * x + y * y + z * z;
    if (len > 0)
        len = 1 / Math.sqrt(len);
    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    return out;
}
function subtract3(a, b) {
    var out = [];
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
}

var CylinderGeometry = /** @class */ (function () {
    function CylinderGeometry(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.radiusTop, radiusTop = _c === void 0 ? 0.5 : _c, _d = _b.radiusBottom, radiusBottom = _d === void 0 ? 0.5 : _d, _e = _b.height, height = _e === void 0 ? 1.5 : _e, _f = _b.radialSegments, radialSegments = _f === void 0 ? 8 : _f, _g = _b.heightSegments, heightSegments = _g === void 0 ? 1 : _g, _h = _b.openEnded, openEnded = _h === void 0 ? false : _h, _j = _b.thetaLength, thetaLength = _j === void 0 ? Math.PI * 2 : _j;
        this.radiusTop = radiusTop;
        this.radiusBottom = radiusBottom;
        this.height = height;
        this.radialSegments = Math.floor(radialSegments);
        this.heightSegments = Math.floor(heightSegments);
        this.openEnded = openEnded;
        this.thetaLength = thetaLength;
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.uvs = [];
        this._index = 0;
        this._halfHeight = this.height / 2;
        this.generate();
    }
    CylinderGeometry.prototype.generate = function () {
        this.generateTorso();
        if (!this.openEnded) {
            if (this.radiusTop > 0)
                this.generateCap(this.radiusTop, 1);
            if (this.radiusBottom > 0)
                this.generateCap(this.radiusBottom, -1);
        }
    };
    CylinderGeometry.prototype.generateTorso = function () {
        var slope = (this.radiusBottom - this.radiusTop) / this.height;
        var indexArray = [];
        for (var y = 0; y <= this.heightSegments; ++y) {
            var indexRow = [];
            var v = y / this.heightSegments;
            var radius = v * (this.radiusBottom - this.radiusTop) + this.radiusTop;
            for (var x = 0; x <= this.radialSegments; ++x) {
                var u = x / this.radialSegments;
                var theta = u * this.thetaLength;
                var sinTheta = Math.sin(theta);
                var cosTheta = Math.cos(theta);
                this.vertices.push(radius * sinTheta, -v * this.height + this._halfHeight, radius * cosTheta);
                this.normals = this.normals.concat(normalize3([sinTheta, slope, cosTheta]));
                this.uvs.push(u, 1 - v);
                indexRow.push(this._index++);
            }
            indexArray.push(indexRow);
        }
        for (var x = 0; x < this.radialSegments; ++x) {
            for (var y = 0; y < this.heightSegments; ++y) {
                var a = indexArray[y][x];
                var b = indexArray[y + 1][x];
                var c = indexArray[y + 1][x + 1];
                var d = indexArray[y][x + 1];
                this.indices.push(a, b, d);
                this.indices.push(b, c, d);
            }
        }
    };
    CylinderGeometry.prototype.generateCap = function (radius, sign) {
        var indexStart = this._index;
        for (var x = 0; x <= this.radialSegments; ++x) {
            this.vertices.push(0, this._halfHeight * sign, 0);
            this.normals.push(0, sign, 0);
            this.uvs.push(0.5, 0.5);
            this._index++;
        }
        var indexEnd = this._index;
        for (var x = 0; x <= this.radialSegments; ++x) {
            var u = x / this.radialSegments;
            var theta = u * this.thetaLength;
            var cosTheta = Math.cos(theta);
            var sinTheta = Math.sin(theta);
            this.vertices.push(radius * sinTheta, this._halfHeight * sign, radius * cosTheta);
            this.normals.push(0, sign, 0);
            this.uvs.push(cosTheta * 0.5 + 0.5, sinTheta * 0.5 * sign + 0.5);
            this._index++;
        }
        for (var x = 0; x < this.radialSegments; ++x) {
            var c = indexStart + x;
            var i = indexEnd + x;
            sign > 0 ? this.indices.push(i, i + 1, c) : this.indices.push(i + 1, i, c);
        }
    };
    return CylinderGeometry;
}());

var TorrusGeometry = /** @class */ (function () {
    function TorrusGeometry(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.radius, radius = _c === void 0 ? 1.5 : _c, _d = _b.tube, tube = _d === void 0 ? 0.5 : _d, _e = _b.radialSegments, radialSegments = _e === void 0 ? 10 : _e, _f = _b.tubularSegments, tubularSegments = _f === void 0 ? 100 : _f, _g = _b.arc, arc = _g === void 0 ? Math.PI * 2 : _g;
        this.radius = radius;
        this.tube = tube;
        this.radialSegments = Math.floor(radialSegments);
        this.tubularSegments = Math.floor(tubularSegments);
        this.arc = arc;
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.uvs = [];
        this.generate();
    }
    TorrusGeometry.prototype.generate = function () {
        for (var j = 0; j <= this.radialSegments; ++j) {
            for (var i = 0; i <= this.tubularSegments; ++i) {
                var u = (i / this.tubularSegments) * this.arc;
                var v = (j / this.radialSegments) * Math.PI * 2;
                var vertex = [
                    (this.radius + this.tube * Math.cos(v)) * Math.cos(u),
                    (this.radius + this.tube * Math.cos(v)) * Math.sin(u),
                    this.tube * Math.sin(v)
                ];
                this.vertices = this.vertices.concat(vertex);
                var normal = normalize3(subtract3(vertex, [
                    this.radius * Math.cos(u),
                    this.radius * Math.sin(u),
                    0
                ]));
                this.normals = this.normals.concat(normal);
                this.uvs.push(i / this.tubularSegments, j / this.radialSegments);
            }
        }
        for (var j = 1; j <= this.radialSegments; ++j) {
            for (var i = 1; i <= this.tubularSegments; ++i) {
                var a = (this.tubularSegments + 1) * j + i - 1;
                var b = (this.tubularSegments + 1) * (j - 1) + i - 1;
                var c = (this.tubularSegments + 1) * (j - 1) + i;
                var d = (this.tubularSegments + 1) * j + i;
                this.indices.push(a, b, d);
                this.indices.push(b, c, d);
            }
        }
    };
    return TorrusGeometry;
}());

export { BoxGeometry as Box, CylinderGeometry as Cylinder, Plane, SphereGeometry as Sphere, TorrusGeometry as Torrus };
