import { Link } from "react-router-dom";
import { Shield, Zap, Users, CheckCircle } from "lucide-react";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="w-full backdrop-blur-sm bg-white/70 sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CopyCatch
            </span>
          </div>
          <div className="flex gap-3">
            <Link 
              to="/login" 
              className="px-5 py-2.5 rounded-xl font-medium text-slate-700 hover:bg-white/80 transition-all duration-200"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center px-6 pt-16 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              Verbatim Plagiarism
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Detection Tool
            </span>
          </h1>

          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            CopyCatch helps colleges maintain academic integrity by accurately detecting copied assignments,
            ensuring fair evaluation, and discouraging unethical practices.
          </p>

          {/* CTA Button */}
          <Link 
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 mb-20"
          >
            Get Started Free
            <Zap className="w-5 h-5" />
          </Link>

          {/* Feature Cards */}
          <section className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="group p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-3 text-slate-900">Automated Detection</h2>
              <p className="text-slate-600 leading-relaxed">
                Save faculty time by finding verbatim plagiarism within seconds using advanced algorithms.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-3 text-slate-900">Fair Evaluation</h2>
              <p className="text-slate-600 leading-relaxed">
                Ensure every student is judged on their real understanding and original work.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-3 text-slate-900">Simple & Scalable</h2>
              <p className="text-slate-600 leading-relaxed">
                Handle large batches of submissions with exceptional accuracy and speed.
              </p>
            </div>
          </section>

          {/* Vision & Features Section */}
          <section className="mt-24 grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200">
              <h2 className="text-2xl font-bold mb-4 text-slate-900">Our Vision</h2>
              <p className="text-slate-600 leading-relaxed">
                To create a fair academic environment where original work is valued and recognized, empowering educators with tools to ensure authentic learning outcomes.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200">
              <h2 className="text-2xl font-bold mb-4 text-slate-900">Key Features</h2>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Real-time plagiarism detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Batch submission processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Detailed similarity reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>User-friendly dashboard</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
    <Footer/>
    </div>
  );
}