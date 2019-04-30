let titleContainer = document.createElement('div');
titleContainer.id = 'titleContainer';

let titleDiv = document.createElement('div');
titleDiv.id = 'title';
titleDiv.innerHTML = document.title;
titleContainer.append(titleDiv);

let authorDiv = document.createElement('div');
authorDiv.id = 'author';
authorDiv.innerHTML = document.head.querySelector('[name~=author][content]').content;
titleContainer.append(authorDiv);

let headerDiv = document.createElement('div');
headerDiv.id = 'header';

document.body.prepend(headerDiv);
document.body.prepend(titleContainer);

window.onscroll = function() {updateStickyHeader()};

let headerStickyOffset = header.offsetTop;
function updateStickyHeader() {
    if (window.pageYOffset > headerStickyOffset) {
        header.classList.add('sticky');
        header.innerHTML = document.title;
    } else {
        header.classList.remove('sticky');
        header.innerHTML = '';
    }
}