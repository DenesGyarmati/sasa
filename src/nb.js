function newNB(coord, radi){
  var Atoms = [];
  for (i = 0; i<radi.length; i++){
    Atoms.push(new Atom());
    Atoms[i].index=i;
    Atoms[i].c = coord[i];
    Atoms[i].r = radi[i];
  }
  for (i = 0; i<Atoms.length;i++){
    checkRadius(Atoms, i);
  }
  return Atoms;
}
function checkRadius(atom, i){
  var a = atom[i];
  for (j = 0; j<atom.length;j++){
    if(j!=i){
      var c = atom[j];
      var dx = a.c[0] - c.c[0];
      var dy = a.c[1] - c.c[1];
      var dz = a.c[2] - c.c[2];
      var rs = a.r + c.r;
      var cent = Math.sqrt(dx*dx + dy*dy + dz*dz);
      if (rs>=cent){
        a.xd.push(dx);
        a.yd.push(dy);
        a.xyd.push(Math.sqrt(dx*dx+dy*dy));
        a.nb.push(c.index);
      }
    }
  }
}
function Atom(){
  this.index = 0;
  this.c = [];
  this.nb = [];
  this.xyd = [];
  this.xd = [];
  this.yd = [];
  this.r = 0;
}

module.exports.newNB = newNB;
