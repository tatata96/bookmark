const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');//h1
const modalClose = document.getElementById('close-modal');//x -icon
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const websiteColorEl = document.getElementById('website-color');
const bookmarksContainer = document.getElementById('bookmarks-container');
const toggleSwitch = document.querySelector('input[type="checkbox"]');
const toggleIcon = document.getElementById('toggle-icon');


var bookmarksDOM = document.getElementsByClassName('item');

let bookmarks = [];

//show modal, focus on inupt
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

//modal event listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
//modal containerın etrafında bir yere tıklanıncada kapanması için//event listener for whole window
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));


//validate form
function validate(nameValue, urlValue) {
    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

    var regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit values for both fields');
        return false;
    }

    if (!urlValue.match(regex)) {
        alert("PROVIDE A VALID WEB ADDRESS");
        return false;
    }
    return true;

}
//build bookmarks DOM
function builddBookmarks() {
    //remove all bookmark elements
    bookmarksContainer.textContent = '';//reset container
    //build items
    bookmarks.forEach((bookmark) => {
        const { name, url, color } = bookmark;//destructuring
        //item
        const item = document.createElement('div');
        item.classList.add('item');
        item.setAttribute('color', color);



        //close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times', 'closeIcon');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        //faviocon / link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        //favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', 'https://s2.googleusercontent.com/s2/favicons?domain=' + url);
        favicon.setAttribute('alt', 'Favicon');
        //link
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        //append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);

    });


    //fix background colors of items
    for (var i = 0; i < bookmarksDOM.length; i++) {

        console.log(bookmarksDOM[i]);
        var backgroundcol = bookmarksDOM[i].getAttribute('color');
        bookmarksDOM[i].setAttribute("style", "background-color:" + backgroundcol);

    }


}

//fetch bookmarks from localstorage
function fetchBookmarks() {

    //get bookmarks if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));//convert back to js object from JSON   
    }
    else {
        bookmarks = [
            {
                name: 'DESIGN',
                url: 'https://www.google.com',
                color: '#ffff'
            }
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

        console.log(bookmarks);
    }
    builddBookmarks();
}

function deleteBookmark(url) {
    //console.log(url);
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);//remove item in index i 

        }
    });

    //update bookmarks array in localstorage, repopulate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();

}

//handle date from form
function storeBookmark(e) {
    console.log(e);
    e.preventDefault();//prevent submitting the form to a web server , we will catch it in js instead
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('http://', 'https://')) {
        urlValue = 'https://' + urlValue;
    }
    const colorValue = websiteColorEl.value;
    //console.log(nameValue, urlValue, colorValue);
    if (!validate(nameValue, urlValue)) {
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
        color: colorValue

    }

    bookmarks.push(bookmark);
    console.log(bookmarks);
    //save to localstorage, save as JSON
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();


}

//form events
bookmarkForm.addEventListener('submit', storeBookmark);

//on load , fetch bookmarks
fetchBookmarks();

//fix background colors of items
for (var i = 0; i < bookmarksDOM.length; i++) {

    console.log(bookmarksDOM[i]);
    var backgroundcol = bookmarksDOM[i].getAttribute('color');
    bookmarksDOM[i].setAttribute("style", "background-color:" + backgroundcol);

}


//changing theme ///////////////////////////////////////
function switchTheme(event) {
    console.log(event);
    if (event.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        toggleDarkLightMode(true);
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');

        toggleDarkLightMode(false);
    }
}


toggleSwitch.addEventListener('change', switchTheme);

function toggleDarkLightMode(isDark) {

    toggleIcon.children[0].textContent = isDark ? 'Dark Mode' : 'Light Mode';
    isDark ? toggleIcon.children[1].classList.replace('fa-sun', 'fa-moon') : toggleIcon.children[1].classList.replace('fa-moon', 'fa-sun');

}
//check local storage for theme
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
        toggleDarkLightMode(true);
    }


}