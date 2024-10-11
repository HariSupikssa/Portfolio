export function displayDialogue(text, onDisplayEnd) {
    const dialogueUI = document.getElementById("textbox_container");
    const dialogue = document.getElementById("dialog");

    dialogueUI.style.display = "block";

    let index = 0;
    let currentText = "";
    const interval = setInterval(() => {
        if (index < text.length) {
            currentText += text[index];
            dialogue.innerHTML = currentText;
            index++;
            return;

        }
        clearInterval(interval);
    }, 1)

    const closeBtn = document.getElementById("close");
    function closeBtnClick() {
        onDisplayEnd();
        dialogueUI.style.display = "none";
        dialogue.innerHTML = "";
        clearInterval(interval);
        closeBtn.removeEventListener("click", closeBtnClick);
    }
    closeBtn.addEventListener("click", closeBtnClick);
    addEventListener("keypress", (key) => {
        if (key.code === "Enter") {
            closeBtn.click();
        }
    });
}

export function setCamScale(k) {
    const resizeFac = k.width() / k.height();
    if (resizeFac < 1) {
        k.camScale(k.vec2(1));
        return;
    }
    k.camScale(k.vec2(1.5));
}