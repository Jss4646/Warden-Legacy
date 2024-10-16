import { default as devicesData } from "../data/devices.json";

/**
 * @typedef screenshotData {Object}
 * @param resolution {object}
 * @param resolution.width {number}
 * @param resolution.height {number}
 * @param userAgent {String}
 * @param url {string}
 * @param fileName {string}
 */

/**
 * Makes the call to the api to generate the screenshots and diff image
 *
 * @param pagesRequestData {Array[screenshotData]}
 * @param generateBaselines {boolean}
 * @returns {Promise<string>}
 */
export function generateScreenshots(pagesRequestData, generateBaselines) {
  return fetch(`${window.location.origin}/api/run-comparison`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pages: pagesRequestData,
      generateBaselines,
    }),
    // TODO cancel button
    // signal: abortSignal,
  });
}

export function runPageComparison(siteData, pages, generateBaselines = false) {
  const pagesRequestData = [];

  for (const page of pages) {
    const pageRequestData = createPageRequestData(
      siteData,
      page,
      generateBaselines
    );
    pagesRequestData.push(...pageRequestData);
  }

  generateScreenshots(pagesRequestData, generateBaselines).catch(console.error);
}

/**
 * Generates comparison screenshots for a given page
 *
 * @param siteData {Object}
 * @param siteData.devices {Array.<string>}
 * @param siteData.url {string}
 * @param siteData.comparisonUrl {string}
 * @param siteData.sitePath {string}
 * @param siteData.screenshotPages {Object}
 * @param page {Array[string]}
 * @param [generateBaselines] {boolean}
 */
function createPageRequestData(siteData, page, generateBaselines = false) {
  const pagesRequestData = [];

  let { devices, url, comparisonUrl, sitePath, pages, cookies, siteUsername, sitePassword } = siteData;

  if (cookies && !validateCookies(cookies)) {
    return;
  }

  url = new URL(url).href.slice(0, -1);
  comparisonUrl = new URL(comparisonUrl).href.slice(0, -1);

  const fullUrl = `${url}${page}`;
  const fullComparisonUrl = `${comparisonUrl}${page}`;

  for (const device of devices) {
    const currentScreenshots = pages[page].screenshots[device];
    const { height, width, userAgent } = devicesData[device];

    generateBaselines =
      currentScreenshots?.baselineScreenshot === undefined || generateBaselines;

    const baselineFileName = generateBaselines
      ? createFilename(fullUrl, device)
      : currentScreenshots.baselineScreenshot.split("/").pop().split(".webp")[0];
    const comparisonFileName = createFilename(fullComparisonUrl, device);

    let parsedCookies = "";

    if (cookies) {
      parsedCookies = cookies.replaceAll("\n", "");
    }

    let screenshotData = {
      resolution: { height, width },
      userAgent,
      comparisonUrl: fullComparisonUrl,
      comparisonFileName,
      baselineUrl: fullUrl,
      baselineFileName,
      sitePath,
      device,
      cookieData: parsedCookies,
      page,
      siteLogin: {username: siteUsername, password: sitePassword},
      id: pages[page]._id,
    };

    pagesRequestData.push(screenshotData);
  }
  return pagesRequestData;
}

/**
 * Creates the file name for the screenshot
 *
 * @param url {string}
 * @param device {string}
 * @returns {string}
 */
export function createFilename(url, device) {
  const parsedUrl = new URL(url);
  let deviceSanitised = device.replaceAll("/", "-");
  return `${parsedUrl.host}-${deviceSanitised}`;
}

/**
 * Validates that the inputted cookies are JSON
 *
 * @param {string} cookies
 * @returns {boolean}
 */
export function validateCookies(cookies) {
  try {
    JSON.parse(cookies);
  } catch (e) {
    return false;
  }

  return true;
}
