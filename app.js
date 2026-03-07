const TEMPLATE = {
  storageKey: "simplekit.cppTimingCalculator.v1",
  appName: "CPP Timing Calculator Canada",
  seoDescription:
    "Compare taking CPP at 60, 65, or 70 and estimate break-even ages, lifetime payouts, and retirement planning tradeoffs.",
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
  monthlyAt65: 1100,
  lifeExpectancy: 92,
  annualReturn: 4.5,
  inflationRate: 2,
  comparisonAgeOne: 78,
  comparisonAgeTwo: 88,
};

const el = {
  root: document.documentElement,
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
  tabs: Array.from(document.querySelectorAll("[data-scroll-target]")),

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
  snapshotGrid: document.getElementById("snapshotGrid"),
  takeawayTitle: document.getElementById("takeawayTitle"),
  takeawayBody: document.getElementById("takeawayBody"),
  takeawayMeta: document.getElementById("takeawayMeta"),
  winnerPanel: document.getElementById("winnerPanel"),
  comparisonGrid: document.getElementById("comparisonGrid"),
  breakEvenGrid: document.getElementById("breakEvenGrid"),
  chartLegend: document.getElementById("chartLegend"),
  chartContainer: document.getElementById("chartContainer"),
  chartCaption: document.getElementById("chartCaption"),
  insightGrid: document.getElementById("insightGrid"),
  appToast: document.getElementById("appToast"),

  plannerHeroLink: document.getElementById("plannerHeroLink"),
  plannerResultsLink: document.getElementById("plannerResultsLink"),
  footerPlannerLink: document.getElementById("footerPlannerLink"),
  supportLink: document.getElementById("supportLink"),
  footerSupportLink: document.getElementById("footerSupportLink"),
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
  [
    el.monthlyAt65,
    el.lifeExpectancy,
    el.annualReturn,
    el.inflationRate,
    el.comparisonAgeOne,
    el.comparisonAgeTwo,
  ].forEach((input) => {
    input?.addEventListener("input", handleInputChange);
    input?.addEventListener("change", handleInputChange);
  });

  el.tryExampleBtn?.addEventListener("click", () => {
    state = normalizeInputs(EXAMPLE_INPUTS);
    persistInputs();
    populateForm();
    render();
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

  el.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-scroll-target") || "";
      setActiveTab(targetId);
      scrollToSection(targetId);
    });
  });

  window.addEventListener("scroll", updateActiveTabOnScroll, { passive: true });
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
  const lifeExpectancy = clamp(toNumber(source.lifeExpectancy, DEFAULT_INPUTS.lifeExpectancy), 60, 105);
  const comparisonAgeOne = clamp(toNumber(source.comparisonAgeOne, DEFAULT_INPUTS.comparisonAgeOne), 60, 105);
  const comparisonAgeTwo = clamp(toNumber(source.comparisonAgeTwo, DEFAULT_INPUTS.comparisonAgeTwo), 60, 105);

  return {
    monthlyAt65: clamp(toNumber(source.monthlyAt65, DEFAULT_INPUTS.monthlyAt65), 0, 5000),
    lifeExpectancy,
    annualReturn: clamp(toNumber(source.annualReturn, DEFAULT_INPUTS.annualReturn), 0, 12),
    inflationRate: clamp(toNumber(source.inflationRate, DEFAULT_INPUTS.inflationRate), 0, 8),
    comparisonAgeOne,
    comparisonAgeTwo,
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

function handleInputChange() {
  state = normalizeInputs({
    monthlyAt65: el.monthlyAt65.value,
    lifeExpectancy: el.lifeExpectancy.value,
    annualReturn: el.annualReturn.value,
    inflationRate: el.inflationRate.value,
    comparisonAgeOne: el.comparisonAgeOne.value,
    comparisonAgeTwo: el.comparisonAgeTwo.value,
  });

  persistInputs();
  render();
}

function render() {
  const model = calculateModel(state);
  renderSnapshot(model);
  renderHeroAside(model);
  renderTakeaway(model);
  renderWinnerPanel(model);
  renderComparisonCards(model);
  renderBreakEvenCards(model);
  renderChart(model);
  renderInsights(model);
}

function calculateModel(inputs) {
  const comparisonAges = Array.from(
    new Set(
      [inputs.comparisonAgeOne, inputs.comparisonAgeTwo, inputs.lifeExpectancy]
        .map((age) => clamp(Math.round(age), 60, 105))
        .sort((a, b) => a - b),
    ),
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
      finalAge: inputs.lifeExpectancy,
      timeline: timeline.points,
    };
  });

  const winner = [...scenarios].sort((a, b) => b.lifetimeTotal - a.lifetimeTotal)[0];
  const winnerByDiscounted = [...scenarios].sort((a, b) => b.discountedTotal - a.discountedTotal)[0];
  const breakEvenPairs = [
    buildBreakEven(scenarios, 60, 65, inputs.lifeExpectancy),
    buildBreakEven(scenarios, 65, 70, inputs.lifeExpectancy),
    buildBreakEven(scenarios, 60, 70, inputs.lifeExpectancy),
  ];

  return {
    inputs,
    comparisonAges,
    scenarios,
    winner,
    winnerByDiscounted,
    breakEvenPairs,
    realAnnualRate,
  };
}

