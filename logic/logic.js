var shortcuts = [
    { url: 'https://www.youtube.com/', imageSrc: 'https://twenty-icons.com/youtube.com/64' },
    { url: 'https://github.com/', imageSrc: 'https://twenty-icons.com/github.com/64' },
    { url: 'https://web.whatsapp.com/', imageSrc: 'https://twenty-icons.com/web.whatsapp.com/64' },
    { url: 'https://www.linkedin.com/', imageSrc: 'https://twenty-icons.com/www.linkedin.com/64' },
    { url: 'https://music.youtube.com/', imageSrc: 'https://twenty-icons.com/music.youtube.com/64' }
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

function saveShortcutsToLocalStorage() {

    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
    console.log('Shortcuts saved to localStorage:', shortcuts);
}

function loadShortcutsFromLocalStorage() {

    const storedShortcuts = JSON.parse(localStorage.getItem('shortcuts'));

    if (storedShortcuts === null || storedShortcuts === undefined) {
        saveShortcutsToLocalStorage()

    } else {
        shortcuts = storedShortcuts;
    }

    var shortcutBox = document.querySelector('.shortcut-box');
    shortcutBox.innerHTML = '';

    createShortcutContainers(shortcutBox);

    if(shortcuts.length < 5) {
        createExtraAddshortcutContainer(shortcutBox)
    }

}

function createShortcutContainers(container) {

    shortcuts.forEach(function (shortcut) {
        var shortcutContainer = document.createElement('a');
        shortcutContainer.href = shortcut.url;
        shortcutContainer.classList.add('shortcut-box-container');

        var iconOverlayButton = document.createElement('button');
        iconOverlayButton.classList.add('icon-overlay');
        iconOverlayButton.setAttribute('onclick', 'editForm("' + shortcut.url + '", event)');

        var iconImage = document.createElement('img');
        iconImage.src = '/style/icons/more.webp';

        var imageShortcut = document.createElement('img');
        imageShortcut.classList.add('image-shortcut');
        imageShortcut.src = shortcut.imageSrc;
        imageShortcut.alt = 'Example Image';
        

        iconOverlayButton.appendChild(iconImage);
        shortcutContainer.appendChild(iconOverlayButton);
        shortcutContainer.appendChild(imageShortcut);
        container.appendChild(shortcutContainer);
    });
}

function createExtraAddshortcutContainer(container) {

    var shortcutContainer = document.createElement('a');
    shortcutContainer.href = 'teste';
    shortcutContainer.classList.add('shortcut-box-container');

    var plusIconButton = document.createElement('button');
    plusIconButton.classList.add('plus-icon');
    plusIconButton.setAttribute('onclick', 'addForm("' + '' + '", event)');

    var iconImage = document.createElement('img');
    iconImage.src = '/style/icons/plus.webp';

    var imageShortcut = document.createElement('img');
    imageShortcut.classList.add('image-addShortcut');
    imageShortcut.alt = 'Example Image';

    plusIconButton.appendChild(iconImage);
    shortcutContainer.appendChild(plusIconButton);
    shortcutContainer.appendChild(imageShortcut);
    container.appendChild(shortcutContainer);
}

function addForm(link, event) {

    var commonParent = event.target.parentElement.parentElement.parentElement;

    var siblings = Array.from(commonParent.children);

    var index = siblings.indexOf(event.target.parentElement.parentElement); 

    fetch('../style/components/addPopup.html')
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

function editForm(link, event) {

    var commonParent = event.target.parentElement.parentElement.parentElement;

    var siblings = Array.from(commonParent.children);

    var index = siblings.indexOf(event.target.parentElement.parentElement); 

    fetch('../style/components/popup.html')
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

function getIconLink(link) {

    const regex = /^https?:\/\/(www\.)?([^\/]+)\//;
    const match = link.match(regex);

    return match ? match[2] : link;
}

function updateIcon(shortcutElement, newLink) {

    var imageShortcut = shortcutElement.querySelector('.image-shortcut');
    
    if (!imageShortcut) {
        imageShortcut = shortcutElement.querySelector('.image-addShortcut');
    }

    if (imageShortcut) {
        imageShortcut.src = "https://twenty-icons.com/" + getIconLink(newLink) + "/64";
    }

    return imageShortcut.src;
}

function editLink() {

    var index = parseInt(document.getElementById('popupForm').getAttribute('data-index'));
    
    var newLink = document.getElementById('linkInput').value;

    var shortcutBox = document.querySelector('.shortcut-box');
    var shortcutToUpdate = shortcutBox.querySelector(`.shortcut-box-container:nth-child(${index + 1})`);
    
    if (shortcutToUpdate) {
        shortcutToUpdate.href = newLink;
        var newImageSrc = updateIcon(shortcutToUpdate, newLink);

        shortcuts[index] = {
            url: newLink,
            imageSrc: newImageSrc,
        };

        location.reload();
        saveShortcutsToLocalStorage();
    }

    closeForm();
}

function deleteLink() {

    var index = parseInt(document.getElementById('popupForm').getAttribute('data-index'));

    if (!isNaN(index) && index >= 0 && index < shortcuts.length) {
        shortcuts.splice(index, 1);

        var shortcutBox = document.querySelector('.shortcut-box');
        var shortcutToDelete = shortcutBox.querySelector(`.shortcut-box-container:nth-child(${index + 1})`);

        if (shortcutToDelete) {
            shortcutBox.removeChild(shortcutToDelete);
            saveShortcutsToLocalStorage();
        } else {
            console.error("Element to delete not found in the DOM");
        }

        closeForm();
        location.reload();
    } else {
        console.error("Invalid index or index out of bounds");
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
    let currentDateYear = currentDate.getFullYear();
    const currentDateTime = daysNames[currentDate.getDay()] + " - " + monthNames[currentDate.getMonth()] + " - " + currentDateYear.toString().slice(2);
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
