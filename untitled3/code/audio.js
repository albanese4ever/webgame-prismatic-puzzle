document.addEventListener('DOMContentLoaded', function () {
    let music = document.querySelector('audio[src="../audio/music.mp3"]');
    if (!music) return;

    let storedVolume = localStorage.getItem('musicVolume');
    let lastMusicVolume = storedVolume !== null ? parseFloat(storedVolume) : 0.2;
    music.volume = lastMusicVolume;
    let musicSlider = document.getElementById('musicVolume');
    let musicMuteBtn = document.getElementById('musicMute');

    if (musicSlider && musicMuteBtn) {
        musicSlider.value = music.volume;

        musicSlider.addEventListener('input', function (e) {
            let v = parseFloat(e.target.value);
            music.volume = v;
            lastMusicVolume = v;
            localStorage.setItem('musicVolume', v);
            musicMuteBtn.textContent = v === 0 ? '🔇' : '🔊';
        });

        musicMuteBtn.addEventListener('click', function () {
            if (music.volume > 0) {
                lastMusicVolume = music.volume;
                music.volume = 0;
                musicSlider.value = 0;
                localStorage.setItem('musicVolume', 0);
                musicMuteBtn.textContent = '🔇';
            } else {
                music.volume = lastMusicVolume;
                musicSlider.value = lastMusicVolume;
                localStorage.setItem('musicVolume', lastMusicVolume);
                musicMuteBtn.textContent = '🔊';
            }
        });
    }
});
