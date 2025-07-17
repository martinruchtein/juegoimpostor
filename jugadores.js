// players.js

const players = [
  "Pelé",
  "Diego Maradona",
  "Johan Cruyff",
  "Franz Beckenbauer",
  "Alfredo Di Stéfano",
  "Ferenc Puskás",
  "Lev Yashin",
  "George Best",
  "Bobby Charlton",
  "Eusébio",
  "Michel Platini",
  "Gerd Müller",
  "Paolo Maldini",
  "Roberto Baggio",
  "Ronaldinho",
  "Lionel Messi",
  "Cristiano Ronaldo",
  "Neymar Jr.",
  "Kylian Mbappé",
  "Vinícius Jr.",
  "Phil Foden",
  "Pedri",
  "Jude Bellingham",
  "Erling Haaland",
  "Raphinha",
  "Lamine Yamal",
  "Rodrygo",
  "Karim Benzema",
  "Kevin De Bruyne",
  "Luka Modrić",
  "Mohamed Salah",
  "Harry Kane",
  "Robert Lewandowski",
  "Sadio Mané",
  "Jadon Sancho",
  "Frenkie de Jong",
  "Bruno Fernandes",
  "Mason Mount",
  "Kai Havertz",
  "Gabriel Jesus",
  "Alexis Mac Allister",
  "Richarlison",
  "Philippe Coutinho",
  "Casemiro",
  "Riyad Mahrez",
  "Andrés Iniesta",
  "Xavi Hernández",
  "Sergio Ramos",
  "Eden Hazard",
  "Thierry Henry",
  "Didier Drogba",
  "David Beckham",
  "Wayne Rooney",
  "Manuel Neuer",
  "Gianluigi Buffon",
  "Paulo Dybala",
  "Ángel Di María",
  "Raúl González",
  "Zlatan Ibrahimović",
  "James Rodríguez",
  "Carlos Tevez",
  "Javier Zanetti",
  "Frank Lampard",
  "Steven Gerrard",
  "Clarence Seedorf",
  "Juan Román Riquelme",
  "Fernando Hierro",
  "Michael Laudrup",
  "Peter Schmeichel",
  "Toni Kroos",
  "Paul Pogba",
  "Mats Hummels",
  "Lucas Hernández",
  "David Silva",
  "Thiago Alcántara"
];

function assignRoles(playerIds) {
  const roles = {};
  // shuffle players array to assign footballer names randomly
  const shuffledPlayers = players.sort(() => 0.5 - Math.random());

  // choose random impostor among players
  const impostorIndex = Math.floor(Math.random() * playerIds.length);

  playerIds.forEach((id, i) => {
    if (i === impostorIndex) {
      roles[id] = "Impostor";
    } else {
      // assign football player name cycling through shuffledPlayers
      roles[id] = shuffledPlayers[i % shuffledPlayers.length];
    }
  });

  return roles;
}



