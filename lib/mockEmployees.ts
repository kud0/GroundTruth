// Mock employee data for AI simulation demo

export interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  seniority: 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  yearsAtCompany: number;
  personality: 'optimistic' | 'pessimistic' | 'analytical' | 'risk-averse' | 'contrarian';
}

export const mockEmployees: Employee[] = [
  // Executive Team (5)
  { id: 1, name: "Sarah Chen", role: "CEO", department: "Executive", seniority: "executive", yearsAtCompany: 8, personality: "optimistic" },
  { id: 2, name: "Marcus Johnson", role: "CTO", department: "Executive", seniority: "executive", yearsAtCompany: 6, personality: "analytical" },
  { id: 3, name: "Lisa Rodriguez", role: "CFO", department: "Executive", seniority: "executive", yearsAtCompany: 5, personality: "risk-averse" },
  { id: 4, name: "David Kim", role: "VP Sales", department: "Executive", seniority: "executive", yearsAtCompany: 4, personality: "optimistic" },
  { id: 5, name: "Rachel Green", role: "VP Product", department: "Executive", seniority: "executive", yearsAtCompany: 3, personality: "analytical" },

  // Engineering (15)
  { id: 6, name: "Alex Thompson", role: "Engineering Manager", department: "Engineering", seniority: "lead", yearsAtCompany: 7, personality: "analytical" },
  { id: 7, name: "Jordan Lee", role: "Senior Engineer", department: "Engineering", seniority: "senior", yearsAtCompany: 5, personality: "optimistic" },
  { id: 8, name: "Sam Patel", role: "Senior Engineer", department: "Engineering", seniority: "senior", yearsAtCompany: 4, personality: "pessimistic" },
  { id: 9, name: "Morgan Davis", role: "Engineer", department: "Engineering", seniority: "mid", yearsAtCompany: 3, personality: "analytical" },
  { id: 10, name: "Casey White", role: "Engineer", department: "Engineering", seniority: "mid", yearsAtCompany: 2, personality: "optimistic" },
  { id: 11, name: "Jamie Wilson", role: "Engineer", department: "Engineering", seniority: "mid", yearsAtCompany: 2, personality: "contrarian" },
  { id: 12, name: "Taylor Brown", role: "Junior Engineer", department: "Engineering", seniority: "junior", yearsAtCompany: 1, personality: "optimistic" },
  { id: 13, name: "Riley Martinez", role: "Junior Engineer", department: "Engineering", seniority: "junior", yearsAtCompany: 1, personality: "analytical" },
  { id: 14, name: "Avery Garcia", role: "Engineer", department: "Engineering", seniority: "mid", yearsAtCompany: 3, personality: "risk-averse" },
  { id: 15, name: "Quinn Anderson", role: "Senior Engineer", department: "Engineering", seniority: "senior", yearsAtCompany: 6, personality: "contrarian" },
  { id: 16, name: "Drew Taylor", role: "Engineer", department: "Engineering", seniority: "mid", yearsAtCompany: 2, personality: "pessimistic" },
  { id: 17, name: "Skyler Moore", role: "Junior Engineer", department: "Engineering", seniority: "junior", yearsAtCompany: 1, personality: "optimistic" },
  { id: 18, name: "Blake Jackson", role: "Engineer", department: "Engineering", seniority: "mid", yearsAtCompany: 3, personality: "analytical" },
  { id: 19, name: "Reese Thomas", role: "Senior Engineer", department: "Engineering", seniority: "senior", yearsAtCompany: 5, personality: "optimistic" },
  { id: 20, name: "Sage Williams", role: "Engineer", department: "Engineering", seniority: "mid", yearsAtCompany: 2, personality: "contrarian" },

  // Sales (10)
  { id: 21, name: "Chris Miller", role: "Sales Manager", department: "Sales", seniority: "lead", yearsAtCompany: 6, personality: "optimistic" },
  { id: 22, name: "Pat Jones", role: "Senior AE", department: "Sales", seniority: "senior", yearsAtCompany: 4, personality: "optimistic" },
  { id: 23, name: "Max Robinson", role: "Account Executive", department: "Sales", seniority: "mid", yearsAtCompany: 2, personality: "optimistic" },
  { id: 24, name: "Dana Clark", role: "Account Executive", department: "Sales", seniority: "mid", yearsAtCompany: 3, personality: "analytical" },
  { id: 25, name: "Kai Lewis", role: "SDR", department: "Sales", seniority: "junior", yearsAtCompany: 1, personality: "optimistic" },
  { id: 26, name: "River Walker", role: "Account Executive", department: "Sales", seniority: "mid", yearsAtCompany: 2, personality: "optimistic" },
  { id: 27, name: "Phoenix Hall", role: "Senior AE", department: "Sales", seniority: "senior", yearsAtCompany: 5, personality: "analytical" },
  { id: 28, name: "Sage Allen", role: "Account Executive", department: "Sales", seniority: "mid", yearsAtCompany: 2, personality: "pessimistic" },
  { id: 29, name: "Rowan Young", role: "SDR", department: "Sales", seniority: "junior", yearsAtCompany: 1, personality: "optimistic" },
  { id: 30, name: "Eden King", role: "Account Executive", department: "Sales", seniority: "mid", yearsAtCompany: 3, personality: "contrarian" },

  // Product (8)
  { id: 31, name: "Harper Scott", role: "Product Manager", department: "Product", seniority: "lead", yearsAtCompany: 5, personality: "analytical" },
  { id: 32, name: "Cameron Green", role: "Senior PM", department: "Product", seniority: "senior", yearsAtCompany: 4, personality: "analytical" },
  { id: 33, name: "Finley Adams", role: "Product Designer", department: "Product", seniority: "mid", yearsAtCompany: 3, personality: "optimistic" },
  { id: 34, name: "Emerson Baker", role: "Product Designer", department: "Product", seniority: "mid", yearsAtCompany: 2, personality: "analytical" },
  { id: 35, name: "Oakley Carter", role: "PM", department: "Product", seniority: "mid", yearsAtCompany: 2, personality: "risk-averse" },
  { id: 36, name: "Sawyer Mitchell", role: "Product Designer", department: "Product", seniority: "senior", yearsAtCompany: 4, personality: "contrarian" },
  { id: 37, name: "Hayden Perez", role: "PM", department: "Product", seniority: "mid", yearsAtCompany: 3, personality: "optimistic" },
  { id: 38, name: "Ellis Roberts", role: "Junior Designer", department: "Product", seniority: "junior", yearsAtCompany: 1, personality: "analytical" },

  // Marketing (6)
  { id: 39, name: "Addison Turner", role: "Marketing Manager", department: "Marketing", seniority: "lead", yearsAtCompany: 4, personality: "optimistic" },
  { id: 40, name: "Parker Phillips", role: "Content Lead", department: "Marketing", seniority: "senior", yearsAtCompany: 3, personality: "analytical" },
  { id: 41, name: "Bailey Campbell", role: "Marketing Specialist", department: "Marketing", seniority: "mid", yearsAtCompany: 2, personality: "optimistic" },
  { id: 42, name: "Charlie Evans", role: "Social Media Manager", department: "Marketing", seniority: "mid", yearsAtCompany: 2, personality: "contrarian" },
  { id: 43, name: "Remy Edwards", role: "SEO Specialist", department: "Marketing", seniority: "mid", yearsAtCompany: 1, personality: "analytical" },
  { id: 44, name: "Stevie Collins", role: "Marketing Coordinator", department: "Marketing", seniority: "junior", yearsAtCompany: 1, personality: "optimistic" },

  // Customer Success (6)
  { id: 45, name: "Devon Stewart", role: "CS Manager", department: "Customer Success", seniority: "lead", yearsAtCompany: 5, personality: "analytical" },
  { id: 46, name: "Kendall Morris", role: "Senior CSM", department: "Customer Success", seniority: "senior", yearsAtCompany: 3, personality: "optimistic" },
  { id: 47, name: "Peyton Rogers", role: "CSM", department: "Customer Success", seniority: "mid", yearsAtCompany: 2, personality: "risk-averse" },
  { id: 48, name: "Justice Reed", role: "CSM", department: "Customer Success", seniority: "mid", yearsAtCompany: 2, personality: "analytical" },
  { id: 49, name: "Tatum Cook", role: "Support Specialist", department: "Customer Success", seniority: "junior", yearsAtCompany: 1, personality: "optimistic" },
  { id: 50, name: "Winter Bell", role: "CSM", department: "Customer Success", seniority: "mid", yearsAtCompany: 3, personality: "pessimistic" },
];

// Personality-based betting behavior
export function getPersonalityBias(personality: Employee['personality']): number {
  switch (personality) {
    case 'optimistic': return 0.7; // 70% likely to bet YES
    case 'pessimistic': return 0.3; // 30% likely to bet YES
    case 'analytical': return 0.5; // 50/50 data-driven
    case 'risk-averse': return 0.45; // Slightly conservative
    case 'contrarian': return 0.4; // Goes against consensus
    default: return 0.5;
  }
}

// Seniority affects bet size
export function getBetAmount(seniority: Employee['seniority']): number {
  switch (seniority) {
    case 'executive': return Math.floor(Math.random() * 200) + 100; // $100-300
    case 'lead': return Math.floor(Math.random() * 100) + 50; // $50-150
    case 'senior': return Math.floor(Math.random() * 80) + 30; // $30-110
    case 'mid': return Math.floor(Math.random() * 50) + 20; // $20-70
    case 'junior': return Math.floor(Math.random() * 30) + 10; // $10-40
    default: return 25;
  }
}
