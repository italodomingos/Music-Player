const nomeMusica = document.getElementById("music-name")
const nomeBanda = document.getElementById("music-band")
const music = document.getElementById("audio")
const cover = document.getElementById("cover")
const playPauseButton = document.getElementById("play-button")
const backButton = document.getElementById("back-button")
const fowardButton = document.getElementById("foward-button")
const likeButton = document.getElementById("like-button")
const repeatButton = document.getElementById("repeat-button")
const currentProgressBar = document.getElementById("current-progress")
const progressContainer = document.getElementById("progress-container")
const shuffleButton = document.getElementById("shuffle-button")
const musicCurrentTime = document.getElementById("current-time")
const musicTotalTime = document.getElementById("total-time")

let isPlaying = false
let contMusicaAtual = 0
let isRepeating = false
let isShuffled = false

const adventures = {
    nome: "Adventures",
    capa: "capa-adventures",
    artista: "A Himitsu",
    like: false
}

const lights = {
    nome: "Lights",
    capa: "capa-lights",
    artista: "Sappheiros",
    like: false
}

const united = {
    nome: "United",
    capa: "capa-united",
    artista: "Elektronomia",
    like: false
}

const originalPlaylist = JSON.parse(localStorage.getItem("playlist")) ?? [adventures, lights, united]
let sortedPlaylist = [...originalPlaylist]

function playPauseMusic() {

    const icon = playPauseButton.getElementsByTagName("i")
    if (isPlaying) {
        music.pause()
        icon[0].className = "bi bi-play-circle-fill"
        isPlaying = false
    } else {
        music.play()
        icon[0].className = "bi bi-pause-circle-fill"
        isPlaying = true
    }

}

function setMusicFoward() {
    contMusicaAtual++
    if (contMusicaAtual == sortedPlaylist.length) {
        contMusicaAtual = 0
    }

    setMusicInfo()
    playPauseMusic()

}

function setMusicBack() {
    contMusicaAtual--
    if (contMusicaAtual == -1) {
        contMusicaAtual = sortedPlaylist.length - 1
    }

    setMusicInfo()
    playPauseMusic()

}

function setMusicInfo() {
    isPlaying = false
    music.src = `static/music/${sortedPlaylist[contMusicaAtual].artista} - ${sortedPlaylist[contMusicaAtual].nome}.mp3`
    nomeMusica.innerText = sortedPlaylist[contMusicaAtual].nome
    nomeBanda.innerText = sortedPlaylist[contMusicaAtual].artista
    cover.src = `static/img/${sortedPlaylist[contMusicaAtual].capa}.jpeg`

    const isMusicliked = sortedPlaylist[contMusicaAtual].like
    const icon = likeButton.getElementsByTagName("i")[0]

    if (isMusicliked) {
        icon.className = "bi bi-heart-fill active-button"
    } else {
        icon.className = "bi bi-heart"
    }
}


function likeMusic() {

    const isMusicliked = sortedPlaylist[contMusicaAtual].like
    if (isMusicliked) {
        likeButton.querySelector(".bi").className = "bi bi-heart"

        sortedPlaylist[contMusicaAtual].like = false
    } else {

        likeButton.querySelector(".bi").className = "bi bi-heart-fill active-button"
        sortedPlaylist[contMusicaAtual].like = true
    }

    localStorage.setItem("playlist", JSON.stringify(originalPlaylist))
}

function repeatMusic() {

    if (isRepeating) {
        repeatButton.style.color = "white"
        isRepeating = false
    } else {
        repeatButton.style.color = "rgb(0,183,107)"
        isRepeating = true
    }
}

function updateProgressBar() {

    if(music.currentTime !== 0){
        const barWidth = (music.currentTime / music.duration) * 100
        currentProgressBar.style.setProperty("--progress", barWidth + "%")

        musicCurrentTime.innerText = formatTime(music.currentTime)
    }
    
}

function jumpTo(event) {
    const width = progressContainer.clientWidth
    const clickPosition = event.offsetX
    const jumpToTime = (clickPosition / width) * music.duration
    music.currentTime = jumpToTime
}

function randomizePlaylist(preShuffleArray) {
    const tamanho = sortedPlaylist.length
    let currentIndex = tamanho - 1
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * tamanho)
        let aux = preShuffleArray[currentIndex]
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex]
        preShuffleArray[randomIndex] = aux
        currentIndex--
    }

}

function shuffleMusic() {

    if (isShuffled) {
        shuffleButton.style.color = "white"
        isShuffled = false
        sortedPlaylist = [...originalPlaylist]

    } else {
        shuffleButton.style.color = "rgb(0,183,107)"
        isShuffled = true
        randomizePlaylist(sortedPlaylist)
    }

}

function nextOrRepeat() {
    if (isRepeating) {
        isPlaying = false
        playPauseMusic()
    } else {
        setMusicFoward()
    }
}

function formatTime(time){
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time - minutes * 60)

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}


function updateTotalTime(){
    musicTotalTime.innerText = formatTime(music.duration)
}

playPauseButton.addEventListener("click", playPauseMusic)
//playPauseButton.addEventListener("keypress", playPauseMusic)
backButton.addEventListener("click", setMusicBack)
fowardButton.addEventListener("click", setMusicFoward)
likeButton.addEventListener("click", likeMusic)
repeatButton.addEventListener("click", repeatMusic)
music.addEventListener("timeupdate", updateProgressBar)
progressContainer.addEventListener("click", jumpTo)
shuffleButton.addEventListener("click", shuffleMusic)
//progressContainer.addEventListener("mouseup", jumpTo)
music.addEventListener("ended", nextOrRepeat)
music.addEventListener("loadedmetadata", updateTotalTime)

setMusicInfo()
