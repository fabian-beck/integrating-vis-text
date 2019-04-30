let titleObject = {
    create() {
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
        return titleContainer;
    }
}

let headerObject = {
    stickyOffset: 0,
    create() {
        let headerDiv = document.createElement('div');
        headerDiv.id = 'header';
        return headerDiv;
    },
    /* needs to be called only after the whole layout has been established */
    initStickyHeader() {
        this.stickyOffset = header.offsetTop;
        window.onscroll = function () { headerObject.updateStickyHeader() };
    },
    updateStickyHeader() {
        if (window.pageYOffset > this.stickyOffset) {
            header.classList.add('sticky');
            header.innerHTML = document.title;
        } else {
            header.classList.remove('sticky');
            header.innerHTML = '';
        }
    }
}

document.body.prepend(headerObject.create());
document.body.prepend(titleObject.create());
headerObject.initStickyHeader();