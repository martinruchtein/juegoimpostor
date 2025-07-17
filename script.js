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

let playerName = "";
let playerId = "";
let isLeader = false;

const playerNameInput = document.getElementById("playerName");
const joinBtn = document.getElementById("joinBtn");
const lobby = document.getElementById("lobby");
const playersList = document.getElementById("playersList");
const startRoundBtn = document.getElementById("startRoundBtn");
const gameDiv = document.getElementById("game");
const roleDisplay = document.getElementById("roleDisplay");
const endRoundBtn = document.getElementById("endRoundBtn");

joinBtn.onclick = () => {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("Ingresá un nombre válido");
    return;
  }
  playerId = Date.now().toString();

  const playersRef = db.ref("game/players");
  playersRef.child(playerId).set({
    name: playerName,
    joinedAt: firebase.database.ServerValue.TIMESTAMP,
  });

  playerNameInput.disabled = true;
  joinBtn.disabled = true;
  lobby.style.display = "block";

  playersRef.once("value").then(snapshot => {
    if (!snapshot.exists() || Object.keys(snapshot.val()).length === 1) {
      isLeader = true;
      startRoundBtn.disabled = false;
    }
  });

  playersRef.on("value", snapshot => {
    const players = snapshot.val() || {};
    playersList.innerHTML = "";
    const ids = Object.keys(players);

    ids.forEach(id => {
      const li = document.createElement("li");
      li.textContent = players[id].name;
      if (id === playerId) li.classList.add("self");
      playersList.appendChild(li);
    });

    if (isLeader) {
      startRoundBtn.disabled = ids.length < 2; // mínimo 2 jugadores para iniciar
    }
  });

  // Escuchar rol asignado
  const rolesRef = db.ref("game/roles/" + playerId);
  rolesRef.on("value", snapshot => {
    const role = snapshot.val();
    if (role) {
      lobby.style.display = "none";
      gameDiv.style.display = "block";
      roleDisplay.textContent = role === "impostor" ? "Eres el IMPOSTOR" : "Eres un JUGADOR";
      startRoundBtn.disabled = true;
    } else {
      gameDiv.style.display = "none";
      lobby.style.display = "block";
      roleDisplay.textContent = "";
      if (isLeader) startRoundBtn.disabled = false;
    }
  });
};

startRoundBtn.onclick = () => {
  if (!isLeader) return;

  const playersRef = db.ref("game/players");
  playersRef.once("value").then(snapshot => {
    const players = snapshot.val() || {};
    const ids = Object.keys(players);
    if (ids.length < 2) {
      alert("Se necesitan al menos 2 jugadores para iniciar la ronda.");
      return;
    }

    // Elegir impostor aleatorio
    const impostorId = ids[Math.floor(Math.random() * ids.length)];

    // Asignar roles en Firebase
    const roles = {};
    ids.forEach(id => {
      roles[id] = id === impostorId ? "impostor" : "player";
    });
    db.ref("game/roles").set(roles);
  });
};

endRoundBtn.onclick = () => {
  if (!isLeader) return;

  // Limpiar roles y mostrar lobby
  db.ref("game/roles").remove();
};
  
window.addEventListener("beforeunload", () => {
  if (playerId) {
    db.ref("game/players/" + playerId).remove();
    db.ref("game/roles/" + playerId).remove();
  }
});

