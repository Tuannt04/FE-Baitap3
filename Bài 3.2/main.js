let xPos = 0;
let currentScale = 1;
let dogImages = [];

async function loadDogImages(count) {
  const images = [];
  for (let i = 0; i < count; i++) {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await response.json();
    images.push(data.message);
  }
  return images;
}

function setScale(scale) {
  currentScale = scale;
  gsap.to('.container', {
    perspective: 2000 * scale,
    width: 300 * scale + 'px',
    height: 400 * scale + 'px',
    ease: 'power2.out'
  });
  gsap.to('.img', {
    transformOrigin: `50% 50% ${500 * scale}px`,
    z: -500 * scale,
    duration: 0.5,
    ease: 'power2.out'
  });
  gsap.to('.ring', {
    scale: scale,
    duration: 0.5,
    ease: 'power2.out'
  });
}

(async () => {
  dogImages = await loadDogImages(10); // Tải 10 ảnh chó
  gsap.timeline()
    .set('.ring', { rotationY: 180, cursor: 'grab' })
    .set('.img', {
      rotateY: (i) => i * -36,
      transformOrigin: '50% 50% 500px',
      z: -500,
      backgroundImage: (i) => `url(${dogImages[i]})`,
      backgroundPosition: (i) => getBgPos(i),
      backfaceVisibility: 'hidden'
    })    
    .from('.img', {
      duration: 1.5,
      y: 200,
      opacity: 0,
      stagger: 0.1,
      ease: 'expo'
    })
    .add(() => {
      $('.img').on('mouseenter', (e) => {
        let current = e.currentTarget;
        gsap.to('.img', { opacity: (i, t) => (t == current) ? 1 : 0.5, ease: 'power3' });
      });
      $('.img').on('mouseleave', (e) => {
        gsap.to('.img', { opacity: 1, ease: 'power2.inOut' });
      });
    }, '-=0.5');
})();

$(window).on('mousedown touchstart', dragStart);
$(window).on('mouseup touchend', dragEnd);

function dragStart(e) { 
  if (e.touches) e.clientX = e.touches[0].clientX;
  xPos = Math.round(e.clientX);
  gsap.set('.ring', { cursor: 'grabbing' });
  $(window).on('mousemove touchmove', drag);
}

function drag(e) {
  if (e.touches) e.clientX = e.touches[0].clientX;    
  gsap.to('.ring', {
    rotationY: '-=' + ((Math.round(e.clientX) - xPos) % 360),
    onUpdate: () => { gsap.set('.img', { backgroundPosition: (i) => getBgPos(i) }); }
  });
  xPos = Math.round(e.clientX);
}

function dragEnd(e) {
  $(window).off('mousemove touchmove', drag);
  gsap.set('.ring', { cursor: 'grab' });
}

function getBgPos(i) {
  return (100 - gsap.utils.wrap(0, 360, gsap.getProperty('.ring', 'rotationY') - 180 - i * 36) / 360 * 500 * currentScale) + 'px 0px';
}

// Khởi tạo scale mặc định
setScale(1);
