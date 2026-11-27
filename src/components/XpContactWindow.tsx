import React, { useState, useRef, useEffect } from 'react';
import {
  XP_WINDOW_PALETTES,
  XpPaletteId,
  CURSOR_PIXEL_ARROW,
  CURSOR_PIXEL_HAND,
  CURSOR_PIXEL_IBEAM,
  CURSOR_PIXEL_WAIT,
} from '../config/xpWindowConfig';

interface XpContactWindowProps {
  paletteId: XpPaletteId;
  onPaletteChange: (id: XpPaletteId) => void;
  isMobile?: boolean;
  reducedMotion?: boolean;
  onFieldFocusChange?: (focused: boolean) => void;
}

interface DialogState {
  open: boolean;
  type: 'validation' | 'success' | 'error' | 'help';
  title: string;
  message: string;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function XpContactWindow({
  paletteId,
  onPaletteChange,
  isMobile = false,
  reducedMotion = false,
  onFieldFocusChange,
}: XpContactWindowProps) {
  const palette = XP_WINDOW_PALETTES[paletteId];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    botcheck: false,
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [statusText, setStatusText] = useState('Ready');
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    type: 'validation',
    title: '',
    message: '',
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [openMenu, setOpenMenu] = useState<'file' | 'edit' | 'view' | 'help' | null>(null);
  const [sparkleTrail, setSparkleTrail] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const sparkleIdRef = useRef(0);
  const lastSparkleTimeRef = useRef(0);

  // Draggable window offset (disabled on mobile or when maximized)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!dragStartRef.current) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      setDragOffset({
        x: dragStartRef.current.origX + dx,
        y: dragStartRef.current.origY + dy,
      });
    };
    const onPointerUp = () => {
      dragStartRef.current = null;
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  const handleTitlePointerDown = (e: React.PointerEvent) => {
    if (isMobile || isMaximized) return;
    if ((e.target as HTMLElement).closest('button')) return;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: dragOffset.x,
      origY: dragOffset.y,
    };
  };

  // Optional sparkle trail (off for reduced motion)
  const handleWindowMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sparkleTrail || reducedMotion || !windowRef.current) return;
    const now = performance.now();
    if (now - lastSparkleTimeRef.current < 45) return;
    lastSparkleTimeRef.current = now;

    const rect = windowRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++sparkleIdRef.current;
    const colors = [palette.frameFrom, palette.sendBg, '#ffffff'];
    const color = colors[id % colors.length];

    setSparkles((prev) => [...prev.slice(-12), { id, x, y, color }]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOpenMenu(null);

    if (formData.botcheck) return;

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!trimmedName) {
      setDialog({
        open: true,
        type: 'validation',
        title: 'Missing Name',
        message: 'Please enter your name before sending your message.',
      });
      return;
    }
    if (!trimmedEmail || !emailValid) {
      setDialog({
        open: true,
        type: 'validation',
        title: 'Invalid Email Address',
        message: 'Please enter a valid email address so I can reply to you.',
      });
      return;
    }
    if (!trimmedMessage) {
      setDialog({
        open: true,
        type: 'validation',
        title: 'Empty Message',
        message: 'Please write a short message before pressing Send.',
      });
      return;
    }

    setStatus('sending');
    setStatusText('Sending message...');

    try {
      const accessKey =
        (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY || '2b36e355-6b68-45eb-92c2-7baec5a98bf8';

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          subject: `Portfolio Contact from ${trimmedName}`,
          from_name: trimmedName,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus('sent');
        setStatusText('Message sent');
        setDialog({
          open: true,
          type: 'success',
          title: 'Message Sent',
          message: 'Your message has been delivered! Thanks for reaching out — I will reply soon.',
        });
        setFormData({ name: '', email: '', message: '', botcheck: false });
      } else {
        throw new Error(result.message || 'Unable to send message right now.');
      }
    } catch (err: any) {
      setStatus('error');
      setStatusText('Ready');
      setDialog({
        open: true,
        type: 'error',
        title: 'Delivery Error',
        message: err.message || 'Could not send message. Please email debojitnathwork@gmail.com directly.',
      });
    }
  };

  const arrowCursor =
    status === 'sending'
      ? `url("${CURSOR_PIXEL_WAIT}") 16 16, wait`
      : `url("${CURSOR_PIXEL_ARROW}") 2 2, default`;
  const handCursor =
    status === 'sending'
      ? `url("${CURSOR_PIXEL_WAIT}") 16 16, wait`
      : `url("${CURSOR_PIXEL_HAND}") 10 2, pointer`;
  const ibeamCursor =
    status === 'sending'
      ? `url("${CURSOR_PIXEL_WAIT}") 16 16, wait`
      : `url("${CURSOR_PIXEL_IBEAM}") 16 16, text`;

  const sunkenInputStyle: React.CSSProperties = {
    backgroundColor: palette.surfaceBg,
    color: palette.textPrimary,
    borderTop: `1px solid ${palette.sunkenBorderDark}`,
    borderLeft: `1px solid ${palette.sunkenBorderDark}`,
    borderRight: `1px solid ${palette.sunkenBorderLight}`,
    borderBottom: `1px solid ${palette.sunkenBorderLight}`,
    boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.16)',
    cursor: ibeamCursor,
  };

  const raisedButtonStyle: React.CSSProperties = {
    backgroundColor: palette.bodyBg,
    color: palette.textPrimary,
    borderTop: '1px solid #FFFFFF',
    borderLeft: '1px solid #FFFFFF',
    borderRight: `1px solid ${palette.sunkenBorderDark}`,
    borderBottom: `1px solid ${palette.sunkenBorderDark}`,
    boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.25)',
    cursor: handCursor,
  };

  return (
    <div
      ref={windowRef}
      onMouseMove={handleWindowMouseMove}
      onClick={() => openMenu && setOpenMenu(null)}
      className={`xp-contact-window ${status === 'sending' ? 'xp-sending' : ''} relative select-none flex flex-col overflow-hidden rounded-t-[8px] rounded-b-[4px] shadow-[0_14px_38px_rgba(0,0,0,0.65)] ${
        isMobile ? 'w-full max-w-[94vw]' : isMaximized ? 'w-[640px]' : 'w-full h-full'
      }`}
      style={{
        fontFamily: 'Tahoma, "Trebuchet MS", sans-serif',
        backgroundColor: palette.bodyBg,
        color: palette.textPrimary,
        border: `2px solid ${palette.frameBorder}`,
        cursor: arrowCursor,
        transform: isMobile || isMaximized ? 'none' : `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
      }}
    >
      {/* Animated XP Green Progress Blocks, Sparkle Keyframes & Retro Pixel Cursors */}
      <style>{`
        .xp-contact-window,
        .xp-contact-window * {
          cursor: url("${CURSOR_PIXEL_ARROW}") 2 2, default !important;
        }
        .xp-contact-window input,
        .xp-contact-window textarea {
          cursor: url("${CURSOR_PIXEL_IBEAM}") 16 16, text !important;
        }
        .xp-contact-window a,
        .xp-contact-window a *,
        .xp-contact-window button,
        .xp-contact-window button * {
          cursor: url("${CURSOR_PIXEL_HAND}") 10 2, pointer !important;
        }
        .xp-contact-window.xp-sending,
        .xp-contact-window.xp-sending * {
          cursor: url("${CURSOR_PIXEL_WAIT}") 16 16, wait !important;
        }
        @keyframes xpBlockSweep {
          0% { transform: translateX(-45%); }
          100% { transform: translateX(210%); }
        }
        @keyframes xpSparkleFade {
          0% { transform: scale(1) translateY(0); opacity: 0.95; }
          100% { transform: scale(0.2) translateY(-8px); opacity: 0; }
        }
      `}</style>

      {/* Optional Sparkle Trail Particles */}
      {sparkles.map((sp) => (
        <span
          key={sp.id}
          className="pointer-events-none absolute z-50 w-2 h-2 rotate-45"
          style={{
            left: sp.x,
            top: sp.y,
            backgroundColor: sp.color,
            boxShadow: `0 0 4px ${sp.color}`,
            animation: 'xpSparkleFade 500ms ease-out forwards',
          }}
        />
      ))}

      {/* =================================================================== */}
      {/* GLOSSY GRADIENT TITLE BAR                                           */}
      {/* =================================================================== */}
      <div
        onPointerDown={handleTitlePointerDown}
        onDoubleClick={() => !isMobile && setIsMaximized((v) => !v)}
        className="flex items-center justify-between px-2 py-1.5 select-none shrink-0"
        style={{
          background: `linear-gradient(180deg, ${palette.frameFrom} 0%, ${palette.frameMid} 45%, ${palette.frameTo} 92%, ${palette.frameBorder} 100%)`,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55)',
          cursor: isMobile ? arrowCursor : 'grab',
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Custom Retro Envelope SVG Icon (original, not Microsoft) */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="shrink-0 drop-shadow-sm"
          >
            <rect x="1" y="3" width="14" height="10" rx="1" fill="#FFF8DC" stroke="#1E293B" strokeWidth="1" />
            <path d="M1.5 3.5 L8 8.5 L14.5 3.5" fill="none" stroke="#D97706" strokeWidth="1.2" />
          </svg>
          <span
            className="text-[12px] font-bold text-white truncate"
            style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.45)' }}
          >
            New Message
          </span>
        </div>

        {/* Decorative Window Control Symbols (visual only, no actions) */}
        <div className="flex items-center gap-1 shrink-0" aria-hidden="true">
          <span
            className="w-[19px] h-[19px] rounded-[3px] flex items-center justify-center text-[11px] font-bold text-white border border-white/60"
            style={{
              background: `linear-gradient(180deg, ${palette.frameFrom} 0%, ${palette.frameTo} 100%)`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
            }}
          >
            _
          </span>
          <span
            className="w-[19px] h-[19px] rounded-[3px] flex items-center justify-center text-[10px] font-bold text-white border border-white/60"
            style={{
              background: `linear-gradient(180deg, ${palette.frameFrom} 0%, ${palette.frameTo} 100%)`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
            }}
          >
            □
          </span>
          <span
            className="w-[19px] h-[19px] rounded-[3px] flex items-center justify-center text-[12px] font-bold text-white border border-white/65"
            style={{
              background: `linear-gradient(180deg, ${palette.closeBgFrom} 0%, ${palette.closeBgTo} 100%)`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
            }}
          >
            ×
          </span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MENU BAR (File, Edit, View, Help)                                   */}
      {/* =================================================================== */}
      {!isMinimized && (
        <div
          className="relative flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] border-b shrink-0"
          style={{
            backgroundColor: palette.bodyBg,
            borderColor: palette.sunkenBorderDark,
          }}
        >
          {(['file', 'edit', 'view', 'help'] as const).map((menuKey) => {
            const label = menuKey.charAt(0).toUpperCase() + menuKey.slice(1);
            const isOpen = openMenu === menuKey;
            return (
              <div key={menuKey} className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(isOpen ? null : menuKey);
                  }}
                  className="px-2 py-0.5 rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-1"
                  style={{
                    backgroundColor: isOpen ? palette.menuHoverBg : 'transparent',
                    color: isOpen ? '#FFFFFF' : palette.textPrimary,
                    cursor: handCursor,
                  }}
                >
                  {label}
                </button>

                {isOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-full mt-0.5 w-44 py-1 z-40 shadow-lg text-[11px]"
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: palette.textPrimary,
                      border: `1px solid ${palette.sunkenBorderDark}`,
                    }}
                  >
                    {menuKey === 'file' && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ name: '', email: '', message: '', botcheck: false });
                          setStatus('idle');
                          setStatusText('Ready');
                          setOpenMenu(null);
                        }}
                        className="w-full text-left px-3 py-1 hover:bg-slate-200"
                        style={{ cursor: handCursor }}
                      >
                        New / Clear Message
                      </button>
                    )}

                    {menuKey === 'edit' && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText('debojitnathwork@gmail.com');
                          setStatusText('Email copied to clipboard');
                          setOpenMenu(null);
                        }}
                        className="w-full text-left px-3 py-1 hover:bg-slate-200"
                        style={{ cursor: handCursor }}
                      >
                        Copy My Email Address
                      </button>
                    )}

                    {menuKey === 'view' && (
                      <>
                        <div className="px-3 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                          Window Palette
                        </div>
                        {(Object.keys(XP_WINDOW_PALETTES) as XpPaletteId[]).map((pid) => (
                          <button
                            key={pid}
                            type="button"
                            onClick={() => {
                              onPaletteChange(pid);
                              setOpenMenu(null);
                            }}
                            className="w-full text-left px-3 py-1 hover:bg-slate-200 flex items-center justify-between"
                            style={{ cursor: handCursor }}
                          >
                            <span>{XP_WINDOW_PALETTES[pid].label}</span>
                            {paletteId === pid && <span>✓</span>}
                          </button>
                        ))}
                        <div className="my-1 border-t border-slate-200" />
                        <button
                          type="button"
                          onClick={() => {
                            setSparkleTrail((v) => !v);
                            setOpenMenu(null);
                          }}
                          className="w-full text-left px-3 py-1 hover:bg-slate-200 flex items-center justify-between"
                          style={{ cursor: handCursor }}
                        >
                          <span>Sparkle Cursor Trail</span>
                          <span>{sparkleTrail && !reducedMotion ? 'On' : 'Off'}</span>
                        </button>
                      </>
                    )}

                    {menuKey === 'help' && (
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);
                          setDialog({
                            open: true,
                            type: 'help',
                            title: 'About New Message',
                            message:
                              'Fill in your name, email, and message to reach Debojit directly, or use the email, LinkedIn, and GitHub links below.',
                          });
                        }}
                        className="w-full text-left px-3 py-1 hover:bg-slate-200"
                        style={{ cursor: handCursor }}
                      >
                        About New Message...
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* WINDOW BODY (Form + Links + Progress Bar)                           */}
      {/* =================================================================== */}
      {!isMinimized && (
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col justify-between p-2.5 sm:p-3 gap-2 overflow-y-auto"
        >
          {/* Honeypot */}
          <input
            type="checkbox"
            name="botcheck"
            checked={formData.botcheck}
            onChange={(e) => setFormData({ ...formData, botcheck: e.target.checked })}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Top Row: Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col gap-0.5">
              <label htmlFor="xp-contact-name" className="text-[11px] font-semibold">
                Name:
              </label>
              <input
                id="xp-contact-name"
                type="text"
                disabled={status === 'sending'}
                value={formData.name}
                onFocus={() => onFieldFocusChange?.(true)}
                onBlur={() => onFieldFocusChange?.(false)}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="w-full px-2 py-1 text-[12px] rounded-[1px] focus-visible:outline-2 focus-visible:outline-[#1E5FD8]"
                style={sunkenInputStyle}
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <label htmlFor="xp-contact-email" className="text-[11px] font-semibold">
                Email:
              </label>
              <input
                id="xp-contact-email"
                type="email"
                disabled={status === 'sending'}
                value={formData.email}
                onFocus={() => onFieldFocusChange?.(true)}
                onBlur={() => onFieldFocusChange?.(false)}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-2 py-1 text-[12px] rounded-[1px] focus-visible:outline-2 focus-visible:outline-[#1E5FD8]"
                style={sunkenInputStyle}
              />
            </div>
          </div>

          {/* Message Field */}
          <div className="flex-1 flex flex-col gap-0.5 min-h-[74px]">
            <label htmlFor="xp-contact-message" className="text-[11px] font-semibold">
              Message:
            </label>
            <textarea
              id="xp-contact-message"
              rows={3}
              disabled={status === 'sending'}
              value={formData.message}
              onFocus={() => onFieldFocusChange?.(true)}
              onBlur={() => onFieldFocusChange?.(false)}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Write your message here..."
              className="w-full flex-1 px-2 py-1 text-[12px] rounded-[1px] resize-none focus-visible:outline-2 focus-visible:outline-[#1E5FD8]"
              style={sunkenInputStyle}
            />
          </div>

          {/* Green Moving-Block XP Progress Bar (shown while sending) */}
          {status === 'sending' && (
            <div
              className="w-full h-3.5 p-[2px] overflow-hidden relative"
              style={{
                backgroundColor: '#FFFFFF',
                borderTop: `1px solid ${palette.sunkenBorderDark}`,
                borderLeft: `1px solid ${palette.sunkenBorderDark}`,
                borderRight: `1px solid ${palette.sunkenBorderLight}`,
                borderBottom: `1px solid ${palette.sunkenBorderLight}`,
              }}
              aria-label="Sending message"
            >
              <div
                className="h-full flex gap-[2px] w-1/3"
                style={{ animation: 'xpBlockSweep 1.2s linear infinite' }}
              >
                {[0, 1, 2, 3, 4].map((blk) => (
                  <span
                    key={blk}
                    className="flex-1 h-full rounded-[1px]"
                    style={{
                      background: 'linear-gradient(180deg, #86EFAC 0%, #22C55E 50%, #15803D 100%)',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bottom Toolbar: Direct Links + Beveled Send Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
            <div className="flex flex-wrap items-center gap-2.5 text-[11px]" style={{ color: palette.textMuted }}>
              <a
                href="mailto:debojitnathwork@gmail.com"
                className="underline hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[#1E5FD8]"
                style={{ cursor: handCursor }}
              >
                debojitnathwork@gmail.com
              </a>
              <span>|</span>
              <a
                href="https://www.linkedin.com/in/debojit-nath-cse/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[#1E5FD8]"
                style={{ cursor: handCursor }}
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/DebojitNath"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[#1E5FD8]"
                style={{ cursor: handCursor }}
              >
                GitHub
              </a>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={status === 'sending'}
                onClick={() => {
                  setFormData({ name: '', email: '', message: '', botcheck: false });
                  setStatus('idle');
                  setStatusText('Ready');
                }}
                className="px-3 py-1 text-[11px] font-medium rounded-[3px] active:translate-y-[1px] focus-visible:outline-2 focus-visible:outline-[#1E5FD8]"
                style={raisedButtonStyle}
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="px-4 py-1 text-[11px] font-bold rounded-[3px] active:translate-y-[1px] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-[#1E5FD8]"
                style={{
                  backgroundColor: palette.sendBg,
                  color: palette.sendText,
                  borderTop: '1px solid #FFFFFF',
                  borderLeft: '1px solid #FFFFFF',
                  borderRight: `1px solid ${palette.sendBorder}`,
                  borderBottom: `1px solid ${palette.sendBorder}`,
                  boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.25)',
                  cursor: handCursor,
                }}
              >
                {status === 'sending' ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* =================================================================== */}
      {/* SUNKEN STATUS BAR                                                   */}
      {/* =================================================================== */}
      <div
        className="flex items-center justify-between px-2 py-0.5 text-[10px] border-t shrink-0"
        style={{
          backgroundColor: palette.bodyBg,
          borderColor: palette.sunkenBorderDark,
          color: palette.textMuted,
        }}
      >
        <div
          className="px-1.5 py-[1px] flex-1 truncate"
          style={{
            borderTop: `1px solid ${palette.sunkenBorderDark}`,
            borderLeft: `1px solid ${palette.sunkenBorderDark}`,
            borderRight: `1px solid ${palette.sunkenBorderLight}`,
            borderBottom: `1px solid ${palette.sunkenBorderLight}`,
          }}
        >
          {statusText}
        </div>
        <div
          className="px-2 py-[1px] ml-1 shrink-0"
          style={{
            borderTop: `1px solid ${palette.sunkenBorderDark}`,
            borderLeft: `1px solid ${palette.sunkenBorderDark}`,
            borderRight: `1px solid ${palette.sunkenBorderLight}`,
            borderBottom: `1px solid ${palette.sunkenBorderLight}`,
          }}
        >
          {palette.label}
        </div>
      </div>

      {/* =================================================================== */}
      {/* CUSTOM XP-STYLE DIALOG (Validation / Success / Error / Help)        */}
      {/* =================================================================== */}
      {dialog.open && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/35 p-3"
          role="dialog"
          aria-modal="true"
          aria-labelledby="xp-dialog-title"
        >
          <div
            className="w-full max-w-[300px] rounded-t-[6px] rounded-b-[3px] shadow-2xl overflow-hidden"
            style={{
              backgroundColor: palette.bodyBg,
              border: `2px solid ${palette.frameBorder}`,
              color: palette.textPrimary,
            }}
          >
            <div
              className="flex items-center justify-between px-2 py-1 text-white text-[11px] font-bold"
              style={{
                background: `linear-gradient(180deg, ${palette.frameFrom} 0%, ${palette.frameTo} 100%)`,
              }}
            >
              <span id="xp-dialog-title">{dialog.title}</span>
              <button
                type="button"
                aria-label="Close dialog"
                onClick={() => setDialog((d) => ({ ...d, open: false }))}
                className="w-4 h-4 rounded-[2px] text-[11px] flex items-center justify-center border border-white/60"
                style={{
                  background: `linear-gradient(180deg, ${palette.closeBgFrom} 0%, ${palette.closeBgTo} 100%)`,
                  cursor: handCursor,
                }}
              >
                ×
              </button>
            </div>

            <div className="p-3 flex items-start gap-2.5 text-[11px]">
              {/* Custom status badge */}
              <div
                className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center font-bold text-white text-xs"
                style={{
                  backgroundColor:
                    dialog.type === 'success'
                      ? '#16A34A'
                      : dialog.type === 'error'
                      ? '#DC2626'
                      : dialog.type === 'help'
                      ? palette.frameTo
                      : '#D97706',
                }}
              >
                {dialog.type === 'success'
                  ? '✓'
                  : dialog.type === 'error'
                  ? '!'
                  : dialog.type === 'help'
                  ? '?'
                  : '!'}
              </div>
              <p className="leading-snug">{dialog.message}</p>
            </div>

            <div className="px-3 pb-2.5 flex justify-end">
              <button
                type="button"
                onClick={() => setDialog((d) => ({ ...d, open: false }))}
                className="px-4 py-1 text-[11px] font-semibold rounded-[3px] focus-visible:outline-2 focus-visible:outline-[#1E5FD8]"
                style={raisedButtonStyle}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
