const TEMPLATE = {
  storageKey: "simplekit.cppTimingCalculator.v1",
  appName: "CPP Timing Calculator Canada: Compare 60 vs 65 vs 70",
  seoDescription:
    "CPP Timing Calculator Canada: compare CPP at 60 vs 65 vs 70, see break-even age, lifetime payout differences, and when delaying CPP may pay off.",
  siteUrl: "https://retirement.simplekit.app/cpp-timing-calculator/",
  socialImageUrl: "https://retirement.simplekit.app/social-preview.png",
  supportUrl: "https://buymeacoffee.com/ashleysnl",
  retirementPlannerUrl: "https://retirement.simplekit.app/",
  chartColors: {
    60: "#ff8c42",
    65: "#0f6abf",
    70: "#0ea5a8",
  },
};

const CPP_RULES = {
  referenceAge: 65,
  ages: [60, 65, 70],
  earlyReductionPerMonth: 0.006,
  delayedIncreasePerMonth: 0.007,
  maxProjectionAge: 105,
};

const DEFAULT_INPUTS = {
  monthlyAt65: 900,
  lifeExpectancy: 90,
  annualReturn: 4,
  inflationRate: 2,
  comparisonAgeOne: 75,
  comparisonAgeTwo: 85,
};

const EXAMPLE_INPUTS = {
  monthlyAt65: 1200,
  lifeExpectancy: 90,
  annualReturn: 3,
  inflationRate: 2,
  comparisonAgeOne: 78,
  comparisonAgeTwo: 88,
};

const el = {
  metaDescription: document.getElementById("metaDescription"),
  metaThemeColor: document.getElementById("metaThemeColor"),
  metaOgTitle: document.getElementById("metaOgTitle"),
  metaOgDescription: document.getElementById("metaOgDescription"),
  metaOgUrl: document.getElementById("metaOgUrl"),
  metaOgImage: document.getElementById("metaOgImage"),
  metaOgSiteName: document.getElementById("metaOgSiteName"),
  metaTwitterTitle: document.getElementById("metaTwitterTitle"),
  metaTwitterDescription: document.getElementById("metaTwitterDescription"),
  metaTwitterImage: document.getElementById("metaTwitterImage"),

  jumpToCalculatorBtn: document.getElementById("jumpToCalculatorBtn"),
  scrollToResultsBtn: document.getElementById("scrollToResultsBtn"),
  calculatorForm: document.getElementById("calculatorForm"),
  compareBtn: document.getElementById("compareBtn"),

  monthlyAt65: document.getElementById("monthlyAt65"),
  lifeExpectancy: document.getElementById("lifeExpectancy"),
  annualReturn: document.getElementById("annualReturn"),
  inflationRate: document.getElementById("inflationRate"),
  comparisonAgeOne: document.getElementById("comparisonAgeOne"),
  comparisonAgeTwo: document.getElementById("comparisonAgeTwo"),
  tryExampleBtn: document.getElementById("tryExampleBtn"),
  resetDefaultsBtn: document.getElementById("resetDefaultsBtn"),

  heroAsideWinner: document.getElementById("heroAsideWinner"),
  heroAsideDetail: document.getElementById("heroAsideDetail"),
  takeawayTitle: document.getElementById("takeawayTitle"),
  takeawayBody: document.getElementById("takeawayBody"),
  takeawaySecondary: document.getElementById("takeawaySecondary"),
  takeawayCaution: document.getElementById("takeawayCaution"),
  takeawaySupportNudge: document.getElementById("takeawaySupportNudge"),
  summaryBannerGrid: document.getElementById("summaryBannerGrid"),
  comparisonGrid: document.getElementById("comparisonGrid"),
  breakEvenGrid: document.getElementById("breakEvenGrid"),
  chartLegend: document.getElementById("chartLegend"),
  chartContainer: document.getElementById("chartContainer"),
  chartCaption: document.getElementById("chartCaption"),
  insightGrid: document.getElementById("insightGrid"),
  appToast: document.getElementById("appToast"),

  plannerResultsLink: document.getElementById("plannerResultsLink"),
  footerPlannerLink: document.getElementById("footerPlannerLink"),
  supportMicroLink: document.getElementById("supportMicroLink"),
  supportLink: document.getElementById("supportLink"),
  footerSupportLink: document.getElementById("footerSupportLink"),
  floatingSupportLink: document.getElementById("floatingSupportLink"),
};

