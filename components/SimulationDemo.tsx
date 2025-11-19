'use client';

import { useState } from 'react';
import { runFullSimulation, simulateRealtime, Bet } from '@/lib/aiSimulation';

export function SimulationDemo({ question }: { question: string }) {
  const [isRunning, setIsRunning] = useState(false);
  const [bets, setBets] = useState<Bet[]>([]);
  const [stats, setStats] = useState({ totalYes: 0, totalNo: 0, yesPercentage: 50, noPercentage: 50 });
  const [showResults, setShowResults] = useState(false);

  const runInstantSimulation = () => {
    const result = runFullSimulation(question);
    setBets(result.bets);
    setStats({
      totalYes: result.totalYes,
      totalNo: result.totalNo,
      yesPercentage: result.yesPercentage,
      noPercentage: result.noPercentage,
    });
    setShowResults(true);
  };

  const runLiveSimulation = async () => {
    setIsRunning(true);
    setBets([]);
    setShowResults(false);

    const generator = simulateRealtime(question, 300);

    for (const result of generator) {
      setBets((prev) => [...prev, result.bet]);
      setStats({
        totalYes: result.totalYes,
        totalNo: result.totalNo,
        yesPercentage: result.yesPercentage,
        noPercentage: result.noPercentage,
      });
      await new Promise((resolve) => setTimeout(resolve, 300)); // 300ms delay between bets
    }

    setIsRunning(false);
    setShowResults(true);
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-8 rounded-lg mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            🤖 AI Employee Simulation
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Watch 50 AI employees with different roles & personalities place bets in real-time
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={runInstantSimulation}
            disabled={isRunning}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            ⚡ Instant Demo
          </button>
          <button
            onClick={runLiveSimulation}
            disabled={isRunning}
            className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition"
          >
            {isRunning ? '🔄 Simulating...' : '▶️ Live Demo'}
          </button>
        </div>
      </div>

      {/* Live Stats */}
      {(bets.length > 0 || isRunning) && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">YES Votes</div>
            <div className="text-3xl font-bold text-green-600">
              {stats.yesPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">${stats.totalYes.toFixed(0)} total</div>
          </div>
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">NO Votes</div>
            <div className="text-3xl font-bold text-red-600">
              {stats.noPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">${stats.totalNo.toFixed(0)} total</div>
          </div>
        </div>
      )}

      {/* Bet Feed */}
      {bets.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
          <div className="text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
            Recent Bets ({bets.length}/50)
          </div>
          <div className="space-y-2">
            {bets.slice(-10).reverse().map((bet, index) => (
              <div
                key={`${bet.employeeId}-${index}`}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg animate-fade-in"
              >
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  bet.prediction === 'YES'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {bet.prediction}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-gray-900 dark:text-white">
                    {bet.employeeName}
                    <span className="font-normal text-gray-500 ml-2">
                      {bet.role} • {bet.department}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    ${bet.amount}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {bet.reasoning}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Summary */}
      {showResults && !isRunning && (
        <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
          <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
            📊 Simulation Complete
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{bets.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Employees</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                ${(stats.totalYes + stats.totalNo).toFixed(0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Pool</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {stats.yesPercentage > 50 ? 'YES' : 'NO'} wins
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {Math.max(stats.yesPercentage, stats.noPercentage).toFixed(1)}% consensus
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Department Confidence Breakdown */}
      {showResults && !isRunning && (
        <div className="mt-6">
          <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
            📊 Department Confidence Levels
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(
              bets.reduce((acc, bet) => {
                const dept = bet.department;
                if (!acc[dept]) {
                  acc[dept] = { yes: 0, no: 0, yesAmount: 0, noAmount: 0, count: 0 };
                }
                acc[dept].count++;
                if (bet.prediction === 'YES') {
                  acc[dept].yes++;
                  acc[dept].yesAmount += bet.amount;
                } else {
                  acc[dept].no++;
                  acc[dept].noAmount += bet.amount;
                }
                return acc;
              }, {} as Record<string, { yes: number; no: number; yesAmount: number; noAmount: number; count: number }>)
            )
              .sort((a, b) => b[1].count - a[1].count) // Sort by team size
              .map(([dept, stats]) => {
                const yesPercentage = (stats.yes / stats.count) * 100;
                const isConfident = yesPercentage > 60 || yesPercentage < 40;
                const sentiment = yesPercentage > 60 ? 'Bullish' : yesPercentage < 40 ? 'Bearish' : 'Mixed';
                const sentimentColor = yesPercentage > 60 ? 'text-green-600' : yesPercentage < 40 ? 'text-red-600' : 'text-yellow-600';

                return (
                  <div key={dept} className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-gray-900 dark:text-white">{dept}</div>
                      <div className={`text-xs font-bold px-2 py-1 rounded ${isConfident ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                        {isConfident ? '💪 Confident' : '🤔 Mixed'}
                      </div>
                    </div>

                    <div className="text-2xl font-bold mb-2 ${sentimentColor}">
                      {sentiment}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <div className="text-lg font-bold text-green-600">{stats.yes}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">YES votes</div>
                      </div>
                      <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                        <div className="text-lg font-bold text-red-600">{stats.no}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">NO votes</div>
                      </div>
                    </div>

                    {/* Percentage bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${yesPercentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{yesPercentage.toFixed(0)}% YES</span>
                      <span>{stats.count} employees</span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                      💰 ${stats.yesAmount + stats.noAmount} total bet
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
