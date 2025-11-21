'use client';

import { useState, useEffect } from 'react';
import { SummaryResponse, HistoryItem, DifficultyLevel } from '@/types/api';
import Link from 'next/link';

const API_BASE_URL = 'http://localhost:8000/api'; 

const StatCard: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
    <div className={`p-4 rounded-lg shadow-md text-center ${color} text-white`}>
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-sm">{title}</div>
    </div>
);

const LevelBar: React.FC<{ level: DifficultyLevel; count: number; total: number }> = ({ level, count, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    let colorClass = 'bg-gray-400';
    if (level === 'Beginner') colorClass = 'bg-success';
    else if (level === 'Intermediate') colorClass = 'bg-warning';
    else if (level === 'Advanced') colorClass = 'bg-danger';

    return (
        <div className="mb-2">
            <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>{level} ({count})</span>
                <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className={`h-2.5 rounded-full ${colorClass}`} 
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};


export default function DashboardPage() {
    const [summary, setSummary] = useState<SummaryResponse | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const summaryRes = await fetch(`${API_BASE_URL}/summary`);
                if (!summaryRes.ok) throw new Error('Failed to fetch summary.');
                const summaryData: SummaryResponse = await summaryRes.json();
                setSummary(summaryData);

                const historyRes = await fetch(`${API_BASE_URL}/history?limit=5`);
                if (!historyRes.ok) throw new Error('Failed to fetch history.');
                const historyData: HistoryItem[] = await historyRes.json();
                setHistory(historyData);

            } catch (err: any) {
                setError(`Error fetching data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalPractices = summary?.total_practices || 0;
    const levelKeys: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

    if (loading) return <div className="max-w-6xl mx-auto p-6 mt-10 text-center">Loading Dashboard...</div>;
    if (error) return <div className="max-w-6xl mx-auto p-6 mt-10 text-center text-danger">Error: {error}</div>;
    
    return (
        <div className="max-w-6xl mx-auto p-6 mt-4">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">📊 Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard 
                    title="Total Practices" 
                    value={totalPractices} 
                    color="bg-info" 
                />
                <StatCard 
                    title="Average Score" 
                    value={summary?.average_score?.toFixed(1) || 'N/A'} 
                    color="bg-primary" 
                />
                <StatCard 
                    title="Words Practiced" 
                    value={summary?.total_words_practiced || 0} 
                    color="bg-accent" 
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Practice Distribution by Level</h2>
                    {summary?.level_distribution && totalPractices > 0 ? (
                        levelKeys.map(level => (
                            <LevelBar 
                                key={level}
                                level={level}
                                count={summary.level_distribution[level]}
                                total={totalPractices}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500">No practice data available.</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent History (Last 5)</h2>
                    {history.length > 0 ? (
                        <ul className="space-y-3">
                            {history.map((item) => (
                                <li key={item.id} className="border-b pb-3 last:border-b-0">
                                    <div className="flex justify-between items-start">
                                        <div className="font-semibold text-primary">{item.word}</div>
                                        <div className={`text-sm px-2 py-0.5 rounded ${item.score >= 80 ? 'bg-success/20 text-success' : item.score >= 60 ? 'bg-warning/20 text-warning' : 'bg-danger/20 text-danger'}`}>
                                            Score: {item.score.toFixed(1)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">{item.user_sentence}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(item.practiced_at).toLocaleString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No recent practice history.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// "use client";

// import BarChart from "@/components/BarChart";
// import RecentHistory from "@/components/RecentHistory";
// import StatsCard from "@/components/StatsCard";
// import { useState, useEffect } from 'react';

// export default function Dashboard() {
//   const [totalPractices, setTotalPractices] = useState(0);
//   const [averageScore, setAverageScore] = useState(0.0);
//   const [wordsPracticed, setWordsPracticed] = useState(0);

//   useEffect(() => {
//     const history = JSON.parse(localStorage.getItem('wordHistory') || '[]');
//     setTotalPractices(history.length);

//     if (history.length > 0) {
//       const totalScore = history.reduce((sum: number, item: any) => sum + item.score, 0);
//       setAverageScore(totalScore / history.length);
//       const uniqueWords = new Set(history.map((item: any) => item.word));
//       setWordsPracticed(uniqueWords.size);
//     } else {
//       setAverageScore(0.0);
//       setWordsPracticed(0);
//     }
//   }, []);

//   return (
//     <div className="container mx-auto p-4 max-w-6xl">
//       <h1 className="text-4xl font-extrabold mb-8 text-gray-800 text-center">Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <StatsCard title="Total Practices" value={totalPractices.toString()} />
//         <StatsCard title="Average Score" value={averageScore.toFixed(1)} />
//         <StatsCard title="Words Practiced" value={wordsPracticed.toString()} />
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-800">Practice Distribution</h2>
//           <BarChart />
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recent History</h2>
//           <RecentHistory />
//         </div>
//       </div>
//     </div>
//   );
// }
