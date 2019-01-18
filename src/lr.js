const nb = require('./nb.js');
const TWOPI = 2*Math.PI;

function alg(coord, radi, slicesVal, probeR){
  var lr = new Data();
  for (i = 0;i<radi.length;i++){
    lr.radii.push(radi[i]+probeR);
  }
  lr.nAtoms = radi.length;
  lr.nSlices = slicesVal;
  lr.adj= nb.newNB(coord,lr.radii);
  for (i=0;i<lr.nAtoms;i++){
    lr.sasa.push(atomArea(lr, coord, i));
  }
  return lr.sasa;
}
function Data(){
  this.nAtoms = 0;
  this.radii = [];
  this.adj = null;
  this.nSlices = 0;
  this.sasa = [];
}
function atomArea(lr, coord, i){
  var Ri = lr.radii[i];
  var nni = lr.adj[i].nb.length;
  var zi = coord[i][2];
  var ns = lr.nSlices;
  var delta = 2 * Ri / ns;
  var z = zi - Ri - 0.5 * delta;
  var sasa = 0;
  for (islice = 0; islice < ns; islice++){ //begins the slices
    z += delta;
    var arc = [];
    var di = Math.abs(zi - z);
    var RiPrime2 = Ri*Ri-di*di;
    if (RiPrime2 < 0) {continue;}
    var RiPrime = Math.sqrt(RiPrime2);
    if (RiPrime <= 0) {continue;}
    var isBuried = false;
    for (j=0; j<nni; j++){
      var zj = coord[lr.adj[i].nb[j]][2];
      var dj = Math.abs(zj-z);
      var Rj = lr.adj[lr.adj[i].nb[j]].r;
      if (dj < Rj){
        var RjPrime2 = Rj*Rj-dj*dj;
        var RjPrime = Math.sqrt(RjPrime2);

        var dij = lr.adj[i].xyd[j];
        if (dij >= RiPrime + RjPrime){continue;}
        if (dij + RiPrime < RjPrime){
          isBuried = true;
          break;
        }
        if (dij + RjPrime < RiPrime){continue;}
        var alpha = Math.acos((RiPrime2 + dij*dij - RjPrime2)/(2*RiPrime*dij));
        var beta = Math.atan2(lr.adj[i].yd[j],lr.adj[i].xd[j]) + Math.PI;
        var inf = beta - alpha;
        var sup = beta + alpha;
        if (inf < 0){inf+=TWOPI;}
        if (sup > 2*Math.PI){sup -= TWOPI;}
        if (sup<inf){
          arc.push([0,sup]);
          arc.push([inf,TWOPI]);
        }else{
          arc.push([inf,sup]);
        }
      }
    }
    if (!isBuried){
      sasa += delta*Ri*exposedArc(arc);
    }
  }
  return sasa;
}
function exposedArc(arc){
  if (arc.length==0){return TWOPI;}
  arc.sort();
  var sum = arc[0][0];
  var sup = arc[0][1];
  for (arci=1;arci<arc.length;arci++){
    if (sup<arc[arci][0]){sum+=arc[arci][0] - sup;}
    var tmp = arc[arci][1];
    if (tmp > sup) {sup = tmp;}
  }
  return sum + TWOPI - sup;
}
module.exports.alg = alg;
