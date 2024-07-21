let currentPage = 1;
let allFormsLoaded = false;
var searched = false;
const pageSize = 4;
const formsContainer = document.getElementById('formsContainer');
const loadingIndicator = document.getElementById('loadingIndicator');

document.addEventListener("DOMContentLoaded", function() {
    var stickyImage = document.querySelector(".sticky-image");
    var footer = document.getElementById("myFooter");
    if (footer) {
        var footerOffset = footer.offsetTop;
    }else {
        var footerOffset = 0;
    }

    function checkScroll() {
        var scrollPosition = window.scrollY || window.pageYOffset;
        var stopStickyAt = footerOffset - window.innerHeight + 160;

        if (stickyImage) {
            if (scrollPosition > stopStickyAt) {
                stickyImage.classList.remove("sticky");
            } else {
                stickyImage.classList.add("sticky");
            }
        }
    }

    window.addEventListener("scroll", checkScroll);

    checkScroll();
});

let availebileKeywords = [
    "paranormal",
    "ghost hunting",
    "haunted places",
    "spirit communication",
    "EVP (Electronic Voice Phenomenon)",
    "ghost sightings",
    "supernatural phenomena",
    "poltergeist activity",
    "demonic possession",
    "psychic phenomena",
    "ghost stories",
    "apparitions",
    "ghost tours",
    "Ouija board",
    "seances",
    "mediumship",
    "investigating ghosts",
    "spirit orbs",
    "exorcism",
    "ghost documentaries",
    "paranormal investigation techniques",
    "haunted houses",
    "urban legends",
    "cryptids",
    "alien encounters",
    "UFO sightings",
    "abandoned places",
    "mysterious disappearances",
    "conspiracy theories",
    "occult practices",
    "witchcraft",
    "dowsing",
    "energy cleansing",
    "ghost hunting equipment",
    "night vision cameras",
    "EMF meters",
    "thermal imaging cameras",
    "spirit boxes",
    "infrared thermometers",
    "motion sensors",
    "ghost hunting apps",
    "paranormal forums",
    "ghost hunting groups",
    "ghost hunting tips",
    "paranormal events",
    "ghost hunting TV shows",
    "paranormal podcasts",
    "haunted objects",
    "cursed items",
    "legend tripping",
    "parapsychology",
    "spiritualism",
    "ectoplasm",
    "ghost hunting gear reviews",
    "ghost photography",
    "séance experiences",
    "haunted dolls",
    "experiences with the unknown",
    "mysteries of the universe"
];

const resultbox = document.querySelector(".result-box");
const inputbox = document.getElementById("input-box");

document.addEventListener("DOMContentLoaded", function() {
    if (inputbox) {
        inputbox.onkeyup = function(){
            let result = [];
            let input = inputbox.value;
            if(input.length){
                result = availebileKeywords.filter((keyword)=>{
                    return keyword.toLowerCase().includes(input.toLowerCase());
                });
                console.log(result)
            }
            displayTerms(result);
    
            if(!result.length){
                resultbox.innerHTML = "";

                formsContainer.innerHTML = '';
                searched = false;
                currentPage = 1;
                allFormsLoaded = false;
            }
        }
    }
});

function search() {
    if(inputbox.value){
        resultbox.innerHTML = "";
        inputbox.blur();
        searched = true;
        showData(inputbox.value);
    }
}

if (inputbox) {
    inputbox.addEventListener("keydown", function(event) {
        // Check if the pressed key is Enter (key code 13)
        if (event.key === "Enter") {
            event.preventDefault();
            search()
        }
    });
}

function writePopUp(swi) {
    const wrP = document.getElementById("wrP");
    const wrP2 = document.getElementById("wrP2");
    if(swi == 0){
        wrP2.classList.remove("write-popup2");
        wrP.classList.add("write-popup2");
    } else if (swi == 1) {
        wrP.classList.remove("write-popup2");
    } else if (swi == 2) {
        wrP.classList.remove("write-popup2");
        wrP2.classList.add("write-popup2");
    } else {
        wrP2.classList.remove("write-popup2");
    }
}

function displayTerms(result){
    const content = result.map((list)=>{
        return "<li onclick=selectInput(this)>" + list + "</li>";
    });

    resultbox.innerHTML = "<ul>" + content.join("") + "</ul>";
}

function selectInput(list){
    inputbox.value = list.innerHTML;
    search()
}

function Error() {
    const popup = document.querySelector(".errorP");
    popup.classList.add("errorPV");
}

function ErrorOf() {
    const popup = document.querySelector(".errorP");
    popup.classList.remove("errorPV");
}

if (/\/req\?failed/.test(window.location.href)) {
    Error()
    var newUrl = window.location.href.replace(/(\?|\&)failed=[^&]+/, '');
    window.history.replaceState({}, document.title, newUrl);
}

