"use strict";

const { UploadSolution } = require("./solutionuploader.js");

const path = require("path");
const args = process.argv.slice(2);

let solutionNames = [];

if (args.length > 0) {
    solutionNames = args.concat(args);
}

UploadSolution(solutionNames);