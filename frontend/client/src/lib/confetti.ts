type Particle = {
  left: number;
  delay: number;
  duration: number;
  color: string;
  rotation: number;
};

export function launchConfetti(): void {
  if (typeof document === "undefined") return;

  const colors = ["#123d2d", "#4a8f6b", "#e3b85c", "#f5d77a", "#d8f0e0"];
  const particles: Particle[] = Array.from({ length: 70 }, (_, index) => ({
    left: 4 + Math.random() * 92,
    delay: Math.random() * 0.35,
    duration: 1.6 + Math.random() * 1.2,
    color: colors[index % colors.length],
    rotation: Math.random() * 360,
  }));

  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true");
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999";

  particles.forEach((particle) => {
    const piece = document.createElement("span");
    piece.style.position = "absolute";
    piece.style.top = "-12px";
    piece.style.left = `${particle.left}%`;
    piece.style.width = "8px";
    piece.style.height = "14px";
    piece.style.borderRadius = "2px";
    piece.style.background = particle.color;
    piece.style.transform = `rotate(${particle.rotation}deg)`;
    piece.style.animation = `confetti-fall ${particle.duration}s ${particle.delay}s ease-in forwards`;
    container.appendChild(piece);
  });

  document.body.appendChild(container);
  window.setTimeout(() => container.remove(), 3500);
}

const style = document.createElement("style");
style.id = "learnloop-confetti-style";
style.textContent = `
  @keyframes confetti-fall {
    0% { transform: translate3d(0, -20px, 0) rotate(0deg); opacity: 1; }
    100% { transform: translate3d(${Math.random() > 0.5 ? "50px" : "-50px"}, 105vh, 0) rotate(720deg); opacity: 0; }
  }
`;
document.head.appendChild(style);
