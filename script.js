let titleContainer = document.createElement('div');
titleContainer.classList.add('titleContainer');
document.body.prepend(titleContainer);

let titleDiv = document.createElement('div');
titleDiv.classList.add('title');
titleDiv.innerHTML = document.title;
titleContainer.append(titleDiv);

let authorDiv = document.createElement('div');
authorDiv.classList.add('author');
authorDiv.innerHTML = document.head.querySelector('[name~=author][content]').content;
titleContainer.append(authorDiv);