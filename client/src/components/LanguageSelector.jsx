import { useEffect, useState } from 'react';
import { getLanguages } from '../api/codeRunner';

const LanguageSelector = ({ onSelect }) => {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                setLoading(true);
                const data = await getLanguages();
                setLanguages(data);
            } catch (err) {
                console.error("Failed to fetch languages: ", err);
                setError('Failed to load languages');
                // Fallback to default languages
                setLanguages([
                    { id: 50, name: 'C (GCC 9.2.0)' },
                    { id: 54, name: 'C++ (GCC 9.2.0)' },
                    { id: 62, name: 'Java (OpenJDK 13.0.1)' },
                    { id: 63, name: 'JavaScript (Node.js 12.14.0)' },
                    { id: 71, name: 'Python (3.8.1)' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchLanguages();
    }, []);

    if (loading) {
        return (
            <div className="relative">
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed" disabled>
                    <option>Loading languages...</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <select 
                onChange={(e) => onSelect(Number(e.target.value))} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 hover:border-gray-400 cursor-pointer appearance-none"
                defaultValue={71}
            >
                {languages.map(lang => (
                    <option key={lang.id} value={lang.id} className="py-2">
                        {lang.name}
                    </option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

export default LanguageSelector;