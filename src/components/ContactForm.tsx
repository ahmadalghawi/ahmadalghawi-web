import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { sendMessage } from '../lib/repositories/messages';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus('error');
      setErrorMsg('All fields are required.');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');
    try {
      await sendMessage({ name, email, body: message });
      setStatus('success');
      setName(''); setEmail(''); setMessage('');
    } catch (err) {
      setStatus('error');
      setErrorMsg((err as Error).message || 'Something went wrong.');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <Send className="text-cyan-400" size={20} />
        <span className="text-white text-lg font-bold">send-message.sh</span>
      </div>

      <div className="text-gray-500 font-mono text-xs mb-4">{'// fill out the form and I\'ll get back to you within 24h'}</div>

      <form onSubmit={onSubmit} className="space-y-3 font-mono text-sm">
        {/* Honeypot */}
        <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        <div>
          <label className="block text-cyan-400 text-xs mb-1" htmlFor="cf-name">name =</label>
          <input
            id="cf-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-600 outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-cyan-400 text-xs mb-1" htmlFor="cf-email">email =</label>
          <input
            id="cf-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-600 outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-cyan-400 text-xs mb-1" htmlFor="cf-message">message =</label>
          <textarea
            id="cf-message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Tell me about your project or role..."
            rows={5}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-600 outline-none focus:border-cyan-400 transition-colors resize-none"
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="text-xs">
            {status === 'error' && (
              <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-red-400">
                <AlertCircle size={14} /> <span>{errorMsg || 'Failed to send — try email instead.'}</span>
              </motion.div>
            )}
            {status === 'success' && (
              <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-green-400">
                <CheckCircle2 size={14} /> <span>Message sent! I'll reply within 24h.</span>
              </motion.div>
            )}
          </div>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors font-mono text-sm cursor-pointer border-none shrink-0"
          >
            {status === 'submitting' ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {status === 'submitting' ? 'sending...' : 'send()'}
          </button>
        </div>
      </form>
    </div>
  );
}
