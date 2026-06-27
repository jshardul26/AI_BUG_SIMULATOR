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

      {/* ============================================================
          ARC GLOW SYSTEM — refined cinematic lighting
          All other code below is completely unchanged.
      ============================================================ */}

      {/* Layer 1 — Outermost diffuse halo: very large, very soft atmospheric bleed */}
      <div style={{
        position: 'absolute',
        top: '-2%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '1100px',
        height: '1100px',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at 50% 42%, rgba(30,90,255,0.09) 0%, rgba(30,80,220,0.05) 40%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      {/* Layer 2 — Mid atmospheric bloom: tighter, brighter, slightly blue-white */}
      <div style={{
        position: 'absolute',
        top: '4%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '860px',
        height: '860px',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at 50% 44%, rgba(80,160,255,0.13) 0%, rgba(60,130,255,0.07) 38%, transparent 64%)',
        filter: 'blur(6px)',
        pointerEvents: 'none',
      }} />

      {/* Layer 3 — Core inner bloom: concentrated bright blue-white at the top arc */}
      <div style={{
        position: 'absolute',
        top: '8%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '680px',
        height: '680px',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at 50% 46%, rgba(140,200,255,0.09) 0%, rgba(100,175,255,0.05) 30%, transparent 56%)',
        filter: 'blur(2px)',
        pointerEvents: 'none',
      }} />

      {/* Layer 4 — Outer ring border: same size/position, enhanced glow only */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '820px',
        height: '820px',
        borderRadius: '50%',
        border: '1px solid rgba(130,195,255,0.16)',
        boxShadow: `
          0 0 0 2px rgba(100,175,255,0.05),
          0 0 18px 4px rgba(100,175,255,0.12),
          0 0 55px 14px rgba(70,145,255,0.09),
          0 0 110px 30px rgba(50,110,255,0.06),
          inset 0 0 50px 10px rgba(70,140,255,0.04)
        `,
        pointerEvents: 'none',
      }} />

      {/* Layer 5 — Inner ring: same size/position, enhanced rim glow */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '640px',
        height: '640px',
        borderRadius: '50%',
        border: '1.5px solid rgba(170,220,255,0.22)',
        boxShadow: `
          0 0 0 2px rgba(180,225,255,0.06),
          0 0 14px 3px rgba(140,205,255,0.15),
          0 0 40px 10px rgba(100,175,255,0.10),
          0 0 80px 20px rgba(70,145,255,0.06),
          inset 0 0 35px 8px rgba(90,160,255,0.05)
        `,
        pointerEvents: 'none',
      }} />



      {/* Layer 7 — Vertical light shaft / upward ray above the arc crown */}
      <div style={{
        position: 'absolute',
        top: '0%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '3px',
        height: '24%',
        background: 'linear-gradient(to top, rgba(220,240,255,0.28), rgba(180,220,255,0.10) 55%, transparent)',
        filter: 'blur(3px)',
        pointerEvents: 'none',
      }} />

      {/* Layer 8 — Wider soft vertical bloom above crown */}
      <div style={{
        position: 'absolute',
        top: '0%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '200px',
        height: '22%',
        background: 'linear-gradient(to top, rgba(120,190,255,0.22), rgba(90,160,255,0.09) 50%, transparent)',
        filter: 'blur(16px)',
        pointerEvents: 'none',
      }} />

      {/* Layer 9 — Horizon glow bar (original, preserved exactly) */}
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

      {/* Hero content — UNCHANGED */}
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

      {/* Feature pills — UNCHANGED */}
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', lineHeight: 1.3 }}>{label}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, marginTop: '4px' }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
