const fs = require("fs");
const { imgDiff } = require("img-diff-js");
// const sharp = require("sharp");

async function createDiffImage(baselineFileName, comparisonFileName) {
  const diffData = await imgDiff({
    actualFilename: `${__dirname}/../screenshots/${baselineFileName}.png`,
    expectedFilename: `${__dirname}/../screenshots/${comparisonFileName}.png`,
    diffFilename: `${__dirname}/../screenshots/${baselineFileName}-diff.png`,
  });

  return diffData.diffCount;
}
module.exports = {
  createDiffImage,
};
