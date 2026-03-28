// window-manager.ts — Vanilla TS module for OS window management

interface WinState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  prevWidth: number;
  prevHeight: number;
}

const windows = new Map<string, WinState>();
let topZ = 100;
const TASKBAR_HEIGHT = 48;

// ── Drag state ──────────────────────────────────────────────────────────────

interface DragState {
  active: boolean;
  winId: string;
  startMouseX: number;
  startMouseY: number;
  startWinX: number;
  startWinY: number;
}

const drag: DragState = {
  active: false,
  winId: '',
  startMouseX: 0,
  startMouseY: 0,
  startWinX: 0,
  startWinY: 0,
};

function clampPosition(x: number, y: number, w: number, h: number): [number, number] {
  const maxX = window.innerWidth - w;
  const maxY = window.innerHeight - TASKBAR_HEIGHT - h;
  return [
    Math.max(0, Math.min(x, maxX)),
    Math.max(0, Math.min(y, maxY)),
  ];
}

function onMouseMove(e: MouseEvent): void {
  if (!drag.active) return;
  const state = windows.get(drag.winId);
  if (!state) return;
  const el = document.getElementById(`window-${drag.winId}`);
  if (!el) return;

  const dx = e.clientX - drag.startMouseX;
  const dy = e.clientY - drag.startMouseY;
  const newX = drag.startWinX + dx;
  const newY = drag.startWinY + dy;
  const [cx, cy] = clampPosition(newX, newY, el.offsetWidth, el.offsetHeight);

  el.style.left = `${cx}px`;
  el.style.top = `${cy}px`;
  state.x = cx;
  state.y = cy;
}

function onTouchMove(e: TouchEvent): void {
  if (!drag.active || e.touches.length === 0) return;
  const touch = e.touches[0];
  if (!touch) return;
  const state = windows.get(drag.winId);
  if (!state) return;
  const el = document.getElementById(`window-${drag.winId}`);
  if (!el) return;

  const dx = touch.clientX - drag.startMouseX;
  const dy = touch.clientY - drag.startMouseY;
  const newX = drag.startWinX + dx;
  const newY = drag.startWinY + dy;
  const [cx, cy] = clampPosition(newX, newY, el.offsetWidth, el.offsetHeight);

  el.style.left = `${cx}px`;
  el.style.top = `${cy}px`;
  state.x = cx;
  state.y = cy;
  e.preventDefault();
}

function onMouseUp(): void {
  drag.active = false;
  drag.winId = '';
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
}

// Attach global drag listeners once
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onMouseUp);
}

// ── Public API ───────────────────────────────────────────────────────────────

export function register(id: string, title: string, icon: string): void {
  const el = document.getElementById(`window-${id}`);
  if (!el) return;

  const initialX = parseFloat(el.style.left) || 100;
  const initialY = parseFloat(el.style.top) || 80;

  windows.set(id, {
    id,
    title,
    icon,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 100,
    x: initialX,
    y: initialY,
    prevX: initialX,
    prevY: initialY,
    prevWidth: el.offsetWidth || 680,
    prevHeight: el.offsetHeight || 520,
  });

  // Set up titlebar drag
  const titlebar = el.querySelector<HTMLElement>('[data-window-id]');
  if (titlebar) {
    titlebar.addEventListener('mousedown', (e) => {
      const state = windows.get(id);
      if (!state || state.isMaximized) return;
      if ((e.target as HTMLElement).closest('[data-action]')) return;

      drag.active = true;
      drag.winId = id;
      drag.startMouseX = e.clientX;
      drag.startMouseY = e.clientY;
      drag.startWinX = state.x;
      drag.startWinY = state.y;

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
      focus(id);
    });

    titlebar.addEventListener('touchstart', (e) => {
      const state = windows.get(id);
      if (!state || state.isMaximized || e.touches.length === 0) return;
      if ((e.target as HTMLElement).closest('[data-action]')) return;

      const touch = e.touches[0];
      if (!touch) return;

      drag.active = true;
      drag.winId = id;
      drag.startMouseX = touch.clientX;
      drag.startMouseY = touch.clientY;
      drag.startWinX = state.x;
      drag.startWinY = state.y;
      focus(id);
    }, { passive: true });
  }
}

