function radius(res, a, classifier) {
  var json = require('./json/protor.json');
  if (classifier == 'OONS') {
    json = require('./json/oons.json');
  } else if (classifier == 'NACCESS') {
    json = require('./json/naccess.json');
  }
  r = [-1.0, "ATOM_UNKNOWN"];
  json.forEach(function (data) {
    if (data.name == res) {
      for (i = 0; i < data.atomName.length; i++) {
        if (data.atomName[i] == a) {
          r[0] = data.atomRadius[i];
          r[1] = data.polar[i];
        }
      }
    }
  });
  return r;
}
function Node() {
  this.id = null;
  this.chain_label = null;
  this.res_index = -1;
  this.res_name = null;
  this.atom_name = null;
  this.symbol = null;
  this.the_class = 'ATOM_UNKNOWN';
  this.radius = null;
  this.coord = null;
  this.area = null;
}
function Atom() {
  this.id = 0;
  this.atom_name = null;
  this.symbol = null;
  this.the_class = 'ATOM_UNKNOWN';
  this.radius = null;
  this.coord = null;
  this.sasa = null;
  this.connect = [];
}
function Residue() {
  this.n = 0;
  this.name = '';
  this.area = 0;
  this.atoms = [];
}
function Model() {
  this.nChains = 0;
  this.sasa = null;
  this.chains = [];
}
function Chain() {
  this.nRes = 0;
  this.labels = null;
  this.res = [];
  this.sasa = 0;
}
function Structure() {
  this.models = [new Model()];
  this.nModels = 1;
}
function newAtomFromLine(line) {
  var a = new Node();
  a.id = parseInt(getAtomAttributes(line, 6, 11));
  a.res_name = getAtomAttributes(line, 17, 20);
  a.atom_name = getAtomAttributes(line, 13, 16);
  a.symbol = getAtomAttributes(line, 77, 78);
  a.chain_label = getAtomAttributes(line, 21, 22);
  a.res_index = getAtomAttributes(line, 23, 26);
  return a;
}
function getPDBStructure(params) {
  var tree = new Structure();
  const fs = require('fs');
  const path = require('path');
  const readline = require('readline');
  var filepluspath = path.join(__dirname, '..', 'uploads', params.file);
  var nummdl = 1;
  var modelIndex = 0;
  var chainIndex = 0;
  var resIndex = 0;
  var file = fs.readFileSync(filepluspath, 'utf8');
  file.toString().split(/\n/).forEach(function (line) {
    if (line.indexOf("NUMMDL") == 0) {
      nummdl = parseInt(getAtomAttributes(line, 11, 14));
    }
  });
  tree.nModels = nummdl;
  for (i = 1; i < nummdl; i++) {
    tree.models.push(new Model());
  }
  file.toString().split(/\n/).forEach(function (line) {
    if (line.indexOf("MODEL") == 0) {
      modelIndex++;
    }
    if (line.indexOf("ATOM") == 0) {
      var v = getCoordinates(line);
      var a = newAtomFromLine(line);
      chainIndex = checkChain(tree.models[modelIndex], a.chain_label);
      resIndex = checkRes(tree.models[modelIndex].chains[chainIndex], a);
      addAtomToTree(tree.models[modelIndex], a, v, params.classifier, chainIndex, resIndex);
    }
    if (line.indexOf("CONECT") == 0) {
      let lineIndex = 12;
      index = parseInt(line.substring(6, 11).trim());
      for (let ch = 0; ch < tree.models[modelIndex].chains.length; ch++) {
        for (let rs = 0; rs < tree.models[modelIndex].chains[ch].res.length; rs++) {
          for (let at = 0; at < tree.models[modelIndex].chains[ch].res[rs].atoms.length; at++) {
            if (tree.models[modelIndex].chains[ch].res[rs].atoms[at].id == index) {
              while (lineIndex < line.length) {
                tree.models[modelIndex].chains[ch].res[rs].atoms[at].connect.push(parseInt(line.substring(lineIndex, lineIndex + 5).trim()));
                lineIndex += 5;
              }
            }
          }
        }
      }
    }
  });
  //fillConnections(tree);
  return tree;
}/*
function fillConnections(tree) {
  for (let md = 0; md < tree.models.length; md++) {
    for (let ch = 0; ch < tree.models[md].chains.length; ch++) {
      for (let rs = 0; rs < tree.models[modelIndex].chains[ch].res.length; rs++) {
        for (let at = 0; at < tree.models[modelIndex].chains[ch].res[rs].atoms.length; at++) {
          if (tree.models[modelIndex].chains[ch].res[rs].atoms[at].id == index) {
            while (lineIndex < line.length) {
              tree.models[modelIndex].chains[ch].res[rs].atoms[at].connect.push(parseInt(line.substring(lineIndex, lineIndex + 5).trim()));
              lineIndex += 5;
            }
          }
        }
      }
    }
  }
}*/
function checkRes(chain, a) {
  var resIndex = 0;
  if (chain.nRes == 0) {
    chain.res.push(new Residue());
    chain.res[0].name = a.res_name;
    chain.res[0].n = a.res_index;
    chain.nRes += 1;
  } else {
    for (j = 0; j < chain.nRes; j++) {
      if ((chain.res[j].name == a.res_name) && (chain.res[j].n == a.res_index)) {
        return j;
      }
    }
    chain.res.push(new Residue());
    chain.nRes += 1;
    chain.res[j].name = a.res_name;
    chain.res[j].n = a.res_index;
    resIndex = chain.res[j].n - 1;
  }
  return resIndex;
}
function checkChain(model, label) {
  var chIndex = 0;
  if (model.nChains == 0) {
    model.chains.push(new Chain());
    model.chains[0].labels = label;
    model.nChains += 1;
  } else {
    for (j = 0; j < model.nChains; j++) {
      if (model.chains[j].labels == label) {
        return j;
      }
    }
    model.chains.push(new Chain());
    model.chains[j].labels = label;
    chIndex = model.nChains;
    model.nChains += 1;
  }
  return chIndex;
}
function addAtomToTree(model, atom, v, classi, chain, residue) {
  var r = [];
  var a = new Atom();
  r = checkAtomRadius(atom, classi);
  a.coord = v;
  a.id = atom.id;
  a.radius = r[0];
  a.the_class = r[1];
  a.atom_name = atom.atom_name;
  a.symbol = atom.symbol;
  model.chains[chain].res[residue].atoms.push(a);
}
function checkAtomRadius(a, classi) {
  r = radius(a.res_name, a.atom_name, classi);
  if (r[0] == -1) { r = radius("ANY", a.atom_name, classi); }
  return r;
}
function getAtomAttributes(line, indexfirst, indexsecond) {
  var rawstring = line.substring(indexfirst, indexsecond);
  return rawstring.trim();
}
function exportTree(tree) {
  //console.log(tree.structure[2]);
}
function getCoordinates(line) {
  var tmp = [];
  tmp[0] = parseFloat(getAtomAttributes(line, 31, 38));
  tmp[1] = parseFloat(getAtomAttributes(line, 39, 46));
  tmp[2] = parseFloat(getAtomAttributes(line, 47, 54));
  return tmp;
}
module.exports.exportTree = exportTree;
module.exports.getPDBStructure = getPDBStructure;
module.exports.Atom = Atom;