var v = require('./vector.js');
var nbFile = require('./json/nb.json');
var structure = require('./structure.js');

function insert(res, con, nb, hs) {
  let helperPlanarVector = [];
  let helperVector = [];
  let helperAtom = [];
  let controlAtom = [];
  hs.forEach(function (data) {
    if (data.type == "ring") {
      let v1 = v.normalize(v.create(nb[0].coord, con.coord));
      let v2 = v.normalize(v.create(nb[1].coord, con.coord));
      let nvector = v.normalize(v.invert(v.add(v1, v2)));
      let coord = v.add(v.multi(1.09, nvector), con.coord);
      insertAtom(res, hs[0], coord, con);
      return;
    }
    if (data.type == "S") {
      /*if (con.connect.length == 1) {*/
      coplanar(res, con, nb, hs, 115.5, 0.95);
      //}
      return;
    }
    if (data.type == "carbox") {
      coplanar(res, con, nb, hs, 112, 0.984);
      return;
    }
    if (data.type == "C") {
      getTetra4th(res, con, nb, hs, 1.11);
      return;
    }
    if (data.type == "C4") {
      helperAtom = coplanar(res, con, nb, hs, -109.5, 1.11);
      return;
    }
    if (data.type == "C3") {
      let inserting = hs[0];
      if (helperAtom.length > 0) {
        controlAtom = helperAtom;
        inserting = hs[1];
      } else {
        controlAtom = nb[1].coord;
      }
      let n = v.normalize(v.create(nb[0].coord, controlAtom));
      let ba = v.create(controlAtom, con.coord);
      let ca = v.create(nb[0].coord, con.coord);
      let i = v.invert(v.normalize(v.add(ba, ca)));
      let rotated = v.rotateInPlane(54.75 * (Math.PI / 180), i, n);
      let coord = v.add(con.coord, v.multi(1.11, rotated));
      insertAtom(res, inserting, coord, con);
      helperPlanarVector = n;
      helperVector = i;
      controlAtom = [];
      return;
    }
    if (data.type == "C2") {
      let inserting = hs[1];

      if (helperAtom.length > 0) {
        inserting = hs[2];
        helperAtom = [];
      }
      let rotated = v.rotateInPlane(-54.75 * (Math.PI / 180), helperVector, helperPlanarVector);
      let coord = v.add(con.coord, v.multi(1.11, rotated));

      insertAtom(res, inserting, coord, con);
      return;
    }
    if (data.type == "coplanar") {
      coplanar(res, con, nb, hs, 109.5, 1.11);
      return;
    }
    if (data.type == "Ncoplanar") {
      /*if (con.connect.length == 1) {*/
      helperVector = coplanar(res, con, nb, hs, 107.8, 1.017);
      /*} else {
      }*/
      return;
    }
    if (data.type == "N2cop") {
      coplanar(res, con, nb, hs, 120, 1.02);
      return;
    }
    if (data.type == "N1cop") {
      coplanar(res, con, nb, hs, -120, 1.02);
      return;
    }
    if (data.type == "lysN2") {
      let ap = v.create(helperVector, con.coord);
      let ab = v.create(nb[1].coord, con.coord);
      let point = v.add(con.coord, v.multi(v.dot(ap, ab) / v.dot(ab, ab), ab));
      let newV = v.normalize(v.create(helperVector, point));
      let rotated = v.rotateInPlane(-117 * (Math.PI / 180), newV, v.normalize(ab));
      let coord = v.add(point, v.multi(1.017, rotated));
      insertAtom(res, hs[1], coord, con);
      return;
    }
    if (data.type == "argN") {
      let ap = v.create(nb[0].coord, con.coord);
      let ab = v.create(nb[1].coord, con.coord);
      let point = v.add(con.coord, v.multi(v.dot(ap, ab) / v.dot(ab, ab), ab));
      let newV = v.normalize(v.create(nb[0].coord, point));
      let rotated = v.rotateInPlane(-117 * (Math.PI / 180), newV, v.normalize(ab));
      let coord = v.add(point, v.multi(1.017, rotated));
      insertAtom(res, hs[0], coord, con);
      return;
    }
    if (data.type == "exc") {
      let ap = v.create(helperVector, con.coord);
      let ab = v.create(nb[1].coord, con.coord);
      let point = v.add(con.coord, v.multi(v.dot(ap, ab) / v.dot(ab, ab), ab));
      let newV = v.normalize(v.create(helperVector, point));
      let rotated = v.rotateInPlane(117 * (Math.PI / 180), newV, v.normalize(ab));
      let coord = v.add(point, v.multi(1.017, rotated));
      insertAtom(res, hs[1], coord, con);
      return;
    }
  });
}
function getTetra4th(res, con, nb, hs, dis) {
  let n = v.planeVector(nb[1].coord, nb[0].coord, nb[2].coord);
  coord = v.add(con.coord, v.multi(dis, n));
  insertAtom(res, hs[0], coord, con);
}
function coplanar(res, con, nb, hs, angle, dis) {
  let n = v.planeVector(con.coord, nb[0].coord, nb[1].coord);
  let nvector = v.normalize(v.create(nb[1].coord, con.coord));
  let rotated = v.rotateInPlane(angle * (Math.PI / 180), nvector, n);
  let coord = v.add(con.coord, v.multi(dis, rotated));
  insertAtom(res, hs[0], coord, con);
  return coord;
}
function insertAtom(res, atom, coord, con) {
  var newAtom = new structure.Atom();
  newAtom.coord = coord;
  newAtom.radius = 1.2;
  newAtom.atom_name = atom.name;
  newAtom.symbol = "H";
  newAtom.the_class = con.polarity;
  res.atoms.push(newAtom);
}
function getNB(symbol, res, hs) {
  let result = [];
  nbFile.forEach(function (data) {
    if ((res != "GLY" && res != "PRO" && data.name == 'global') || data.name == res) {
      data.control.forEach(function (sym) {
        if (sym.atom == symbol) {
          result = sym.nb;
          hs[0] = sym.h;
        }
      });
    }
  });
  if (result.length == 0) {
    return;
  } else {
    return result;
  }
}
function getNBCoord(atoms, nb) {
  var nbCoord = [];
  for (symbol = 0; symbol < nb.length; symbol++) {
    for (atom = 0; atom < atoms.length; atom++) {
      if (nb[symbol] == atoms[atom].atom_name) {
        nbCoord.push({
          "name": atoms[atom].atom_name,
          "coord": atoms[atom].coord
        });
      }
    }
  }
  return nbCoord;
}
function addHydrogen(tree) {
  let s = tree.models;
  for (i = 0; i < tree.nModels; i++) {
    for (j = 0; j < s[i].nChains; j++) {
      for (k = 0; k < s[i].chains[j].nRes; k++) {
        for (l = 0; l < s[i].chains[j].res[k].atoms.length; l++) {
          let hs = [];
          let nb = getNB(s[i].chains[j].res[k].atoms[l].atom_name, s[i].chains[j].res[k].name, hs);
          if (nb) {
            /*if (s[i].chains[j].res[k].atoms[l - 1]) {
              pre = s[i].chains[j].res[k].atoms[l - 1];
              console.log(pre.coord);
            }*/
            let nbCoordinates = getNBCoord(s[i].chains[j].res[k].atoms, nb);
            insert(s[i].chains[j].res[k], { "name": s[i].chains[j].res[k].atoms[l].atom_name, "coord": s[i].chains[j].res[k].atoms[l].coord, "polarity": s[i].chains[j].res[k].atoms[l].the_class/*, "connect": s[i].chains[j].res[k].atoms[l].*/ }, nbCoordinates, hs[0]);
          }
        }
      }
    }
  }
  return s;
}

module.exports.addHydrogen = addHydrogen;
