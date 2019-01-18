const nb = require('./nb.js');
function alg(coord, radi, pointsVal, probeR){
  var sr = new Data();
  sr.radii = radi;
  sr.nPoints = pointsVal;
  sr.xyz = coord;

  for (i =0; i<radi.length;i++){
    var ri = radi[i] + probeR;
    sr.r[i] = ri;
    sr.r2[i] = ri*ri;
  }
  sr.adj = nb.newNB(coord, sr.r);
  for (i=0;i<sr.r.length;i++){
    sr.sasa.push(atomArea(i, sr));
  }
  return sr.sasa;
}
function pointTransform(points, xyz, r){
  for (pi = 0; pi<points.length; pi++){
    points[pi][0] *= r;
    points[pi][1] *= r;
    points[pi][2] *= r;

    points[pi][0] += parseFloat(xyz[0]);
    points[pi][1] += parseFloat(xyz[1]);
    points[pi][2] += parseFloat(xyz[2]);
  }
}
function atomArea(i, sr){
  var nPoints = sr.nPoints;
  var nSurface = 0;
  var ri = sr.r[i];
  var r2 = sr.r2;
  var tp = testPoints(nPoints);
  pointTransform(tp, sr.xyz[i], ri);
  for (j=0;j<nPoints;j++){
    var buried = false;
    if (!buried){
      for (nbc = 0; nbc<sr.adj[i].nb.length;nbc++){
        var dx = tp[j][0] - sr.xyz[sr.adj[i].nb[nbc]][0];
        var dy = tp[j][1] - sr.xyz[sr.adj[i].nb[nbc]][1];
        var dz = tp[j][2] - sr.xyz[sr.adj[i].nb[nbc]][2];
        if (dx*dx+dy*dy+dz*dz <= r2[sr.adj[i].nb[nbc]]){
          buried = true;
          break;
        }
      }
    }
    if (!buried){
      nSurface++;
    }
  }
  result = (4.0*Math.PI*ri*ri*nSurface)/nPoints;
  return result;
}
function testPoints(n){
  var testPArray = [];
  var dlong = Math.PI*(3-Math.sqrt(5));
  var dz = 2.0/n;
  var longitude = 0;
  var z = 1-dz/2;
  for (count=0;count<n; count++){
    var r = Math.sqrt(1-z*z);
    var p = [];
    p.push(Math.cos(longitude)*r);
    p.push(Math.sin(longitude)*r);
    p.push(z);
    z -= dz;
    testPArray.push(p);
    longitude += dlong;
  }
  return testPArray;
}
function Data(){
  this.nAtoms = 0;
  this.nPoints = 0;
  this.probeR = 0;
  this.xyz = [];
  this.radii = [];
  this.adj = null;
  this.nPoints = 0;
  this.sasa = [];
  this.r = [];
  this.r2 = [];
}

module.exports.alg = alg;
