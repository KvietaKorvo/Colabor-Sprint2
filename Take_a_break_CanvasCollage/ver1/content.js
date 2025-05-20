(function () {
  const message = "Take a break!";
  const sampleText = document.body.innerText.replace(/\s+/g, '');
  if (!sampleText) return;

  // Fehér háttér + fade-in animáció
  const fadeBg = document.createElement('div');
  fadeBg.style.position = 'fixed';
  fadeBg.style.top = '0';
  fadeBg.style.left = '0';
  fadeBg.style.width = '100vw';
  fadeBg.style.height = '100vh';
  fadeBg.style.backgroundColor = 'white';
  fadeBg.style.opacity = '0';
  fadeBg.style.transition = 'opacity 3s ease-in';
  fadeBg.style.zIndex = '9998';
  document.body.appendChild(fadeBg);

  // Létrehoz egy konténert a szöveghez és mozgó elemekhez:
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

  // Háttér fokozatos elfehérítése:
  setTimeout(() => {
    fadeBg.style.opacity = '1';
  }, 1000);

  // Karakterek véletlenszerü szétszórása:
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

    setTimeout(() => {
      span.style.opacity = '1';
      span.style.left = `${Math.random() * 100}vw`;
      span.style.top = `${Math.random() * 100}vh`;
    }, 1500 + Math.random() * 1000);
  }

  // Véletlen képek rendezése, pozicionálása(?) (ha vannak)
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
    setTimeout(() => {
      img.style.left = `${Math.random() * 100}vw`;
      img.style.top = `${Math.random() * 100}vh`;
      img.style.opacity = '0.5';
    }, 1500 + Math.random() * 1000);
  });

  // A "Take a break!" szöveg betűinek elhelyezése
  setTimeout(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const letterSpacing = 40; // px
    const totalWidth = message.length * letterSpacing;
    for (let i = 0; i < message.length; i++) {
      const char = message[i];
      const span = document.createElement('span');
      span.textContent = char;
      span.style.position = 'absolute';
      span.style.left = `${centerX - totalWidth / 2 + i * letterSpacing}px`;
      span.style.top = `${centerY}px`;
      span.style.fontSize = '48px';
      span.style.fontWeight = 'bold';
      span.style.color = '#222';
      span.style.opacity = '0';
      span.style.transition = 'opacity 2s ease-in';
      container.appendChild(span);
      setTimeout(() => {
        span.style.opacity = '1';
      }, 3000 + i * 100);
    }
  }, 2500);
})();
