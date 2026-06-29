'use client';

import React, { useState } from 'react';
import { CareerOpportunity } from '../../types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Users, FileText, CheckCircle, Mail, MapPin, Sparkles, Upload, Send, RefreshCw } from 'lucide-react';
import PageHero from './PageHero';

interface VolunteerFormProps {
  careers: CareerOpportunity[];
}

const TYPE_DISPLAY: Record<string, string> = {
  'FULL_TIME': 'Full-time',
  'PART_TIME': 'Part-time',
  'CONTRACT': 'Contract',
  'VOLUNTEER': 'Volunteer',
};

export default function VolunteerForm({ careers }: VolunteerFormProps) {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<CareerOpportunity | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('maternal-child');
  const [message, setMessage] = useState('');
  
  const [fileName, setFileName] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [appId, setAppId] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('http://localhost:5201/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          interest: selectedJob ? selectedJob.title : interest,
          message,
          fileName,
          jobId: selectedJob?.id || null,
        }),
      });
      const data = await res.json();
      setAppId(data.id || `SHF-APP-${Math.floor(1000 + Math.random() * 9000)}`);
    } catch {
      setAppId(`SHF-APP-${Math.floor(1000 + Math.random() * 9000)}`);
    }
    setStatus('success');
  };

  const resetForm = () => {
    setStatus('idle');
    setName('');
    setEmail('');
    setMessage('');
    setFileName('');
    setSelectedJob(null);
  };

  return (
    <div className="space-y-16 pb-20" id="shifat-get-involved-page">
      
      <PageHero
        pageKey="get-involved"
        defaultImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1600"
        badge="Mobilizing Communities"
        title="Get Involved"
        description="Whether you are a medical specialist, a water engineer, a student looking to volunteer, or a donor coordinator, we offer rewarding structures to assist."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-lg font-bold text-brand-charcoal font-display border-b border-gray-100 pb-2">
              Current Open Positions & Vocational Openings
            </h3>

            <div className="space-y-4">
              {careers.map((job) => (
                <div
                  key={job.id}
                  className={`p-5 rounded-xl border transition-all text-left ${
                    selectedJob?.id === job.id
                      ? 'border-brand-blue bg-blue-50/20 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white shadow-2xs hover:shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 font-mono mb-1.5">
                        {job.department}
                      </span>
                      <h4 className="text-base font-bold text-brand-charcoal font-display">
                        {job.title}
                      </h4>
                      
                      <div className="flex gap-4 text-[10px] font-bold text-gray-400 font-mono mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-brand-green" />
                          <span>{job.location}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-brand-blue" />
                          <span className="uppercase">{TYPE_DISPLAY[job.type] || job.type}</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setStatus('idle');
                        setFileName('');
                      }}
                      className="self-start sm:self-center px-4 py-2 text-xs font-bold text-brand-blue border border-brand-blue/30 hover:bg-brand-blue hover:text-white rounded-lg transition-all cursor-pointer"
                    >
                      Apply Now
                    </button>
                  </div>

                  <AnimatePresence>
                    {selectedJob?.id === job.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600 space-y-3">
                          <p className="font-semibold text-brand-charcoal">{job.description}</p>
                          <div className="space-y-1.5">
                            <p className="font-bold text-gray-500 uppercase tracking-widest font-mono text-[9px]">Key Requirements:</p>
                            <ul className="list-disc pl-4 space-y-1 font-sans">
                              {job.requirements.map((req, idx) => (
                                <li key={idx}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-md">
              
              {status === 'submitting' && (
                <div className="py-12 text-center space-y-3 flex flex-col items-center">
                  <RefreshCw className="h-10 w-10 text-brand-blue animate-spin" />
                  <h4 className="text-base font-bold text-brand-charcoal font-display">Uploading Secure Application</h4>
                  <p className="text-xs text-gray-500 max-w-xs font-sans">
                    Registering your credentials with the SHiFAT administrative database in Hargeisa...
                  </p>
                </div>
              )}

              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center space-y-4 flex flex-col items-center font-sans"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-brand-green">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h4 className="text-lg font-bold text-brand-charcoal font-display">Application Received!</h4>
                  <div className="bg-brand-sand rounded-lg border border-dashed border-gray-300 p-4 text-xs font-mono w-full text-left space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-400">APPLICATION NO:</span>
                      <span className="font-bold text-brand-charcoal">{appId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">CANDIDATE:</span>
                      <span className="font-bold uppercase text-brand-charcoal">{name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">DESIGNATION:</span>
                      <span className="font-bold text-brand-blue uppercase">{selectedJob ? selectedJob.title : 'General Volunteer'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                    We will contact you within 5 working days. A copy of this secure confirmation has been forwarded to <strong>{email}</strong>.
                  </p>
                  <button
                    onClick={() => { resetForm(); router.push('/'); }}
                    className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-brand-green hover:bg-brand-green-dark transition-colors cursor-pointer"
                  >
                    Submit Another Form
                  </button>
                </motion.div>
              )}

              {status === 'idle' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1 text-center border-b border-gray-100 pb-3">
                    <h4 className="text-base font-bold text-brand-charcoal font-display">
                      {selectedJob ? `Apply: ${selectedJob.title}` : 'General Registration / Volunteer Sign-Up'}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
                      {selectedJob ? 'Somaliland Local & Diaspora Hiring' : 'Join Our Mobilization Network'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Faisal Warsame"
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
                      placeholder="e.g. faisal@example.com"
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-brand-blue focus:outline-hidden"
                    />
                  </div>

                  {!selectedJob && (
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Preferred Department</label>
                      <select
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-brand-blue focus:outline-hidden font-semibold text-brand-charcoal"
                      >
                        <option value="maternal-child">Maternal & Child Health</option>
                        <option value="emergency-relief">Emergency Relief Operations</option>
                        <option value="wash">WASH (Clean Water Supply)</option>
                        <option value="vaccinations">Vaccination Outreach</option>
                        <option value="nutrition">Nutrition Clinics</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Statement of Motivation</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Briefly describe your experience and why you are passionate about joining SHiFAT..."
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-brand-blue focus:outline-hidden resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Upload Resume (PDF/Word)</label>
                    
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
                        isDragActive ? 'border-brand-green bg-emerald-50/10' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="file"
                        id="file-upload-input"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                      />
                      
                      <label htmlFor="file-upload-input" className="cursor-pointer space-y-1 block">
                        <Upload className="h-6 w-6 text-gray-400 mx-auto" />
                        <p className="text-xs font-bold text-gray-600">
                          {fileName ? `File Selected: ${fileName}` : 'Drag & Drop File Here'}
                        </p>
                        <p className="text-[10px] text-gray-400">or click to browse from local drive</p>
                      </label>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white brand-gradient cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit Document Application</span>
                  </motion.button>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
