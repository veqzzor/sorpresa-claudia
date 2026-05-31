// Contraseña configurada con tu fecha especial: 06/06/2007 (DDMMAA)
const TARGET_CODE = "060607"; 
let inputCode = "";

function pressKey(num) {
    if (inputCode.length < 6) {
        inputCode += num;
        updateDots();
    }
    
    if (inputCode.length === 6) {
        setTimeout(verifyCode, 350);
    }
}

function clearCode() {
    if (inputCode.length > 0) {
        inputCode = inputCode.slice(0, -1);
        updateDots();
    }
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index < inputCode.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

function verifyCode() {
    if (inputCode === TARGET_CODE) {
        // 1. Mostrar pantalla de fecha con chispas
        changeScene('scene-login', 'scene-date-reveal');
        createSparks();

        // 2. Pasar a la barra de carga tras ver la fecha
        setTimeout(() => {
            changeScene('scene-date-reveal', 'scene-loading');
            
            // 3. Progreso de la barra de carga
            const progressFill = document.querySelector('.progress-fill');
            let width = 0;
            const interval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(interval);
                    // 4. Tras cargar, ir al sobre interactivo
                    setTimeout(() => {
                        changeScene('scene-loading', 'scene-envelope');
                    }, 400);
                } else {
                    width += 2;
                    progressFill.style.width = width + '%';
                }
            }, 50);

        }, 3200);

    } else {
        alert("Código incorrecto... Prueba con nuestra fecha más especial. ❤️");
        inputCode = "";
        updateDots();
    }
}

function openEnvelope() {
    const wrapper = document.querySelector('.envelope-wrapper');
    if (!wrapper.classList.contains('open')) {
        wrapper.classList.add('open');
        
        setTimeout(() => {
            changeScene('scene-envelope', 'scene-cake');
            startCakeTimer(); 
        }, 1500);
    }
}

// Lógica del temporizador de la tarta, apagón global y mensajes esparcidos
function startCakeTimer() {
    let timeLeft = 10; 
    const countdownEl = document.getElementById('countdown');
    
    // Aplicamos la oscuridad progresiva al BODY entero para cubrir el 100% de la pantalla
    setTimeout(() => {
        document.body.classList.add('lights-darkness');
    }, 100);

    const mensajes = [
        "Te quiero miniña ❤️",
        "Te mereces el mundo entero ✨",
        "Eres mi lugar seguro vayas donde vayas 🤍",
        "Feliz cumpleaños mivida 🎂",
        "Gracias por hacerme tan feliz 🌹",
        "A por mil años más juntos 🔗",
        "Eres lo más valioso de mi vida 🥰",
        "Pide un deseo... 🤫"
    ];

    // Lanzar textos flotantes repartidos limpiamente cada 650ms
    const msgInterval = setInterval(() => {
        const randomText = mensajes[Math.floor(Math.random() * mensajes.length)];
        createFloatingMessage(randomText);
    }, 650);

    const timer = setInterval(() => {
        timeLeft--;
        countdownEl.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            clearInterval(msgInterval); 
            
            // Apagar las velas de la tarta
            document.querySelector('.candles').classList.add('extinguished');
            
            // Quitamos la oscuridad del body para regresar al tono suave original en la carta
            setTimeout(() => {
                document.body.classList.remove('lights-darkness');
                changeScene('scene-cake', 'scene-reveal');
            }, 1000);
        }
    }, 1000);
}

// FUNCIÓN MATEMÁTICAMENTE COMPENSADA: Usa píxeles reales para bloquear los bordes de la pantalla
function createFloatingMessage(text) {
    const container = document.getElementById('love-messages');
    if(!container) return;

    const msgEl = document.createElement('div');
    msgEl.classList.add('floating-msg');
    msgEl.innerText = text;

    // 1. Obtenemos el ancho total de la pantalla en píxeles de forma exacta
    const windowWidth = window.innerWidth;
    
    // 2. Establecemos márgenes de seguridad en píxeles para que no toquen las esquinas
    const margin = 40; 
    const estimatedMsgWidth = 220; // Ancho promedio con padding de la burbuja
    
    // 3. El rango máximo seguro en el que puede nacer el texto
    const maxSafePos = windowWidth - estimatedMsgWidth - margin;

    // 4. Generamos una posición en píxeles dentro del rango seguro
    let leftPx = margin + Math.random() * (maxSafePos - margin);
    
    // 5. Calculamos el centro de la pantalla para evitar que tape la tarta
    const center = windowWidth / 2;
    const cakeAvoidArea = 180; // Zona de exclusión alrededor de la tarta

    if (leftPx > (center - cakeAvoidArea) && leftPx < (center + cakeAvoidArea)) {
        // Si cae en la tarta, lo empujamos hacia los extremos seguros de la pantalla
        leftPx = leftPx > center ? leftPx + cakeAvoidArea : leftPx - cakeAvoidArea;
    }

    // 6. Volvemos a blindar que tras el empujón no se salga de los márgenes absolutos de la pantalla
    if (leftPx < margin) leftPx = margin;
    if (leftPx > maxSafePos) leftPx = maxSafePos;

    const duration = 6 + Math.random() * 4; 

    // Aplicamos la posición directamente en píxeles en lugar de usar porcentajes inestables
    msgEl.style.left = `${leftPx}px`;
    msgEl.style.transform = 'none'; // Desactivamos el translate para controlar el pixelaje exacto
    msgEl.style.setProperty('--msg-duration', `${duration}s`); 

    container.appendChild(msgEl);

    setTimeout(() => {
        msgEl.remove();
    }, duration * 1000);
}

// Función de cambio de escena optimizada para un fundido súper suave y progresivo
function changeScene(currentId, nextId) {
    const currentScene = document.getElementById(currentId);
    const nextScene = document.getElementById(nextId);
    
    currentScene.style.opacity = '0';
    currentScene.style.transform = 'scale(0.96)';
    
    setTimeout(() => {
        currentScene.classList.remove('active');
        
        nextScene.classList.add('active');
        nextScene.style.opacity = '0';
        nextScene.style.transform = 'scale(0.97)';
        
        setTimeout(() => {
            nextScene.style.opacity = '1';
            nextScene.style.transform = 'scale(1)';
        }, 80); 
    }, 750); 
}

function createSparks() {
    const container = document.getElementById('particles');
    container.innerHTML = ''; 
    const numberOfParticles = 50; 
    
    for (let i = 0; i < numberOfParticles; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        const top = 45 + Math.random() * 10; 
        const left = 45 + Math.random() * 10;
        
        const moveX = (Math.random() - 0.5) * 400 + 'px'; 
        const moveY = (Math.random() - 0.5) * 400 + 'px';
        const duration = 1.5 + Math.random() * 2 + 's';      
        const size = 3 + Math.random() * 5 + 'px';         
        const scale = 0.3 + Math.random() * 1.5;
        
        sparkle.style.top = top + '%';
        sparkle.style.left = left + '%';
        sparkle.style.width = size;
        sparkle.style.height = size;
        
        sparkle.style.setProperty('--x', moveX);
        sparkle.style.setProperty('--y', moveY);
        sparkle.style.setProperty('--d', duration);
        sparkle.style.setProperty('--s', scale);
        
        container.appendChild(sparkle);
    }
}