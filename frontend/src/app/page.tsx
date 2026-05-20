'use client';

import Link from 'next/link';
import { 
  Zap, Menu, User, Shield, Sparkles, Layout, 
  Layers, MousePointer2, Filter, Download, 
  Grid, Megaphone, Folder, BarChart2, Settings,
  ArrowRight, Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand/30" style={{ background: '#0b0a13', color: '#f0eeff' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Menu size={18} className="text-text-secondary" />
          <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">menu</span>
        </div>
        
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">LinkedReach</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-brand/50 transition-colors">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-32">
        {/* Hero Section */}
        <section className="px-6 pt-20 pb-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 mb-8 animate-fade-in">
            <Sparkles size={14} className="text-brand" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-300">New: AI Sequencing Engine</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Automate LinkedIn <br />
            <span className="text-brand-300">Outreach with Precision</span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
            Deploy high-performance sales sequences that mimic human behavior. 
            Scale your networking without sacrificing personalization or safety.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary px-10 py-4 text-base font-semibold shadow-lg shadow-brand/20 w-full sm:w-auto">
              Get Started
            </Link>
            <button className="btn-secondary px-10 py-4 text-base font-semibold border-white/5 hover:bg-white/5 w-full sm:w-auto flex items-center justify-center gap-2">
              <Play size={18} fill="currentColor" /> Watch Demo
            </button>
          </div>
        </section>

        {/* Trusted By */}
        <section className="px-6 py-16 border-y border-white/5 bg-white/[0.02]">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted text-center mb-10">
            Trusted by hyper-growth sales teams
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-lg"><Zap size={20} /> VELOCITY</div>
            <div className="flex items-center gap-2 font-bold text-lg"><Layers size={20} /> NEXUS</div>
            <div className="flex items-center gap-2 font-bold text-lg"><Grid size={20} /> STRATUS</div>
            <div className="flex items-center gap-2 font-bold text-lg"><Sparkles size={20} /> SPARK</div>
          </div>
        </section>

        {/* Workflows Section */}
        <section className="px-6 py-32 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Build complex <br /> workflows in minutes.
              </h2>
              <p className="text-lg text-text-secondary mb-12 leading-relaxed">
                Our drag-and-drop sequence builder lets you design multi-step outreach programs 
                with conditional logic based on lead interactions.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0 border border-brand/20">
                    <Sparkles className="text-brand" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Smart Personalization</h3>
                    <p className="text-text-secondary leading-relaxed">AI-driven variables that adapt to your prospect's profile.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 border border-orange-500/20">
                    <Shield className="text-orange-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Safety First Protocol</h3>
                    <p className="text-text-secondary leading-relaxed">Cloud-based automation that stays within platform limits.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-brand/20 blur-3xl rounded-full opacity-30" />
              <div className="relative rounded-2xl border border-white/10 bg-[#13121e] overflow-hidden shadow-2xl">
                {/* Mock Sequence Builder UI */}
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-black/20">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  </div>
                  <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest">sequence_builder_v2.io <span className="text-green-500 ml-2">● ACTIVE</span></div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center">
                          <User size={16} className="text-brand" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Send Connection Request</span>
                      </div>
                      <span className="text-[10px] text-text-muted font-mono">STEP 01</span>
                    </div>
                    <div className="p-3 rounded bg-black/40 text-[11px] font-mono text-text-secondary leading-relaxed">
                      Hi {'{{first_name}}'}, noticed your work in {'{{industry}}'}...
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="h-8 w-px bg-white/10 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-white/10 bg-black flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
                          <div className="w-1 h-1 bg-white/40 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 opacity-80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Megaphone size={16} className="text-blue-400" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Follow-up Message</span>
                      </div>
                      <span className="text-[10px] text-text-muted font-mono">STEP 02</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lead Intelligence Section */}
        <section className="px-6 py-32 bg-gradient-to-b from-transparent to-black/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Real-time Lead Intelligence</h2>
                <p className="text-lg text-text-secondary max-w-xl">
                  Monitor and manage your networking pipeline with technical precision.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                  Filter: Engaged
                </button>
                <button className="px-4 py-2 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                  Export .CSV
                </button>
              </div>
            </div>
            
            <div className="rounded-2xl border border-white/5 bg-[#0f0e17] overflow-hidden">
              <div className="grid grid-cols-4 px-8 py-4 border-b border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                <div>Prospect</div>
                <div>Stage</div>
                <div className="text-right">Last Activity</div>
              </div>
              
              <div className="divide-y divide-white/5">
                <div className="grid grid-cols-4 px-8 py-6 items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-blue-500/20" />
                    <div>
                      <div className="text-sm font-bold">Marcus Chen</div>
                      <div className="text-[10px] text-text-muted">CTO @ Nebula Scale</div>
                    </div>
                  </div>
                  <div>
                    <span className="px-2 py-1 rounded bg-brand/10 border border-brand/20 text-[9px] font-bold uppercase text-brand tracking-widest">Follow_up_2</span>
                  </div>
                  <div className="col-span-2 text-right text-xs text-text-muted font-mono">2m ago</div>
                </div>
                
                <div className="grid grid-cols-4 px-8 py-6 items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-purple-500/20" />
                    <div>
                      <div className="text-sm font-bold">Sarah Jenkins</div>
                      <div className="text-[10px] text-text-muted">Head of Growth @ Flow.ai</div>
                    </div>
                  </div>
                  <div>
                    <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-bold uppercase text-text-secondary tracking-widest">Connection_Sent</span>
                  </div>
                  <div className="col-span-2 text-right text-xs text-text-muted font-mono">1h ago</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-20 border-t border-white/5 bg-black/40">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl font-bold tracking-tight text-white">LinkedReach</span>
              </div>
              <p className="text-text-secondary text-base max-w-sm leading-relaxed">
                The elite LinkedIn automation toolkit for modern engineering teams and growth hackers. 
                Built for precision.
              </p>
            </div>
            
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-text-secondary">
                <li><Link href="#" className="hover:text-brand transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-brand transition-colors">Integrations</Link></li>
                <li><Link href="#" className="hover:text-brand transition-colors">API Docs</Link></li>
                <li><Link href="#" className="hover:text-brand transition-colors">Safety Guide</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-text-secondary">
                <li><Link href="#" className="hover:text-brand transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-brand transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-brand transition-colors">Contact Support</Link></li>
                <li><Link href="#" className="hover:text-brand transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              © 2024 LINKEDREACH_INTL. ALL RIGHTS RESERVED.
            </p>
            
            {/* Bottom Nav Bar */}
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              {[Grid, Megaphone, Folder, BarChart2, Settings].map((Icon, i) => (
                <button 
                  key={i} 
                  className={cn(
                    "p-2.5 rounded-xl transition-all duration-200",
                    i === 0 ? "bg-brand text-white" : "text-text-muted hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
