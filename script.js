const discImage = document.getElementById("discImage");
const bunnyImage = document.getElementById("bunnyImage");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const autoButton = document.getElementById("autoButton");
const frameCounter = document.getElementById("frameCounter");
const animationStatus = document.getElementById("animationStatus");

const DISC_FRAMES = 12;
const BUNNY_FRAMES = 8;
const ANIMATION_SPEED = 120;

let discFrame = 0;
let bunnyFrame = 0;
let isAutoRotating = false;
let animationTimer = null;

const discFrames = Array.from(
    { length: DISC_FRAMES },
    (_, index) => `disc-${String(index + 1).padStart(2, "0")}.svg`
);

const bunnyFrames = Array.from(
    { length: BUNNY_FRAMES },
    (_, index) => `bunny-${String(index + 1).padStart(2, "0")}.svg`
);

// Bilder frühzeitig laden, damit beim Wechsel möglichst keine Verzögerung entsteht.
function preloadImages(sources) {
    sources.forEach((source) => {
        const image = new Image();
        image.src = source;
    });
}

preloadImages([...discFrames, ...bunnyFrames]);

function updateDisc() {
    const angle = discFrame * 30;

    discImage.src = discFrames[discFrame];
    discImage.alt = `Scheibe im Rotationszustand ${angle} Grad`;
    frameCounter.textContent = `Bild ${discFrame + 1} / ${DISC_FRAMES}`;
}

function stepDisc(direction) {
    discFrame = (discFrame + direction + DISC_FRAMES) % DISC_FRAMES;
    updateDisc();
}

function updateBunny() {
    bunnyImage.src = bunnyFrames[bunnyFrame];
    bunnyImage.alt = `Animierter Hase, Bild ${bunnyFrame + 1} von ${BUNNY_FRAMES}`;
}

function animateBunny() {
    bunnyFrame = (bunnyFrame + 1) % BUNNY_FRAMES;
    updateBunny();
}

function updateAutoButton() {
    if (isAutoRotating) {
        autoButton.innerHTML = `<span aria-hidden="true">⏸</span> Stoppen <kbd>A</kbd>`;
        animationStatus.textContent = "Automatische Rotation";
        animationStatus.classList.add("running");
        autoButton.setAttribute("aria-pressed", "true");
    } else {
        autoButton.innerHTML = `<span aria-hidden="true">▶</span> Automatisch <kbd>A</kbd>`;
        animationStatus.textContent = "Manuell";
        animationStatus.classList.remove("running");
        autoButton.setAttribute("aria-pressed", "false");
    }
}

function startAutoRotation() {
    if (isAutoRotating) return;

    isAutoRotating = true;

    animationTimer = window.setInterval(() => {
        stepDisc(1);
    }, ANIMATION_SPEED);

    updateAutoButton();
}

function stopAutoRotation() {
    isAutoRotating = false;

    if (animationTimer !== null) {
        window.clearInterval(animationTimer);
        animationTimer = null;
    }

    updateAutoButton();
}

function toggleAutoRotation() {
    if (isAutoRotating) {
        stopAutoRotation();
    } else {
        startAutoRotation();
    }
}

leftButton.addEventListener("click", () => stepDisc(-1));
rightButton.addEventListener("click", () => stepDisc(1));
autoButton.addEventListener("click", toggleAutoRotation);

document.addEventListener("keydown", (event) => {
    // Keine unerwarteten Aktionen, wenn der Nutzer gerade in einem Eingabefeld tippt.
    const tagName = event.target.tagName.toLowerCase();
    if (tagName === "input" || tagName === "textarea" || tagName === "select") {
        return;
    }

    switch (event.key.toLowerCase()) {
        case "l":
            event.preventDefault();
            stepDisc(-1);
            break;

        case "r":
            event.preventDefault();
            stepDisc(1);
            break;

        case "a":
            event.preventDefault();
            toggleAutoRotation();
            break;

        default:
            break;
    }
});

// Die Erweiterung 1 läuft unabhängig von der Scheibensteuerung.
window.setInterval(animateBunny, 180);

updateDisc();
updateBunny();
updateAutoButton();
