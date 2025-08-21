import React, { useState } from "react";
import { Search, Plus, Sun, Moon } from "lucide-react";

const prompts = [
  {
    title: "Explain ChatGPT",
    description: "A detailed explanation of how ChatGPT works.",
    tag: "ChatGPT",
  },
  {
    title: "Marketing Ideas",
    description: "Generate five marketing ideas for a new product.",
    tag: "Marketing",
  },
  {
    title: "Code Formatter",
    description: "Format a block of JavaScript code.",
    tag: "Code",
  },
  {
    title: "Compose Poem",
    description: "Compose a poem about the ocean.",
    tag: "Poetry",
  },
];

export default function App() {
  const [dark, setDark] = useState(true);

  return (
    <div className={`${dark ? "bg-[#111827] text-white" : "bg-gray-100 text-black"} min-h-screen flex`}>
      {/* Sidebar */}
      <div className="w-64 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-indigo-600 text-white px-2 py-1 rounded-lg">PV</span>
            PromptVault
          </h1>
          <p className="text-sm mt-1 text-gray-400">Never lose a prompt again.</p>

          <div className="mt-8 space-y-4">
            <button className="block w-full text-left text-gray-300 hover:text-white">Personal Vault</button>
            <button className="block w-full text-left text-gray-300 hover:text-white">Community</button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Dark</span>
          <button
            onClick={() => setDark(!dark)}
            className="w-12 h-6 flex items-center rounded-full p-1 bg-gray-600"
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-md transform duration-300 ${
                dark ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Search + New Prompt */}
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-gray-700 rounded-lg px-4 py-2 w-96">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Find prompts by intent..."
              className="bg-transparent outline-none px-2 text-sm w-full"
            />
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg text-white font-medium">
            <Plus size={16} /> New Prompt
          </button>
        </div>

        {/* Prompt Cards */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          {prompts.map((prompt, idx) => (
            <div key={idx} className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h2 className="text-lg font-semibold">{prompt.title}</h2>
              <p className="text-sm text-gray-400 mt-1">{prompt.description}</p>
              <span className="inline-block mt-3 px-3 py-1 text-xs rounded-lg bg-gray-700 text-indigo-300">
                {prompt.tag}
              </span>
            </div>
          ))}

          {/* Export Prompt */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-semibold">Export Prompt</h2>
            <div className="flex gap-3 mt-4">
              <button className="bg-gray-700 px-3 py-2 rounded-lg text-sm">JSON</button>
              <button className="bg-gray-700 px-3 py-2 rounded-lg text-sm">Notion</button>
              <button className="bg-gray-700 px-3 py-2 rounded-lg text-sm">PDF</button>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p className="font-medium text-white">Explain ChatGPT</p>
              A detailed explanation of how ChatGPT works.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
