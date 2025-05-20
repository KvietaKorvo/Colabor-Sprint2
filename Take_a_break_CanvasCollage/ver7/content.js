(function (){
  const messages = ["Take a break!", "Drink some water!", "soemthingsomething"];
  let currentIndex = 0;

  // Wait for the page to be fully loaded:
  window.addEventListener('load', () => {
    runAnimation();
  });

  function runAnimation() {
    const message = messages[currentIndex];
    currentIndex = (currentIndex + 1) % messages.length;

    // Grab all direct children-element of body:
    const elements = Array.from(document.body.children);

    // Store original styles to restore later:
    const originalStyles = elements.map(el => ({
      el,
      transform: el.style.transform || '',
      transition: el.style.transition || '',
      position: el.style.position || '',
      zIndex: el.style.zIndex || '',
    }));

    // Set position to relative or absolute if needed for transform to work smoothly:
    elements.forEach(el => {
      el.style.transition = 'transform 2s ease';
      if (getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      el.style.zIndex = 1000; // on top for visibility during animation
    });

    // Step 1: Scatter elements with random transforms (rotate, scale, translate)
    elements.forEach(el => {
      const randX = (Math.random() - 0.5) * window.innerWidth * 0.5;
      const randY = (Math.random() - 0.5) * window.innerHeight * 0.5;
      const randRot = (Math.random() - 0.5) * 720; // degrees
      const randScale = 0.5 + Math.random() * 1.5;

      el.style.transform = `translate(${randX}px, ${randY}px) rotate(${randRot}deg) scale(${randScale})`;
      el.style.opacity = '0.7';
    });

    // Step 2: After 3 seconds, regroup all elements, aka transform back
    setTimeout(() => {
      elements.forEach(el => {
        el.style.transform = 'none';
        el.style.opacity = '1';
      });
    }, 3000);

    // Step 3: After 5 seconds, show the typewriter text formed by scattered letters
    setTimeout(() => {
      showTypewriterText(message);
    }, 5000);

    // Step 4: After 15 seconds, cleanup and run again > loop
    setTimeout(() => {
      // Restore original styles (IMPORTANT): 
      originalStyles.forEach(({ el, transform, transition, position, zIndex }) => {
        el.style.transform = transform;
        el.style.transition = transition;
        el.style.position = position;
        el.style.zIndex = zIndex;
        el.style.opacity = '';
      });

      // Remove typewriter container if any
      const oldContainer = document.getElementById('typewriter-container');
      if (oldContainer) oldContainer.remove();

      setTimeout(runAnimation, 3000);
    }, 15000);
  }

  function showTypewriterText(message){
    const width = window.innerWidth;
    const height = window.innerHeight;
    const sampleText = document.body.innerText.replace(/\s+/g, '') || 'abcdefghijklmnopqrstuvwxyz';

    // Container for typewriter letters:
    const container = document.createElement('div');
    container.id = 'typewriter-container';
    Object.assign(container.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 9999,
      overflow: 'hidden',
      backgroundColor: 'white',
    });
    document.body.appendChild(container);

    // Draw message shape on canvas to get points:
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
        transition: 'all 1.2s ease-in-out',
      });

      container.appendChild(span);

      // Closure-es setTimeout az i helyes értékével:
      ((span, targetX, targetY, delay) => {
        setTimeout(() => {
          span.style.left = `${targetX}px`;
          span.style.top = `${targetY}px`;
          span.style.opacity = '1';
        }, delay);
      })(span, points[i].x, points[i].y, 1000 + i * 3);
    }

    // Fade out and remove container after a while:
    setTimeout(() => {
      container.style.transition = 'opacity 2s ease';
      container.style.opacity = '0';

      setTimeout(() => {
        container.remove();
      }, 2000);
    }, 10000); // timer
  }
})();
