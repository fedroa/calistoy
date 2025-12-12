document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully!');
    
    // Periksa jika di mobile
    const isMobile = window.innerWidth <= 768;
    
    // Elemen foto dan modal
    const photoFrames = document.querySelectorAll('.photo-frame');
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeModal = document.querySelector('.close-modal');
    
    // Tambah caption ke foto jika belum ada
    photoFrames.forEach((frame, index) => {
        if (!frame.querySelector('.photo-caption')) {
            const captions = ['2 jari? pendukung prabowo kah?', 'kepompong bandung', 'hulk girl', 'patung museum kok gerak jir', 'bao an kepedean'];
            const caption = document.createElement('div');
            caption.className = 'photo-caption';
            caption.textContent = captions[index] || 'Foto ' + (index + 1);
            frame.appendChild(caption);
        }
    });
    
    // Animasi foto saat scroll - DIPERBAIKI untuk mobile
    let ticking = false;
    
    function updatePhotoAnimation() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Untuk mobile, animasi lebih sederhana
        if (isMobile) {
            photoFrames.forEach((frame, index) => {
                const frameRect = frame.getBoundingClientRect();
                const isInViewport = frameRect.top < windowHeight && frameRect.bottom > 0;
                
                if (isInViewport) {
                    // Animasi sederhana untuk mobile
                    const viewportProgress = 1 - Math.max(0, Math.min(1, (frameRect.top + frameRect.height/2) / windowHeight));
                    const scale = 0.8 + viewportProgress * 0.4;
                    const rotation = (viewportProgress - 0.5) * 10;
                    
                    frame.style.transform = `rotate(${rotation}deg) scale(${scale})`;
                    frame.style.opacity = 0.7 + viewportProgress * 0.3;
                } else {
                    frame.style.transform = 'rotate(0deg) scale(0.8)';
                    frame.style.opacity = '0.7';
                }
            });
        } else {
            // Animasi untuk desktop (lebih kompleks)
            photoFrames.forEach((frame, index) => {
                const frameRect = frame.getBoundingClientRect();
                const frameCenter = frameRect.top + frameRect.height / 2;
                
                const viewportCenter = windowHeight / 2;
                const distanceFromCenter = Math.abs(frameCenter - viewportCenter);
                const maxDistance = windowHeight / 2;
                const scale = 0.8 + (1 - Math.min(distanceFromCenter / maxDistance, 1)) * 0.4;
                const rotation = ((viewportCenter - frameCenter) / maxDistance) * 20;
                
                frame.style.transform = `rotate(${rotation}deg) scale(${scale})`;
                frame.style.opacity = 0.7 + (1 - Math.min(distanceFromCenter / maxDistance, 1)) * 0.3;
                
                const floatOffset = Math.sin(Date.now() / 1000 + index) * 5;
                frame.style.transform += ` translateY(${floatOffset}px)`;
            });
        }
        
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
    
    // Player Musik Natal
    class MusicPlayer {
        constructor() {
            this.audio = new Audio();
            this.currentSongIndex = 0;
            this.isPlaying = false;
            this.songs = [
                {
                    title: "Jingle Bell Rock",
                    artist: "Bobby Helms",
                    duration: "2:10",
                    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-jingle-bell-rock-229.mp3"
                },
                {
                    title: "Rockin' Around The Christmas Tree",
                    artist: "Brenda Lee",
                    duration: "2:06",
                    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-christmas-rock-230.mp3"
                },
                {
                    title: "Santa Claus Is Coming To Town",
                    artist: "Jackson 5",
                    duration: "2:24",
                    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-santa-claus-is-coming-to-town-231.mp3"
                }
            ];
            
            this.init();
        }
        
        init() {
            // Set lagu pertama
            this.loadSong(0);
            
            // Event listeners
            this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
            this.audio.addEventListener('ended', this.nextSong.bind(this));
            
            // Setup UI controls
            this.setupControls();
            
            console.log("Music player initialized with songs:", this.songs);
        }
        
        loadSong(index) {
            this.currentSongIndex = index;
            const song = this.songs[index];
            
            // Update audio source
            this.audio.src = song.audioUrl;
            this.audio.load();
            
            // Update UI
            this.updateSongInfo(song);
            this.updateSongList(index);
            
            // Jika sedang play, play lagu baru
            if (this.isPlaying) {
                this.play();
            }
        }
        
        play() {
            this.audio.play()
                .then(() => {
                    this.isPlaying = true;
                    this.updatePlayButton(true);
                })
                .catch(error => {
                    console.log("Autoplay prevented:", error);
                    this.updatePlayButton(false);
                });
        }
        
        pause() {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlayButton(false);
        }
        
        nextSong() {
            const nextIndex = (this.currentSongIndex + 1) % this.songs.length;
            this.loadSong(nextIndex);
            if (this.isPlaying) {
                this.play();
            }
        }
        
        prevSong() {
            const prevIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
            this.loadSong(prevIndex);
            if (this.isPlaying) {
                this.play();
            }
        }
        
        updateProgress() {
            if (this.audio.duration) {
                const progressPercent = (this.audio.currentTime / this.audio.duration) * 100;
                
                // Update progress bar
                document.querySelectorAll('.progress-bar').forEach((bar, index) => {
                    if (index === this.currentSongIndex) {
                        bar.style.width = `${progressPercent}%`;
                    } else {
                        bar.style.width = '0%';
                    }
                });
            }
        }
        
        updateSongInfo(song) {
            const titleEl = document.getElementById('currentSongTitle');
            const artistEl = document.getElementById('currentArtist');
            
            if (titleEl) titleEl.textContent = song.title;
            if (artistEl) artistEl.textContent = song.artist;
        }
        
        updateSongList(activeIndex) {
            document.querySelectorAll('.song').forEach((songEl, index) => {
                if (index === activeIndex) {
                    songEl.classList.add('active');
                } else {
                    songEl.classList.remove('active');
                }
            });
        }
        
        updatePlayButton(isPlaying) {
            const playPauseBtn = document.getElementById('playPauseBtn');
            const playButtons = document.querySelectorAll('.play-btn');
            
            if (!playPauseBtn || !playButtons) return;
            
            if (isPlaying) {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playPauseBtn.classList.add('playing');
                
                // Update button di list lagu
                playButtons.forEach((btn, index) => {
                    if (index === this.currentSongIndex) {
                        btn.innerHTML = '<i class="fas fa-pause"></i>';
                        btn.classList.add('playing');
                    } else {
                        btn.innerHTML = '<i class="fas fa-play"></i>';
                        btn.classList.remove('playing');
                    }
                });
            } else {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.classList.remove('playing');
                
                playButtons.forEach(btn => {
                    btn.innerHTML = '<i class="fas fa-play"></i>';
                    btn.classList.remove('playing');
                });
            }
        }
        
        setupControls() {
            // Play/Pause button
            const playPauseBtn = document.getElementById('playPauseBtn');
            const nextBtn = document.getElementById('nextBtn');
            const prevBtn = document.getElementById('prevBtn');
            const volumeSlider = document.getElementById('volumeSlider');
            
            if (playPauseBtn) {
                playPauseBtn.addEventListener('click', () => {
                    if (this.isPlaying) {
                        this.pause();
                    } else {
                        this.play();
                    }
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.nextSong();
                });
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    this.prevSong();
                });
            }
            
            if (volumeSlider) {
                volumeSlider.addEventListener('input', (e) => {
                    const volume = e.target.value / 100;
                    this.audio.volume = volume;
                    
                    const volumeIcon = document.querySelector('.volume-control i');
                    if (volumeIcon) {
                        if (volume === 0) {
                            volumeIcon.className = 'fas fa-volume-mute';
                        } else if (volume < 0.5) {
                            volumeIcon.className = 'fas fa-volume-down';
                        } else {
                            volumeIcon.className = 'fas fa-volume-up';
                        }
                    }
                });
            }
            
            // Song list click
            document.querySelectorAll('.song').forEach((songEl, index) => {
                songEl.setAttribute('data-index', index);
                
                const playBtn = songEl.querySelector('.play-btn');
                if (playBtn) {
                    playBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        
                        if (this.currentSongIndex === index && this.isPlaying) {
                            this.pause();
                        } else {
                            if (this.currentSongIndex !== index) {
                                this.loadSong(index);
                            }
                            this.play();
                        }
                    });
                }
                
                songEl.addEventListener('click', (e) => {
                    if (!e.target.closest('.play-btn')) {
                        if (this.currentSongIndex !== index) {
                            this.loadSong(index);
                        }
                        this.play();
                    }
                });
            });
        }
    }
    
    // Inisialisasi player musik
    const musicPlayer = new MusicPlayer();
    
    // Event untuk autoplay setelah interaksi pertama
    let hasInteracted = false;
    document.addEventListener('click', function firstInteraction() {
        if (!hasInteracted) {
            hasInteracted = true;
            console.log("First user interaction detected");
        }
    });
    
    // Inisialisasi animasi awal untuk foto
    photoFrames.forEach((frame, index) => {
        frame.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.8s ease';
        frame.style.transitionDelay = `${index * 0.1}s`;
        
        const rotation = (Math.random() * 10) - 5;
        frame.style.transform = `rotate(${rotation}deg) scale(0.8)`;
        
        frame.style.animation = `photoFloat 3s ease-in-out infinite alternate`;
        frame.style.animationDelay = `${index * 0.3}s`;
    });
    
    // Tambah efek hover untuk semua card
    const cards = document.querySelectorAll('.wish-card, .song, .glass');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!isMobile) {
                this.style.transform = this.classList.contains('glass') ? 'translateY(-5px)' : 'translateY(-8px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Untuk mobile, tambah efek tap
        if (isMobile) {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        }
    });
    
    // Inisialisasi scroll event
    updatePhotoAnimation();
    
    // Fix untuk background di mobile
    function fixMobileBackground() {
        if (isMobile) {
            // Pastikan background gradient terlihat di mobile
            const body = document.body;
            body.style.minHeight = '100vh';
            body.style.height = 'auto';
            
            // Force re-render background
            body.style.backgroundAttachment = 'fixed';
            
            console.log("Mobile background fix applied");
        }
    }
    
    // Panggil fungsi fix
    fixMobileBackground();
    
    // Event listener untuk resize
    window.addEventListener('resize', function() {
        // Refresh animasi saat resize
        updatePhotoAnimation();
    });
    
    console.log('JavaScript initialized successfully!');
});