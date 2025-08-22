import React, { useState, useEffect } from "react";
import { Search, Plus, X, Trash2, Edit3, Share2, Star, Globe, Copy, Filter, Moon, Sun, Download, Heart, User, LogOut } from "lucide-react";

// Mock API service for demonstration (replace with actual API calls)
const apiService = {
  // Simulate API calls with localStorage for demonstration
  async getPrompts(vaultType, searchQuery, category) {
    // In a real app, you would use axios to call your backend
    const storedPrompts = JSON.parse(localStorage.getItem('prompts') || '[]');
    
    let filtered = storedPrompts;
    
    // Filter by vault type
    if (vaultType === 'personal') {
      filtered = filtered.filter(prompt => prompt.creator === 'current-user');
    } else if (vaultType === 'community') {
      filtered = filtered.filter(prompt => prompt.isPublic);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(prompt => 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter(prompt => prompt.category === category);
    }
    
    return filtered;
  },

  async createPrompt(promptData) {
    // In a real app, you would use axios to call your backend
    const newPrompt = {
      _id: Date.now().toString(),
      ...promptData,
      creator: 'current-user',
      createdAt: new Date().toISOString(),
      likes: 0,
      isFavorite: false
    };
    
    const storedPrompts = JSON.parse(localStorage.getItem('prompts') || '[]');
    const updatedPrompts = [...storedPrompts, newPrompt];
    localStorage.setItem('prompts', JSON.stringify(updatedPrompts));
    
    return newPrompt;
  },

  async updatePrompt(id, promptData) {
    // In a real app, you would use axios to call your backend
    const storedPrompts = JSON.parse(localStorage.getItem('prompts') || '[]');
    const updatedPrompts = storedPrompts.map(prompt => 
      prompt._id === id ? { ...prompt, ...promptData } : prompt
    );
    
    localStorage.setItem('prompts', JSON.stringify(updatedPrompts));
    return updatedPrompts.find(prompt => prompt._id === id);
  },

  async deletePrompt(id) {
    // In a real app, you would use axios to call your backend
    const storedPrompts = JSON.parse(localStorage.getItem('prompts') || '[]');
    const updatedPrompts = storedPrompts.filter(prompt => prompt._id !== id);
    localStorage.setItem('prompts', JSON.stringify(updatedPrompts));
  },

  async togglePublic(id) {
    // In a real app, you would use axios to call your backend
    const storedPrompts = JSON.parse(localStorage.getItem('prompts') || '[]');
    const updatedPrompts = storedPrompts.map(prompt => 
      prompt._id === id ? { ...prompt, isPublic: !prompt.isPublic } : prompt
    );
    
    localStorage.setItem('prompts', JSON.stringify(updatedPrompts));
    return updatedPrompts.find(prompt => prompt._id === id);
  },

  async toggleFavorite(id) {
    // In a real app, you would use axios to call your backend
    const storedPrompts = JSON.parse(localStorage.getItem('prompts') || '[]');
    const updatedPrompts = storedPrompts.map(prompt => 
      prompt._id === id ? { ...prompt, isFavorite: !prompt.isFavorite } : prompt
    );
    
    localStorage.setItem('prompts', JSON.stringify(updatedPrompts));
    return updatedPrompts.find(prompt => prompt._id === id);
  },

  async sharePrompt(id, permission, expiresInDays) {
    // In a real app, you would use axios to call your backend
    // This is a mock implementation
    const token = `share-${id}-${Date.now()}`;
    return {
      success: true,
      shareUrl: `${window.location.origin}/shared/${token}`,
      expiresAt: expiresInDays ? 
        new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString() : 
        null
    };
  }
};

// Initial mock data
const initialMockPrompts = [
  { 
    _id: '1', 
    title: "Explain ChatGPT", 
    content: "A detailed explanation of how ChatGPT works, including its architecture and training process.", 
    category: "AI", 
    tags: ["ChatGPT", "AI", "Explanation"],
    likes: 42,
    isPublic: true,
    isFavorite: false,
    creator: 'system',
    format: 'text',
    vaultType: 'community',
    createdAt: new Date().toISOString()
  },
  { 
    _id: '2', 
    title: "Marketing Ideas", 
    content: "Generate five innovative marketing ideas for a new tech product launch.", 
    category: "Marketing", 
    tags: ["Marketing", "Ideation", "Strategy"],
    likes: 28,
    isPublic: true,
    isFavorite: true,
    creator: 'system',
    format: 'text',
    vaultType: 'community',
    createdAt: new Date().toISOString()
  },
  { 
    _id: '3', 
    title: "Code Formatter", 
    content: "Format this JavaScript code following best practices and proper indentation.", 
    category: "Development", 
    tags: ["JavaScript", "Code", "Formatting"],
    likes: 35,
    isPublic: false,
    isFavorite: false,
    creator: 'current-user',
    format: 'text',
    vaultType: 'personal',
    createdAt: new Date().toISOString()
  },
];

// Initialize localStorage with mock data if empty
if (!localStorage.getItem('prompts')) {
  localStorage.setItem('prompts', JSON.stringify(initialMockPrompts));
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeVault, setActiveVault] = useState("personal");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({ name: "John Doe", favorites: [] });
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentSharingPrompt, setCurrentSharingPrompt] = useState(null);
  const [shareSettings, setShareSettings] = useState({ permission: "view", expiresInDays: 7 });
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    isPublic: false,
    format: "text",
    vaultType: "personal"
  });

  // Fetch prompts on component mount and when filters change
  useEffect(() => {
    fetchPrompts();
  }, [activeVault, searchQuery, activeCategory]);

  const fetchPrompts = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getPrompts(activeVault, searchQuery, activeCategory);
      setPrompts(data);
      setFilteredPrompts(data);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      showNotification("Failed to fetch prompts", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Create or update prompt
  const handleSavePrompt = async () => {
    if (!formData.title || !formData.content) {
      showNotification("Title and content are required", "error");
      return;
    }
    
    try {
      if (editingPrompt) {
        // Update existing prompt
        await apiService.updatePrompt(editingPrompt._id, {
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : [],
          isPublic: formData.isPublic,
          format: formData.format,
          vaultType: formData.vaultType
        });
        showNotification("Prompt updated successfully!");
      } else {
        // Create new prompt
        await apiService.createPrompt({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : [],
          isPublic: formData.isPublic,
          format: formData.format,
          vaultType: formData.vaultType
        });
        showNotification("Prompt created successfully!");
      }
      
      // Refresh the prompts list
      fetchPrompts();
      
      // Close modal and reset form
      setShowModal(false);
      setEditingPrompt(null);
      setFormData({
        title: "",
        content: "",
        category: "",
        tags: "",
        isPublic: false,
        format: "text",
        vaultType: "personal"
      });
    } catch (error) {
      console.error("Error saving prompt:", error);
      showNotification("Failed to save prompt", "error");
    }
  };

  // Delete prompt
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prompt?")) return;
    
    try {
      await apiService.deletePrompt(id);
      showNotification("Prompt deleted successfully!");
      // Refresh the prompts list
      fetchPrompts();
    } catch (error) {
      console.error("Error deleting prompt:", error);
      showNotification("Failed to delete prompt", "error");
    }
  };

  // Toggle Public
  const handleTogglePublic = async (id) => {
    try {
      await apiService.togglePublic(id);
      showNotification("Visibility updated!");
      // Refresh the prompts list
      fetchPrompts();
    } catch (error) {
      console.error("Error toggling public:", error);
      showNotification("Failed to update visibility", "error");
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = async (id) => {
    try {
      await apiService.toggleFavorite(id);
      showNotification("Favorite status updated!");
      // Refresh the prompts list
      fetchPrompts();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      showNotification("Failed to update favorite status", "error");
    }
  };

  // Share prompt
  const handleShare = async (id) => {
    try {
      const result = await apiService.sharePrompt(id, shareSettings.permission, shareSettings.expiresInDays);
      if (result.success) {
        navigator.clipboard.writeText(result.shareUrl);
        showNotification("Share link copied to clipboard!");
        setShowShareModal(false);
      }
    } catch (error) {
      console.error("Error sharing prompt:", error);
      showNotification("Failed to share prompt", "error");
    }
  };

  // Copy prompt content
  const handleCopyContent = (content) => {
    navigator.clipboard.writeText(content);
    showNotification("Content copied to clipboard!");
  };

  // Get unique categories from prompts
  const categories = ["all", ...new Set(prompts.map(prompt => prompt.category).filter(Boolean))];

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <div className={`w-64 p-6 flex flex-col justify-between border-r ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-indigo-600 text-white px-2 py-1 rounded-lg">PV</span>
            PromptVault
          </h1>
          <p className="text-sm mt-1 text-gray-400">Never lose a prompt again.</p>

          <div className="mt-8 space-y-2">
            <button 
              onClick={() => setActiveVault("personal")}
              className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded-lg transition-colors ${activeVault === "personal" ? "bg-indigo-600 text-white" : "hover:bg-gray-800"}`}
            >
              <User size={18} />
              Personal Vault
            </button>
            <button 
              onClick={() => setActiveVault("community")}
              className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded-lg transition-colors ${activeVault === "community" ? "bg-indigo-600 text-white" : "hover:bg-gray-800"}`}
            >
              <Globe size={18} />
              Community
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Categories</h3>
            <div className="space-y-1">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm capitalize transition-colors ${activeCategory === category ? "bg-indigo-600 text-white" : "hover:bg-gray-800"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800">
            <span className="text-sm">{darkMode ? "Dark" : "Light"} Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-12 h-6 flex items-center rounded-full p-1 bg-gray-600 transition-colors"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transform duration-300 ease-in-out flex items-center justify-center ${darkMode ? "translate-x-6" : "translate-x-0"}`}
              >
                {darkMode ? <Moon size={10} /> : <Sun size={10} className="text-yellow-500" />}
              </div>
            </button>
          </div>
          
          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-800">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">Free Plan</p>
            </div>
            <button className="text-gray-400 hover:text-white">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header with Search + New Prompt */}
        <div className="flex items-center justify-between mb-8">
          <div
            className={`flex items-center rounded-lg px-4 py-2 w-96 ${darkMode ? "bg-gray-800" : "bg-white border"}`}
          >
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search prompts by title, content, or tags..."
              className="bg-transparent outline-none px-2 text-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X size={16} className="text-gray-400 hover:text-gray-200" />
              </button>
            )}
          </div>
          <button
            onClick={() => {
              setEditingPrompt(null);
              setFormData({
                title: "",
                content: "",
                category: "",
                tags: "",
                isPublic: false,
                format: "text",
                vaultType: "personal"
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
          >
            <Plus size={16} /> New Prompt
          </button>
        </div>

        {/* Stats and Filter Bar */}
        <div className={`flex items-center justify-between mb-6 p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white border"}`}>
          <div className="text-sm text-gray-400">
            {filteredPrompts.length} {filteredPrompts.length === 1 ? "prompt" : "prompts"} found
            {activeCategory !== "all" && ` in ${activeCategory}`}
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">Filter:</span>
            <select 
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className={`text-sm rounded-md px-2 py-1 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
            >
              <option value="all">All Categories</option>
              {categories.filter(cat => cat !== "all").map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Prompt Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <div
                key={prompt._id}
                className={`rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${darkMode ? "bg-gray-800" : "bg-white border"}`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold truncate">{prompt.title}</h2>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => {
                          setEditingPrompt(prompt);
                          setFormData({
                            title: prompt.title,
                            content: prompt.content,
                            category: prompt.category,
                            tags: prompt.tags.join(", "),
                            isPublic: prompt.isPublic,
                            format: prompt.format,
                            vaultType: prompt.vaultType
                          });
                          setShowModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-indigo-400 transition-colors"
                        title="Edit prompt"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(prompt._id)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete prompt"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-3">{prompt.content}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    <span className={`px-2 py-1 text-xs rounded-lg ${darkMode ? "bg-gray-700 text-indigo-300" : "bg-indigo-100 text-indigo-700"}`}>
                      {prompt.category || "General"}
                    </span>
                    {prompt.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className={`px-2 py-1 text-xs rounded-lg ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                        {tag}
                      </span>
                    ))}
                    {prompt.tags.length > 2 && (
                      <span className={`px-2 py-1 text-xs rounded-lg ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                        +{prompt.tags.length - 2}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleCopyContent(prompt.content)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                        title="Copy to clipboard"
                      >
                        <Copy size={12} /> Copy
                      </button>
                      {activeVault === "community" && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Heart size={12} className="text-red-400" fill={prompt.isFavorite ? "#f87171" : "none"} />
                          {prompt.likes}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleToggleFavorite(prompt._id)}
                        className={`p-1 ${prompt.isFavorite ? "text-yellow-400" : "text-gray-400"} hover:text-yellow-300`}
                        title={prompt.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Star size={14} fill={prompt.isFavorite ? "#fbbf24" : "none"} />
                      </button>
                      <button 
                        onClick={() => handleTogglePublic(prompt._id)}
                        className={`p-1 ${prompt.isPublic ? "text-green-400" : "text-gray-400"} hover:text-green-300`}
                        title={prompt.isPublic ? "Make private" : "Make public"}
                      >
                        <Globe size={14} />
                      </button>
                      <button 
                        onClick={() => {
                          setCurrentSharingPrompt(prompt);
                          setShowShareModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-indigo-400"
                        title="Share prompt"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`col-span-full text-center py-12 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white border"}`}>
            <div className="text-gray-400 mb-2">No prompts found</div>
            <p className="text-sm text-gray-500">Try changing your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Modal for Create/Edit Prompt */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className={`w-full max-w-md p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editingPrompt ? "Edit Prompt" : "Create New Prompt"}
              </h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setEditingPrompt(null);
                }}
                className="p-1 hover:bg-gray-700 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInput}
                  placeholder="Enter prompt title"
                  className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInput}
                  placeholder="Enter prompt content"
                  rows={4}
                  className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInput}
                  placeholder="e.g., Marketing, Code, AI"
                  className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInput}
                  placeholder="e.g., marketing, ideas, strategy"
                  className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Format</label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleInput}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}
                  >
                    <option value="text">Text</option>
                    <option value="code">Code</option>
                    <option value="markdown">Markdown</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Vault Type</label>
                  <select
                    name="vaultType"
                    value={formData.vaultType}
                    onChange={handleInput}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}
                  >
                    <option value="personal">Personal</option>
                    <option value="community">Community</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInput}
                  className="mr-2"
                />
                <label htmlFor="isPublic" className="text-sm">
                  Make this prompt public
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSavePrompt}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-white font-medium transition-colors"
              >
                {editingPrompt ? "Save Changes" : "Create Prompt"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && currentSharingPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className={`w-full max-w-md p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Share Prompt</h2>
              <button 
                onClick={() => setShowShareModal(false)}
                className="p-1 hover:bg-gray-700 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-medium">{currentSharingPrompt.title}</h3>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{currentSharingPrompt.content}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Permission</label>
                <select
                  value={shareSettings.permission}
                  onChange={(e) => setShareSettings({...shareSettings, permission: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}
                >
                  <option value="view">View Only</option>
                  <option value="edit">Can Edit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Expires In (days)</label>
                <input
                  type="number"
                  min="1"
                  value={shareSettings.expiresInDays}
                  onChange={(e) => setShareSettings({...shareSettings, expiresInDays: parseInt(e.target.value) || 7})}
                  className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleShare(currentSharingPrompt._id)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-white font-medium transition-colors"
              >
                Generate Share Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-opacity duration-300 ${notification.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
}
