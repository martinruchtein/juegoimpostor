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

let playerName = "";
let playerId = "";
let isLeader = false;
let gameStarted = false;

const playerNameInput = document.getElementById("playerName");
const joinBtn = document.getElementById("joinBtn");
const lobby = document.getElementById("lobby");
const playersList = document.getElementById("playersList");
const startBtn = document.getElementById("startBtn");
const gameDiv = document.getElementById("game");
const gameStatus = document.getElementById("gameStatus");
const finishRoundBtn = document.getElementById("finishRoundBtn");
const scoreBoard = document.getElementById("scoreBoard");
const joinDiv = document.getElementById("joinDiv");

const topPlayers = [
  "Lionel Messi", "Cristiano Ronaldo", "Neymar Jr", "Kylian Mbappé", "Kevin De Bruyne",
  "Robert Lewandowski", "Virgil van Dijk", "Mohamed Salah", "Sadio Mané", "Luka Modrić",
  "Harry Kane", "Erling Haaland", "Sergio Ramos", "Paulo Dybala", "Karim Benzema",
  "Jan Oblak", "Alisson Becker", "Joshua Kimmich", "Son Heung-min", "Trent Alexander-Arnold",
  "Raheem Sterling", "Jadon Sancho", "Bruno Fernandes", "Toni Kroos", "Marc-André ter Stegen",
  "Pierre-Emerick Aubameyang", "Ederson", "Casemiro", "Marco Reus", "Riyad Mahrez",
  "Mason Mount", "Gerard Piqué", "Angel Di María", "Frenkie de Jong", "Thomas Müller",
  "Luis Suárez", "Hakim Ziyech", "Achraf Hakimi", "Phil Foden", "Antoine Griezmann",
  "Ciro Immobile", "David de Gea", "James Rodríguez", "Kalidou Koulibaly", "Leonardo Bonucci",
  "Ángel Correa", "Dusan Vlahović", "Rodri", "Marquinhos", "Gianluigi Donnarumma",
  "Jordi Alba", "Alexis Sánchez", "Zlatan Ibrahimović", "Christian Pulisic", "Thomas Partey",
  "N’Golo Kanté", "Yaya Touré", "Andrea Pirlo", "Xavi Hernández", "Iker Casillas",
  "David Silva", "Sergio Agüero", "Luis Figo", "Frank Lampard", "Ryan Giggs",
  "Paul Pogba", "Didier Drogba", "Thiago Silva", "John Terry", "Carles Puyol",
  "Kaka", "Bastian Schweinsteiger", "Eden Hazard", "Mesut Özil", "Wayne Rooney",
  "Mario Götze", "Gareth Bale", "Marcelo", "Sergio Busquets", "Javi Martínez",
  "Angelino", "Fabinho", "Vinícius Jr", "Rodrigo", "Mats Hummels",
  "Gerard Moreno", "Coutinho", "Alex Sandro", "Lucas Hernández", "Renato Sanches",
  "Jules Koundé", "Eduardo Camavinga", "Philippe Coutinho", "David Alaba", "Sergio Gómez",
  "Jude Bellingham", "Bukayo Saka", "Raphinha", "Kalvin Phillips", "Mikel Oyarzabal"
];

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
    score: 0
  }).then(() => {
    playerNameInput.disabled = true;
    joinBtn.disabled = true;
    joinDiv.style.display = "none";
    lobby.style.display = "block";

    playersRef.once("value").then(snapshot => {
      if (!snapshot.exists() || Object.keys(snapshot.val()).length === 1) {
        isLeader = true;
        startBtn.disabled = false;
      }
    });
  });

  playersRef.on("value", snapshot => {
    const players = snapshot.val() || {};
    playersList.innerHTML = "";
    const ids = Object.keys(players).slice(0, 100);

    ids.forEach(id => {
      const li = document.createElement("li");
      li.textContent = players[id].name + (players[id].score ? ` (Puntos: ${players[id].score})` : "");
      if (id === playerId) li.classList.add("self");
      if (id === ids[0]) li.classList.add("leader");
      playersList.appendChild(li);
    });
  });

  const gameRef = db.ref("game");
  gameRef.on("value", snapshot => {
    const gameData = snapshot.val() || {};
    gameStarted = gameData.started || false;

    if (gameStarted) {
      lobby.style.display = "none";
      gameDiv.style.display = "block";

      if (playerId === gameData.impostorId) {
        gameStatus.textContent = "Eres el IMPOSTOR. No sabes la palabra.";
      } else {
        gameStatus.textContent = `La palabra es: ${gameData.word}`;
      }
      startBtn.disabled = true;
      finishRoundBtn.style.display = "inline-block";

      updateScoreBoard(gameData.scores || {});
    } else {
      gameDiv.style.display = "none";
      if (isLeader) startBtn.disabled = false;
    }
  });
};

startBtn.onclick = () => {
  if (isLeader && !gameStarted) {
    const playersRef = db.ref("game/players");
    playersRef.once("value").then(snapshot => {
      const players = snapshot.val();
      const ids = Object.keys(players);
      if (ids.length < 4) {
        alert("Se necesitan al menos 4 jugadores para empezar.");
        return;
      }
      const impostorIndex = Math.floor(Math.random() * ids.length);
      const word = topPlayers[Math.floor(Math.random() * topPlayers.length)];

      const scores = {};
      ids.forEach(id => {
        scores[id] = players[id].score || 0;
      });

      db.ref("game").set({
        started: true,
        impostorId: ids[impostorIndex],
        word: word,
        scores: scores
      });
    });
  }
};

finishRoundBtn.onclick = () => {
  // Aquí la lógica para actualizar puntajes (ejemplo: impostor gana o pierden los jugadores)
  // Por simplicidad, aumentaremos 1 punto al impostor en cada ronda terminada

  const gameRef = db.ref("game");
  gameRef.once("value").then(snapshot => {
    const gameData = snapshot.val() || {};
    const scores = gameData.scores || {};
    if (!gameData.impostorId) return;

    scores[gameData.impostorId] = (scores[gameData.impostorId] || 0) + 1;

    db.ref("game").update({ scores });

    // Reiniciar juego para siguiente ronda
    db.ref("game").update({ started: false, impostorId: null, word: null });
  });
};

function updateScoreBoard(scores) {
  let html = "<strong>Puntajes:</strong><br/>";
  for (const [id, score] of Object.entries(scores)) {
    html += `<div>${id === playerId ? "(Tú) " : ""}Puntos: ${score}</div>`;
  }
  scoreBoard.innerHTML = html;
}

// Limpiar jugador al cerrar pestaña o recargar página
window.addEventListener("beforeunload", () => {
  if (playerId) {
    db.ref("game/players/" + playerId).remove();
  }
});
