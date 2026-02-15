import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-[#020617]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <div className="text-sm text-slate-400">
          © {new Date().getFullYear()} 
          <span className="ml-1 font-semibold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            CopyCatch
          </span>
        </div>

        {/* Tagline */}
        <div className="text-sm text-slate-500">
          Academic Integrity • Minhash | LSH
        </div>

        {/* Contact */}
        <div className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition">
          <Mail className="w-4 h-4"/>
          copy.catch@walchnadsangli.ac.in (*Comming Soon)
        </div>

      </div>
    </footer>
  );
};

export default Footer;
