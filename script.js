// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCG5GrA3XwItRzc2z3DPWRYvoSy8S04-xk",
  authDomain: "juego-impostor.firebaseapp.com",
  databaseURL: "https://juego-impostor-default-rtdb.firebaseio.com",
  projectId: "juego-impostor",
  storageBucket: "juego-impostor.appspot.com",
  messagingSenderId: "171848088727",
  appId: "1:171848088727:web:54c9a21163582794ecbdd2"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// VARS
let playerId = "";
let playerName = "";
let isLeader = false;
let gameStarted = false;

// UI
const playerInput = document.getElementById("playerName");
const joinBtn = document.getElementById("joinBtn");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const playersList = document.getElementById("playersList");
const lobby = document.getElementById("lobby");
const game = document.getElementById("game");
const roleDisplay = document.getElementById("roleDisplay");
const gameStatus = document.getElementById("gameStatus");

// JOIN
joinBtn.onclick = () => {
  playerName = playerInput.value.trim();
  if (!playerName) return alert("Nombre requerido");

  playerId = Date.now().toString();
  db.ref("game/players/" + playerId).set({
    name: playerName,
    joinedAt: firebase.database.ServerValue.TIMESTAMP
  });

  playerInput.disabled = true;
  joinBtn.disabled = true;
  lobby.style.display = "block";

  db.ref("game/players").on("value", snap => {
    const data = snap.val() || {};
    playersList.innerHTML = "";
    Object.values(data).forEach(p => {
      const li = document.createElement("li");
      li.textContent = p.name;
      playersList.appendChild(li);
    });

    const sorted = Object.entries(data).sort((a, b) => a[1].joinedAt - b[1].joinedAt);
    if (sorted.length > 0 && sorted[0][0] === playerId) {
      isLeader = true;
      startBtn.disabled = false;
      restartBtn.disabled = false;
    } else {
      isLeader = false;
      startBtn.disabled = true;
      restartBtn.disabled = true;
    }

    if (sorted.length === 0) resetGame();
  });

  db.ref("game/started").on("value", s => {
    gameStarted = !!s.val();
    if (gameStarted) {
      lobby.style.display = "none";
      game.style.display = "block";
    } else {
      game.style.display = "none";
    }
  });

  db.ref("game/roles/" + playerId).on("value", s => {
    const role = s.val();
    if (role) {
      roleDisplay.textContent = "Palabra: " + role;
    } else {
      roleDisplay.textContent = "Esperando rol...";
    }
  });
};

// START
startBtn.onclick = () => {
  db.ref("game/players").once("value").then(snap => {
    const players = Object.keys(snap.val() || {});
    if (players.length < 2) return alert("Mínimo 2 jugadores");

    const palabra = jugadoresFutbol[Math.floor(Math.random() * jugadoresFutbol.length)];
    const impostorId = players[Math.floor(Math.random() * players.length)];
    const roles = {};
    players.forEach(id => {
      roles[id] = id === impostorId ? "Impostor" : palabra;
    });

    db.ref("game/roles").set(roles);
    db.ref("game/started").set(true);
  });
};

// RESET
restartBtn.onclick = () => {
  if (!isLeader) return;
  resetGame();
};

function resetGame() {
  db.ref("game").set({ started: false });
}

// AUTO QUIT
window.addEventListener("beforeunload", () => {
  if (playerId) db.ref("game/players/" + playerId).remove();
});







