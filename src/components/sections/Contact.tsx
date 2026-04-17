import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ExternalLink, Download, Copy, Check } from 'lucide-react';
import ContactForm from '../ContactForm';

const contactFields = [
  { key: 'EMAIL',    value: 'Ahmadalghawi.86@gmail.com',                            href: 'mailto:Ahmadalghawi.86@gmail.com',                       copyable: true  },
  { key: 'PHONE',    value: '073-742 14 90',                                        href: 'tel:0737421490',                                         copyable: true  },
  { key: 'GITHUB',   value: 'https://github.com/ahmadalghawi',                      href: 'https://github.com/ahmadalghawi',                        copyable: true  },
  { key: 'LINKEDIN', value: 'https://www.linkedin.com/in/ahmad-alghawi-310722197/', href: 'https://www.linkedin.com/in/ahmad-alghawi-310722197/',    copyable: true  },
  { key: 'LOCATION', value: 'Malmö, Sweden',                                        href: undefined,                                                copyable: false },
  { key: 'STATUS',   value: 'Open to new opportunities',                            href: undefined,                                                copyable: false },
];

export default function Contact() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="text-green-400" size={24} />
          <span className="text-white text-xl font-bold">contact.env</span>
        </div>

        <div className="text-green-400 font-mono space-y-2">
          <div><span className="text-gray-500"># Contact Information</span></div>

          {contactFields.map((field, i) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-2 flex-wrap group"
            >
              <span className="text-cyan-400">{field.key}</span>
              <span className="text-gray-400">=</span>
              {field.href ? (
                <a
                  href={field.href}
                  target={field.href.startsWith('http') ? '_blank' : undefined}
                  rel={field.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors"
                  style={{ textDecoration: 'none' }}
                >
                  {field.value}
                  <ExternalLink size={10} />
                </a>
              ) : (
                <span className="text-green-400">{field.value}</span>
              )}
              {field.copyable && (
                <button
                  onClick={() => handleCopy(field.key, field.value)}
                  title="Copy to clipboard"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-300 bg-transparent border-none cursor-pointer p-0 ml-1"
                >
                  {copied === field.key
                    ? <Check size={12} className="text-green-400" />
                    : <Copy size={12} />}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="mailto:Ahmadalghawi.86@gmail.com"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors font-mono text-sm"
            style={{ textDecoration: 'none' }}
          >
            <Mail size={16} /> Send Email
          </a>
          <a
            href="https://www.linkedin.com/in/ahmad-alghawi-310722197/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors font-mono text-sm"
            style={{ textDecoration: 'none' }}
          >
            <ExternalLink size={16} /> LinkedIn
          </a>
          <a
            href="https://github.com/ahmadalghawi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors font-mono text-sm"
            style={{ textDecoration: 'none' }}
          >
            <ExternalLink size={16} /> GitHub
          </a>
        </div>
      </div>

      {/* Contact form */}
      <ContactForm />

      {/* Download resume */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 flex items-center justify-between">
        <div>
          <div className="text-white font-mono text-sm mb-1">Resume / CV</div>
          <div className="text-gray-400 text-xs font-mono">Available for download</div>
        </div>
        <a
          href="/data/Resume.pdf"
          download
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors font-mono text-sm"
          style={{ textDecoration: 'none' }}
        >
          <Download size={16} /> Download
        </a>
      </div>
    </motion.div>
  );
}
