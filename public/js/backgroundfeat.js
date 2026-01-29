const redBack = document.querySelector(".redBtn")
const yellowBack = document.querySelector(".yellowBtn")
const blueBack = document.querySelector(".blueBtn")
const originalColor = document.querySelector(".originalBtn")
const body = document.querySelector("body")
const colorArray = ["redButton", "yellowButton", "blueButton"];

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

originalColor.addEventListener("click", ()=> {
    originalColor = removeColor();
} )