const fs = require("fs");
const axios = require("axios");
const colors = require("colors");
const readline = require("readline");
const { DateTime } = require("luxon");
const { HttpsProxyAgent } = require("https-proxy-agent");
const figlet = require("figlet");

const METHOD = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
};

class BaseRoot {
  constructor() {
    this.header = {
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "en-US,en;q=0.9",
      "Content-Type": "application/json",
      Origin: "https://app.bahne.ai",
      Priority: "u=1, i",
      Referer: "https://app.bahne.ai/",
      "Sec-Ch-Ua":
        '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129", "Microsoft Edge WebView2";v="129"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0",
    };
  }

  getHeader = async (addional = {}, excludeKey = []) => {
    if (excludeKey.length || (addional && Object.keys(addional).length)) {
      return this.buildHeader(addional, excludeKey);
    }
    return this.header;
  };

  buildHeader = async (addional = {}, excludeKey = []) => {
    const cusHeader = { ...this.header };
    if (excludeKey.length) {
      excludeKey.forEach((k) => {
        if (cusHeader[k]) {
          delete cusHeader[k];
        }
      });
    }
    if (addional && Object.keys(addional).length) {
      for (const key in addional) {
        cusHeader[key] = addional[key];
      }
    }
    this.header = cusHeader;
    return cusHeader;
  };

  getDataFile = () => {
    const data = fs
      .readFileSync("data.txt", "utf8")
      .replace(/\r/g, "")
      .split("\n")
      .filter(Boolean);
    return data;
  };

  getWalletFile = () => {
    const wallets = fs
      .readFileSync("wallets.txt", "utf8")
      .replace(/\r/g, "")
      .split("\n")
      .filter(Boolean);
    return wallets;
  };

  log = (msg, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    switch (type) {
      case "success":
        console.log(`[${timestamp}] [*] ${msg}`.green);
        break;
      case "custom":
        console.log(`[${timestamp}] [*] ${msg}`.magenta);
        break;
      case "error":
        console.log(`[${timestamp}] [!] ${msg}`.red);
        break;
      case "warning":
        console.log(`[${timestamp}] [*] ${msg}`.yellow);
        break;
      default:
        console.log(`[${timestamp}] [*] ${msg}`.blue);
    }
  };

  renderFiglet(name, version) {
    figlet("BaseTools by Nguyen Duc", function (err, data) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      console.log("\n");
      console.log("\n");
      console.log(data);
      console.log("\n");
      console.log("\n");
      console.log(colors.cyan(`${name} version ${version}`));
      console.log(colors.cyan(`Author: Nguyen Duc`));
      console.log(
        colors.cyan(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)
      );
      console.log("\n");
    });
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  extractUserData(queryId) {
    const urlParams = new URLSearchParams(queryId);
    const user = JSON.parse(decodeURIComponent(urlParams.get("user")));
    return {
      auth_date: urlParams.get("auth_date"),
      hash: urlParams.get("hash"),
      query_id: urlParams.get("query_id"),
      user: user,
    };
  }

  askQuestion(query) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) =>
      rl.question(query, (ans) => {
        rl.close();
        resolve(ans);
      })
    );
  }

  async callApi(method, url, request = {}, header = this.header) {
    try {
      const response = await axios({
        method: METHOD[method],
        url: url,
        data: request,
        headers: header,
      });
      return response.data;
    } catch (err) {
      console.log(colors.red(`Failed to call API: ${err.message}`));
      return null; // Optional: return a fallback value or rethrow the error
    }
  }

  async countdown(seconds) {
    for (let i = seconds; i >= 0; i--) {
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`===== Wait ${i} second to continue =====`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

module.exports = BaseRoot;
