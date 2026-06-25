import { useEffect, useRef, useState } from 'react';
import { Bot, ChevronRight, Zap, BrainCircuit, Code2, BookOpen } from 'lucide-react';

const features = [
  { icon: BrainCircuit, label: 'Root Cause AI', desc: 'Instantly identifies why your code broke.' },
  { icon: Code2,        label: 'Auto Fix',       desc: 'Generates corrected code on the spot.' },
  { icon: BookOpen,     label: 'Learn As You Go', desc: 'Flashcards and quizzes built from your bug.' },
  { icon: Zap,          label: 'Workflow Map',    desc: 'Visual step-by-step debugging flow.' },
];

export default function LandingView({ setActiveView }) {
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Particle field on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);

    const N = 72;
    const dots = Array.from({ length: N }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      a: Math.random(),
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // connect nearby dots
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100,180,255,${0.10 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }
      // dots
      dots.forEach((d) => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,210,255,${0.35 + d.a * 0.3})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    setTimeout(() => setVisible(true), 80);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden',
      background: '#020b18',
      marginTop: '-20px',
    }}>

      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none',
      }} />

      {/* Arc glow — the signature element */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '820px',
        height: '820px',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(56,140,255,0.13) 0%, rgba(56,140,255,0.07) 35%, transparent 70%)',
        boxShadow: '0 0 120px 60px rgba(40,110,255,0.10)',
        pointerEvents: 'none',
      }} />
      {/* Inner arc ring */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '640px',
        height: '640px',
        borderRadius: '50%',
        border: '1px solid rgba(100,170,255,0.18)',
        boxShadow: '0 0 60px 10px rgba(60,130,255,0.10)',
        pointerEvents: 'none',
      }} />
      {/* Horizon glow bar */}
      <div style={{
        position: 'absolute',
        top: '41%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '700px',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(100,190,255,0.55), transparent)',
        filter: 'blur(1px)',
        pointerEvents: 'none',
      }} />

      {/* Hero content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '100px 24px 0',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(60,130,255,0.12)',
          border: '1px solid rgba(100,170,255,0.28)',
          borderRadius: '999px',
          padding: '6px 16px',
          marginBottom: '36px',
          fontSize: '12px',
          letterSpacing: '0.08em',
          color: '#93c5fd',
        }}>
          <Bot size={13} />
          AI-POWERED DEBUGGING
        </div>

        {/* Headline */}
        <h1 style={{
          margin: 0,
          fontSize: 'clamp(40px, 7vw, 76px)',
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          color: '#f0f8ff',
          maxWidth: '780px',
        }}>
          Debug Smarter.{' '}
          <span style={{
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 60%, #67e8f9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Learn Faster.
          </span>
        </h1>

        {/* Sub */}
        <p style={{
          marginTop: '28px',
          fontSize: '17px',
          lineHeight: 1.7,
          color: 'rgba(180,210,255,0.70)',
          maxWidth: '520px',
        }}>
          Paste an error log or buggy code. Get the root cause, a working fix,
          a visual workflow, and study cards — in seconds.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '14px', marginTop: '44px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => setActiveView('analyze')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 600,
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 0 32px rgba(99,102,241,0.40)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 48px rgba(99,102,241,0.60)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 0 32px rgba(99,102,241,0.40)'; }}
          >
            Get Started <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setActiveView('analyze')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'transparent',
              border: '1px solid rgba(100,160,255,0.30)',
              borderRadius: '10px',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 500,
              color: '#93c5fd',
              cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(100,160,255,0.65)'; e.currentTarget.style.color = '#bfdbfe'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(100,160,255,0.30)'; e.currentTarget.style.color = '#93c5fd'; }}
          >
            Try Demo
          </button>
        </div>
      </div>

      {/* Feature pills */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '14px',
        justifyContent: 'center',
        padding: '72px 24px 80px',
        maxWidth: '860px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 1.1s ease 0.3s, transform 1.1s ease 0.3s',
      }}>
        {features.map(({ icon: Icon, label, desc }) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(100,160,255,0.15)',
            borderRadius: '12px',
            padding: '16px 22px',
            width: '180px',
            flexDirection: 'column',
            textAlign: 'center',
            transition: 'border-color 0.2s, background 0.2s',
            cursor: 'default',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(100,160,255,0.40)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(100,160,255,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          >
            <div style={{
              width: '38px', height: '38px',
              borderRadius: '10px',
              background: 'rgba(60,130,255,0.15)',
              display: 'grid', placeItems: 'center',
              color: '#60a5fa',
              marginBottom: '4px',
            }}>
              <Icon size={18} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', lineHeight: 1.3 }}>{label}</div>
            <div style={{ fontSize: '12px', color: 'rgba(148,180,220,0.70)', lineHeight: 1.5, marginTop: '4px' }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}