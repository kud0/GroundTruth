'use client';

export function Scanline() {
  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 8000,
        overflow: 'hidden',
      }}
    >
      <div className="scanline" />
    </div>
  );
}
