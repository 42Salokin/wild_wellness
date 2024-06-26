let APIKey = "7d3bff7bd1mshf07209b4c87620fp1a8bf8jsne5b3b63b54ea";

let bodyPart = [];
const queryURL = `https://exercisedb.p.rapidapi.com/exercises/bodyPartList?appid=${APIKey}`;

// fetches list of body parts from API -N
function getAPI () {
    fetch(queryURL, {
        method: 'GET',
        headers: {
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        "X-RapidAPI-Key": APIKey,
        }
    })    
        .then(function (response) {
            return response.json();
        })
        .then(function (bodyPart) {
            // for each body part, creates option in dropdown menu -N
                for (const part of bodyPart){
                    let ddlList = document.querySelector("#dropdown1");
                    let option = document.createElement("li");
                    let aEl = document.createElement("a");
                    aEl.setAttribute("href","#!");
                    aEl.textContent = part;
                    option.appendChild(aEl);
                    ddlList.appendChild(option)
                }
        });
}

// Makes the dropdown menu appear when cursor hovers over 'exercise' -N
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems, {
        hover: true,
        coverTrigger: false,        
    });
  });

// Returns the option clicked in the dropdown menu and calls the new fetch function -N
document.addEventListener('DOMContentLoaded', () => {
    const ddl = document.querySelector("#dropdown1");
    ddl.addEventListener('click', (event) => {
        let selectedBodyPart = event.target.textContent;
        fetchExercises(selectedBodyPart);
    });
});

// Fetches exercises based on the selected body part -N
function fetchExercises(selectedBodyPart) {
    const exerciseURL = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${selectedBodyPart}?limit=200&appid=${APIKey}`;
    fetch(exerciseURL, {
        method: 'GET',
        headers: {
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
            "X-RapidAPI-Key": APIKey,
        }
    })
    .then(response => response.json())
    // Keeps randomly choosing exercises until it finds one listing equipment of "body weight" -N
    .then(data => {
        let exercise = data[Math.floor(Math.random()*data.length)];
        while (exercise.equipment !== "body weight"){
            exercise = data[Math.floor(Math.random()*data.length)];
        }

        exerCard(exercise);
    });
}

// Fills card with info from the API fetch and appends to the page -N
function exerCard(exercise) {
    let exCard = document.querySelector("#ex-card");
    empty(exCard);
    let gif = document.createElement("img");
    gif.classList.add("card-image", "ex-img");
    let name = document.createElement("div");
    name.classList.add("card-title");
    let target = document.createElement("div");
    target.classList.add("card-content","target-part");
    let instructions = document.createElement("div");
    instructions.classList.add("card-content","ex-instructions");
    let favEx = document.createElement("i");
    favEx.classList.add("small", "material-icons");

    favEx.textContent = "star";
    name.textContent = exercise.name;
    target.textContent = exercise.target;
    instructions.textContent = exercise.instructions;
    gif.src = exercise.gifUrl;

    exCard.appendChild(gif);
    name.appendChild(favEx);
    exCard.appendChild(name);
    exCard.appendChild(target);
    exCard.appendChild(instructions);

    instructions.scrollIntoView({behavior: "smooth"});

    // Makes the favorite button turn yellow when clicked, 
    // and calls the function to store that exercise -N
    favEx.addEventListener('click', () => {
        favEx.classList.add("faveEx");
        storeFaveEx(exercise);
    })

}

// Removes all the child elements in the card, 
// run right before putting in the new content -N
function empty(element) {
    while(element.firstElementChild) {
        element.firstElementChild.remove();
    }
}

// Sends favorite exercise to local storage -N
function storeFaveEx (exercise) {
    let exerciseArray = JSON.parse(localStorage.getItem('exerciseArray')) || [];
    exerciseArray.push(exercise);
    localStorage.setItem('exerciseArray', JSON.stringify(exerciseArray));
}

getAPI();




