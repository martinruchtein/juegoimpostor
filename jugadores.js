// Lista de 75 jugadores de fútbol
const futbolPlayers = [
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
  "Mario Götze", "Gareth Bale", "Marcelo", "Sergio Busquets", "Javi Martínez"
];

// Función para asignar roles: 1 impostor, resto jugadores con mismo nombre de futbolista
function assignRoles(players) {
  if (players.length < 4) {
    throw new Error("Se necesitan al menos 4 jugadores para jugar");
  }
  const roles = {};
  // Elegir impostor aleatorio
  const impostorIndex = Math.floor(Math.random() * players.length);

  // Elegir nombre futbolístico para los demás
  const futbolName = futbolPlayers[Math.floor(Math.random() * futbolPlayers.length)];

  players.forEach((playerId, index) => {
    if (index === impostorIndex) {
      roles[playerId] = "Impostor";
    } else {
      roles[playerId] = futbolName;
    }
  });
  return roles;
}

