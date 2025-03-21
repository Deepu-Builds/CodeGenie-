import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai"; // ✅ Use Google Gemini SDK
import ChatMessage from "./components/ChatMessage";

function App() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const examples = [
    "React useState example",
    "Python list comprehension example",
    "What is cloud computing?",
    "JavaScript async/await example",
    "Explain Docker containers",
    "React useEffect example",
  ];

  // ✅ Initialize Google AI SDK
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await model.generateContent(query);
      const textResponse = await result.response.text(); // ✅ Extract text properly

      if (textResponse) {
        const newMessage = { query, response: textResponse };
        setMessages((prev) => [...prev, newMessage]);
        setQuery("");
      } else {
        throw new Error("Invalid response from Gemini API.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to get response. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-100"} transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-8 mb-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">AI Code Assistant</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Popular Examples</h2>
          <div className="flex flex-wrap gap-3">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setQuery(example)}
                className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-all transform hover:scale-105 font-medium"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className="animate-fadeIn">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 text-sm">Q</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{msg.query}</div>
              </div>
              <div className="pl-10">
                <ChatMessage message={msg.response} />
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-6 shadow-lg border-t dark:border-gray-700">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a programming or tech question..."
              className="flex-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all transform hover:scale-105 font-medium"
            >
              {loading ? "Processing..." : "Ask AI"}
            </button>
          </div>
          {error && <div className="mt-3 text-red-500 text-sm text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default App;
