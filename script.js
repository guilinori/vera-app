

// Chat / Work Toggle

const modes = document.querySelectorAll(".mode");

modes.forEach(mode => {
    mode.addEventListener("click", () => {

        modes.forEach(item =>
            item.classList.remove("active")
        );

        mode.classList.add("active");
    });
});


// Fake Connect Buttons

const connectButtons =
document.querySelectorAll(".connect");

connectButtons.forEach(button => {

    button.addEventListener("click", () => {

        if(button.classList.contains("connected")){
            button.classList.remove("connected");
            button.textContent = "Connect";
        }
        else{
            button.classList.add("connected");
            button.textContent = "Connected";
        }

    });

});


// Start Button Demo

const startBtn =
document.querySelector(".start-btn");

startBtn.addEventListener("click", () => {

    alert(
        "Prototype only. Chat functionality is not connected yet."
    );

});

