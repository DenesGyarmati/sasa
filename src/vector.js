
function create(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}
function multi(l, v) {
    return [l * v[0], l * v[1], l * v[2]];
}
function invert(v) {
    return [-v[0], -v[1], -v[2]];
}
function add(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}
function cross(v1, v2) {
    let nv = [];
    nv.push(v1[1] * v2[2] - v1[2] * v2[1]);
    nv.push((-v1[0] * v2[2]) + v1[2] * v2[0]);
    nv.push(v1[0] * v2[1] - v1[1] * v2[0]);
    return nv;
}
function dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}
function normalize(v) {
    let len = length(v);
    let nv = [];
    nv.push(v[0] / len);
    nv.push(v[1] / len);
    nv.push(v[2] / len);
    return nv;
}
function angle(v1, v2) {
    let u = dot(v1, v2);
    let tetha = u / (length(v1) * length(v2));
    return Math.arccos(tetha);
}
function length(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}
function planeVectorFromVectors(v1, v2) {
    return cross(v1, v2);
}
function planeVector(v1, v2, v3) {
    let first = create(v2, v1);
    let second = create(v3, v1);
    return normalize(cross(first, second));
}
function rotateInPlane(angle, v, n) {
    let cos = multi(Math.cos(angle), v);
    let a = Math.sin(angle);
    let b = cross(n, v);
    let sin = multi(a, b);
    return add(cos, sin);
}
module.exports.cross = cross;
module.exports.dot = dot;
module.exports.normalize = normalize;
module.exports.length = length;
module.exports.angle = angle;
module.exports.create = create;
module.exports.add = add;
module.exports.invert = invert;
module.exports.multi = multi;
module.exports.rotateInPlane = rotateInPlane;
module.exports.planeVector = planeVector;
module.exports.planeVectorFromVectors = planeVectorFromVectors;