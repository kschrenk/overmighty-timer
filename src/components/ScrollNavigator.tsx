import React, { useEffect, useState, useCallback } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollNavigatorProps {
  /** Visual style variant controlling background & text colors */
  variant?: 'neutral' | 'accent' | 'primary';
  /** Optional extra class names for the container */
  className?: string;
}

/**
 * ScrollNavigator
 * Small fixed control (bottom-right) to quickly jump to top or bottom of the page.
 * Hides automatically when any drawer is open. It listens for custom events emitted
 * by interactive components (app:drawer-open-change) and also observes the DOM
 * for any elements with data-slot="drawer-content" to be resilient.
 */
const ScrollNavigator: React.FC<ScrollNavigatorProps> = ({ variant = 'neutral', className }) => {
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const detectDrawerPresence = useCallback(() => {
    const anyDrawer = document.querySelector('[data-slot="drawer-content"]');
    return !!anyDrawer;
  }, []);

  const evaluateScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const innerH = window.innerHeight;
    const docH = document.documentElement.scrollHeight;
    const bottomThreshold = 16; // px tolerance for bottom detection
    const top = scrollY <= 8;
    const bottom = scrollY + innerH >= docH - bottomThreshold;
    setAtTop(top);
    setAtBottom(bottom);
    const scrollable = docH - innerH > 200; // require >200px extra height to show
    const anyDrawer = drawerOpen || detectDrawerPresence();
    setVisible(scrollable && !anyDrawer);
  }, [drawerOpen, detectDrawerPresence]);

  // Basic scroll/resize listeners
  useEffect(() => {
    evaluateScroll();
    window.addEventListener('scroll', evaluateScroll, { passive: true });
    window.addEventListener('resize', evaluateScroll);
    return () => {
      window.removeEventListener('scroll', evaluateScroll);
      window.removeEventListener('resize', evaluateScroll);
    };
  }, [evaluateScroll]);

  // Listen for global drawer open change events
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ open: boolean }>;
      setDrawerOpen(custom.detail.open);
    };
    window.addEventListener('app:drawer-open-change', handler as EventListener);
    return () => window.removeEventListener('app:drawer-open-change', handler as EventListener);
  }, []);

  // Observe DOM mutations to detect drawers not emitting events
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const anyDrawer = detectDrawerPresence();
      if (anyDrawer !== drawerOpen) {
        setDrawerOpen(anyDrawer);
      }
      evaluateScroll();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    return () => observer.disconnect();
  }, [detectDrawerPresence, drawerOpen, evaluateScroll]);

  // Re-evaluate when drawer state changes
  useEffect(() => {
    evaluateScroll();
  }, [drawerOpen, evaluateScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  if (!visible) return null;

  const variantClasses: Record<string, string> = {
    neutral: 'bg-background/70 dark:bg-gray-900/70 border-border',
    accent: 'bg-accent text-accent-foreground border-accent/40',
    primary: 'bg-primary text-primary-foreground border-primary/50',
  };

  return (
    <div
      aria-label="Scroll navigation"
      role="group"
      className={cn(
        'fixed z-40 bottom-4 right-4 flex flex-col gap-2 rounded-md backdrop-blur shadow-md p-1 transition-opacity border',
        variantClasses[variant],
        drawerOpen ? 'pointer-events-none opacity-0' : 'opacity-100',
        className
      )}
    >
      {!atTop && (
        <button
          type="button"
          aria-label="Scroll to top"
          onClick={scrollToTop}
          className={cn(
            'p-2 rounded-sm transition-colors focus:outline-none focus-visible:ring focus-visible:ring-ring',
            variant === 'neutral' && 'hover:bg-accent hover:text-accent-foreground',
            (variant === 'accent' || variant === 'primary') && 'hover:brightness-110'
          )}
        >
          <ArrowUp size={18} />
        </button>
      )}
      {!atBottom && (
        <button
          type="button"
          aria-label="Scroll to bottom"
          onClick={scrollToBottom}
          className={cn(
            'p-2 rounded-sm transition-colors focus:outline-none focus-visible:ring focus-visible:ring-ring',
            variant === 'neutral' && 'hover:bg-accent hover:text-accent-foreground',
            (variant === 'accent' || variant === 'primary') && 'hover:brightness-110'
          )}
        >
          <ArrowDown size={18} />
        </button>
      )}
    </div>
  );
};

export default ScrollNavigator;
