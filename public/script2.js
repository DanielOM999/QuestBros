let scrolled = false;

let messages = ["Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam, illum.", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit quas nemo fugit ea, quod eum. Tempora iste suscipit, dolore praesentium hic, fugiat in autem ducimus quae doloremque aliquam eum a fuga sunt natus, atque accusantium placeat assumenda dicta nostrum quia mollitia. Aperiam numquam assumenda reprehenderit, eos consequatur aliquam eligendi itaque dolore est sunt in? Amet fuga voluptate minus voluptas quis repellendus praesentium odio, facere dolorum odit ab consequuntur sit accusantium non ipsa hic quia ullam accusamus fugit numquam aut reiciendis? Natus amet repellendus, nisi aut vel impedit architecto perferendis quibusdam soluta numquam ad inventore voluptas rerum laboriosam quis. Fugiat, fugit!", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, velit! Ipsum quidem quia quod, dicta tempore exercitationem facilis minus doloribus.", "Lorem, ipsum dolor sit amet"];

let addItemsB = document.getElementById("addItemsB");
let uploadButton = document.getElementById("uploadButton");
let emojiSelector = document.getElementById("emojis");
let emojisButton = document.getElementById("emojisButton");
let emojilistElement = document.getElementById("emojilistElement");
let emojiSearch = document.getElementById("emojiSearch");

uploadButton.addEventListener("click", () => {
    addItemsB.classList.toggle("active");
    emojiSelector.classList.remove("active");
});

emojisButton.addEventListener("click", () => {
    emojiSelector.classList.toggle("active");
    addItemsB.classList.remove("active");
});

document.addEventListener("click", (event) => {
    if (!emojiSelector.contains(event.target) && !emojisButton.contains(event.target)) {
        emojiSelector.classList.remove("active");
    }
    if (!addItemsB.contains(event.target) && !uploadButton.contains(event.target)) {
        addItemsB.classList.remove("active");
    }
});

fetch('https://emoji-api.com/emojis?access_key=be16787e6a26767ce0463992e34fdd343858f632')
    .then(res => res.json())
    .then(data => loadEmoji(data))

function loadEmoji(data) {
    data.forEach(emoji => {
        let li = document.createElement("li");
        li.setAttribute("emoji-name", emoji.slug);
        li.textContent = emoji.character;

        li.addEventListener("click", () => {
            let chatIn = document.getElementById("m-in");
            chatIn.append(li.textContent);
            emojiSelector.classList.toggle("active");
        });

        emojilistElement.appendChild(li)
    });
}

emojiSearch.addEventListener("keyup", e => {
    let value = e.target.value.toLowerCase();
    let emojis = document.querySelectorAll(".emojilist li");
    emojis.forEach(emoji => {
        if (emoji.getAttribute("emoji-name").toLowerCase().includes(value)) {
            emoji.style.display = "flex";
        } else {
            emoji.style.display = "none";
        }
    });
});

window.onload = function() {
    $('html, body').animate({
        scrollTop: $(".chat-input").offset().top
        }, 0);
};

window.onscroll = function(e) {
    if (this.oldScroll > this.scrollY) {
        scrolled = true;
    }
    if (window.pageYOffset + window.innerHeight >= document.body.scrollHeight) {
        scrolled = false;
    }
    this.oldScroll = this.scrollY;
}

let contentTarget = document.getElementById("m-in");

function inTextReplacer(e, value, replace, replacer) {
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    let cursorPosition = range.startOffset;

    let newValue = value.replace(replace, replacer);
    e.target.innerText = newValue;

    let newCursorPosition = cursorPosition + (replacer.length - replace.length);
    
    contentTarget.focus();
    let newRange = document.createRange();
    newRange.setStart(contentTarget.childNodes[0], newCursorPosition);
    newRange.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(newRange);
}

contentTarget.addEventListener("keyup", e => {
    let value = e.target.innerText.toString();
    if (value.includes(":)")) {
        inTextReplacer(e, value, ":)", "🙂");
    }
    if (value.includes(":D")) {
        inTextReplacer(e, value, ":D", "😁");
    }
    if (value.includes(":(")) {
        inTextReplacer(e, value, ":(", "😞");
    }
    if (value.includes(":o")) {
        inTextReplacer(e, value, ":o", "😯");
    }
    if (value.includes(":O")) {
        inTextReplacer(e, value, ":O", "😮");
    }
    if (value.includes(":C")) {
        inTextReplacer(e, value, ":C", "😠");
    }
    if (value.includes(":|")) {
        inTextReplacer(e, value, ":|", "😐");
    }
});

contentTarget.addEventListener('paste', (e) => {
    e.preventDefault();

    let items = (e.clipboardData || e.originalEvent.clipboardData).items;

    let text = e.clipboardData.getData('text/plain');
    if (text) {
        document.execCommand('insertText', false, text);
        return;
    }

    for (let item of items) {
        if (item.type.indexOf('image') !== -1) {
            let blob = item.getAsFile();
            let reader = new FileReader();
            reader.onload = (event) => {
                let img = new Image();
                img.src = event.target.result;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                
                let selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    let range = selection.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(img);
                } else {
                    contentTarget.appendChild(img);
                }
            };
            reader.readAsDataURL(blob);
        }
    }
});

const isWhitespaceString = str => !str.replace(/\s/g, '').length

function sendMessage() {
    let messageContent = document.getElementById("m-in").innerHTML;

    if (messageContent.trim() !== '') {
        var div2 = document.createElement('div');
        div2.className = 'col-12 col-md-6 message right';

        var tempContainer = document.createElement('div');
        tempContainer.innerHTML = messageContent;

        tempContainer.childNodes.forEach(node => {
            if (node.nodeName === '#text') {
                var p2 = document.createElement('p');
                p2.innerHTML = node.textContent.replace(/[\r\n]+/gm, "<br>");
                div2.appendChild(p2);
            } else if (node.nodeName === 'IMG') {
                var img = document.createElement('img');
                img.src = node.src;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                div2.appendChild(img);
            }
        });

        var container = document.getElementById('container');
        container.appendChild(div2);
        document.getElementById("m-in").innerHTML = "";
    }
}

document.getElementById('videoInput').addEventListener('change', function() {
    const file = this.files[0];
    if (file && file.size <= 5242880) {
        var div = document.createElement('div');
        div.className = 'col-12 col-md-6 message right';
        div.textContent = `File: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        
        var container = document.getElementById('container');
        container.appendChild(div);
        
        document.getElementById("addItemsB").classList.remove("active");
    } else {
        alert("File is too large");
        document.getElementById("addItemsB").classList.remove("active");
    }
});

document.getElementById("m-in").addEventListener("keypress", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

function createMyElementL() {
    var div1 = document.createElement('div');
    div1.className = 'col-12 col-md-6 message left';
    var p1 = document.createElement('p');
    p1.textContent = messages[Math.floor(Math.random() * (messages.length - 1)) + 1];
    div1.appendChild(p1);

    var container = document.getElementById('container');
    container.appendChild(div1);
}

setInterval(function scrollInterval() {
    if (!scrolled) {
        $('html, body').animate({
            scrollTop: $(".divider").offset().top
        }, 0);
    } else {
        clearInterval(scrollInterval);
        console.log("Try Break!")
    }
}, 100);

// setInterval(function() {
//     createMyElementL();
// }, 5000);

jQuery(function($){
    $("[contenteditable]").focusout(function(){
        var element = $(this);        
        if (!element.text().trim().length) {
            element.empty();
        }
    });
});