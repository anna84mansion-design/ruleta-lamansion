const sonidoGiro = new Audio("sonidos/giro.mp3");
const sonidoGanar = new Audio("sonidos/ganador.mp3");

const canvas = document.getElementById("ruleta");
const ctx = canvas.getContext("2d");

const boton = document.getElementById("girar");
const resultado = document.getElementById("resultado");

const premios = [
    "🍺 Pacenita",
    "🧢 Gorra",
    "🔑 Llavero",
    "⏰ Hora Gratis",
    "💰 20% OFF",
    "🍷 Copa Sangría",
    "🍫 Chocolate",
    "❤️ Lubricante",
    "🍀 Sigue Participando",
    "🎁 Premio Sorpresa"
];

const colores = [
    "#E53935",
    "#FB8C00",
    "#FDD835",
    "#43A047",
    "#00ACC1",
    "#3949AB",
    "#8E24AA",
    "#D81B60",
    "#6D4C41",
    "#546E7A"
];

let angulo = 0;
let girando = false;

function dibujarRuleta() {

    const total = premios.length;
    const arco = (Math.PI * 2) / total;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < total; i++) {

        ctx.beginPath();
        ctx.moveTo(350, 350);

        ctx.fillStyle = colores[i];

      ctx.arc(
    350,
    350,
    300,
    i * arco,
    (i + 1) * arco
);

        ctx.fill();

        ctx.save();

        ctx.translate(350,350);
        ctx.rotate(i * arco + arco / 2);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";

        ctx.shadowColor = "#000";
        ctx.shadowBlur = 4;

        ctx.fillText(
            premios[i],
            220,
            0
        );

        ctx.restore();
    }

    ctx.beginPath();
    ctx.fillStyle = "#111";
    ctx.arc(350,350,60,0,Math.PI*2);
    ctx.fill();

    const logo = new Image();

    logo.src = "imagen/logo.png";

    logo.onload = function(){

        ctx.save();

        ctx.beginPath();
        ctx.arc(350,350,55,0,Math.PI*2);
        ctx.clip();

        ctx.drawImage(
            logo,
            295,
            295,
            110,
            110
        );

        ctx.restore();

    };

}

dibujarRuleta();

boton.onclick = () => {
    if (girando) return;

    girando = true;

    resultado.innerHTML = "";

    sonidoGiro.currentTime = 0;
    sonidoGiro.play();

    const gradosPorSector = 360 / premios.length;

const sectorFinal = Math.floor(Math.random() * premios.length);

// Centro del sector ganador
const anguloSector = sectorFinal * gradosPorSector + gradosPorSector / 2;

// La flecha está a las 12 (270° respecto al inicio del canvas)
angulo += 360 * 6 + (270 - anguloSector);

canvas.style.transition = "6s cubic-bezier(.17,.67,.12,.99)";
canvas.style.transform = `rotate(${angulo}deg)`;


    setTimeout(() => {

        sonidoGiro.pause();
        sonidoGiro.currentTime = 0;

        sonidoGanar.currentTime = 0;
        sonidoGanar.play();

        const codigo =
            "LM-" +
            Math.random().toString(36).substring(2,7).toUpperCase();

        resultado.style.animation = "none";
        resultado.offsetHeight;
        resultado.style.animation = "zoom .6s ease";

        resultado.innerHTML = `
            <h2>🎉 ¡Felicidades!</h2>

            <h1>${premios[sectorFinal]}</h1>

            <p style="font-size:24px;color:#FFD700;">
                Código:
                <b>${codigo}</b>
            </p>

            <button id="enviar">
                📲 Enviar por WhatsApp
            </button>
        `;

        if (typeof confetti === "function") {
            confetti({
                particleCount: 180,
                spread: 120,
                origin: { y: 0.6 }
            });
        }

        document.getElementById("enviar").onclick = () => {

            const mensaje =
`Hola, gané ${premios[sectorFinal]} en la Ruleta VIP de La Mansión.

Código: ${codigo}`;

            window.open(
                `https://wa.me/59174041087?text=${encodeURIComponent(mensaje)}`,
                "_blank"
            );

        };

        girando = false;

    }, 6200);

};