let state = loadInputs();
let toastTimer = null;

init();

function init() {
  syncHeadMeta();
  syncStaticLinks();
  populateForm();
  bindEvents();
  render();
}

function bindEvents() {
  el.calculatorForm?.addEventListener("submit", handleCompareSubmit);

  [el.monthlyAt65, el.lifeExpectancy, el.annualReturn, el.inflationRate, el.comparisonAgeOne, el.comparisonAgeTwo]
    .forEach((input) => {
      input?.addEventListener("change", syncStateFromForm);
    });

  el.tryExampleBtn?.addEventListener("click", () => {
    state = normalizeInputs(EXAMPLE_INPUTS);
    persistInputs();
    populateForm();
    render();
    scrollToSection("resultsPanel");
    toast("Example scenario loaded");
  });

  el.resetDefaultsBtn?.addEventListener("click", () => {
    state = normalizeInputs(DEFAULT_INPUTS);
    persistInputs();
    populateForm();
    render();
    toast("Defaults restored");
  });

  el.jumpToCalculatorBtn?.addEventListener("click", () => scrollToSection("calculatorPanel"));
  el.scrollToResultsBtn?.addEventListener("click", () => scrollToSection("resultsPanel"));
}

function handleCompareSubmit(event) {
  event.preventDefault();
  syncStateFromForm();
  render();
  scrollToSection("resultsPanel");
  toast("Results updated");
}

function syncStateFromForm() {
  state = normalizeInputs({
    monthlyAt65: el.monthlyAt65.value,
    lifeExpectancy: el.lifeExpectancy.value,
    annualReturn: el.annualReturn.value,
    inflationRate: el.inflationRate.value,
    comparisonAgeOne: el.comparisonAgeOne.value,
    comparisonAgeTwo: el.comparisonAgeTwo.value,
  });
  persistInputs();
}

function loadInputs() {
  try {
    const raw = localStorage.getItem(TEMPLATE.storageKey);
    if (!raw) return normalizeInputs(DEFAULT_INPUTS);
    return normalizeInputs(JSON.parse(raw));
  } catch {
    return normalizeInputs(DEFAULT_INPUTS);
  }
}

function persistInputs() {
  localStorage.setItem(TEMPLATE.storageKey, JSON.stringify(state));
}

function normalizeInputs(input) {
  const source = input && typeof input === "object" ? input : {};
  return {
    monthlyAt65: clamp(toNumber(source.monthlyAt65, DEFAULT_INPUTS.monthlyAt65), 0, 5000),
    lifeExpectancy: clamp(toNumber(source.lifeExpectancy, DEFAULT_INPUTS.lifeExpectancy), 60, 105),
    annualReturn: clamp(toNumber(source.annualReturn, DEFAULT_INPUTS.annualReturn), 0, 12),
    inflationRate: clamp(toNumber(source.inflationRate, DEFAULT_INPUTS.inflationRate), 0, 8),
    comparisonAgeOne: clamp(toNumber(source.comparisonAgeOne, DEFAULT_INPUTS.comparisonAgeOne), 60, 105),
    comparisonAgeTwo: clamp(toNumber(source.comparisonAgeTwo, DEFAULT_INPUTS.comparisonAgeTwo), 60, 105),
  };
}

