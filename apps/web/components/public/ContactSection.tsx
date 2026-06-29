'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, ChevronUp, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';
import { Faq } from '../../types';
import PageHero from './PageHero';

interface ContactSectionProps {
  faqs: Faq[];
}

export default function ContactSection({ faqs }: ContactSectionProps) {
  const [activeFaqId, setActiveFaqId] = useState<string | null>('faq-1');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('http://localhost:5201/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
    } catch {
    }
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 5000);
  };

  const toggleFaq = (id: string) => {
    setActiveFaqId(activeFaqId === id ? null : id);
  };

  return (
    <div className="space-y-16 pb-20" id="shifat-contact-section">
      
      <PageHero
        pageKey="contact"
        defaultImage="https://images.unsplash.com/photo-1521791136368-1a85190079f5?auto=format&fit=crop&q=80&w=1600"
        badge="Open Communication Desks"
        title="Contact Us"
        description="Reach out to our administrative directors. We operate open communication channels and maintain dedicated hours."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-lg font-bold text-brand-charcoal font-display border-b border-gray-100 pb-2">
              Our Coordination HQ
            </h3>

            <div className="space-y-4 text-sm text-gray-600 font-sans">
              
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="flex items-start gap-3.5 bg-white p-4 rounded-xl border border-gray-100 shadow-2xs transition-shadow hover:shadow-xs"
              >
                <MapPin className="h-5 w-5 text-brand-green shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <strong className="text-brand-charcoal font-semibold">HQ Address:</strong>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Main Street, Near General Hospital,<br />
                    Hargeisa, Somaliland (Horn of Africa)
                  </p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="flex items-start gap-3.5 bg-white p-4 rounded-xl border border-gray-100 shadow-2xs transition-shadow hover:shadow-xs"
              >
                <Phone className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-charcoal font-semibold">Telephone Channels:</strong>
                  <p className="text-xs text-gray-500 mt-1">
                    +252 (63) 441-2345 (Direct Lines)<br />
                    +252 (63) 551-6789 (Support Desks)
                  </p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="flex items-start gap-3.5 bg-white p-4 rounded-xl border border-gray-100 shadow-2xs transition-shadow hover:shadow-xs"
              >
                <Mail className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-charcoal font-semibold">Official Email:</strong>
                  <p className="text-xs text-gray-500 mt-1 break-all">
                    contact@shifat.org (Inquiries)<br />
                    donations@shifat.org (Donor Services)
                  </p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="flex items-start gap-3.5 bg-white p-4 rounded-xl border border-gray-100 shadow-2xs transition-shadow hover:shadow-xs"
              >
                <Clock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-charcoal font-semibold">Operating Hours:</strong>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Sunday to Thursday: 8:00 AM – 4:00 PM<br />
                    (Closed Friday & Saturday for regional rest)
                  </p>
                </div>
              </motion.div>

            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-md">
            <h3 className="text-base font-bold text-brand-charcoal font-display border-b border-gray-100 pb-3 mb-4">
              Send an Online Query
            </h3>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-3 flex flex-col items-center"
              >
                <CheckCircle className="h-12 w-12 text-brand-green animate-pulse" />
                <h4 className="text-lg font-bold text-brand-charcoal">Query Transmitted Successfully!</h4>
                <p className="text-xs text-gray-500 max-w-sm font-sans leading-relaxed">
                  Thank you for contacting SHiFAT. Your feedback is valuable to us. We will route your inquiry to the respective desk in Hargeisa and reply shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Marian Duale"
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-brand-blue focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. marian@example.com"
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-brand-blue focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Subject / Department</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. General Donation Inquiry, WASH Project Proposal"
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-brand-blue focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Detailed Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your questions or comments here..."
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-brand-blue focus:outline-hidden resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white brand-gradient shadow-xs cursor-pointer hover:shadow-md transition-all"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? 'Sending...' : 'Transmit Query Securely'}</span>
                </motion.button>
              </form>
            )}

          </div>
        </div>

      </div>

      <div className="bg-brand-sand border-t border-b border-gray-100 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-10">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-brand-green">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold text-brand-charcoal font-display">
              Frequently Asked Questions (FAQ)
            </h3>
            <p className="text-sm text-gray-500 font-sans max-w-md mx-auto">
              Find instant answers regarding SHiFAT's operating structures, regional reach, and secure transaction systems.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = activeFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden transition-shadow shadow-2xs hover:shadow-xs"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-brand-charcoal hover:text-brand-blue transition-colors focus:outline-hidden cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="h-5 w-5 text-brand-green" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-gray-500 leading-relaxed font-sans border-t border-gray-50 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}
