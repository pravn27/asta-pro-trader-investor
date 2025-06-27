function tradingApp() {
  return {
    activeTab: "dashboard",
    mobileMenuOpen: false,

    // Portfolio summary
    portfolioValue: 500000,
    maxRiskPercentage: 2,

    // Equity calculator data - Excel style
    equity: {
      capital: 200000,
      maxRisk: 2,
      buyEntry: 3950,
      buyStopLoss: 3850,
      sellEntry: 1500,
      sellStopLoss: 1620,
      convictionLevel: 1,
    },

    // Futures calculator data
    futures: {
      capital: 300000,
      maxRisk: 2,
      entryLevel: 7780,
      stopLoss: 7770,
      lotSize: 250,
      convictionLevel: 1,
      direction: "buy", // 'buy' or 'sell'
    },

    // Computed properties
    get riskAmount() {
      return (this.portfolioValue * this.maxRiskPercentage) / 100;
    },

    // Utility methods
    formatNumber(num) {
      if (!num) return "0";
      return Math.round(num).toLocaleString("en-IN");
    },

    // Equity calculations
    calculateEquityRisk() {
      const capital = parseFloat(this.equity.capital) || 0;
      const maxRisk = parseFloat(this.equity.maxRisk) || 2;
      const entryPrice = parseFloat(this.equity.entryPrice) || 0;
      const stopLoss = parseFloat(this.equity.stopLoss) || 0;
      const convictionLevel = parseFloat(this.equity.convictionLevel) || 1;

      if (!capital || !entryPrice || !stopLoss) {
        return {
          riskPerShare: 0,
          totalRiskAmount: 0,
          maxSharesRisk: 0,
          maxSharesEntry: 0,
          recommendedShares: 0,
          investmentAmount: 0,
          portfolioPercentage: 0,
        };
      }

      const riskPerShare = Math.abs(entryPrice - stopLoss);
      const totalRiskAmount = (capital * maxRisk) / 100;
      const convictionRiskAmount = (capital * convictionLevel) / 100;

      const maxSharesRisk = Math.floor(totalRiskAmount / riskPerShare);
      const maxSharesEntry = Math.floor(capital / entryPrice);
      const recommendedShares = Math.floor(convictionRiskAmount / riskPerShare);

      const investmentAmount = recommendedShares * entryPrice;
      const portfolioPercentage = ((investmentAmount / capital) * 100).toFixed(
        2
      );

      return {
        riskPerShare: riskPerShare.toFixed(2),
        totalRiskAmount: totalRiskAmount,
        maxSharesRisk: maxSharesRisk,
        maxSharesEntry: maxSharesEntry,
        recommendedShares: recommendedShares,
        investmentAmount: investmentAmount,
        portfolioPercentage: portfolioPercentage,
      };
    },

    // Get equity risk ranges
    getRiskRanges() {
      const capital = parseFloat(this.equity.capital) || 0;
      const entryPrice = parseFloat(this.equity.entryPrice) || 0;
      const stopLoss = parseFloat(this.equity.stopLoss) || 0;

      if (!capital || !entryPrice || !stopLoss) return [];

      const riskPerShare = Math.abs(entryPrice - stopLoss);
      const ranges = [
        { level: "Below Low", percentage: 0.25 },
        { level: "Low", percentage: 0.5 },
        { level: "Medium", percentage: 1 },
        { level: "High", percentage: 1.5 },
        { level: "Above High", percentage: 1.75 },
      ];

      return ranges.map((range) => {
        const riskAmount = (capital * range.percentage) / 100;
        const shares = Math.floor(riskAmount / riskPerShare);
        const amount = shares * entryPrice;

        return {
          level: range.level,
          percentage: range.percentage,
          shares: shares,
          amount: amount,
        };
      });
    },

    // Futures calculations
    calculateFuturesRisk() {
      const capital = parseFloat(this.futures.capital) || 0;
      const maxRisk = parseFloat(this.futures.maxRisk) || 2;
      const entryLevel = parseFloat(this.futures.entryLevel) || 0;
      const stopLoss = parseFloat(this.futures.stopLoss) || 0;
      const lotSize = parseFloat(this.futures.lotSize) || 250;
      const convictionLevel = parseFloat(this.futures.convictionLevel) || 1;

      if (!capital || !entryLevel || !stopLoss || !lotSize) {
        return {
          riskPerUnit: 0,
          riskPerLot: 0,
          totalRiskAmount: 0,
          maxLots: 0,
          recommendedLots: 0,
          totalQuantity: 0,
          marginRequired: 0,
          portfolioPercentage: 0,
        };
      }

      const riskPerUnit = Math.abs(entryLevel - stopLoss);
      const riskPerLot = riskPerUnit * lotSize;
      const totalRiskAmount = (capital * maxRisk) / 100;
      const convictionRiskAmount = (capital * convictionLevel) / 100;

      const maxLots = Math.floor(totalRiskAmount / riskPerLot);
      const recommendedLots = Math.floor(convictionRiskAmount / riskPerLot);
      const totalQuantity = recommendedLots * lotSize;

      // Estimate margin (typically 10-15% of contract value)
      const marginRequired = recommendedLots * lotSize * entryLevel * 0.12;
      const portfolioPercentage = ((marginRequired / capital) * 100).toFixed(2);

      return {
        riskPerUnit: riskPerUnit.toFixed(2),
        riskPerLot: riskPerLot,
        totalRiskAmount: totalRiskAmount,
        maxLots: maxLots,
        recommendedLots: recommendedLots,
        totalQuantity: totalQuantity,
        marginRequired: marginRequired,
        portfolioPercentage: portfolioPercentage,
      };
    },

    // Get futures risk ranges
    getFuturesRiskRanges() {
      const capital = parseFloat(this.futures.capital) || 0;
      const entryLevel = parseFloat(this.futures.entryLevel) || 0;
      const stopLoss = parseFloat(this.futures.stopLoss) || 0;
      const lotSize = parseFloat(this.futures.lotSize) || 250;

      if (!capital || !entryLevel || !stopLoss || !lotSize) return [];

      const riskPerUnit = Math.abs(entryLevel - stopLoss);
      const riskPerLot = riskPerUnit * lotSize;

      const ranges = [
        { level: "Below Low", percentage: 0.25 },
        { level: "Low", percentage: 0.5 },
        { level: "Medium", percentage: 1 },
        { level: "High", percentage: 1.5 },
        { level: "Above High", percentage: 1.75 },
        { level: "Highest", percentage: 2 },
      ];

      return ranges.map((range) => {
        const riskAmount = (capital * range.percentage) / 100;
        const lots = Math.floor(riskAmount / riskPerLot);

        return {
          level: range.level,
          percentage: range.percentage,
          riskAmount: riskAmount,
          lots: lots,
        };
      });
    },

    // Excel-style Buy Risk Calculations
    calculateEquityBuyRisk() {
      const capital = parseFloat(this.equity.capital) || 0;
      const maxRisk = parseFloat(this.equity.maxRisk) || 2;
      const entryPrice = parseFloat(this.equity.buyEntry) || 0;
      const stopLoss = parseFloat(this.equity.buyStopLoss) || 0;

      if (!capital || !entryPrice || !stopLoss) {
        return {
          maxSharesRisk: 0,
          maxSharesEntry: 0,
          recommendedLevel: 0,
          finalMaxShares: 0,
        };
      }

      const riskPerShare = Math.abs(entryPrice - stopLoss);
      const totalRiskAmount = (capital * maxRisk) / 100;

      const maxSharesRisk = Math.floor(totalRiskAmount / riskPerShare);
      const maxSharesEntry = Math.floor(capital / entryPrice);
      const recommendedLevel = Math.min(maxSharesRisk, maxSharesEntry);
      const finalMaxShares = Math.min(maxSharesRisk, maxSharesEntry);

      return {
        maxSharesRisk: maxSharesRisk,
        maxSharesEntry: maxSharesEntry,
        recommendedLevel: recommendedLevel,
        finalMaxShares: finalMaxShares,
      };
    },

    // Excel-style Sell Risk Calculations
    calculateEquitySellRisk() {
      const capital = parseFloat(this.equity.capital) || 0;
      const maxRisk = parseFloat(this.equity.maxRisk) || 2;
      const entryPrice = parseFloat(this.equity.sellEntry) || 0;
      const stopLoss = parseFloat(this.equity.sellStopLoss) || 0;

      if (!capital || !entryPrice || !stopLoss) {
        return {
          maxSharesRisk: 0,
          maxSharesEntry: 0,
          recommendedLevel: 0,
          finalMaxShares: 0,
        };
      }

      const riskPerShare = Math.abs(entryPrice - stopLoss);
      const totalRiskAmount = (capital * maxRisk) / 100;

      const maxSharesRisk = Math.floor(totalRiskAmount / riskPerShare);
      const maxSharesEntry = Math.floor(capital / entryPrice);
      const recommendedLevel = Math.min(maxSharesRisk, maxSharesEntry);
      const finalMaxShares = Math.min(maxSharesRisk, maxSharesEntry);

      return {
        maxSharesRisk: maxSharesRisk,
        maxSharesEntry: maxSharesEntry,
        recommendedLevel: recommendedLevel,
        finalMaxShares: finalMaxShares,
      };
    },

    // Buy Risk Range Table
    getBuyRiskRanges() {
      const capital = parseFloat(this.equity.capital) || 0;
      const entryPrice = parseFloat(this.equity.buyEntry) || 0;
      const stopLoss = parseFloat(this.equity.buyStopLoss) || 0;

      if (!capital || !entryPrice || !stopLoss) return [];

      const riskPerShare = Math.abs(entryPrice - stopLoss);
      const ranges = [0.25, 0.5, 1, 1.5, 1.75, 2];

      return ranges.map((percentage) => {
        const riskAmount = (capital * percentage) / 100;
        const shares = Math.floor(riskAmount / riskPerShare);
        const amount = shares * entryPrice;

        return {
          percentage: percentage,
          shares: shares,
          amount: amount,
        };
      });
    },

    // Sell Risk Range Table
    getSellRiskRanges() {
      const capital = parseFloat(this.equity.capital) || 0;
      const entryPrice = parseFloat(this.equity.sellEntry) || 0;
      const stopLoss = parseFloat(this.equity.sellStopLoss) || 0;

      if (!capital || !entryPrice || !stopLoss) return [];

      const riskPerShare = Math.abs(entryPrice - stopLoss);
      const ranges = [0.25, 0.5, 1, 1.5, 1.75, 2];

      return ranges.map((percentage) => {
        const riskAmount = (capital * percentage) / 100;
        const shares = Math.floor(riskAmount / riskPerShare);
        const amount = shares * entryPrice;

        return {
          percentage: percentage,
          shares: shares,
          amount: amount,
        };
      });
    },

    // F&O Calculator Variables
    foCapital: 300000,
    foMaxRiskPercent: 2.5,
    foMaxRiskAmount: 7500,

    // Futures Variables
    futuresLongEntry: 19500,
    futuresLongStop: 19300,
    futuresShortEntry: 19500,
    futuresShortStop: 19700,
    futuresLotSize: 50,

    // Options Variables
    optionsBuyPremium: 150,
    optionsSellPremium: 150,
    optionsSellMaxLoss: 300,
    optionsLotSize: 50,

    // Computed F&O properties
    get futuresLongRisk() {
      return (
        Math.abs((this.futuresLongEntry || 0) - (this.futuresLongStop || 0)) *
        (this.futuresLotSize || 0)
      );
    },

    get futuresLongMaxLots() {
      return this.futuresLongRisk > 0
        ? Math.floor(this.foMaxRiskAmount / this.futuresLongRisk)
        : 0;
    },

    get futuresLongTotalRisk() {
      return this.futuresLongMaxLots * this.futuresLongRisk;
    },

    get futuresShortRisk() {
      return (
        Math.abs((this.futuresShortEntry || 0) - (this.futuresShortStop || 0)) *
        (this.futuresLotSize || 0)
      );
    },

    get futuresShortMaxLots() {
      return this.futuresShortRisk > 0
        ? Math.floor(this.foMaxRiskAmount / this.futuresShortRisk)
        : 0;
    },

    get futuresShortTotalRisk() {
      return this.futuresShortMaxLots * this.futuresShortRisk;
    },

    get optionsBuyRisk() {
      return (this.optionsBuyPremium || 0) * (this.optionsLotSize || 0);
    },

    get optionsBuyMaxLots() {
      return this.optionsBuyRisk > 0
        ? Math.floor(this.foMaxRiskAmount / this.optionsBuyRisk)
        : 0;
    },

    get optionsBuyTotalRisk() {
      return this.optionsBuyMaxLots * this.optionsBuyRisk;
    },

    get optionsSellRisk() {
      return Math.max(
        0,
        ((this.optionsSellMaxLoss || 0) - (this.optionsSellPremium || 0)) *
          (this.optionsLotSize || 0)
      );
    },

    get optionsSellMaxLots() {
      return this.optionsSellRisk > 0
        ? Math.floor(this.foMaxRiskAmount / this.optionsSellRisk)
        : 0;
    },

    get optionsSellTotalRisk() {
      return this.optionsSellMaxLots * this.optionsSellRisk;
    },

    // F&O Risk Calculator
    calculateFORisk() {
      this.foMaxRiskAmount =
        ((this.foCapital || 0) * (this.foMaxRiskPercent || 0)) / 100;
    },

    // Initialize app
    init() {
      // Set default values
      this.equity.capital = 200000;
      this.equity.maxRisk = 2;
      this.equity.buyEntry = 3950;
      this.equity.buyStopLoss = 3850;
      this.equity.sellEntry = 1500;
      this.equity.sellStopLoss = 1620;
      this.equity.convictionLevel = 1;

      this.futures.capital = 300000;
      this.futures.maxRisk = 2;
      this.futures.entryLevel = 7780;
      this.futures.stopLoss = 7770;
      this.futures.lotSize = 250;
      this.futures.convictionLevel = 1;

      // Initialize F&O calculations
      this.calculateFORisk();

      // Update portfolio summary periodically
      this.updatePortfolioSummary();
    },

    // Update portfolio summary
    updatePortfolioSummary() {
      // This would typically fetch real data from an API
      // For demo purposes, we'll use static calculations
      setInterval(() => {
        // Simulate minor price fluctuations
        const fluctuation = (Math.random() - 0.5) * 1000;
        this.portfolioValue = Math.max(400000, 500000 + fluctuation);
      }, 30000); // Update every 30 seconds
    },

    // Export calculations to CSV (bonus feature)
    exportToCSV(type) {
      let data = [];
      let filename = "";

      if (type === "equity") {
        const calc = this.calculateEquityRisk();
        const ranges = this.getRiskRanges();

        data = [
          ["Equity Risk Calculator Results"],
          ["Capital", this.equity.capital],
          ["Max Risk %", this.equity.maxRisk],
          ["Entry Price", this.equity.entryPrice],
          ["Stop Loss", this.equity.stopLoss],
          [""],
          ["Risk per Share", calc.riskPerShare],
          ["Recommended Shares", calc.recommendedShares],
          ["Investment Amount", calc.investmentAmount],
          [""],
          ["Risk Range", "Risk %", "Shares", "Amount"],
          ...ranges.map((r) => [r.level, r.percentage, r.shares, r.amount]),
        ];
        filename = "equity_risk_calculator.csv";
      } else if (type === "futures") {
        const calc = this.calculateFuturesRisk();
        const ranges = this.getFuturesRiskRanges();

        data = [
          ["F&O Risk Calculator Results"],
          ["Capital", this.futures.capital],
          ["Max Risk %", this.futures.maxRisk],
          ["Entry Level", this.futures.entryLevel],
          ["Stop Loss", this.futures.stopLoss],
          ["Lot Size", this.futures.lotSize],
          [""],
          ["Risk per Lot", calc.riskPerLot],
          ["Recommended Lots", calc.recommendedLots],
          ["Total Quantity", calc.totalQuantity],
          [""],
          ["Conviction Level", "Risk %", "Risk Amount", "Lots"],
          ...ranges.map((r) => [r.level, r.percentage, r.riskAmount, r.lots]),
        ];
        filename = "futures_risk_calculator.csv";
      }

      // Create and download CSV
      const csvContent = data.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  };
}