function populateForm() {
  el.monthlyAt65.value = String(state.monthlyAt65);
  el.lifeExpectancy.value = String(state.lifeExpectancy);
  el.annualReturn.value = String(state.annualReturn);
  el.inflationRate.value = String(state.inflationRate);
  el.comparisonAgeOne.value = String(state.comparisonAgeOne);
  el.comparisonAgeTwo.value = String(state.comparisonAgeTwo);
}

function render() {
  const model = calculateModel(state);
  renderHeroAside(model);
  renderSummary(model);
  renderComparisonCards(model);
  renderBreakEvenCards(model);
  renderChart(model);
  renderInsights(model);
}

function calculateModel(inputs) {
  const comparisonAges = Array.from(
    new Set([inputs.comparisonAgeOne, inputs.comparisonAgeTwo, inputs.lifeExpectancy].map((age) => clamp(Math.round(age), 60, 105)).sort((a, b) => a - b)),
  );
  const realAnnualRate = ((1 + inputs.annualReturn / 100) / (1 + inputs.inflationRate / 100) - 1) * 100;
  const monthlyDiscountRate = Math.pow(1 + inputs.annualReturn / 100, 1 / 12) - 1;

  const scenarios = CPP_RULES.ages.map((age) => {
    const monthlyPayment = getAdjustedMonthly(inputs.monthlyAt65, age);
    const annualPayment = monthlyPayment * 12;
    const timeline = buildTimeline({
      claimAge: age,
      monthlyPayment,
      planningAge: inputs.lifeExpectancy,
      comparisonAges,
      monthlyDiscountRate,
    });

    return {
      age,
      monthlyPayment,
      annualPayment,
      byAge: timeline.byAge,
      lifetimeTotal: timeline.totalNominal,
      discountedTotal: timeline.totalDiscounted,
      timeline: timeline.points,
      interpretation: getScenarioInterpretation(age),
    };
  });

  const winner = [...scenarios].sort((a, b) => b.lifetimeTotal - a.lifetimeTotal)[0];
  const bestCashFlow = [...scenarios].sort((a, b) => a.age - b.age)[0];
  const winnerByDiscounted = [...scenarios].sort((a, b) => b.discountedTotal - a.discountedTotal)[0];
  const breakEvenPairs = [
    buildBreakEven(scenarios, 60, 65, inputs.lifeExpectancy),
    buildBreakEven(scenarios, 65, 70, inputs.lifeExpectancy),
    buildBreakEven(scenarios, 60, 70, inputs.lifeExpectancy),
  ];

  return {
    inputs,
    comparisonAges,
    realAnnualRate,
    scenarios,
    winner,
    bestCashFlow,
    winnerByDiscounted,
    breakEvenPairs,
  };
}

function getAdjustedMonthly(baseMonthlyAt65, claimAge) {
  const monthsFrom65 = Math.round((claimAge - CPP_RULES.referenceAge) * 12);
  if (monthsFrom65 < 0) return baseMonthlyAt65 * (1 + monthsFrom65 * CPP_RULES.earlyReductionPerMonth);
  if (monthsFrom65 > 0) return baseMonthlyAt65 * (1 + monthsFrom65 * CPP_RULES.delayedIncreasePerMonth);
  return baseMonthlyAt65;
}

function buildTimeline({ claimAge, monthlyPayment, planningAge, comparisonAges, monthlyDiscountRate }) {
  const startAge = 60;
  const maxMonth = Math.max(0, Math.round((planningAge - startAge) * 12));
  const byAge = {};
  const points = [];
  let totalNominal = 0;
  let totalDiscounted = 0;

  for (let month = 0; month <= maxMonth; month += 1) {
    const age = startAge + month / 12;
    if (age >= claimAge) {
      totalNominal += monthlyPayment;
      totalDiscounted += monthlyPayment / Math.pow(1 + monthlyDiscountRate, month);
    }
    if (month % 12 === 0) {
      points.push({ age: roundTo(age, 1), total: totalNominal });
    }
  }

  comparisonAges.forEach((checkpoint) => {
    const eligibleMonths = Math.max(0, Math.round((checkpoint - claimAge) * 12));
    byAge[checkpoint] = monthlyPayment * eligibleMonths;
  });

  return { byAge, points, totalNominal, totalDiscounted };
}

