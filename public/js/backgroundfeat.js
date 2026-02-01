const redBack = document.querySelector(".redBtn")
const yellowBack = document.querySelector(".yellowBtn")
const blueBack = document.querySelector(".blueBtn")
const blackButton = document.querySelector(".blackBtn")
const originalColor = document.querySelector(".originalBtn")
const body = document.querySelector("body")
const colorArray = ["redButton", "yellowButton", "blueButton","blackButton"];

const removeColor = () => {
    body.classList.remove(...colorArray); }

redBack.addEventListener("click", () => {
        removeColor()
        body.classList.add("redButton")
})

yellowBack.addEventListener("click", () => {
        removeColor()
        body.classList.add("yellowButton")
})

blueBack.addEventListener("click", () => {
        removeColor()
        body.classList.add("blueButton");
})

originalColor.addEventListener("click", () => {
    originalColor = removeColor();
} )

blackButton.addEventListener("click", () => {
        removeColor();
        body.classList.add("blackButton", "h1-white")
})

