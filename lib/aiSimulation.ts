import { Employee, mockEmployees, getPersonalityBias, getBetAmount } from './mockEmployees';

export interface Bet {
  employeeId: number;
  employeeName: string;
  role: string;
  department: string;
  prediction: 'YES' | 'NO';
  amount: number;
  reasoning: string;
  timestamp: Date;
}

// Simple AI reasoning generator (no API calls needed!)
export function generateReasoning(employee: Employee, question: string, prediction: 'YES' | 'NO'): string {
  const templates = {
    optimistic: {
      YES: [
        `Based on our current trajectory and ${employee.department} team performance, I'm confident we'll hit this target.`,
        `I've seen the growth metrics and believe we're on track to exceed expectations.`,
        `The market conditions are favorable and our team is executing well.`,
      ],
      NO: [
        `While I'm generally optimistic, the timeline seems too aggressive given our current resources.`,
        `I want to believe we can do it, but the data suggests we need more time.`,
      ],
    },
    pessimistic: {
      YES: [
        `Surprisingly, the numbers actually support this outcome despite my usual skepticism.`,
        `I'm cautiously optimistic based on recent performance improvements.`,
      ],
      NO: [
        `Based on historical patterns and current headwinds, I don't see us reaching this milestone.`,
        `The market conditions and internal challenges make this target unrealistic.`,
        `We've missed similar targets before, and I don't see what's different this time.`,
      ],
    },
    analytical: {
      YES: [
        `My analysis of Q1-Q3 data shows a 73% probability of hitting this target.`,
        `The metrics from ${employee.department} indicate we're trending 15% above plan.`,
        `Data-driven forecast models suggest this is achievable with our current burn rate.`,
      ],
      NO: [
        `The numbers don't support this timeline - we're currently tracking 22% below target.`,
        `Based on conversion rates and pipeline data, we'll likely fall short by 18%.`,
        `My analysis shows we need 3 more quarters to reach this milestone realistically.`,
      ],
    },
    'risk-averse': {
      YES: [
        `With proper risk mitigation and our current conservative approach, this seems achievable.`,
        `The low-risk path we're on should get us there, though it'll be tight.`,
      ],
      NO: [
        `The risk/reward ratio doesn't justify betting on this aggressive timeline.`,
        `Too many external variables and unknowns to confidently predict success.`,
        `Better to underestimate and overdeliver than the reverse.`,
      ],
    },
    contrarian: {
      YES: [
        `Everyone's being too pessimistic - the market is underestimating our potential.`,
        `Conventional wisdom says no, but I see opportunities others are missing.`,
      ],
      NO: [
        `While everyone's bullish, I see structural issues that will prevent us from hitting this.`,
        `The consensus is wrong - they're not accounting for the upcoming market shift.`,
        `Unpopular opinion: we're overextended and need to reset expectations.`,
      ],
    },
  };

  const options = templates[employee.personality][prediction];
  return options[Math.floor(Math.random() * options.length)];
}

// Simulate employee decision-making
export function simulateEmployeeBet(employee: Employee, question: string, currentOdds: { yes: number; no: number }): Bet {
  const personalityBias = getPersonalityBias(employee.personality);

  // Factor in current odds (contrarians go against consensus)
  let yesLikelihood = personalityBias;

  if (employee.personality === 'contrarian') {
    // Contrarians bet against the majority
    yesLikelihood = currentOdds.yes > 60 ? 0.3 : 0.7;
  } else if (employee.personality === 'analytical') {
    // Analytical people look for value
    if (currentOdds.yes > 70) yesLikelihood = 0.4; // Overvalued
    if (currentOdds.yes < 30) yesLikelihood = 0.6; // Undervalued
  }

  // Add some randomness
  const randomFactor = Math.random() * 0.2 - 0.1; // ±10%
  yesLikelihood = Math.max(0, Math.min(1, yesLikelihood + randomFactor));

  const prediction = Math.random() < yesLikelihood ? 'YES' : 'NO';
  const amount = getBetAmount(employee.seniority);
  const reasoning = generateReasoning(employee, question, prediction);

  return {
    employeeId: employee.id,
    employeeName: employee.name,
    role: employee.role,
    department: employee.department,
    prediction,
    amount,
    reasoning,
    timestamp: new Date(),
  };
}

// Run full simulation
export function runFullSimulation(question: string): {
  bets: Bet[];
  totalYes: number;
  totalNo: number;
  yesPercentage: number;
  noPercentage: number;
} {
  const bets: Bet[] = [];
  let totalYes = 0;
  let totalNo = 0;

  // Simulate in waves (more realistic)
  const shuffledEmployees = [...mockEmployees].sort(() => Math.random() - 0.5);

  shuffledEmployees.forEach((employee, index) => {
    // Calculate current odds based on bets so far
    const currentOdds = {
      yes: totalYes + totalNo > 0 ? (totalYes / (totalYes + totalNo)) * 100 : 50,
      no: totalYes + totalNo > 0 ? (totalNo / (totalYes + totalNo)) * 100 : 50,
    };

    const bet = simulateEmployeeBet(employee, question, currentOdds);
    bets.push(bet);

    if (bet.prediction === 'YES') {
      totalYes += bet.amount;
    } else {
      totalNo += bet.amount;
    }
  });

  const total = totalYes + totalNo;

  return {
    bets,
    totalYes,
    totalNo,
    yesPercentage: (totalYes / total) * 100,
    noPercentage: (totalNo / total) * 100,
  };
}

// Simulate in real-time (one bet every X ms)
export function* simulateRealtime(question: string, delayMs: number = 500) {
  const shuffledEmployees = [...mockEmployees].sort(() => Math.random() - 0.5);
  let totalYes = 0;
  let totalNo = 0;

  for (const employee of shuffledEmployees) {
    const currentOdds = {
      yes: totalYes + totalNo > 0 ? (totalYes / (totalYes + totalNo)) * 100 : 50,
      no: totalYes + totalNo > 0 ? (totalNo / (totalYes + totalNo)) * 100 : 50,
    };

    const bet = simulateEmployeeBet(employee, question, currentOdds);

    if (bet.prediction === 'YES') {
      totalYes += bet.amount;
    } else {
      totalNo += bet.amount;
    }

    yield {
      bet,
      totalYes,
      totalNo,
      yesPercentage: totalYes + totalNo > 0 ? (totalYes / (totalYes + totalNo)) * 100 : 50,
      noPercentage: totalYes + totalNo > 0 ? (totalNo / (totalYes + totalNo)) * 100 : 50,
    };
  }
}
