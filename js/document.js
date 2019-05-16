const documentObject = {
    createAndApply() {
        const sideLayoutContainer = document.createElement('div');
        sideLayoutContainer.id = 'sideLayoutContainer';
        sideLayoutContainer.append(headerObject.create());
        sideLayoutContainer.append(tableOfContentsObject.create());
        sideLayoutContainer.append(infoPanel.create());
        document.body.prepend(sideLayoutContainer);
        document.body.prepend(titleObject.create());
    }
}

const titleObject = {
    create() {
        const titleContainer = document.createElement('div');
        titleContainer.id = 'titleContainer';
        const titleDiv = document.createElement('div');
        titleDiv.id = 'title';
        titleDiv.innerHTML = document.title;
        titleContainer.append(titleDiv);
        const authorDiv = document.createElement('div');
        authorDiv.id = 'author';
        authorDiv.innerHTML = document.head.querySelector('[name~=author][content]').content;
        titleContainer.append(authorDiv);
        return titleContainer;
    }
}

const headerObject = {
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
            toc.style.visibility = 'visible';
            info.style.visibility = 'visible';
        } else {
            header.classList.remove('sticky');
            header.innerHTML = '';
            toc.style.visibility = 'hidden';
            info.style.visibility = 'hidden';
        }
    }
}

const tableOfContentsObject = {
    create() {
        const tocDiv = document.createElement('div');
        tocDiv.id = 'toc';
        tocDiv.innerHTML = '<h1>Table of Contents</h1>';
        let hList = document.createElement('ul');
        const rootHList = hList;
        let previousLevel = 1;
        var counter = 0;
        document.querySelectorAll('h1, h2, h3').forEach(sectionHeader => {
            const level = Number(sectionHeader.tagName.substr(1));
            if (level > previousLevel) {
                subHList = document.createElement('ul');
                hList.appendChild(subHList);
                hList = subHList;
                previousLevel = level;
            } else if (level < previousLevel) {
                hList = hList.parentElement;
                previousLevel = level;
            }
            sectionHeader.id = `toc${counter}`;
            const li = document.createElement('li');
            li.innerHTML = `<a href="#toc${counter}">${sectionHeader.innerHTML}</a>`;
            hList.appendChild(li);
            counter++;
        });
        tocDiv.appendChild(rootHList);
        return tocDiv;
    }
}

const infoPanel = {
    create() {
        const infoPanelDiv = document.createElement('div');
        infoPanelDiv.id = 'info';
        return infoPanelDiv;
    }
}

const tableReferenceManager = {
    updateTableReferences() {
        let tableCount = 0;
        const tableLabelIndexMap = {};
        document.querySelectorAll('table').forEach(table => {
            const caption = table.querySelector('caption');
            if (caption) {
                tableCount++;
                const label = table.getAttribute('data-label');
                caption.innerHTML = `<a id="${label}"></a><b>Table ${tableCount}:</b> ${caption.innerHTML}`;
                tableLabelIndexMap[label] = tableCount;
            }
        });
        document.querySelectorAll('ref').forEach(ref => {
            const index = tableLabelIndexMap[ref.innerHTML];
            if (index) {
                ref.innerHTML = `<a href="#${ref.innerHTML}">Table&nbsp;${index}</a>`;
            }
        });
    }
}
