(function () {
  const collageFontSize = 160;
  const messageFont = `bold ${collageFontSize}px sans-serif`;
  const width = window.innerWidth;
  const height = window.innerHeight;

  const steps = [
    () => runCollageAnimation("Take a break!"),
    () => runCollageAnimation("Drink some water!"),
    runMeditationAnimation
  ];

  let currentStep = 0;

  function loopAnimations() {
    steps[currentStep]();
    currentStep = (currentStep + 1) % steps.length;
  }

  function runCollageAnimation(message) {
    let sampleText = document.body.innerText.replace(/\s+/g, '');
    if (!sampleText) return;

    if (sampleText.length < 5000) {
      sampleText = sampleText.repeat(Math.ceil(5000 / sampleText.length));
    }

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

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = 'black';
    ctx.font = messageFont;

    const textWidth = ctx.measureText(message).width;
    const x = (width - textWidth) / 2;
    const y = height / 2 + collageFontSize / 3;
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
        setTimeout(loopAnimations, 1000);
      }, 3000);
    }, 7000);
  }

  function runMeditationAnimation() {
    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'white',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      pointerEvents: 'none',
      transition: 'opacity 1s ease-in-out'
    });

    const message = document.createElement('div');
    message.textContent = "Meditate!";
    Object.assign(message.style, {
      fontSize: '60px',
      fontWeight: 'bold',
      fontFamily: 'sans-serif',
      color: 'black',
      marginBottom: '30px',
      transition: 'opacity 1s ease-in-out'
    });

    const circle = document.createElement('div');
    Object.assign(circle.style, {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: 'black',
      transition: 'transform 3s ease-in-out'
    });

    container.appendChild(message);
    container.appendChild(circle);
    document.body.appendChild(container);

    // Step 1: Show "Breathe in!" and grow circle
    setTimeout(() => {
      message.textContent = "Breathe in!";
      circle.style.transform = 'scale(3)';
    }, 1000);

    // Step 2: Show "Breathe out!" and shrink circle
    setTimeout(() => {
      message.textContent = "Breathe out!";
      circle.style.transform = 'scale(1)';
    }, 4000);

    // Step 3: Fade out and cleanup
    setTimeout(() => {
      container.style.opacity = '0';
    }, 7000);

    setTimeout(() => {
      document.body.removeChild(container);
      loopAnimations(); // Continue the loop
    }, 8000);
  }

  // Start everything - important!
  loopAnimations();
})();
