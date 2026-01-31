import { Link } from "react-router-dom";
import {  Mail, MapPin, Phone } from "lucide-react";
const Footer = () => {
  return (
    <div className="mt-5 w-full">
         {/* Footer */}
      <footer className="w-full backdrop-blur-sm bg-white/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="font-bold text-slate-900 mb-4 text-lg">About CopyCatch</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                CopyCatch is an innovative plagiarism detection system designed to help educational institutions maintain academic integrity through advanced verbatim content matching.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-slate-900 mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li>
                  <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-blue-600 transition-colors">Login</Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-blue-600 transition-colors">Sign Up</Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-blue-600 transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-blue-600 transition-colors">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="font-bold text-slate-900 mb-4 text-lg">Contact Us</h3>
              <div className="space-y-3 text-slate-600 text-sm">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>support@copycatch.edu</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>+91 1234567890</span>
                </div>
                {/* <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Educational Tech Hub, India</span>
                </div> */}
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} CopyCatch — Academic Integrity Matters
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer