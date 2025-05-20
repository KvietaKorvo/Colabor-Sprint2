(function () {
  const messages = ["Take a break!", "Drink some water!","Yoga poses?","Go outside a bit!"];
  let currentIndex = 0;

  let sampleText = document.body.innerText.replace(/\s+/g, '');
  if (!sampleText) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  function runAnimation() {
    const message = messages[currentIndex];
    currentIndex = (currentIndex + 1) % messages.length; // váltogatás

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
      overflow: 'hidden'
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

    setTimeout(() => {
      bg.style.opacity = '1';
    }, 100);

    // Véletlenszerű karakterek és képek szétszórása
    function scatterRandomElements() {
      const elements = [];

      // karakterek:
      for (let i = 0; i < 200; i++) {
        const char = sampleText[Math.floor(Math.random() * sampleText.length)];
        const span = document.createElement('span');
        span.textContent = char;
        span.style.position = 'absolute';
        span.style.left = `${Math.random() * 100}vw`;
        span.style.top = `${Math.random() * 100}vh`;
        span.style.fontSize = `${Math.random() * 24 + 12}px`;
        span.style.color = 'black';
        span.style.opacity = '0';
        span.style.transition = 'all 2s ease-out';
        container.appendChild(span);
        elements.push(span);

        setTimeout(() => {
          span.style.opacity = '1';
          span.style.left = `${Math.random() * 100}vw`;
          span.style.top = `${Math.random() * 100}vh`;
        }, 1500 + Math.random() * 1000);
      }

      // képek
      const images = Array.from(document.getElementsByTagName('img'));
      images.forEach(image => {
        const img = document.createElement('img');
        img.src = image.src;
        img.style.position = 'absolute';
        img.style.left = `${Math.random() * 100}vw`;
        img.style.top = `${Math.random() * 100}vh`;
        img.style.width = '80px';
        img.style.opacity = '0.3';
        img.style.transition = 'all 2s ease-out';
        container.appendChild(img);
        elements.push(img);
        setTimeout(() => {
          img.style.left = `${Math.random() * 100}vw`;
          img.style.top = `${Math.random() * 100}vh`;
          img.style.opacity = '0.5';
        }, 1500 + Math.random() * 1000);
      });

      return elements;
    }

    const scatteredElements = scatterRandomElements();

    //szöveg kirajzolása, karakter, pozíciók
    if (sampleText.length < 5000) {
      sampleText = sampleText.repeat(Math.ceil(5000 / sampleText.length));
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = 'black';
    const fontSize = 150;
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

    // Reverse animáció + cleanup + loop
    setTimeout(() => {
      spans.forEach((span, i) => {
        setTimeout(() => {
          span.style.left = `${Math.random() * width}px`;
          span.style.top = `${Math.random() * height}px`;
          span.style.opacity = '0';
        }, i * 2);
      });

      scatteredElements.forEach((elem, i) => {
        setTimeout(() => {
          elem.style.left = `${Math.random() * width}px`;
          elem.style.top = `${Math.random() * height}px`;
          elem.style.opacity = '0';
        }, i * 3);
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
    }, 7000);
  }

  runAnimation();
})();
