import { useState, useEffect } from "react";

/**
 * Hook สำหรับตรวจจับขนาดหน้าจอ (mobile responsive)
 * @param maxWidth ความกว้างสูงสุดเป็น px ค่าเริ่มต้น 768px
 * @returns boolean - true ถ้าหน้าจอมีความกว้าง <= maxWidth, false ถ้ากว้างกว่า
 *
 * @example
 * const isMobile = useMobileMatch();
 * // or
 * const isTablet = useMobileMatch(1024);
 */
export const useMobileMatch = (maxWidth: number = 768): boolean => {
  const [isMobileMatch, setIsMobileMatch] = useState(window.matchMedia(`(max-width: ${maxWidth}px)`).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobileMatch(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [maxWidth]);

  return isMobileMatch;
};
