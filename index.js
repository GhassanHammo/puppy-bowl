
const HEADER = "https://fsa-puppy-bowl.herokuapp.com/api/2505-FTB-CT-WEB-PT";
const NAME = "Ghassan";
const API = HEADER + NAME;
let playerArr = [];
const deltePlayer = async (id) => {
  try {
    // see "Invite a new player"
    // remember methods and headers

    const response = await fetch(API + "/players/" + id, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    });

    //return json.data.newPlayer;
  } catch (err) {
    console.error(err.message);
  }
  await GetAllPlayers();
  start();
};

const getMoreInfo = async (id) => {
  try {
    const response = await fetch(API + "/players/" + id);
    const result = await response.json();
    const player = result.data.player;
    const $playerDetails = document.getElementById("player-details");
    $playerDetails.innerHTML = `
      <h2>${player.name}</h2>
      <p>Breed: ${player.breed}</p>
      <p>Status: ${player.status}</p>
      <img src="${player.imageUrl}" width="200" height="200" />
      <button id="back-btn">Back to List</button>
    `;
    const $deletbutton = document.createElement("button");
    $deletbutton.textContent = "Delet";
    $playerDetails.append($deletbutton);
    $deletbutton.addEventListener ("click", () => {
      deltePlayer(player.id)

    })

    document.getElementById("back-btn").onclick = () => {
      $playerDetails.innerHTML = ""; // Clear details
    };
  } catch (error) {
    console.error(error);
  }
};

const $app = document.querySelector("#app");
const displayResults = (players) => {
  const $playersList = document.getElementById("players-list");
  $playersList.innerHTML = ""; // Clear previous list
  for (const element of players) {
    const $div = document.createElement("div");
    const $h2 = document.createElement("h2");
    $h2.textContent = element.name;
    const $img = document.createElement("img");
    $img.src = element.imageUrl;
    $img.width = 100;
    $img.height = 100;
    const $button = document.createElement("button");
    $button.textContent = "click for more info";
    $button.addEventListener("click", () => getMoreInfo(element.id));

    $div.append($h2, $img, $button);

    $playersList.append($div);
  }
};

const GetAllPlayers = async () => {
  try {
    const response = await fetch(API + "/players");
    const data = await response.json();
    console.log(data);
    playerArr = data.players;
    displayResults(data.data.players);
  } catch (error) {
    console.error(error);
  }
};
const createPlayer = async (newPlayer) => {
  try {
    // see "Invite a new player"
    // remember methods and headers

    const response = await fetch(API + "/players", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newPlayer),
    });

    //return json.data.newPlayer;
  } catch (err) {
    console.error(err.message);
  }
  await GetAllPlayers();
  start();
};


const AddPlayer = () => {
  const $form = document.createElement("form");
  $form.innerHTML = `
    <form>
     <label>Name:</label>
     <input type="text" id="name"><br><br>
     <label>Breed:</label>
     <input type="text" id="breed"><br><br>
     <input type="submit" value="Add Player">
    </form>
    `;

  //This eventlistener adds a player to the API and then re-renders the page with the updated verison of the API
  $form.addEventListener("submit", (event) => {
    event.preventDefault();
    const newPlayer = {
      name: $form.querySelector("#name").value,
      breed: $form.querySelector("#breed").value,
    };
    createPlayer(newPlayer);
  });

  return $form;
};
const start = async () => {
  $app.innerHTML = `
    <h1>Puppy Bowl</h1>
    <main>
     <section>
      <h2>Players List</h2>
      <div id="players-list"></div>
      <div id="form-container"></div>
     </section>
     <section>
      <h2>Player Details</h2>
      <div id="player-details"></div>
     </section>
    </main>
  `;

  await GetAllPlayers();
  const $form = AddPlayer();
  document.getElementById("form-container").appendChild($form);
};
start();