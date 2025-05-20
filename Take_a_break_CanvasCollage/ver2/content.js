(function () {
  const message = "Take a break!";
  const sampleText = document.body.innerText.replace(/\s+/g, '') || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  if (!sampleText) return;

  // Háttér fade-in
  const fadeBg = document.createElement('div');
  fadeBg.style.position = 'fixed';
  fadeBg.style.top = '0';
  fadeBg.style.left = '0';
  fadeBg.style.width = '100vw';
  fadeBg.style.height = '100vh';
  fadeBg.style.backgroundColor = 'white';
  fadeBg.style.opacity = '0';
  fadeBg.style.transition = 'opacity 2s ease-in';
  fadeBg.style.zIndex = '9998';
  document.body.appendChild(fadeBg);

  // Konténer
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.overflow = 'hidden';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);

  // Fade-in2
  setTimeout(() => {
    fadeBg.style.opacity = '1';
  }, 500);

  // Vászon előkészítése:
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.font = 'bold 100px Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Kiválasztja a pontokat(?), ahol a szöveg van (nem átlátszó pixelek):
  const points = [];
  for (let y = 0; y < canvas.height; y += 10) {
    for (let x = 0; x < canvas.width; x += 10) {
      const index = (y * canvas.width + x) * 4;
      const alpha = data[index + 3];
      if (alpha > 128) {
        points.push({ x, y });
      }
    }
  }

  // Keverés, karakterkollázs
  for (let i = 0; i < points.length; i++) {
    const char = sampleText[Math.floor(Math.random() * sampleText.length)];
    const span = document.createElement('span');
    span.textContent = char;
    span.style.position = 'absolute';
    span.style.left = `${Math.random() * window.innerWidth}px`;
    span.style.top = `${Math.random() * window.innerHeight}px`;
    span.style.fontSize = '12px';
    span.style.fontFamily = 'monospace';
    span.style.color = '#111';
    span.style.opacity = '0';
    span.style.transition = 'all 2s ease-in-out';
    container.appendChild(span);

    // Mozgás valami
    setTimeout(() => {
      span.style.left = `${points[i].x}px`;
      span.style.top = `${points[i].y}px`;
      span.style.opacity = '1';
    }, 1500 + Math.random() * 500);
  }
})();
