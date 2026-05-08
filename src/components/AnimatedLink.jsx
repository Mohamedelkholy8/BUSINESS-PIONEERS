import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

function AnimatedLink({ to, children, className, color = '#111111', onClick }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    
    // Don't animate if we are already on this route
    if (window.location.pathname === to) return;

    const overlay = document.getElementById('transition-overlay');
    if (!overlay) {
      navigate(to);
      return;
    }

    // Set overlay color to match the destination
    gsap.set(overlay, { backgroundColor: color });
    
    // Animate overlay DOWN (cover the screen)
    gsap.fromTo(overlay, 
      { y: "-100vh" },
      { 
        y: "0vh", 
        duration: 0.8, 
        ease: "power4.inOut",
        onComplete: () => {
          navigate(to);
        }
      }
    );
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export default AnimatedLink;
