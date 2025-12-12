document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully!');
    
    // Elemen foto dan modal
    const photoFrames = document.querySelectorAll('.photo-frame');
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeModal = document.querySelector('.close-modal');
    
    // Tambah caption ke foto jika belum ada
    photoFrames.forEach((frame, index) => {
        if (!frame.querySelector('.photo-caption')) {
            const captions = ['Kenangan Indah', 'Kebersamaan', 'Sukacita Natal', 'Kehangatan Keluarga', 'Semangat Natal'];
            const caption = document.createElement('div');
            caption.className = 'photo-caption';
            caption.textContent = captions[index] || 'Foto ' + (index + 1);
            frame.appendChild(caption);
        }
    });
    
    // Animasi foto saat scroll - DIPERBAIKI
    let ticking = false;
    
    function updatePhotoAnimation() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        photoFrames.forEach((frame, index) => {
            const frameRect = frame.getBoundingClientRect();
            const frameCenter = frameRect.top + frameRect.height / 2;
            
            // Hitung posisi relatif frame terhadap viewport
            const viewportCenter = windowHeight / 2;
            const distanceFromCenter = Math.abs(frameCenter - viewportCenter);
            
            // Skala dan rotasi berdasarkan jarak dari tengah viewport
            const maxDistance = windowHeight / 2;
            const scale = 0.8 + (1 - Math.min(distanceFromCenter / maxDistance, 1)) * 0.4;
            const rotation = ((viewportCenter - frameCenter) / maxDistance) * 20;
            
            // Terapkan transformasi
            frame.style.transform = `rotate(${rotation}deg) scale(${scale})`;
            frame.style.opacity = 0.7 + (1 - Math.min(distanceFromCenter / maxDistance, 1)) * 0.3;
            
            // Tambah animasi mengambang
            const floatOffset = Math.sin(Date.now() / 1000 + index) * 5;
            frame.style.transform += ` translateY(${floatOffset}px)`;
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updatePhotoAnimation();
            });
            ticking = true;
        }
    });
    
    // Buka modal saat foto diklik
    photoFrames.forEach(frame => {
        frame.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const caption = this.querySelector('.photo-caption').textContent;
            
            modalImage.src = imgSrc;
            modalImage.alt = caption;
            modalCaption.textContent = caption;
            modal.style.display = 'flex';
            
            // Tambah efek masuk modal
            modal.querySelector('.modal-content').style.animation = 'modalFadeIn 0.5s forwards';
        });
    });
    
    // Tutup modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Tutup modal saat klik di luar konten
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Animasi untuk tombol play musik
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Ganti ikon play/pause
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-play')) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                
                // Animasi tombol
                this.style.transform = 'scale(1.1)';
                this.style.backgroundColor = 'rgba(255, 209, 102, 0.3)';
                
                // Simulasi pemutaran lagu
                const songTitle = this.closest('.song').querySelector('h3').textContent;
                console.log(`Memutar: ${songTitle}`);
            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                
                // Reset animasi
                this.style.transform = 'scale(1)';
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                
                console.log('Pause lagu');
            }
            
            // Beri feedback audio (hanya simulasi)
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3');
            audio.volume = 0.3;
            audio.play().catch(e => console.log('Audio tidak dapat diputar: ', e));
        });
    });

    // Initialize player when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize photo animations (kode sebelumnya)
        // ... [kode untuk foto tetap seperti sebelumnya]
        
        // Initialize music player
        const musicPlayer = new MusicPlayer();
        
        // Play first song automatically (with user interaction)
        document.addEventListener('click', function firstInteraction() {
            // Try to play music on first user interaction
            if (!musicPlayer.isPlaying) {
                musicPlayer.play();
            }
            document.removeEventListener('click', firstInteraction);
        });
        
        console.log("Website loaded successfully!");
    });
    
    // Inisialisasi animasi awal untuk foto
    photoFrames.forEach((frame, index) => {
        // Beri delay berbeda untuk setiap foto
        frame.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.8s ease';
        frame.style.transitionDelay = `${index * 0.1}s`;
        
        // Atur posisi awal dengan sedikit variasi
        const rotation = (Math.random() * 10) - 5; // -5 hingga 5 derajat
        frame.style.transform = `rotate(${rotation}deg) scale(0.8)`;
        
        // Tambah animasi mengambang
        frame.style.animation = `photoFloat 3s ease-in-out infinite alternate`;
        frame.style.animationDelay = `${index * 0.3}s`;
    });
    
    // Tambah efek hover untuk semua card
    const cards = document.querySelectorAll('.wish-card, .song, .glass');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('glass') ? 'translateY(-5px)' : 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Inisialisasi scroll event
    updatePhotoAnimation();
    
    console.log('JavaScript initialized successfully!');
});