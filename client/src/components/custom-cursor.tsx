import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorScale, setCursorScale] = useState(1);
  const [cursorOpacity, setCursorOpacity] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only show custom cursor on desktop devices
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    
    if (isDesktop) {
      // Track mouse position
      const updatePosition = (e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
        setCursorOpacity(1);
      };
      
      // Handle clickable elements
      const handleMouseEnter = (e: MouseEvent) => {
        if (
          e.target instanceof HTMLElement &&
          (e.target.tagName === 'BUTTON' || 
           e.target.tagName === 'A' || 
           e.target.tagName === 'INPUT' ||
           e.target.closest('button') ||
           e.target.closest('a') ||
           e.target.closest('input'))
        ) {
          setCursorScale(1.5);
        }
      };
      
      const handleMouseLeave = () => {
        setCursorScale(1);
      };
      
      document.addEventListener('mousemove', updatePosition);
      document.addEventListener('mouseenter', handleMouseEnter);
      document.addEventListener('mouseleave', handleMouseLeave);
      
      // Add event listeners to buttons and links
      const clickableElements = document.querySelectorAll('button, a, input');
      clickableElements.forEach(element => {
        element.addEventListener('mouseenter', () => setCursorScale(1.5));
        element.addEventListener('mouseleave', () => setCursorScale(1));
      });
      
      return () => {
        document.removeEventListener('mousemove', updatePosition);
        document.removeEventListener('mouseenter', handleMouseEnter);
        document.removeEventListener('mouseleave', handleMouseLeave);
        
        clickableElements.forEach(element => {
          element.removeEventListener('mouseenter', () => setCursorScale(1.5));
          element.removeEventListener('mouseleave', () => setCursorScale(1));
        });
        
        window.removeEventListener('resize', checkIsDesktop);
      };
    }
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      <div 
        className="fixed w-2 h-2 bg-highlight rounded-full pointer-events-none z-[9999] transition-opacity duration-300"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${cursorScale})`,
          opacity: cursorOpacity,
          transition: 'transform 0.2s ease',
        }}
      />
      <div 
        className="fixed w-10 h-10 border-2 border-highlight/50 rounded-full pointer-events-none z-[9998]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${cursorScale})`,
          opacity: cursorOpacity,
          transition: 'transform 0.15s ease',
        }}
      />
    </>
  );
};

export default CustomCursor;
