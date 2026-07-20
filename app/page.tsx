import type { Metadata } from 'next';
import Image from 'next/image';
import { HeroBackground, AnimatedRoles } from '@/components/animations/HeroAnimations';

export const metadata: Metadata = {
  title: 'Gajendra Mandal | AI Researcher & ML Engineer',
  description:
    'AI Researcher & ML Engineer specializing in Computer Vision, NLP, and Deep Learning.',
  openGraph: {
    title: 'Gajendra Mandal | AI Researcher & ML Engineer',
    description:
      'AI Researcher & ML Engineer specializing in Computer Vision, NLP, and Deep Learning.',
  },
};

export default function Home() {
  return (
    <main className="relative z-10 min-h-screen px-6 sm:px-10 lg:px-20 py-8 max-w-7xl mx-auto w-full">

      {/* ══════ HERO SECTION ══════ */}
      <section className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 min-h-[75vh] items-center">
        {/* Neural Network Background */}
        <HeroBackground />

        {/* Left Content */}
        <div className="flex-1 max-w-2xl relative">
          {/* Profile Picture */}
          <div className="mb-4">
            <div className="w-40 h-40 rounded-full p-[3px] bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500 inline-block">
              <Image
                src="/images/profile_photo.jpg"
                alt="Gajendra Mandal"
                width={160}
                height={160}
                className="rounded-full w-full h-full object-cover"
                unoptimized
                priority
              />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
            Gajendra Mandal
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-gray-200 font-medium">
            AI / ML Engineer &nbsp;·&nbsp; <AnimatedRoles />
          </p>

          <p className="mt-6 text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl">
            B.Tech Data Science student at CSVTU Bhilai (CGPA 8/10, graduating
            July 2026). Research background in thermal computer vision at IIT
            Gandhinagar. First-author IEEE publication on real-time threat detection.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="mailto:gajendramandal2003@gmail.com" className="glass-card px-4 py-2.5 flex items-center gap-2 hover:border-purple-500/30 transition-all duration-300">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
              <span className="text-sm text-gray-200">gajendramandal2003@gmail.com</span>
            </a>
            <a href="tel:+916264769759" className="glass-card px-4 py-2.5 flex items-center gap-2 hover:border-purple-500/30 transition-all duration-300">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
              <span className="text-sm text-gray-200">+91-6264769759</span>
            </a>
            <a href="https://linkedin.com/in/gajendra-mandal" target="_blank" rel="noopener noreferrer" className="glass-card px-4 py-2.5 flex items-center gap-2 hover:border-purple-500/30 transition-all duration-300">
              <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              <span className="text-sm text-gray-200">LinkedIn</span>
            </a>
            <a href="https://github.com/gajendramandal" target="_blank" rel="noopener noreferrer" className="glass-card px-4 py-2.5 flex items-center gap-2 hover:border-purple-500/30 transition-all duration-300">
              <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <span className="text-sm text-gray-200">GitHub</span>
            </a>
            <a href="/files/Gajendra_resume.pdf" download className="glass-card px-4 py-2.5 flex items-center gap-2 hover:border-purple-500/30 transition-all duration-300">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              <span className="text-sm text-gray-200">Download Resume</span>
            </a>
          </div>
        </div>

        {/* Right Stat Cards */}
        <div className="flex flex-row lg:flex-col gap-4 relative">
          <div className="flex-1 lg:w-52 glass-card stat-glow p-6 text-center">
            <p className="text-3xl sm:text-4xl font-bold gradient-text">1</p>
            <p className="mt-2 text-xs text-gray-300 uppercase tracking-wider font-medium">IEEE Publication</p>
          </div>
          <div className="flex-1 lg:w-52 glass-card stat-glow p-6 text-center">
            <p className="text-3xl sm:text-4xl font-bold gradient-text">5+</p>
            <p className="mt-2 text-xs text-gray-300 uppercase tracking-wider font-medium">ML Projects</p>
          </div>
          <div className="flex-1 lg:w-52 glass-card stat-glow p-6 text-center">
            <p className="text-3xl sm:text-4xl font-bold gradient-text">8.0</p>
            <p className="mt-2 text-xs text-gray-300 uppercase tracking-wider font-medium">CGPA / 10</p>
          </div>
        </div>
      </section>

      {/* Scroll Down Indicator - positioned at bottom of viewport */}
      <div className="flex flex-col items-center gap-2 mt-4 mb-8 relative z-10">
        <span className="text-xs text-gray-400 uppercase tracking-widest">scroll down</span>
        <a href="#experience" className="animate-bounce">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>

      {/* ══════ EXPERIENCE SECTION ══════ */}
      <section id="experience" className="mt-24">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><span className="w-8 h-[2px] bg-purple-400 inline-block"></span>Experience</h2>

        <div className="space-y-6">
          {/* Experience 1 */}
          <div className="relative pl-6 border-l border-white/[0.08]">
            <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-blue-500 timeline-dot" />
            <div className="glass-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white">AI / ML Intern</h3>
                <span className="text-xs text-gray-300 border border-white/[0.15] rounded-full px-3 py-1 whitespace-nowrap">March 2026 – present</span>
              </div>
              <p className="text-sm text-blue-300 mb-3 font-medium">Stembotix · Gandhinagar</p>
              <p className="text-[15px] text-gray-300 leading-relaxed">
                Developing AI/ML models integrated with IoT hardware. Built a full-stack multi-protocol IoT dashboard (MQTT, TCP, WebSocket, HTTP) hosted on a VPS with real-time sensor data visualization, supporting ESP32 and Arduino devices.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['ESP32', 'Node.js', 'MQTT', 'PostgreSQL', 'WebSocket'].map((t) => (
                  <span key={t} className="tech-tag px-3 py-1 rounded-lg text-xs">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Experience 2 */}
          <div className="relative pl-6 border-l border-white/[0.08]">
            <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-green-500 timeline-dot" />
            <div className="glass-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white">Research Intern — Computer Vision</h3>
                <span className="text-xs text-gray-300 border border-white/[0.15] rounded-full px-3 py-1 whitespace-nowrap">Feb – Jul 2025</span>
              </div>
              <p className="text-sm text-blue-300 mb-3 font-medium">IIT Gandhinagar · Prof. Nipun Batra&apos;s Lab</p>
              <p className="text-[15px] text-gray-300 leading-relaxed">
                Worked on thermal imaging-based respiratory signal extraction and non-contact sleep apnea detection using YOLOv8 for nostril localization and signal processing. Contributed to the ApneaEye research project under the guidance of Prof. Nipun Batra, with day-to-day mentorship from Ayush Shrivastava (PhD Scholar, CSE).</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['YOLOv8', 'Thermal Imaging', 'VLM', 'Python', 'Deep Learning'].map((t) => (
                  <span key={t} className="tech-tag px-3 py-1 rounded-lg text-xs">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ ACHIEVEMENTS SECTION ══════ */}
      <section className="mt-24">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><span className="w-8 h-[2px] bg-purple-400 inline-block"></span>Achievements</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="glass-card p-5 flex items-center gap-4">
            <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.996.178-1.768.431-2.25.756 0 0 .75 3.294 3 5.008m13.5-5.764c.996.178 1.768.431 2.25.756 0 0-.75 3.294-3 5.008" /></svg>
            <div>
              <p className="text-white font-medium text-sm">IIM Nagpur Hackathon</p>
              <p className="text-gray-400 text-xs">Participant</p>
            </div>
          </div>
          <div className="glass-card p-5 flex items-center gap-4">
            <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
            <div>
              <p className="text-white font-medium text-sm">IDC-2024 New Delhi</p>
              <p className="text-gray-400 text-xs">National level</p>
            </div>
          </div>
         
          <div className="glass-card p-5 flex items-center gap-4">
            <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
            <div>
              <p className="text-white font-medium text-sm">Rajya Puraskar</p>
              <p className="text-gray-400 text-xs">Scouts & Guides</p>
            </div>
          </div>
          <div className="glass-card p-5 flex items-center gap-4">
            <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
            <div>
              <p className="text-white font-medium text-sm">NSS Head Boy</p>
              <p className="text-gray-400 text-xs">Leadership role</p>
            </div>
          </div>
          <div className="glass-card p-5 flex items-center gap-4">
            <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
            <div>
              <p className="text-white font-medium text-sm">ACM Summer School</p>
              <p className="text-gray-400 text-xs">IIT Gandhinagar 2025</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