if (/\/users\?failed/.test(window.location.href)) {
    Error()
    var newUrl = window.location.href.replace(/(\?|\&)failed=[^&]+/, '');
    window.history.replaceState({}, document.title, newUrl);
}

let profilePic = document.getElementById("profile-pic");
let inputFile = document.getElementById("input-file");

if (inputFile) {
    inputFile.onchange = function() {
        profilePic.src = URL.createObjectURL(inputFile.files[0]);
    }
}

function showData(page) {
    if(!searched) {
        fetch(`/form/forms?page=${page}&size=${pageSize}`)
        .then(response => response.json())
        .then(data => {
            const formsContainer = document.getElementById('formsContainer');
            if (data.length < pageSize) {
                allFormsLoaded = true;
            }
    
            data.forEach(form => {
                const formItem = document.createElement('div');
                formItem.className = 'col-12 formItem';
    
                const formBtn = document.createElement('div');
                formBtn.className = 'formbtn';
                formBtn.setAttribute('onclick', `window.location='/form/${form.id}'`);
    
                const formBtnSide = document.createElement('div');
                formBtnSide.className = 'formbtn-side';
    
                const h1 = document.createElement('h1');
                h1.textContent = form.name;
    
                const h2 = document.createElement('h2');
                h2.textContent = form.email;
    
                const p = document.createElement('p');
                p.textContent = form.description;
    
                formBtnSide.appendChild(h1);
                formBtnSide.appendChild(h2);
                formBtnSide.appendChild(p);
    
                const formBtText = document.createElement('div');
                formBtText.className = 'formbtText';
    
                const h1Form = document.createElement('h1');
                h1Form.textContent = form.formName;
    
                const pForm = document.createElement('p');
                pForm.textContent = form.formDesc;
    
                const h2Tags = document.createElement('h2');
                h2Tags.textContent = form.tags;
    
                const img = document.createElement('img');
                img.className = 'LOGOFORM';
                if (form.profilePic) {
                    img.src = form.profilePic;
                } else {
                    img.src = "/profile.png";
                }
                img.alt = 'LOGO';
    
                formBtText.appendChild(h1Form);
                formBtText.appendChild(pForm);
                formBtText.appendChild(h2Tags);
                formBtText.appendChild(img);
    
                formBtn.appendChild(formBtnSide);
                formBtn.appendChild(formBtText);
    
                formItem.appendChild(formBtn);
    
                formsContainer.appendChild(formItem);
            });
    
            loadingIndicator.style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching forms:', error);
            loadingIndicator.style.display = 'none';
        });
    } else {
        formsContainer.innerHTML = '';
        loadingIndicator.style.display = 'block';
        fetch(`/form/forms?size=${20}&search=${page}`)
        .then(response => response.json())
        .then(data => {
            const formsContainer = document.getElementById('formsContainer');
            if (data.length < pageSize) {
                allFormsLoaded = true;
            }
    
            data.forEach(form => {
                const formItem = document.createElement('div');
                formItem.className = 'col-12 formItem';
    
                const formBtn = document.createElement('div');
                formBtn.className = 'formbtn';
                formBtn.setAttribute('onclick', `window.location='/form/${form.id}'`);
    
                const formBtnSide = document.createElement('div');
                formBtnSide.className = 'formbtn-side';
    
                const h1 = document.createElement('h1');
                h1.textContent = form.name;
    
                const h2 = document.createElement('h2');
                h2.textContent = form.email;
    
                const p = document.createElement('p');
                p.textContent = form.description;
    
                formBtnSide.appendChild(h1);
                formBtnSide.appendChild(h2);
                formBtnSide.appendChild(p);
    
                const formBtText = document.createElement('div');
                formBtText.className = 'formbtText';
    
                const h1Form = document.createElement('h1');
                h1Form.textContent = form.formName;
    
                const pForm = document.createElement('p');
                pForm.textContent = form.formDesc;
    
                const h2Tags = document.createElement('h2');
                h2Tags.textContent = form.tags;
    
                const img = document.createElement('img');
                img.className = 'LOGOFORM';
                if (form.profilePic) {
                    img.src = form.profilePic;
                } else {
                    img.src = "/profile.png";
                }
                img.alt = 'LOGO';
    
                formBtText.appendChild(h1Form);
                formBtText.appendChild(pForm);
                formBtText.appendChild(h2Tags);
                formBtText.appendChild(img);
    
                formBtn.appendChild(formBtnSide);
                formBtn.appendChild(formBtText);
    
                formItem.appendChild(formBtn);
    
                formsContainer.appendChild(formItem);
            });
    
            loadingIndicator.style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching forms:', error);
            loadingIndicator.style.display = 'none';
        });
    }
}

function loadMoreForms() {
    if (!allFormsLoaded && loadingIndicator && !searched) {
        loadingIndicator.style.display = 'block';
        showData(currentPage);
        currentPage++;
    }
}

window.onload = function() {
    loadMoreForms();
};

window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1) {
        loadMoreForms();
    }
});