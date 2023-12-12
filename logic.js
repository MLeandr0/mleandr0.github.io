var shortcuts = [
    { url: 'https://www.youtube.com/watch?v=4KxRp8jeliQ', imageSrc: 'https://icon.horse/icon/youtube.com' },
    { url: 'https://github.com/', imageSrc: 'https://icon.horse/icon/github.com' },
    { url: 'https://web.whatsapp.com/', imageSrc: 'https://icon.horse/icon/whatsapp.com' },
    { url: 'https://www.linkedin.com/', imageSrc: 'https://icon.horse/icon/linkedin.com' },
    { url: 'https://music.youtube.com/', imageSrc: 'https://icon.horse/icon/music.youtube.com' }
];

const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];

const daysNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday'
];


var shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];

function saveShortcutsToLocalStorage() {
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
}

function loadShortcutsFromLocalStorage() {
    shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];
}

function openForm(link, event) {
    var commonParent = event.target.parentElement.parentElement.parentElement;

    var siblings = Array.from(commonParent.children);

    var index = siblings.indexOf(event.target.parentElement.parentElement); 

    fetch('popup.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('popupContainer').innerHTML = data;
            document.getElementById('linkInput').value = link;
            document.getElementById('popupForm').setAttribute('data-index', index);
            document.getElementById("popupForm").style.display = "block";
            document.getElementById("overlay").style.display = "block";
        });

        event.preventDefault();
}

function getIcon(link) {
    const regex = /^https?:\/\/(www\.)?([^\/]+)\//;
    const match = link.match(regex);

    return match ? match[2] : link;
}

function updateIcon(shortcutElement, newLink) {
    var imageShortcut = shortcutElement.querySelector('.image-shortcut');
    if (imageShortcut) {
        imageShortcut.src = "https://icon.horse/icon/" + getIcon(newLink);
    }

    return imageShortcut.src;
}

function editLink() {
    var index = document.getElementById('popupForm').getAttribute('data-index');
    
    var newLink = document.getElementById('linkInput').value;

    var shortcutBox = document.querySelector('.shortcut-box');
    var shortcutToUpdate = shortcutBox.querySelector(`a:nth-child(${parseInt(index) + 1})`);
    
    if (shortcutToUpdate) {
        shortcutToUpdate.href = newLink;
        var newImageSrc = updateIcon(shortcutToUpdate, newLink);

        shortcuts[index] = {
            link: newLink,
            imageSrc: newImageSrc,
        };

        saveShortcutsToLocalStorage();
    }

    closeForm();
}


function deleteLink() {
    var index = parseInt(document.getElementById('popupForm').getAttribute('data-index'));

    if (!isNaN(index)) {
        shortcuts.splice(index, 1);

        var shortcutBox = document.querySelector('.shortcut-box');
        var shortcutToDelete = shortcutBox.querySelector(`a:nth-child(${index + 1})`);

        if (shortcutToDelete) {
            shortcutBox.removeChild(shortcutToDelete);
        } else {
            console.error("Element to delete not found");
        }

        closeForm();
    } else {
        console.error("Invalid index");
    }
}

function closeForm() {
   document.getElementById("popupForm").style.display = "none";
   document.getElementById("overlay").style.display = "none";
}

function formatTime(time) {
    if (time < 10) return "0" + time;
    return time;
}

function updateCurrentDate() {
    const currentDate = new Date();
    const currentDateTime = daysNames[currentDate.getDay()] + " - " + monthNames[currentDate.getMonth()];
    document.getElementById("currentDate").innerHTML = currentDateTime;
}

function updateCurrentTime() {
    var time = Date.now();
    var date = new Date(time);
    var currentTime = formatTime(date.getHours()) + ":" + formatTime(date.getMinutes());
    document.getElementById("currentTime").innerHTML = currentTime;
}

loadShortcutsFromLocalStorage();
updateCurrentDate();
updateCurrentTime();
setInterval(updateCurrentTime, 1000);