let scrolled = false;
let formid;
let currentUser;
let currentUserPic;

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

function formatImagePath(path) {
    // Replace backslashes with forward slashes
    const normalizedPath = path.replace(/\\/g, '/');
    
    // Ensure the path starts with a forward slash
    if (!normalizedPath.startsWith('/')) {
        return '/' + normalizedPath;
    }
    return normalizedPath;
}

function displayMessages(messages, currentUser) {
    const container = document.getElementById('container');

    messages.forEach(message => {
        const div2 = document.createElement('div');
        div2.className = 'col-12 col-md-6 message';

        if (message.username === currentUser) {
            div2.classList.add('right');
        } else {
            div2.classList.add('left');
        }

        if (!message.profilePic) {
            message.profilePic = (message.username === currentUser) ? currentUserPic : "/profile.png";
        }

        const formattedProfilePic = formatImagePath(message.profilePic);
        console.log(formattedProfilePic);
        div2.style.setProperty('--profile-pic-url', `url('${formattedProfilePic}')`);

        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = message.message;

        tempContainer.childNodes.forEach(node => {
            if (node.nodeName === '#text') {
                const p2 = document.createElement('p');
                p2.innerHTML = node.textContent.replace(/[\r\n]+/gm, "<br>");
                div2.appendChild(p2);
            } else if (node.nodeName === 'IMG') {
                const img = document.createElement('img');
                img.src = node.src;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                div2.appendChild(img);
            }
        });

        container.appendChild(div2);
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .right::after, .left::after {
            content: "";
            position: absolute;
            top: -25px;
            width: 50px;
            height: 50px;
            background-size: cover;
            border-radius: 50%;
        }
        .right::after {
            right: -60px;
            background-image: var(--profile-pic-url);
        }
        .left::after {
            left: -60px;
            background-image: var(--profile-pic-url);
        }
    `;
    document.head.appendChild(style);
}

async function fetchChatMessages(formid) {
    try {
        const response = await fetch(`/form/chats/${formid}`);
        if (response.status === 404) {
            console.log("No chat data found, displaying empty chat.");
            displayMessages([], null, null);
            return;
        }
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        const messages = data.messages;
        currentUser = data.currentUser;
        currentUserPic = data.currentUserPic;
        displayMessages(messages, currentUser, currentUserPic);
    } catch (error) {
        console.error("Failed to fetch messages:", error);
    }
}

window.onload = function() {
    const pathParts = window.location.pathname.split('/');
    formid = pathParts[pathParts.length - 1];
    if (formid) {
        fetchChatMessages(formid);
    }
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

const socket = new WebSocket('ws://localhost:8082');

socket.onopen = () => {
    console.log('Connected to WebSocket server');

    // Immediately send the fixed integer `1` upon connection
    // ws.send(JSON.stringify({ formid: 1 }));

    const url = new URL(window.location.href);

    const pathname = url.pathname;

    const match = pathname.match(/^\/form\/(\d+)$/);

    if (match) {
    const number = parseInt(match[1], 10);
        if (!isNaN(number)) {
            // console.log(`Extracted number: ${number}`);
            socket.send(JSON.stringify({ chatrome: number }));
        } else {
            socket.send(JSON.stringify({ chatrome: -1 }));
        }
    } else {
        socket.send(JSON.stringify({ chatrome: -1 }));
    }
};

socket.onmessage = (event) => {
    const messages = JSON.parse(event.data);
    var div2 = document.createElement('div');
    div2.className = 'col-12 col-md-6 message';
    if (messages.username === currentUser) {
        div2.classList.add('right');
    } else {
        div2.classList.add('left');
    }

    if (!messages.profilePic) {
        messages.profilePic = (messages.username === currentUser) ? currentUserPic : "/profile.png";
    }

    const formattedProfilePic = formatImagePath(messages.profilePic);
    console.log(formattedProfilePic);
    div2.style.setProperty('--profile-pic-url', `url('${formattedProfilePic}')`);

    var tempContainer = document.createElement('div');
    tempContainer.innerHTML = messages.message;

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

    const style = document.createElement('style');
    style.innerHTML = `
        .right::after, .left::after {
            content: "";
            position: absolute;
            top: -25px;
            width: 50px;
            height: 50px;
            background-size: cover;
            border-radius: 50%;
        }
        .right::after {
            right: -60px;
            background-image: var(--profile-pic-url);
        }
        .left::after {
            left: -60px;
            background-image: var(--profile-pic-url);
        }
    `;
    document.head.appendChild(style);
} 

function sendMessage() {
    let messageContent = document.getElementById("m-in").innerHTML;
    if (messageContent.trim() !== '') {
        const message = {
            formid: formid,
            username: currentUser,
            message: messageContent
        };
        socket.send(JSON.stringify(message));

        document.getElementById("m-in").innerText = "";
    }
}

// function sendMessage() {
//     let messageContent = document.getElementById("m-in").innerHTML;

//     if (messageContent.trim() !== '') {
//         var div2 = document.createElement('div');
//         div2.className = 'col-12 col-md-6 message right';

//         var tempContainer = document.createElement('div');
//         tempContainer.innerHTML = messageContent;

//         tempContainer.childNodes.forEach(node => {
//             if (node.nodeName === '#text') {
//                 var p2 = document.createElement('p');
//                 p2.innerHTML = node.textContent.replace(/[\r\n]+/gm, "<br>");
//                 div2.appendChild(p2);
//             } else if (node.nodeName === 'IMG') {
//                 var img = document.createElement('img');
//                 img.src = node.src;
//                 img.style.maxWidth = '100%';
//                 img.style.height = 'auto';
//                 div2.appendChild(img);
//             }
//         });

//         var container = document.getElementById('container');
//         container.appendChild(div2);
//         document.getElementById("m-in").innerHTML = "";
//     }
// }

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