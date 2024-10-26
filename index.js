const fs = require("fs");
const axios = require("axios");
const colors = require("colors");
const readline = require("readline");
const { DateTime } = require("luxon");
const { HttpsProxyAgent } = require("https-proxy-agent");
const { questions, questionTypes, ToolName } = require("./config");

const BaseRoot = require("./ultils");

class Tools extends BaseRoot {
  constructor() {
    super();
    this.toolsName = ToolName || "";
    this.version = "1.0";
    this.questionStatuses = {
      isPlayGame: false,
      isWatchAds: false,
      isDoTask: false,
      isConnectWallet: false,
    };
  }

  async renderQuestions() {
    for (let i = 0; i < questions.length; i++) {
      const questionAnswer = await this.askQuestion(questions[i].question);
      this.questionStatuses[questions[i].type] =
        questionAnswer.toLowerCase() === "y" ?? true;
    }
  }

  processAccount = async (queryId, dataUser) => {
    console.log(colors.gray(`====== [Process Account] ======`));
    const token = await this.login(queryId);
    if (true) {
      // Logic here
      await this.dailyCheckInClaim();
      await this.farmingClaim();
      if (this.questionStatuses.isDoTask) {
        await this.resolveTask(queryId, dataUser, token);
      }
      if (this.questionStatuses.isWatchAds) {
        await this.watchAds(queryId, dataUser, token);
      }
      if (this.questionStatuses.isPlayGame) {
        await this.playGame(queryId, dataUser, token);
      }
      if (this.questionStatuses.isConnectWallet) {
        await this.connectWallets(queryId, dataUser, token);
      }
    }
  };

  login = async () => {
    console.log(colors.gray(`====== [Login] ======`));
    const header = this.getHeader();
  };

  dailyCheckInClaim = async (queryId, dataUser, token) => {
    console.log(colors.gray(`====== [Daily Checkin Claim] ======`));
    const header = this.getHeader();
  };

  watchAds = async (queryId, dataUser, token) => {
    console.log(colors.gray(`====== [Watch Ads] ======`));
    const header = this.getHeader();
  };

  farmingClaim = async (queryId, dataUser, token) => {
    console.log(colors.gray(`====== [Farm Claim] ======`));
    const header = this.getHeader();
  };

  playGame = async (queryId, dataUser, token) => {
    console.log(colors.gray(`====== [Play Game] ======`));
    const header = this.getHeader();
  };

  resolveTask = async (queryId, dataUser, token) => {
    console.log(colors.gray(`====== [Resolve Task] ======`));
    const header = this.getHeader();
  };

  connectWallets = async (queryId, dataUser, token) => {
    console.log(colors.gray(`====== [Connect Wallets] ======`));
    const wallets = this.getWalletFile();
    if (!wallets.length) return;
    const header = this.getHeader();
  };

  async main() {
    this.renderFiglet(this.toolsName, this.version);
    await this.sleep(1000);
    await this.renderQuestions();
    await this.sleep(1000);
    const data = this.getDataFile();

    if (!data || data.length < 1) {
      this.log(colors.red(`Don't have any data. Please check file data.txt!`));
      await this.sleep(1000);
    }

    while (true) {
      for (let i = 0; i < data.length; i++) {
        const queryId = data[i];
        const dataUser = this.extractUserData(queryId);
        this.log(`Working with user #${i + 1} | ${dataUser.user.username}`);
        await this.processAccount(queryId, dataUser);
      }
      await this.countdown(10 * 60);
    }
  }
}

const client = new Tools();
client.main().catch((err) => {
  client.log(err.message, "error");
});
