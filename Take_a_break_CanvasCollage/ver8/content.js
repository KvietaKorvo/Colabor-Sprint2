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
    currentIndex = (currentIndex + 1) % messages.length;

    // Container
    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 9999,
      overflow: 'hidden',
      backgroundColor: 'transparent'
    });
    document.body.appendChild(container);

    // Background
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

    // Create spans scattered randomly
    const maxChars = 1000;
    const spans = [];

    for (let i = 0; i < maxChars; i++) {
      const char = sampleText[i % sampleText.length];
      const span = document.createElement('span');
      span.textContent = char;

      // Szétrobbanás kezdőpontja/-helye: a weboldal eredeti helyén, random, kis eltéréssel
      // Mivel nem tudjuk pontosan az eredeti helyet, random pontokat kell használni:
      const startX = Math.random() * width;
      const startY = Math.random() * height;

      Object.assign(span.style, {
        position: 'absolute',
        left: `${startX}px`,
        top: `${startY}px`,
        fontSize: '16px',
        fontFamily: 'monospace',
        color: 'black',
        opacity: '1',
        transition: 'all 1.5s ease-in-out'
      });

      container.appendChild(span);
      spans.push(span);
    }

    // Szétrobbanás (random irányba szétszóródás)
    spans.forEach((span, i) => {
      setTimeout(() => {
        // Random, nagy elmozdulás, pl +/- 200-400 px
        const offsetX = (Math.random() - 0.5) * 600;
        const offsetY = (Math.random() - 0.5) * 400;

        // Új pozíció (szétrobbanás)
        span.style.left = `${Math.min(Math.max(0, parseFloat(span.style.left) + offsetX), width)}px`;
        span.style.top = `${Math.min(Math.max(0, parseFloat(span.style.top) + offsetY), height)}px`;
      }, 100);
    });

    // === Összegyűjtés egy csíkba/vonalba a képernyő közepén --->
    setTimeout(() => {
      const stripeY = height / 2; // vízszintes csík Y koordinátája
      const spacing = width / maxChars; // karakterek közti távolság

      spans.forEach((span, i) => {
        setTimeout(() => {
          span.style.left = `${spacing * i}px`;
          // Vastag csíkban: karakterek különböző Y pozíciók, pl. ±10 px véletlenszerűen, hogy ne legyen teljesen egyenes
          span.style.top = `${stripeY + (Math.random() - 0.5) * 20}px`;
        }, i * 3);
      });

      // Háttér elfehéredés indulása:
      bg.style.opacity = '1';
    }, 1800);

    // === Második fázis: megjelenik az üzenet a megszokott módon
    setTimeout(() => {
      // Canvas és karakterek pontos pozíciók a "message" szöveg alapján
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;

      const fontSize = 150;
      ctx.fillStyle = 'black';
      ctx.font = `bold ${fontSize}px sans-serif`;
      const textWidth = ctx.measureText(message).width;
      const x = (width - textWidth) / 2;
      const y = height / 2 + fontSize / 3;
      ctx.fillText(message, x, y);

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

      // Áthelyezi a span-eket a pontos helyükre, és megjeleníti öket
      spans.forEach((span, i) => {
        if (i >= points.length) return;
        const char = message[i % message.length];
        span.textContent = char;
        setTimeout(() => {
          span.style.left = `${points[i].x}px`;
          span.style.top = `${points[i].y}px`;
          span.style.opacity = '1';
          span.style.fontSize = `${fontSize / 10}px`; // nagyobb betűméret, hogy közel legyen az eredetihez
          span.style.transition = 'all 1s ease-in-out';
        }, i * 3);
      });
    }, 4000);

    // Visszarendezés, cleanup, újraindítás
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
        setTimeout(runAnimation, 8000);
      }, 3000);
    }, 10000);
  }

  runAnimation();
})();