function buildBreakEven(scenarios, earlyAge, laterAge, planningAge) {
  const earlyScenario = scenarios.find((scenario) => scenario.age === earlyAge);
  const laterScenario = scenarios.find((scenario) => scenario.age === laterAge);
  const maxMonth = (CPP_RULES.maxProjectionAge - 60) * 12;
  let earlyTotal = 0;
  let laterTotal = 0;
  let breakEvenAge = null;

  for (let month = 0; month <= maxMonth; month += 1) {
    const age = 60 + month / 12;
    if (age >= earlyAge) earlyTotal += earlyScenario.monthlyPayment;
    if (age >= laterAge) laterTotal += laterScenario.monthlyPayment;
    if (laterTotal >= earlyTotal) {
      breakEvenAge = age;
      break;
    }
  }

  return {
    earlyAge,
    laterAge,
    breakEvenAge,
    withinPlanningAge: breakEvenAge !== null && breakEvenAge <= planningAge,
  };
}

function renderHeroAside(model) {
  const winner = model.winner;
  const second = [...model.scenarios].sort((a, b) => b.lifetimeTotal - a.lifetimeTotal)[1];
  const edge = winner.lifetimeTotal - second.lifetimeTotal;
  el.heroAsideWinner.textContent =
    winner.age === 70
      ? "Waiting until 70 may be worth it if you expect a longer retirement."
      : winner.age === 60
        ? "Starting at 60 may be better if earlier cash flow matters more."
        : "Age 65 can be the middle-ground answer in this scenario.";
  el.heroAsideDetail.textContent = `${winner.age} leads by about ${formatCurrency(edge)} by age ${model.inputs.lifeExpectancy}, based on your assumptions.`;
}

function renderSummary(model) {
  const breakEvenPrimary = model.breakEvenPairs[1];
  const breakEvenEarly = model.breakEvenPairs[0];
  const winner = model.winner;
  const title =
    winner.age === 70
      ? "Waiting until 70 may maximize lifetime CPP in this scenario."
      : winner.age === 60
        ? "Starting CPP at 60 may make more sense in this scenario."
        : "Starting CPP at 65 looks like the middle-ground fit here.";
  const body =
    winner.age === 70
      ? "Starting later gives up earlier cash flow, but the larger monthly payment may win if you expect a longer retirement."
      : winner.age === 60
        ? "Starting earlier gives you income sooner, but it locks in a smaller monthly payment for life."
        : "Age 65 balances access and benefit size without the longer wait for maximum delayed CPP.";
  const secondary =
    winner.age === 70
      ? "If you expect a longer retirement, delaying CPP may pay off."
      : winner.age === 60
        ? "If you need income sooner, earlier CPP may still be reasonable."
        : "If you want a baseline starting point, age 65 is often the practical reference option.";
  const caution = "Scenario-based estimate only. It is useful for planning, but it is not personalized financial advice.";

  el.takeawayTitle.textContent = title;
  el.takeawayBody.textContent = body;
  el.takeawaySecondary.textContent = secondary;
  el.takeawayCaution.textContent = caution;
  el.takeawaySupportNudge.textContent = "Did this clarify your CPP decision? Support more free tools ☕";

  const stats = [
    {
      label: "Best for lifetime income in this scenario",
      value: `Start CPP at ${winner.age}`,
      sub: `${formatCurrency(winner.lifetimeTotal)} by age ${model.inputs.lifeExpectancy}`,
    },
    {
      label: "Break-even age",
      value: formatBreakEvenShort(breakEvenPrimary),
      sub: "65 vs 70 comparison",
    },
    {
      label: "Best for maximum lifetime income",
      value: `CPP at ${winner.age}`,
      sub: "Under this scenario",
    },
    {
      label: "Best for earlier cash flow",
      value: `Start CPP at ${model.bestCashFlow.age}`,
      sub: "Income starts sooner",
    },
    {
      label: "60 vs 65 break-even",
      value: formatBreakEvenShort(breakEvenEarly),
      sub: breakEvenEarly.withinPlanningAge ? "Within your planning age" : "Beyond your planning age",
    },
    {
      label: "Best discounted value",
      value: `CPP at ${model.winnerByDiscounted.age}`,
      sub: `At ${formatPercent(model.inputs.annualReturn)} discount rate`,
    },
  ];

  el.summaryBannerGrid.innerHTML = stats
    .map(
      (item) => `
        <article class="summary-stat">
          <span class="label">${escapeHtml(item.label)}</span>
          <span class="value">${escapeHtml(item.value)}</span>
          <span class="sub">${escapeHtml(item.sub)}</span>
        </article>
      `,
    )
    .join("");
}

