import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  History, 
  Info, 
  Mail, 
  Github, 
  ExternalLink, 
  Cpu, 
  Zap, 
  Layers, 
  Database,
  Menu,
  X,
  ChevronRight,
  Loader2
} from "lucide-react";
import { analyzeNews, AnalysisResult } from "./lib/gemini";
import Markdown from "react-markdown";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<(AnalysisResult & { text: string; timestamp: number })[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "url">("text");
  const [selectedModel, setSelectedModel] = useState("Logistic Regression");

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      const analysis = await analyzeNews(inputText, selectedModel);
      setResult(analysis);
      setHistory(prev => [
        { ...analysis, text: inputText.slice(0, 50) + "...", timestamp: Date.now() }, 
        ...prev.slice(0, 9)
      ]);
      
      // Auto-scroll to results
      setTimeout(() => {
        const resultSection = document.getElementById("analysis-result");
        resultSection?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-gray-100 selection:bg-accent/30 selection:text-accent">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent-2/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <div className="flex flex-col -gap-1">
              <span className="font-display font-extrabold text-xl tracking-tight leading-none uppercase">TruthScan</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-accent/60 font-bold">Verification v2.0</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {["Detect", "How it Works", "Features", "Models", "About"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-medium text-gray-400 hover:text-accent transition-colors"
              >
                {item}
              </a>
            ))}
            <button className="bg-accent text-bg px-6 py-2.5 rounded-lg font-bold text-sm hover:glow-accent transition-all active:scale-95">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-gray-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-20 left-0 right-0 bg-surface border-b border-white/5 p-6 flex flex-col gap-4"
            >
              {["Detect", "How it Works", "Features", "Models", "About"].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-medium text-gray-400"
                >
                  {item}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="relative z-10 pt-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/5 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            AI-Powered Verification System
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] tracking-tight mb-8"
          >
            Detect <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-green-custom">Fake News</span><br />
            Instantly with AI
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 font-light mb-12"
          >
            TruthScan uses state-of-the-art Large Language Models and NLP to analyze news content and classify it as real or fake — in seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <a href="#detect" className="bg-accent text-bg px-8 py-4 rounded-xl font-display font-bold text-lg hover:glow-accent transition-all flex items-center gap-2">
              <Search className="w-5 h-5" />
              Analyze News
            </a>
            <a href="#how-it-works" className="bg-white/5 border border-white/10 px-8 py-4 rounded-xl font-display font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2">
              <Info className="w-5 h-5" />
              How it works
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-4xl mx-auto"
          >
            {[
              { label: "Detection Accuracy", value: "98%" },
              { label: "ML Models", value: "3+" },
              { label: "Analysis Time", value: "<2s" },
              { label: "Articles Trained", value: "50K+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl font-extrabold text-white mb-1">
                  {stat.value.split('').map((char, i) => (
                    <span key={i} className={char === '%' || char === '+' || char === '<' || char === 's' ? "text-accent" : ""}>{char}</span>
                  ))}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Detector Section */}
        <section id="detect" className="max-w-4xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <div className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-4">Core Feature</div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4">Analyze Your News</h2>
            <p className="text-gray-400 font-light">Paste a news article, headline, or URL below. Our AI will analyze it instantly.</p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-accent-2/20 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-surface border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
              {/* Scan Line Animation */}
              {isAnalyzing && (
                <motion.div 
                  initial={{ top: 0 }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent z-20 opacity-50"
                />
              )}

              <div className="input-group">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Detection Model</label>
                <div className="flex flex-wrap gap-3 mt-3">
                  {["Logistic Regression", "Naïve Bayes", "SVM", "Ensemble"].map((model) => (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                        selectedModel === model 
                          ? "bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(0,229,255,0.1)]" 
                          : "bg-surface-2 border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10"
                      )}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === "text" ? (
                <div className="space-y-4 mb-8">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">News Article / Headline</label>
                  <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste the full news article or headline here...&#10;&#10;Example: 'Scientists discover a new species of dinosaur in the Amazon...'"
                    className="w-full h-48 bg-surface-2 border border-white/5 rounded-2xl p-6 text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-accent/30 focus:ring-4 focus:ring-accent/5 transition-all resize-none font-light leading-relaxed"
                  />
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Article URL</label>
                  <div className="flex gap-4">
                    <input 
                      type="url"
                      placeholder="https://example.com/news-article"
                      className="flex-1 bg-surface-2 border border-white/5 rounded-xl px-6 py-4 text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-accent/30 focus:ring-4 focus:ring-accent/5 transition-all font-light"
                    />
                    <button className="bg-accent text-bg px-6 rounded-xl font-bold text-sm hover:glow-accent transition-all">Fetch</button>
                  </div>
                </div>
              )}

              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className="w-full bg-gradient-to-r from-accent to-[#00b4cc] text-bg py-5 rounded-2xl font-display font-extrabold text-xl hover:glow-accent transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    Analyze for Fake News
                  </>
                )}
              </button>

              <div id="analysis-result">
                <AnimatePresence>
                  {result && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-12 space-y-6"
                  >
                    <div className={cn(
                      "rounded-2xl border p-6 flex items-start gap-4",
                      result.isFake ? "bg-accent-2/5 border-accent-2/20" : "bg-green-custom/5 border-green-custom/20"
                    )}>
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                        result.isFake ? "bg-accent-2/10 text-accent-2" : "bg-green-custom/10 text-green-custom"
                      )}>
                        {result.isFake ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className={cn(
                          "font-display font-extrabold text-2xl mb-1",
                          result.isFake ? "text-accent-2" : "text-green-custom"
                        )}>
                          {result.verdict.toUpperCase()} NEWS DETECTED
                        </h3>
                        <p className="text-gray-400 text-sm">{result.explanation.split('.')[0]}.</p>
                      </div>
                    </div>

                    <div className="bg-surface-2 border border-white/5 rounded-2xl p-8">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Confidence Score</span>
                        <span className={cn(
                          "text-2xl font-display font-extrabold",
                          result.isFake ? "text-accent-2" : "text-green-custom"
                        )}>{result.confidence}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-8">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full",
                            result.isFake ? "bg-accent-2" : "bg-green-custom"
                          )}
                        />
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4 text-accent" />
                            Analysis Details
                          </h4>
                          <div className="text-gray-400 text-sm leading-relaxed font-light prose prose-invert max-w-none">
                            <Markdown>{result.explanation}</Markdown>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-accent" />
                            Key Evidence
                          </h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {result.keyPoints.map((point, i) => (
                              <li key={i} className="flex items-start gap-3 text-xs text-gray-400 bg-white/5 p-3 rounded-lg border border-white/5">
                                <ChevronRight className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

        {/* How it Works */}
        <section id="how-it-works" className="bg-surface border-y border-white/5 py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <div className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-4">Pipeline</div>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4">How It Works</h2>
              <p className="text-gray-400 font-light max-w-xl mx-auto">A structured 5-step AI pipeline processes every piece of news you submit.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
              {[
                { step: "01", icon: <Database />, title: "Input Collection", desc: "User submits news text or a URL. The system validates the input for minimum word count." },
                { step: "02", icon: <Zap />, title: "BERT Initialization", desc: "The 'bert-tiny-finetuned' model is initialized using the HuggingFace Transformers pipeline." },
                { step: "03", icon: <Layers />, title: "Feature Extraction", desc: "Text is tokenized and converted into hidden states (vectors) for model processing." },
                { step: "04", icon: <Cpu />, title: "Hybrid Inference", desc: "Classic ML (LR/NB/SVM) and Deep Learning (BERT) models classify the article." },
                { step: "05", icon: <ShieldCheck />, title: "Relational Logging", desc: "Results are returned to the user and a copy is logged into a MongoDB database." },
              ].map((item, i) => (
                <div key={i} className="bg-surface p-10 group hover:bg-surface-2 transition-colors">
                  <div className="font-display text-5xl font-extrabold text-white/5 mb-6 group-hover:text-accent/10 transition-colors">{item.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <div className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-4">Capabilities</div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4">System Features</h2>
            <p className="text-gray-400 font-light max-w-xl mx-auto">Everything you need to verify and trust the news you read.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Cpu />, title: "Multi-Model Detection", desc: "Choose between Logistic Regression, Naïve Bayes, SVM, or run all models for an ensemble result." },
              { icon: <Zap />, title: "Instant Analysis", desc: "Get results in under 2 seconds. The entire NLP + ML pipeline runs in real time." },
              { icon: <Layers />, title: "Confidence Scoring", desc: "Every prediction comes with a confidence percentage so you know how certain the model is." },
              { icon: <History />, title: "History Dashboard", desc: "All your past analyses are saved and accessible from your personal dashboard." },
              { icon: <ShieldCheck />, title: "Admin Control Panel", desc: "Admins can upload new datasets, retrain models, and monitor system performance." },
              { icon: <ExternalLink />, title: "URL-Based Scanning", desc: "Directly paste a news URL and the system automatically fetches and analyzes the content." },
            ].map((feat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-surface-2 border border-white/5 rounded-2xl p-8 hover:border-accent/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center text-accent mb-6">
                  {feat.icon}
                </div>
                <h3 className="font-display font-bold text-xl mb-3">{feat.title}</h3>
                <p className="text-gray-500 font-light leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* History / Recent Analyses */}
        <section id="models" className="max-w-7xl mx-auto px-6 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-4">ML Models</div>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Trained on Thousands of Articles</h2>
              <p className="text-gray-400 font-light mb-8 leading-relaxed">
                Three classification algorithms, each trained on labeled real/fake news datasets. Compare or combine them for best accuracy.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Logistic Regression", "Naïve Bayes", "SVM", "TF-IDF", "NLTK", "Scikit-learn", "Pandas", "NumPy"].map(tag => (
                  <span key={tag} className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-gray-500">{tag}</span>
                ))}
              </div>
            </div>
            <div className="bg-surface-2 border border-white/5 rounded-3xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-accent/5 border-b border-white/5">
                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Model</th>
                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Accuracy</th>
                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">F1-Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { name: "Logistic Regression", acc: 98, f1: "0.97" },
                    { name: "Naïve Bayes", acc: 94, f1: "0.93" },
                    { name: "SVM", acc: 96, f1: "0.95" },
                    { name: "Ensemble", acc: 99, f1: "0.98", highlight: true },
                  ].map((row) => (
                    <tr key={row.name} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5 font-medium text-sm">{row.name}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full", row.highlight ? "bg-accent" : "bg-green-custom")} 
                              style={{ width: `${row.acc}%` }} 
                            />
                          </div>
                          <span className={cn("text-xs font-bold", row.highlight ? "text-accent" : "text-green-custom")}>{row.acc}%</span>
                        </div>
                      </td>
                      <td className={cn("px-8 py-5 text-xs font-bold", row.highlight ? "text-accent" : "text-green-custom")}>{row.f1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* History Dashboard */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-16">
            <div className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-4">Dashboard</div>
            <h2 className="font-display text-4xl font-extrabold mb-4">Recent Analyses</h2>
            <p className="text-gray-400 font-light">Your past submissions and their verdicts.</p>
          </div>

          <div className="space-y-4">
            {history.length > 0 ? (
              history.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface border border-white/5 rounded-2xl p-6 flex flex-wrap items-center gap-6 hover:border-white/10 transition-all"
                >
                  <div className={cn(
                    "px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                    item.isFake ? "bg-accent-2/10 text-accent-2 border-accent-2/20" : "bg-green-custom/10 text-green-custom border-green-custom/20"
                  )}>
                    {item.verdict}
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-sm text-gray-300 line-clamp-1 font-light italic">"{item.text}"</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-xs font-bold text-gray-500">
                      Confidence: <span className={item.isFake ? "text-accent-2" : "text-green-custom"}>{item.confidence}%</span>
                    </div>
                    <div className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-surface-2 rounded-3xl border border-dashed border-white/10">
                <History className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-600 font-light">No analysis history yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-surface border-t border-white/5 py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div>
                <div className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-4">About the Project</div>
                <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Built at Islamia College of Commerce</h2>
                <p className="text-gray-400 font-light mb-8 leading-relaxed text-lg">
                  A final-year BCA project for Session 2025–26 under the guidance of Mrs. Aisha Ikhlaq and Mrs. Anupama. The system combines modern web technologies and AI to fight misinformation.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["React 19", "Gemini AI", "Tailwind CSS", "NLP", "Machine Learning", "Framer Motion", "TypeScript"].map(tag => (
                    <span key={tag} className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-gray-500">{tag}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-6">Team Members</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "Tamanna Dalmiya", roll: "2614037050020", role: "Team Lead" },
                    { name: "Mahima Chauhan", roll: "2614037050008", role: "ML Engineer" },
                    { name: "Riya Maddeshiya", roll: "2614037050012", role: "Data Scientist" },
                    { name: "Anvesha Chaurasia", roll: "2614037050004", role: "UI Designer" },
                    { name: "Swapnil Upadhyay", roll: "2614037050058", role: "Documentation" },
                    { name: "Ruman Khan", roll: "2614037050056", role: "Backend Dev" },
                  ].map((member) => (
                    <div key={member.roll} className="bg-surface-2 border border-white/5 rounded-2xl p-6 hover:bg-accent/5 transition-colors group">
                      <div className="font-display font-bold text-white mb-1 group-hover:text-accent transition-colors">{member.name}</div>
                      <div className="text-[10px] font-mono text-accent/60 mb-2">{member.roll}</div>
                      <div className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{member.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="max-w-3xl mx-auto px-6 py-32">
          <div className="text-center mb-16">
            <div className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-4">Get in Touch</div>
            <h2 className="font-display text-4xl font-extrabold mb-4">Contact Us</h2>
            <p className="text-gray-400 font-light">Have feedback or want to report an issue? Reach out to the team.</p>
          </div>

          <div className="bg-surface border border-white/5 rounded-3xl p-8 md:p-12">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Your Name</label>
                  <input type="text" className="w-full bg-surface-2 border border-white/5 rounded-xl px-6 py-4 text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-accent/30 transition-all font-light" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Email Address</label>
                  <input type="email" className="w-full bg-surface-2 border border-white/5 rounded-xl px-6 py-4 text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-accent/30 transition-all font-light" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Subject</label>
                <input type="text" className="w-full bg-surface-2 border border-white/5 rounded-xl px-6 py-4 text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-accent/30 transition-all font-light" placeholder="Feedback / Inquiry" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Message</label>
                <textarea className="w-full h-32 bg-surface-2 border border-white/5 rounded-xl px-6 py-4 text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-accent/30 transition-all font-light resize-none" placeholder="Your message..." />
              </div>
              <button className="w-full bg-accent text-bg py-5 rounded-2xl font-display font-extrabold text-xl hover:glow-accent transition-all flex items-center justify-center gap-3">
                <Mail className="w-6 h-6" />
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight">TruthScan</span>
          </div>
          
          <div className="text-[10px] uppercase tracking-widest text-gray-600 font-bold text-center">
            © 2025–26 Islamia College of Commerce, Gorakhpur. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
