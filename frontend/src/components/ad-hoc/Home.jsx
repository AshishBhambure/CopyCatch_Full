import { Link } from "react-router-dom";
import { Shield, Zap, FileText, Clock, Award, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import Footer from "./Footer";
import { useEffect, useState } from "react";

export default function Home() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) setIsUserLoggedIn(true);

    const role = localStorage.getItem("role");
    if (role) setRole(role);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLogout() {
    localStorage.clear();
    setIsUserLoggedIn(false);
  }

  const dashboard_mapping = [
    { role: "student", path: "/student-dashboard" },
    { role: "teacher", path: "/teacher-subjects" },
    { role: "admin", path: "/admin-dashboard" }
  ];

  function getPath(role) {
    const mapping = dashboard_mapping.find(m => m.role === role);
    return mapping?.path || "/";
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-white overflow-hidden relative">

      {/* Grid Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,#1e293b_1px,transparent_0)] [background-size:40px_40px] opacity-[0.15]"></div>

      {/* Aurora Lights */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-40 -right-40 w-[600px] h-[600px] bg-cyan-500/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      {/* HEADER */}
      <header className="w-full backdrop-blur-xl bg-[#020617]/70 sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition">
              <Shield className="w-6 h-6 text-white"/>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              CopyCatch
            </span>
          </div>

          {isUserLoggedIn ? (
            <div className="flex gap-3">
              <Link to={getPath(role)} className="px-6 py-2 rounded-xl hover:bg-slate-800/60 transition">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:scale-105 transition shadow-lg shadow-rose-500/30">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="px-6 py-2 rounded-xl hover:bg-slate-800/60 transition">
                Login
              </Link>
              <Link to="/signup" className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:scale-105 transition shadow-lg shadow-cyan-500/30">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <main className="flex-1 flex flex-col items-center px-6 pt-24 pb-20 text-center relative z-10">

        <div style={{ transform:`translateY(${scrollY*0.15}px)` }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 mb-8 backdrop-blur-xl">
          <Sparkles className="text-cyan-400 w-4 h-4"/>
          Modern Assignment Platform
        </div>

        <h1 className="text-7xl font-bold leading-tight mb-6">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Smart Assignment
          </span>
          <br/>
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Processing System
          </span>
        </h1>

        <p className="text-slate-400 text-xl max-w-2xl mb-12">
          plagiarism Detection .
        </p>

        <div className="flex gap-4 mb-20">
          <Link to="/signup"
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-xl shadow-cyan-500/30 hover:scale-110 transition flex items-center gap-2">
            Get Started <ArrowRight/>
          </Link>

          <Link to="/login"
            className="px-10 py-4 rounded-xl border border-slate-700 hover:bg-slate-800/50 transition">
            Sign In
          </Link>
        </div>

        {/* FEATURE CARDS */}
        <section className="grid md:grid-cols-3 gap-8 max-w-6xl">
          {[
            {icon:FileText,title:"Easy Submission"},
            {icon:Clock,title:"Quick Reviews"},
            {icon:Award,title:"Fair Evaluation"},
          ].map((f,i)=>(
            <div key={i}
              className="p-8 rounded-2xl bg-[#0F172A]/70 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20 transition hover:-translate-y-3">
              <f.icon className="w-10 h-10 text-cyan-400 mb-4"/>
              <h3 className="text-xl font-bold">{f.title}</h3>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="mt-32 p-12 rounded-3xl bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border border-indigo-500/20 backdrop-blur-xl">
          <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
          <Link to="/signup"
            className="px-12 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-xl shadow-cyan-500/30 hover:scale-110 transition inline-flex items-center gap-2">
            Create Account <ArrowRight/>
          </Link>
        </section>

      </main>

      <Footer/>
    </div>
  );
}
