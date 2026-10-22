import { useEffect, useState } from 'react';

/**
 * Keeps a component mounted while it plays an exit animation.
 *
 * Pass the `open` flag that controls visibility. The returned `isMounted`
 * stays true until the exit animation finishes, and `isClosing` is true
 * during that window so you can swap to a close animation.
 */
export const usePresence = (open: boolean, duration = 250) => {
  const [isMounted, setIsMounted] = useState(open);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      setIsClosing(false);
      return;
    }

    if (!isMounted) return;

    setIsClosing(true);
    const timer = setTimeout(() => {
      setIsMounted(false);
      setIsClosing(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [open, duration, isMounted]);

  return { isMounted, isClosing };
};