function renderComparisonCards(model) {
  el.comparisonGrid.innerHTML = model.scenarios
    .map((scenario) => {
      return `
        <article class="result-card">
          <div class="result-card-header">
            <div>
              <h4>CPP at ${escapeHtml(String(scenario.age))}</h4>
              <div class="scenario-age">${escapeHtml(getScenarioLabel(scenario.age))}</div>
            </div>
            <span class="pill">${escapeHtml(`Age ${scenario.age}`)}</span>
          </div>
          <p class="scenario-monthly">${escapeHtml(formatCurrency(scenario.monthlyPayment))}<span class="scenario-age"> / month</span></p>
          <div class="metric-stack">
            <div class="metric-stack-row">
              <span>Annual CPP</span>
              <span>${escapeHtml(formatCurrency(scenario.annualPayment))}</span>
            </div>
            <div class="metric-stack-row">
              <span>Total by age ${escapeHtml(String(model.inputs.lifeExpectancy))}</span>
              <span>${escapeHtml(formatCurrency(scenario.lifetimeTotal))}</span>
            </div>
            <div class="metric-stack-row">
              <span>Discounted value</span>
              <span>${escapeHtml(formatCurrency(scenario.discountedTotal))}</span>
            </div>
          </div>
          <p class="scenario-take">${escapeHtml(scenario.interpretation)}</p>
        </article>
      `;
    })
    .join("");
}

function renderBreakEvenCards(model) {
  el.breakEvenGrid.innerHTML = model.breakEvenPairs
    .map((pair) => {
      const headline =
        pair.breakEvenAge === null
          ? `CPP at ${pair.laterAge} does not catch CPP at ${pair.earlyAge} by age ${CPP_RULES.maxProjectionAge}.`
          : `CPP at ${pair.laterAge} catches CPP at ${pair.earlyAge} around age ${roundTo(pair.breakEvenAge, 1)}.`;
      const body =
        pair.breakEvenAge === null
          ? "Under this scenario, the earlier start stays ahead through the modeled horizon."
          : pair.withinPlanningAge
            ? `That is within your planning age of ${model.inputs.lifeExpectancy}, so the larger later payment may have time to catch up.`
            : `That is beyond your planning age of ${model.inputs.lifeExpectancy}, so the earlier start stays ahead in total dollars within this scenario.`;

      return `
        <article class="break-even-card">
          <h4>${escapeHtml(`${pair.earlyAge} vs ${pair.laterAge}`)}</h4>
          <p class="muted">${escapeHtml(headline)}</p>
          <p class="muted small-copy">${escapeHtml(body)}</p>
        </article>
      `;
    })
    .join("");
}