function getAdjustedMonthly(baseMonthlyAt65, claimAge) {
  const monthsFrom65 = Math.round((claimAge - CPP_RULES.referenceAge) * 12);
  if (monthsFrom65 < 0) {
    return baseMonthlyAt65 * (1 + monthsFrom65 * CPP_RULES.earlyReductionPerMonth);
  }
  if (monthsFrom65 > 0) {
    return baseMonthlyAt65 * (1 + monthsFrom65 * CPP_RULES.delayedIncreasePerMonth);
  }
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
      points.push({
        age: roundTo(age, 1),
        total: totalNominal,
      });
    }
  }

  comparisonAges.forEach((checkpoint) => {
    const eligibleMonths = Math.max(0, Math.round((checkpoint - claimAge) * 12));
    byAge[checkpoint] = monthlyPayment * eligibleMonths;
  });

  return {
    byAge,
    points,
    totalNominal,
    totalDiscounted,
  };
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

function renderSnapshot(model) {
  const snapshotItems = [
    {
      label: "Best total at age " + model.inputs.lifeExpectancy,
      value: `CPP at ${model.winner.age}`,
      sub: formatCurrency(model.winner.lifetimeTotal) + " total CPP",
    },
    {
      label: "Highest monthly CPP",
      value: formatCurrency(model.scenarios[2].monthlyPayment),
      sub: "Starting at age 70",
    },
    {
      label: "Break-even 60 vs 65",
      value: formatBreakEvenShort(model.breakEvenPairs[0]),
      sub: model.breakEvenPairs[0].withinPlanningAge ? "Within your scenario" : "Beyond your planning age",
    },
    {
      label: "Real return assumption",
      value: formatPercent(model.realAnnualRate),
      sub: "Approx. return net of inflation",
    },
    {
      label: "Planning horizon",
      value: `Age ${model.inputs.lifeExpectancy}`,
      sub: "Reference point for lifetime totals",
    },
  ];

  el.snapshotGrid.innerHTML = snapshotItems
    .map(
      (item) => `
        <article class="trip-snapshot-item">
          <span class="label">${escapeHtml(item.label)}</span>
          <span class="value">${escapeHtml(item.value)}</span>
          <span class="sub">${escapeHtml(item.sub)}</span>
        </article>
      `,
    )
    .join("");
}

function renderHeroAside(model) {
  const winner = model.winner;
  const runnerUp = [...model.scenarios].sort((a, b) => b.lifetimeTotal - a.lifetimeTotal)[1];
  const edge = winner.lifetimeTotal - runnerUp.lifetimeTotal;
  el.heroAsideWinner.textContent = winner.age === 70
    ? "Waiting until 70 leads on lifetime CPP in this scenario."
    : winner.age === 60
      ? "Starting at 60 leads on lifetime CPP in this scenario."
      : "Starting at 65 is the middle-ground winner in this scenario.";
  el.heroAsideDetail.textContent =
    `${winner.age} leads by about ${formatCurrency(edge)} by age ${model.inputs.lifeExpectancy}, based on your assumptions.`;
}

function renderTakeaway(model) {
  const winner = model.winner;
  const breakEven70 = model.breakEvenPairs.find((pair) => pair.laterAge === 70);
  const breakEven65 = model.breakEvenPairs.find((pair) => pair.earlyAge === 60 && pair.laterAge === 65);
  const title =
    winner.age === 70
      ? "Waiting until 70 may maximize lifetime CPP in this scenario."
      : winner.age === 60
        ? "Starting CPP at 60 may produce more total CPP in this scenario."
        : "Starting CPP at 65 looks like the middle-ground fit in this scenario.";

  const body =
    winner.age === 70
      ? `You give up earlier payments, but the larger monthly benefit catches up if you expect a longer retirement. Delaying can be especially useful when you want stronger guaranteed income later in life.`
      : winner.age === 60
        ? `Taking CPP earlier can make sense when your planning horizon is shorter or you value cash flow sooner. The tradeoff is a permanently lower monthly benefit.`
        : `Age 65 balances immediate access and benefit size. It will not maximize the monthly cheque like age 70, but it avoids the long wait for delayed CPP.`;

  const metaItems = [
    `Best total by age ${model.inputs.lifeExpectancy}: CPP at ${winner.age}`,
    `60 vs 65 break-even: ${formatBreakEvenShort(breakEven65)}`,
    `65 vs 70 break-even: ${formatBreakEvenShort(breakEven70)}`,
  ];

  el.takeawayTitle.textContent = title;
  el.takeawayBody.textContent = body;
  el.takeawayMeta.innerHTML = metaItems.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join("");
}

