export function burst(state, x, y, color, amount = 14, power = 190) {
  for (let index = 0; index < amount; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = power * (0.35 + Math.random() * 0.85);
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.45 + Math.random() * 0.45,
      maxLife: 0.9,
      size: 1.5 + Math.random() * 3.5,
      color
    });
  }
}

export function updateParticles(state, dt) {
  state.particles = state.particles.filter((particle) => {
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= 0.985;
    particle.vy = particle.vy * 0.985 + 220 * dt;
    return particle.life > 0;
  });
}