function renderChart(model) {
  el.chartLegend.innerHTML = model.scenarios
    .map(
      (scenario) => `
        <span class="legend-item">
          <span class="legend-swatch" style="background:${escapeHtml(TEMPLATE.chartColors[scenario.age])}"></span>
          CPP at ${escapeHtml(String(scenario.age))}
        </span>
      `,
    )
    .join("");

  const chartWidth = 860;
  const chartHeight = 380;
  const padding = { top: 20, right: 20, bottom: 40, left: 64 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const minAge = 60;
  const maxAge = model.inputs.lifeExpectancy;
  const maxValue = Math.max(...model.scenarios.flatMap((scenario) => scenario.timeline.map((point) => point.total)), 1);
  const yTicks = 4;
  const xYears = Array.from({ length: maxAge - minAge + 1 }, (_, index) => minAge + index).filter((age) => age === minAge || age === maxAge || age % 5 === 0);

  const lines = model.scenarios
    .map((scenario) => {
      const path = scenario.timeline
        .map((point, index) => {
          const x = padding.left + ((point.age - minAge) / (maxAge - minAge || 1)) * plotWidth;
          const y = padding.top + plotHeight - (point.total / maxValue) * plotHeight;
          return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
        })
        .join(" ");
      return `<path class="chart-line" d="${path}" stroke="${escapeHtml(TEMPLATE.chartColors[scenario.age])}"></path>`;
    })
    .join("");

  const yGrid = Array.from({ length: yTicks + 1 }, (_, index) => {
    const ratio = index / yTicks;
    const value = maxValue * (1 - ratio);
    const y = padding.top + plotHeight * ratio;
    return `
      <line class="chart-gridline" x1="${padding.left}" y1="${y.toFixed(2)}" x2="${chartWidth - padding.right}" y2="${y.toFixed(2)}"></line>
      <text class="chart-label" x="${padding.left - 10}" y="${(y + 4).toFixed(2)}" text-anchor="end">${escapeHtml(formatCurrencyCompact(value))}</text>
    `;
  }).join("");

  const xLabels = xYears
    .map((age) => {
      const x = padding.left + ((age - minAge) / (maxAge - minAge || 1)) * plotWidth;
      return `
        <text class="chart-label" x="${x.toFixed(2)}" y="${chartHeight - 12}" text-anchor="middle">${escapeHtml(String(age))}</text>
      `;
    })
    .join("");

  el.chartContainer.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 ${chartWidth} ${chartHeight}" aria-hidden="true">
      <rect x="${padding.left}" y="${padding.top}" width="${plotWidth}" height="${plotHeight}" fill="#fbfdff" stroke="#e6edf7" rx="14"></rect>
      ${yGrid}
      ${lines}
      ${xLabels}
      <text class="chart-label" x="${chartWidth / 2}" y="${chartHeight - 4}" text-anchor="middle">Age</text>
      <text class="chart-label" transform="translate(18 ${chartHeight / 2}) rotate(-90)" text-anchor="middle">Cumulative CPP</text>
    </svg>
  `;

  el.chartCaption.textContent = `Chart runs from age 60 to age ${model.inputs.lifeExpectancy}. It shows estimated cumulative CPP only, not tax, investment growth, or other retirement income.`;
}

function renderInsights(model) {
  const scenario60 = model.scenarios.find((scenario) => scenario.age === 60);
  const scenario65 = model.scenarios.find((scenario) => scenario.age === 65);
  const scenario70 = model.scenarios.find((scenario) => scenario.age === 70);
  const insights = [
    {
      title: "Longer retirement can favour delaying",
      body: `If you expect a longer retirement, the larger CPP payment at 70 has more time to catch up and move ahead.`,
    },
    {
      title: "Earlier CPP helps with cash flow sooner",
      body: `CPP at 60 gives income sooner, which can matter if you want less pressure on savings in your early retirement years.`,
    },
    {
      title: "Waiting meaningfully raises the monthly cheque",
      body: `CPP at 70 is about ${formatPercent(((scenario70.monthlyPayment / scenario65.monthlyPayment) - 1) * 100)} higher per month than CPP at 65 in this model.`,
    },
    {
      title: "CPP timing should be coordinated",
      body: `Review CPP with OAS, workplace pensions, RRSP/RRIF withdrawals, tax, and spending needs before deciding.`,
    },
    {
      title: "Break-even is useful, but not the whole story",
      body: `${formatBreakEvenSentence(model.breakEvenPairs[1])} Health, taxes, survivor needs, and flexibility also matter.`,
    },
    {
      title: "Age 65 remains the baseline reference",
      body: `Your input amount at 65 is the reference used to estimate the 60 and 70 scenarios.`,
    },
  ];

  el.insightGrid.innerHTML = insights
    .map(
      (insight) => `
        <article class="insight-card">
          <h4>${escapeHtml(insight.title)}</h4>
          <p class="muted">${escapeHtml(insight.body)}</p>
        </article>
      `,
    )
    .join("");
}

function getScenarioInterpretation(age) {
  if (age === 60) return "Best if earlier cash flow matters more than maximizing later guaranteed income.";
  if (age === 65) return "Balanced option if you want a standard baseline without waiting until 70.";
  return "Best if you want the largest monthly CPP and expect a longer retirement horizon.";
}

function syncHeadMeta() {
  document.title = TEMPLATE.appName;
  if (el.metaDescription) el.metaDescription.setAttribute("content", TEMPLATE.seoDescription);
  if (el.metaThemeColor) el.metaThemeColor.setAttribute("content", "#0f6abf");
  if (el.metaOgTitle) el.metaOgTitle.setAttribute("content", TEMPLATE.appName);
  if (el.metaOgDescription) el.metaOgDescription.setAttribute("content", TEMPLATE.seoDescription);
  if (el.metaOgUrl) el.metaOgUrl.setAttribute("content", TEMPLATE.siteUrl);
  if (el.metaOgImage) el.metaOgImage.setAttribute("content", TEMPLATE.socialImageUrl);
  if (el.metaOgSiteName) el.metaOgSiteName.setAttribute("content", TEMPLATE.appName);
  if (el.metaTwitterTitle) el.metaTwitterTitle.setAttribute("content", TEMPLATE.appName);
  if (el.metaTwitterDescription) el.metaTwitterDescription.setAttribute("content", TEMPLATE.seoDescription);
  if (el.metaTwitterImage) el.metaTwitterImage.setAttribute("content", TEMPLATE.socialImageUrl);
}

function syncStaticLinks() {
  [el.plannerResultsLink, el.footerPlannerLink].forEach((link) => {
    if (link) link.href = TEMPLATE.retirementPlannerUrl;
  });
  [el.supportMicroLink, el.supportLink, el.footerSupportLink, el.floatingSupportLink].forEach((link) => {
    if (link) link.href = TEMPLATE.supportUrl;
  });
}

function scrollToSection(targetId) {
  const section = document.getElementById(targetId);
  if (!section) return;
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function toast(message) {
  if (!el.appToast) return;
  if (toastTimer) clearTimeout(toastTimer);
  el.appToast.textContent = message;
  el.appToast.hidden = false;
  toastTimer = window.setTimeout(() => {
    el.appToast.hidden = true;
    toastTimer = null;
  }, 1800);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatCurrencyCompact(value) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value || 0);
}

function formatPercent(value) {
  return `${roundTo(value, 1)}%`;
}

function formatBreakEvenShort(pair) {
  return pair.breakEvenAge === null ? "Not reached" : `Age ${roundTo(pair.breakEvenAge, 1)}`;
}

function formatBreakEvenSentence(pair) {
  if (pair.breakEvenAge === null) {
    return `CPP at ${pair.laterAge} does not catch CPP at ${pair.earlyAge} within the model horizon.`;
  }
  return `CPP at ${pair.laterAge} overtakes CPP at ${pair.earlyAge} around age ${roundTo(pair.breakEvenAge, 1)}.`;
}

function getScenarioLabel(age) {
  if (age === 60) return "Earlier income";
  if (age === 70) return "Higher later income";
  return "Middle ground";
}

function toNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundTo(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
