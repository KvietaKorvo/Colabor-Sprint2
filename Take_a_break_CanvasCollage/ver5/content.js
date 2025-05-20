(function () {
  const messages = ["Take a break!", "Drink some water!"];
  let currentIndex = 0;

  let sampleText = document.body.innerText.replace(/\s+/g, '');
  if (!sampleText) return;

  if (sampleText.length < 5000) {
    sampleText = sampleText.repeat(Math.ceil(5000 / sampleText.length));
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  function runAnimation() {
    const message = messages[currentIndex];
    currentIndex = (currentIndex + 1) % messages.length; // Alternate!

    // Container:
    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 9999,
      overflow: 'hidden'
    });
    document.body.appendChild(container);

    // Background:
    const bg = document.createElement('div');
    Object.assign(bg.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'white',
      opacity: '0',
      transition: 'opacity 2s ease-in',
      zIndex: 9998
    });
    document.body.appendChild(bg);

    setTimeout(() => {
      bg.style.opacity = '1';
    }, 100);

    // Canvas:
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    /* FIRST VERSION -->
    ctx.fillStyle = 'black';
    ctx.font = 'bold 160px sans-serif';
    const textWidth = ctx.measureText(message).width;
    const x = (width - textWidth) / 2;
    const y = height / 2 + 50;
    ctx.fillText(message, x, y); <----*/

/* SECOND VRSION --->*/
ctx.fillStyle = 'black';
const fontSize = 150;
ctx.font = `bold ${fontSize}px sans-serif`;
const textWidth = ctx.measureText(message).width;
const x = (width - textWidth) / 2;
const y = height / 2 + fontSize / 3;
ctx.fillText(message, x, y);
/*------END SECOND VER---------*/

    const imageData = ctx.getImageData(0, 0, width, height);
    const points = [];

    for (let y = 0; y < height; y += 8) {
      for (let x = 0; x < width; x += 6) {
        const index = (y * width + x) * 4;
        if (imageData.data[index + 3] > 128) {
          points.push({ x, y });
        }
      }
    }

    const maxChars = 1000;
    const spans = [];

    for (let i = 0; i < points.length && i < maxChars; i++) {
      const char = sampleText[i % sampleText.length];
      const span = document.createElement('span');
      span.textContent = char;

      const startX = Math.random() * width;
      const startY = Math.random() * height;

      Object.assign(span.style, {
        position: 'absolute',
        left: `${startX}px`,
        top: `${startY}px`,
        fontSize: `16px`,
        fontFamily: 'monospace',
        color: `black`,
        opacity: '0',
        transition: 'all 1.2s ease-in-out'
      });

      container.appendChild(span);
      spans.push(span);

      setTimeout(() => {
        span.style.left = `${points[i].x}px`;
        span.style.top = `${points[i].y}px`;
        span.style.opacity = '1';
      }, 1200 + i * 3);
    }

    // Reverse Animation + Cleanup + Loop
    setTimeout(() => {
      spans.forEach((span, i) => {
        setTimeout(() => {
          span.style.left = `${Math.random() * width}px`;
          span.style.top = `${Math.random() * height}px`;
          span.style.opacity = '0';
        }, i * 2);
      });

      setTimeout(() => {
        bg.style.opacity = '0';
        container.style.opacity = '0';
      }, 2000);

      setTimeout(() => {
        document.body.removeChild(bg);
        document.body.removeChild(container);
        setTimeout(runAnimation, 8000); // Wait 8 seconds before restarting
      }, 3000);
    }, 7000);
  }

  runAnimation();
})();
