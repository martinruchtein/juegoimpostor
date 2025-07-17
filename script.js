// script.js
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
let isLeader = false;

const playerNameInput = document.getElementById("playerName");
const joinBtn = document.getElementById("joinBtn");
const playersList = document.getElementById("playersList");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const roleDisplay = document.getElementById("roleDisplay");
const lobby = document.getElementById("lobby");
const gameDiv = document.getElementById("game");
const gameStatus = document.getElementById("gameStatus");

function updateControls() {
  startBtn.disabled = !isLeader || gameStarted;
  restartBtn.disabled = !isLeader;
}

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
  }).then(() => {
    checkEmptyLobby();

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
        updateControls();
        gameStatus.textContent = "";
      }
    });
  });
};

startBtn.onclick = () => {
  db.ref("game/players").once("value").then(snapshot => {
    const playersObj = snapshot.val() || {};
    const players = Object.keys(playersObj);
    if (players.length < 2) {
      alert("Se necesitan al menos 2 jugadores para iniciar.");
      return;
    }
    const roles = assignRoles(players);
    db.ref("game/roles").set(roles);
    db.ref("game/started").set(true);
  });
};

restartBtn.onclick = () => {
  if (!isLeader) return;
  db.ref("game").set({
    players: {},
    started: false,
    roles: {}
  });
  playerNameInput.disabled = false;
  joinBtn.disabled = false;
  playerNameInput.value = "";
  roleDisplay.textContent = "";
  lobby.style.display = "none";
  gameDiv.style.display = "none";
  gameStatus.textContent = "";
  isLeader = false;
  updateControls();
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

function checkEmptyLobby() {
  db.ref("game/players").once("value").then(snapshot => {
    const players = snapshot.val() || {};
    if (Object.keys(players).length === 0) {
      db.ref("game").set({
        players: {},
        started: false,
        roles: {}
      });
      isLeader = false;
      updateControls();
    } else {
      const firstPlayerId = Object.keys(players).sort((a,b) => players[a].joinedAt - players[b].joinedAt)[0];
      isLeader = (firstPlayerId === playerId);
      updateControls();
    }
  });
}

db.ref("game/players").on("value", () => {
  checkEmptyLobby();
});

window.addEventListener("beforeunload", () => {
  if (playerId) {
    db.ref("game/players/" + playerId).remove();
  }
});

// assignRoles imported from jugadores.js
function assignRoles(players) {
  const roles = {};
  const impostorIndex = Math.floor(Math.random() * players.length);
  const impostor = jugadoresFutbol[Math.floor(Math.random() * jugadoresFutbol.length)];
  players.forEach((id, i) => {
    roles[id] = i === impostorIndex ? impostor : "Jugador";
  });
  return roles;
}






