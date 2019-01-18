function calc(coord, radi, params) {
  if (params.alg == 'SR') {
    const sr = require('./sr.js');
    return sr.alg(coord, radi, params.val, params.probeR);
  }
  if (params.alg == 'LR') {
    const lr = require('./lr.js');
    return lr.alg(coord, radi, params.val, params.probeR);
  }
}
function fillStructure(model, result) {
  var resSasa = 0;
  var chainSasa = 0;
  var modelSasa = 0;
  var resultIndex = 0;
  for (i = 0; i < model.nChains; i++) {
    for (j = 0; j < model.chains[i].nRes; j++) {
      for (z = 0; z < model.chains[i].res[j].atoms.length; z++) {
        model.chains[i].res[j].atoms[z].sasa = result[resultIndex];
        resSasa += result[resultIndex];
        chainSasa += result[resultIndex];
        modelSasa += result[resultIndex];
        //console.log(model.chains[i].res[j].atoms[z]);
        resultIndex++;
      }
      model.chains[i].res[j].area = resSasa;
      resSasa = 0;
    }
    model.chains[i].sasa = chainSasa;
    chainSasa = 0;
  }
  model.sasa = modelSasa;
}
function calcTree(tree, parameters) {
  tree.models.forEach(function (model) {
    var coord = [];
    var radi = [];
    model.chains.forEach(function (chain) {
      chain.res.forEach(function (res) {
        res.atoms.forEach(function (atom) {
          coord.push(atom.coord);
          radi.push(atom.radius);
        });
      });
    });
    result = calc(coord, radi, parameters);
    fillStructure(model, result);
  });
}
module.exports.calcTree = calcTree;
