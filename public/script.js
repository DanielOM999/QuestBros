document.addEventListener("DOMContentLoaded", function() {
    var stickyImage = document.querySelector(".sticky-image");
    var footer = document.getElementById("myFooter");
    var footerOffset = footer.offsetTop;

    function checkScroll() {
        var scrollPosition = window.scrollY || window.pageYOffset;
        var stopStickyAt = footerOffset - window.innerHeight + 160;

        if (stickyImage) { // Check if stickyImage is not null
            if (scrollPosition > stopStickyAt) {
                stickyImage.classList.remove("sticky");
            } else {
                stickyImage.classList.add("sticky");
            }
        }
    }

    // Attach the scroll event listener
    window.addEventListener("scroll", checkScroll);

    // Initial check on page load
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
    resultbox.innerHTML = "";
}

function Error() {
    const popup = document.querySelector(".errorP");
    popup.classList.add("errorPV");
}

function ErrorOf() {
    const popup = document.querySelector(".errorP");
    popup.classList.remove("errorPV");
}