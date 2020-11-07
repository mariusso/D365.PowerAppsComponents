"use strict";

const path = require("path");
const adal = require("./adal");
const fs = require("fs");
const superagent = require("superagent");
const { customAlphabet } = require("nanoid");
const clientConfig = require("./clientConfig.json");
const solutionManifest = require("./solutionmanifest.json");

if (clientConfig == null) {
    throw new Error("Missing clientConfig.json");
}

exports.UploadSolution = async (solutionNames) => {

    const tokenResponse = await adal.acquireTokenWithClientCredentials();
    const headers = getRequestHeaders(tokenResponse);

    let solutions = solutionManifest.Solutions;

    if (solutionNames != undefined && solutionNames.length > 0) {
        solutions = solutions.filter((s) => {
            return solutionNames.some((name) => name === s.Name);
        });
    }

    if (solutions.length < 1) {
        console.info("No solutions to upload");
        return;
    }

    for (const solution of solutions) {

        const importSolutionUrl = clientConfig.webApiUrl + "ImportSolution";
        const solutionBase64String = await GetSolution(solution.Path);
        const guidGenerator = customAlphabet("abcdef0123456789", 32);
        const guid = guidGenerator();

        const importSolutionRequest = {
            OverwriteUnmanagedCustomizations: true,
            PublishWorkflows: true,
            ImportJobId: guid,
            CustomizationFile: solutionBase64String,
        };

        console.log("Importing solution '" + solution.Name + "'...");
        await superagent.post(importSolutionUrl).set(headers).send(importSolutionRequest).catch((error) => {
            console.log(error);
        });

        console.log("Import of '" + solution.Name + "' complete.");
    }
}

const GetSolution = async (relativePath) => {

    const absolutePath = path.resolve(__dirname, relativePath);

    console.log("Reading " + absolutePath + "...");
    return new Promise((resolve, reject) => {
        fs.readFile(absolutePath, (err, data) => {
            if (err) {
                console.error(err.message);
                reject(error);
            }

            resolve(data.toString("base64"));
        });
    });
}

const getRequestHeaders = (tokenResponse) => {
    const headers = {
        "Authorization": "Bearer " + tokenResponse.accessToken,
        "Accept": "application/json",
        "Content-Type": "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0"
    };

    return headers;
};