export function open(id: string): void {
  const state = windows.get(id);
  if (!state) return;

  const el = document.getElementById(`window-${id}`);
  if (!el) return;

  state.isOpen = true;
  state.isMinimized = false;

  el.classList.remove('window--closed', 'window--minimized');
  el.setAttribute('aria-hidden', 'false');

  focus(id);
  updateTaskbar();
}

export function close(id: string): void {
  const state = windows.get(id);
  if (!state) return;

  const el = document.getElementById(`window-${id}`);
  if (!el) return;

  state.isOpen = false;
  state.isMinimized = false;
  state.isMaximized = false;

  el.classList.add('window--closed');
  el.classList.remove('window--minimized', 'window--maximized', 'window--active');
  el.setAttribute('aria-hidden', 'true');

  updateTaskbar();
}

export function minimize(id: string): void {
  const state = windows.get(id);
  if (!state || !state.isOpen) return;

  const el = document.getElementById(`window-${id}`);
  if (!el) return;

  state.isMinimized = !state.isMinimized;

  if (state.isMinimized) {
    el.classList.add('window--minimized');
  } else {
    el.classList.remove('window--minimized');
    focus(id);
  }

  updateTaskbar();
}

export function maximize(id: string): void {
  const state = windows.get(id);
  if (!state || !state.isOpen) return;

  const el = document.getElementById(`window-${id}`);
  if (!el) return;

  state.isMaximized = !state.isMaximized;

  if (state.isMaximized) {
    // Save current position/size before maximizing
    state.prevX = state.x;
    state.prevY = state.y;
    state.prevWidth = el.offsetWidth;
    state.prevHeight = el.offsetHeight;
    el.classList.add('window--maximized');
  } else {
    el.classList.remove('window--maximized');
    // Restore saved position
    el.style.left = `${state.prevX}px`;
    el.style.top = `${state.prevY}px`;
    state.x = state.prevX;
    state.y = state.prevY;
  }
}

export function focus(id: string): void {
  const state = windows.get(id);
  if (!state) return;

  topZ += 1;
  state.zIndex = topZ;

  const el = document.getElementById(`window-${id}`);
  if (!el) return;

  el.style.zIndex = String(topZ);

  // Remove active from all, set active on focused
  windows.forEach((s) => {
    const winEl = document.getElementById(`window-${s.id}`);
    if (winEl) winEl.classList.remove('window--active');
  });
  el.classList.add('window--active');
}

export function updateTaskbar(): void {
  const container = document.getElementById('taskbar-windows');
  if (!container) return;

  container.innerHTML = '';

  windows.forEach((state) => {
    if (!state.isOpen) return;

    const btn = document.createElement('button');
    btn.className = `taskbar-win-btn${state.isMinimized ? ' taskbar-win-btn--minimized' : ''}`;
    btn.setAttribute('role', 'listitem');
    btn.setAttribute('aria-label', `${state.title} — ${state.isMinimized ? 'réduit' : 'ouvert'}`);
    btn.innerHTML = `<span aria-hidden="true">${state.icon}</span><span class="taskbar-win-btn__label">${state.title}</span>`;

    btn.addEventListener('click', () => {
      const s = windows.get(state.id);
      if (!s) return;
      if (s.isMinimized) {
        minimize(state.id); // toggle back to visible
      } else {
        focus(state.id);
      }
    });

    container.appendChild(btn);
  });

  // Inject styles if not already present
  if (!document.getElementById('taskbar-win-styles')) {
    const style = document.createElement('style');
    style.id = 'taskbar-win-styles';
    style.textContent = `
      .taskbar-win-btn {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.25rem 0.75rem;
        background: rgba(139,92,246,0.1);
        border: 1px solid rgba(139,92,246,0.25);
        border-radius: 0.375rem;
        color: #FAF5FF;
        font-size: 0.75rem;
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s ease;
        max-width: 10rem;
        font-family: inherit;
      }
      .taskbar-win-btn:hover {
        background: rgba(139,92,246,0.25);
        border-color: rgba(139,92,246,0.5);
      }
      .taskbar-win-btn--minimized {
        opacity: 0.55;
      }
      .taskbar-win-btn__label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .taskbar-win-btn:focus-visible {
        outline: 2px solid #F59E0B;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  }
}
