import { Mail, GraduationCap, BookOpen, Linkedin } from "lucide-react";

const Footer = () => {
  const contributors = [
    {
      name: "Ashish Bhambure",
      linkedin: "https://www.linkedin.com/in/ashishbhambure05102003",
    },
    {
      name: "Deepak Vishwakarma",
      linkedin: "https://www.linkedin.com/in/deepakv2003/",
    },
    {
      name: "Subodh Kangale",
      linkedin: "https://www.linkedin.com/in/subodhkangale07/",
    },
    {
      name: "Shivam Singh Yadav",
      linkedin: "https://www.linkedin.com/in/shivamsingh-a-yadav-a64610248/",
    },
  ];

  return (
    <footer className="w-full border-t border-slate-800 bg-[#020617]/80 backdrop-blur-xl">
      {/* Top Section — College & Dept Info */}
      <div className="border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* College Info */}
          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Walchand College of Engineering, Sangli
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Department of Computer Science & Engineering
              </p>
            </div>
          </div>

          {/* Contributors */}
          <div className="flex items-start gap-3">
            <div>
              <p className="text-xs text-slate-500 flex justify-center uppercase tracking-wider mb-1.5 font-medium">
                Contributors
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {contributors.map((contributor, i) => (
                  <a
                    key={i}
                    href={contributor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-slate-300 font-medium bg-slate-800/60 px-2 py-0.5 rounded-full border border-slate-700/50 hover:border-indigo-500/60 hover:text-indigo-300 hover:bg-slate-700/60 transition-all duration-200 group"
                  >
                    {contributor.name}
                    <Linkedin className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 transition-colors duration-200" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Guide */}
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-indigo-300 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-medium">
                Project Guide
              </p>
              <p className="text-sm text-slate-200 font-semibold">
                Dr. N. L. Gavankar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section — Brand, Tagline, Contact */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
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
          <Mail className="w-4 h-4" />
          <span>
            copy.catch@walchnadsangli.ac.in{" "}
            <span className="text-slate-600 text-xs">(Coming Soon)</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;