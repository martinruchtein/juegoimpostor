const firebaseConfig = {
  apiKey: "AIzaSyCG5GrA3XwItRzc2z3DPWRYvoSy8S04-xk",
  authDomain: "juego-impostor.firebaseapp.com",
  databaseURL: "https://juego-impostor-default-rtdb.firebaseio.com",
  projectId: "juego-impostor",
  storageBucket: "juego-impostor.firebasestorage.app",
  messagingSenderId: "171848088727",
  appId: "1:171848088727:web:54c9a21163582794ecbdd2",
  measurementId: "G-B1EY96KZEN"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let playerId = "";
let playerName = "";
let gameStarted = false;

const playerNameInput = document.getElementById("playerName");
const joinBtn = document.getElementById("joinBtn");
const playersList = document.getElementById("playersList");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const roleDisplay = document.getElementById("roleDisplay");
const lobby = document.getElementById("lobby");
const gameDiv = document.getElementById("game");
const gameStatus = document.getElementById("gameStatus");

joinBtn.onclick = () => {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("Ingresá un nombre válido");
    return;
  }

  playerId = Date.now().toString();

  db.ref("game/players/" + playerId).set({
    name: playerName,
    joinedAt: firebase.database.ServerValue.TIMESTAMP
  });

  playerNameInput.disabled = true;
  joinBtn.disabled = true;

  lobby.style.display = "block";

  updatePlayersList();

  db.ref("game/started").on("value", snapshot => {
    gameStarted = snapshot.val();
    if (gameStarted) {
      lobby.style.display = "none";
      gameDiv.style.display = "block";
      gameStatus.textContent = "El juego ha comenzado";
      startBtn.disabled = true;
      listenRoles();
    } else {
      lobby.style.display = "block";
      gameDiv.style.display = "none";
      roleDisplay.textContent = "";
      startBtn.disabled = false;
    }
  });
};

startBtn.onclick = () => {
  db.ref("game/players").once("value").then(snapshot => {
    const playersObj = snapshot.val() || {};
    const players = Object.keys(playersObj);
    if (players.length < 4) {
      alert("Se necesitan al menos 4 jugadores para iniciar.");
      return;
    }
    const roles = assignRoles(players); // Función de jugadores.js
    // Guardar roles en Firebase
    db.ref("game/roles").set(roles);
    db.ref("game/started").set(true);
  });
};

restartBtn.onclick = () => {
  db.ref("game/players").remove();
  db.ref("game/roles").remove();
  db.ref("game/started").set(false);

  playerNameInput.disabled = false;
  joinBtn.disabled = false;
  playerNameInput.value = "";
  roleDisplay.textContent = "";
  lobby.style.display = "none";
  gameDiv.style.display = "none";
  startBtn.disabled = true;
  gameStatus.textContent = "";
};

function updatePlayersList() {
  db.ref("game/players").on("value", snapshot => {
    const players = snapshot.val() || {};
    playersList.innerHTML = "";
    Object.values(players).forEach(player => {
      const li = document.createElement("li");
      li.textContent = player.name;
      playersList.appendChild(li);
    });
  });
}

function listenRoles() {
  db.ref("game/roles/" + playerId).on("value", snapshot => {
    const role = snapshot.val();
    roleDisplay.textContent = role ? `La palabra es: ${role}` : "Esperando rol...";
  });
}

// Limpiar jugador al salir
window.addEventListener("beforeunload", () => {
  if (playerId) {
    db.ref("game/players/" + playerId).remove();
  }
});




