(function () {
  const message = "Take a break!";
  let sampleText = document.body.innerText.replace(/\s+/g, '');

  if (!sampleText) return;

  // Duplicate content if not enough:
  if (sampleText.length < 5000) {
    sampleText = sampleText.repeat(Math.ceil(5000 / sampleText.length));
  }

  // Create container:
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);

  // White background fade-in:
  const bg = document.createElement('div');
  bg.style.position = 'fixed';
  bg.style.top = '0';
  bg.style.left = '0';
  bg.style.width = '100vw';
  bg.style.height = '100vh';
  bg.style.backgroundColor = 'white';
  bg.style.opacity = '0';
  bg.style.transition = 'opacity 2s ease-in';
  bg.style.zIndex = '9998';
  document.body.appendChild(bg);

  setTimeout(() => {
    bg.style.opacity = '1';
  }, 500);

  // Canvas setup:
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = 'black';
  ctx.font = 'bold 160px sans-serif';
  const textWidth = ctx.measureText(message).width;
  const x = (width - textWidth) / 2;
  const y = height / 2 + 50;
  ctx.fillText(message, x, y);

  const imageData = ctx.getImageData(0, 0, width, height);
  const points = [];

/* ---> szöveg olvashatóság,méret*/
  for (let y = 0; y < height; y += 8) {
    for (let x = 0; x < width; x += 6) {
/* megváltoztatni a számokat a végen */

      const index = (y * width + x) * 4;
      if (imageData.data[index + 3] > 128) {
        points.push({ x, y });
      }
    }
  }

  // Limit number of characters for clarity:
  const maxChars = 1000;

  for (let i = 0; i < points.length && i < maxChars; i++) {
    const char = sampleText[i % sampleText.length];
    const span = document.createElement('span');
    span.textContent = char;

    // Random initial position:
    const startX = Math.random() * width;
    const startY = Math.random() * height;

    // Consistent font styling:
    span.style.position = 'absolute';
    span.style.left = `${startX}px`;
    span.style.top = `${startY}px`;
    span.style.fontSize = `16px`;
    span.style.fontFamily = 'monospace';
    span.style.color = `black`;
    span.style.opacity = '0';
    span.style.transition = 'all 1.5s ease-in-out';

    container.appendChild(span);

    // Animate into final position:
    setTimeout(() => {
      span.style.left = `${points[i].x}px`;
      span.style.top = `${points[i].y}px`;
      span.style.opacity = '1';
    }, 1200 + Math.random() * 600);
  }
})();