function renderWinnerPanel(model) {
  const nominalEdge = model.winner.lifetimeTotal - [...model.scenarios].sort((a, b) => b.lifetimeTotal - a.lifetimeTotal)[1].lifetimeTotal;
  const discountedLead = model.winnerByDiscounted.age;

  el.winnerPanel.innerHTML = `
    <span class="winner-badge">Illustrative best fit</span>
    <div class="winner-metric">
      <span class="muted small-copy">Highest estimated lifetime CPP by age ${escapeHtml(String(model.inputs.lifeExpectancy))}</span>
      <strong>Start at age ${escapeHtml(String(model.winner.age))}</strong>
    </div>
    <p class="muted">Nominal lifetime CPP is about ${escapeHtml(formatCurrency(model.winner.lifetimeTotal))}, which is roughly ${escapeHtml(formatCurrency(nominalEdge))} ahead of the next-best option.</p>
    <p class="muted">Using your return assumption, the strongest discounted value is CPP at ${escapeHtml(String(discountedLead))}.</p>
  `;
}

function renderComparisonCards(model) {
  el.comparisonGrid.innerHTML = model.scenarios
    .map((scenario) => {
      const ageRows = model.comparisonAges
        .map(
          (age) => `
            <div class="metric-stack-row">
              <span>By age ${escapeHtml(String(age))}</span>
              <span>${escapeHtml(formatCurrency(scenario.byAge[age] || 0))}</span>
            </div>
          `,
        )
        .join("");

      return `
        <article class="result-card">
          <div class="result-card-header">
            <div>
              <h4>CPP at ${escapeHtml(String(scenario.age))}</h4>
              <div class="scenario-age">Claim age ${escapeHtml(String(scenario.age))}</div>
            </div>
            <span class="pill">${escapeHtml(getScenarioLabel(scenario.age))}</span>
          </div>
          <p class="scenario-monthly">${escapeHtml(formatCurrency(scenario.monthlyPayment))}<span class="scenario-age"> / month</span></p>
          <div class="metric-stack">
            <div class="metric-stack-row">
              <span>Annual CPP</span>
              <span>${escapeHtml(formatCurrency(scenario.annualPayment))}</span>
            </div>
            ${ageRows}
            <div class="metric-stack-row">
              <span>Total by age ${escapeHtml(String(model.inputs.lifeExpectancy))}</span>
              <span>${escapeHtml(formatCurrency(scenario.lifetimeTotal))}</span>
            </div>
            <div class="metric-stack-row">
              <span>Discounted value</span>
              <span>${escapeHtml(formatCurrency(scenario.discountedTotal))}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderBreakEvenCards(model) {
  el.breakEvenGrid.innerHTML = model.breakEvenPairs
    .map((pair) => {
      const headline = pair.breakEvenAge === null
        ? `CPP at ${pair.laterAge} does not catch CPP at ${pair.earlyAge} by age ${CPP_RULES.maxProjectionAge}.`
        : `CPP at ${pair.laterAge} overtakes CPP at ${pair.earlyAge} around age ${roundTo(pair.breakEvenAge, 1)}.`;

      const body = pair.breakEvenAge === null
        ? `Under these assumptions, the later start never makes up the missed payments in the model horizon.`
        : pair.withinPlanningAge
          ? `That break-even point is within your planning age of ${model.inputs.lifeExpectancy}, so waiting is more plausible if you expect to live that long or longer.`
          : `That break-even point is beyond your planning age of ${model.inputs.lifeExpectancy}, so the earlier start stays ahead in total dollars within this scenario.`;

      return `
        <article class="break-even-card">
          <h4>${escapeHtml(pair.earlyAge)} vs ${escapeHtml(pair.laterAge)}</h4>
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

  const chartWidth = 900;
  const chartHeight = 420;
  const padding = { top: 20, right: 20, bottom: 40, left: 64 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const maxAge = model.inputs.lifeExpectancy;
  const minAge = 60;
  const maxValue = Math.max(...model.scenarios.flatMap((scenario) => scenario.timeline.map((point) => point.total)), 1);
  const yTicks = 4;
  const xYears = Array.from({ length: maxAge - minAge + 1 }, (_, index) => minAge + index).filter((age) => age % 5 === 0 || age === maxAge || age === minAge);

  const lines = model.scenarios
    .map((scenario) => {
      const path = scenario.timeline
        .map((point, index) => {
          const x = padding.left + ((point.age - minAge) / (maxAge - minAge || 1)) * plotWidth;
          const y = padding.top + plotHeight - (point.total / maxValue) * plotHeight;
          return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
        })
        .join(" ");
      const lastPoint = scenario.timeline[scenario.timeline.length - 1];
      const lastX = padding.left + ((lastPoint.age - minAge) / (maxAge - minAge || 1)) * plotWidth;
      const lastY = padding.top + plotHeight - (lastPoint.total / maxValue) * plotHeight;

      return `
        <path class="chart-line" d="${path}" stroke="${escapeHtml(TEMPLATE.chartColors[scenario.age])}"></path>
        <circle class="chart-endpoint" cx="${lastX.toFixed(2)}" cy="${lastY.toFixed(2)}" r="5" fill="${escapeHtml(TEMPLATE.chartColors[scenario.age])}"></circle>
      `;
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
        <line class="chart-axis" x1="${x.toFixed(2)}" y1="${padding.top}" x2="${x.toFixed(2)}" y2="${chartHeight - padding.bottom}"></line>
        <text class="chart-label" x="${x.toFixed(2)}" y="${chartHeight - 12}" text-anchor="middle">${escapeHtml(String(age))}</text>
      `;
    })
    .join("");

  el.chartContainer.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 ${chartWidth} ${chartHeight}" aria-hidden="true">
      <rect x="${padding.left}" y="${padding.top}" width="${plotWidth}" height="${plotHeight}" fill="#fbfdff" stroke="#e6edf7" rx="14"></rect>
      ${yGrid}
      ${xLabels}
      ${lines}
      <text class="chart-label" x="${chartWidth / 2}" y="${chartHeight - 4}" text-anchor="middle">Age</text>
      <text class="chart-label" transform="translate(18 ${chartHeight / 2}) rotate(-90)" text-anchor="middle">Cumulative CPP received</text>
    </svg>
  `;

  el.chartCaption.textContent = `Chart runs from age 60 to age ${model.inputs.lifeExpectancy}. It shows estimated cumulative CPP only and does not include tax, investment growth, or other retirement income sources.`;
}

function renderInsights(model) {
  const scenario60 = model.scenarios.find((scenario) => scenario.age === 60);
  const scenario65 = model.scenarios.find((scenario) => scenario.age === 65);
  const scenario70 = model.scenarios.find((scenario) => scenario.age === 70);
  const insights = [
    {
      title: "Waiting meaningfully raises the monthly cheque",
      body: `CPP at 70 is about ${formatPercent(((scenario70.monthlyPayment / scenario65.monthlyPayment) - 1) * 100)} higher per month than CPP at 65 in this model.`,
    },
    {
      title: "Early CPP can stay ahead for a long time",
      body: `${formatBreakEvenSentence(model.breakEvenPairs[0])} That is why shorter planning horizons often favour earlier income.`,
    },
    {
      title: "Break-even depends heavily on lifespan",
      body: `If your planning horizon extends well past the break-even age, delaying becomes easier to justify. If not, earlier CPP may produce more total income.`,
    },
    {
      title: "CPP timing is only one retirement lever",
      body: `Review CPP beside OAS, pensions, RRSP/RRIF withdrawals, TFSA flexibility, and spending needs before making a real-world decision.`,
    },
    {
      title: "Discounted value can tell a different story",
      body: `When future income is discounted at ${formatPercent(model.inputs.annualReturn)}, the strongest present-value option here is CPP at ${model.winnerByDiscounted.age}.`,
    },
    {
      title: "Age 65 remains the baseline reference",
      body: `Your input amount at age 65 is the anchor used to estimate the age 60 and age 70 scenarios under standard timing adjustment rules.`,
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
  [el.plannerHeroLink, el.plannerResultsLink, el.footerPlannerLink].forEach((link) => {
    if (link) link.href = TEMPLATE.retirementPlannerUrl;
  });
  [el.supportLink, el.footerSupportLink].forEach((link) => {
    if (link) link.href = TEMPLATE.supportUrl;
  });
}

function scrollToSection(targetId) {
  const section = document.getElementById(targetId);
  if (!section) return;
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setActiveTab(targetId) {
  el.tabs.forEach((tab) => {
    const active = tab.getAttribute("data-scroll-target") === targetId;
    tab.classList.toggle("active", active);
  });
}

function updateActiveTabOnScroll() {
  const sections = ["calculatorPanel", "resultsPanel", "learnPanel", "faqPanel"];
  let active = sections[0];
  for (let index = 0; index < sections.length; index += 1) {
    const sectionId = sections[index];
    const section = document.getElementById(sectionId);
    if (!section) continue;
    const rect = section.getBoundingClientRect();
    if (rect.top <= 140) active = sectionId;
  }
  setActiveTab(active);
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
