const http = require("http");
const fs = require("fs");
const structure = require("./structure.js");
const core = require("./core.js");
const hydrogen = require("./hydrogen.js");

function runAnalysis(params) {
  tree = structure.getPDBStructure(params);
  hydTree = hydrogen.addHydrogen(tree);
  core.calcTree(tree, params);
  const util = require("util");
  /*console.log(
    util.inspect(tree, { showHidden: false, depth: null })
  );*/ /*
    var nodeStructure = node.childrenNode(node.childrenNode(tmp_tree));*/
  return tree;
}
function Parameters() {
  this.alg = "LR"; //algor. name
  this.val = 50; //calculation constant
  this.probeR = 1.4; //probe radius
  this.classifier = "PROTOR"; //radius classifier
  this.output = []; //output formats (DOM = NULL, raw = TXT, ....)
  this.errlog = null; //log for debugging
  this.file = "VAL.pdb"; //file location
}
async function main(data) {
  /*var files = data.filenames.split(", ");
  for (filenum = 1; filenum < files.length; filenum++) {
    var params = new Parameters();
    params.file = files[filenum];
    params.probeR = parseFloat(data.radius);
    switch (data.select) {
      case "naccess":
        params.classifier = "NACCESS";
        break;
      case "oons":
        params.classifier = "OONS";
        break;
      default:
        params.classifier = "PROTOR";
    }
    if (data.alg == "sr") {
      params.alg = "SR";
      params.val = parseInt(data.srnum);
    } else {
      params.val = parseInt(data.lrnum);
    }
    var tree = runAnalysis(params);
    createOutput(tree);
  }*/
  var tree = runAnalysis(new Parameters());
  createOutput(tree);

  return tree;
}
main('ok');
function createOutput(tree) { }
module.exports.main = main;
