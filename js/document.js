class MyDocument {

    constructor() {
        this.sectionHierarchy = new SectionHierarchy();
        const sideLayoutContainer = document.createElement('div');
        sideLayoutContainer.id = 'sideLayoutContainer';
        this.headerPanel = new HeaderPanel();
        const headerDiv = this.headerPanel.toHtml();
        sideLayoutContainer.append(headerDiv);
        sideLayoutContainer.append(this.sectionHierarchy.toTableOfContents());
        this.infoPanel = new InfoPanel();
        sideLayoutContainer.append(this.infoPanel.toHtml());
        headerDiv.appendChild(this.infoPanel.createHeader());
        document.body.prepend(sideLayoutContainer);
        document.body.prepend(new Title().toHtml());

        this.updateTableReferences();
        bibManager.createListOfReferences();
        bibManager.updateCitations();

        this.headerPanel.initStickyHeader();
    }

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

class Title {

    constructor() {
        this.titleContainer = document.createElement('div');
        this.titleContainer.id = 'titleContainer';
        const titleDiv = document.createElement('div');
        titleDiv.id = 'title';
        titleDiv.innerHTML = document.title;
        this.titleContainer.append(titleDiv);
        const descriptionDiv = document.createElement('div');
        descriptionDiv.id = 'documentDescription';
        descriptionDiv.innerHTML = document.head.querySelector('[name~=description][content]').content;
        this.titleContainer.appendChild(descriptionDiv);
        const authorDiv = document.createElement('div');
        authorDiv.id = 'author';
        authorDiv.innerHTML = document.head.querySelector('[name~=author][content]').content;
        this.titleContainer.append(authorDiv);
    }

    toHtml() {
        return this.titleContainer;
    }

}

class HeaderPanel {

    toHtml() {
        const headerDiv = document.createElement('div');
        headerDiv.id = 'header';
        headerDiv.innerHTML = '<div id="headerTitle"></div>';
        return headerDiv;
    }

    /* needs to be called only after the whole layout has been established */
    initStickyHeader() {
        this.stickyOffset = header.offsetTop;
        window.onscroll = function () {
            myDocument.headerPanel.updateStickyHeader();
        };
    }

    updateStickyHeader() {
        if (window.pageYOffset > this.stickyOffset) {
            header.classList.add('sticky');
            main.classList.add('sticky');
            headerTitle.innerHTML = document.title;
            infoHeader.classList.add('sticky');
            toc.style.visibility = 'visible';
            info.style.visibility = 'visible';
        } else {
            header.classList.remove('sticky');
            main.classList.remove('sticky');
            headerTitle.innerHTML = '';
            infoHeader.classList.remove('sticky');
            toc.style.visibility = 'hidden';
            info.style.visibility = 'hidden';
        }
    }

}

class InfoPanel {

    toHtml() {
        const infoPanelDiv = document.createElement('div');
        infoPanelDiv.id = 'info';
        return infoPanelDiv;
    }

    createHeader() {
        const infoHeaderDiv = document.createElement('div');
        infoHeaderDiv.id = 'infoHeader';
        const infoHeaderTitleDiv = document.createElement('div');
        infoHeaderTitleDiv.id = 'infoTitle';
        infoHeaderDiv.appendChild(infoHeaderTitleDiv);
        const infoCloseButtonDiv = document.createElement('div');
        infoCloseButtonDiv.id = 'infoCloseButton';
        infoCloseButtonDiv.classList.add('button');
        infoCloseButtonDiv.innerHTML = '<i class="fas fa-window-close"></i>';
        infoCloseButtonDiv.addEventListener('click', function () {
            info.style.display = 'none';
            infoHeaderDiv.style.display = 'none';
        });
        infoHeaderDiv.appendChild(infoCloseButtonDiv);
        return infoHeaderDiv;
    }

    open(title, contentDiv) {
        infoTitle.innerHTML = title;
        info.innerHTML = '';
        info.appendChild(contentDiv);
        info.style.display = 'block';
        infoHeader.style.display = 'block';
    }

}

class SectionHierarchy {

    constructor() {
        let currentSection = new Section('', 'root');
        this.rootSection = currentSection;
        let previousLevel = 0;
        let indexCounter = 1;
        document.querySelectorAll('h1, h2, h3').forEach(sectionHeader => {
            const level = Number(sectionHeader.tagName.substr(1));
            let parentSection = currentSection.parentSection;
            if (level > previousLevel) {
                indexCounter = 1;
                parentSection = currentSection;
                previousLevel = level;
            } else if (level < previousLevel) {
                indexCounter = currentSection.parentSection.index + 1;
                parentSection = currentSection.parentSection.parentSection;
                previousLevel = level;
            }
            currentSection = new Section(indexCounter, sectionHeader.innerHTML, parentSection);
            sectionHeader.id = `toc${currentSection.indexPath}`;
            sectionHeader.innerHTML = `${currentSection.toString()}`;
            indexCounter++;
        });
    }

    toTableOfContents() {
        const tocDiv = document.createElement('div');
        tocDiv.id = 'toc';
        tocDiv.appendChild(this.rootSection.toTableOfContents());
        return tocDiv;
    }

}

class Section {

    constructor(index, title, parentSection) {
        this.title = title;
        this.index = index;
        this.indexPath = (parentSection && parentSection.index ? `${parentSection.index}.` : '') + String(index);
        this.level = parentSection ? parentSection.level + 1 : 0;
        this.parentSection = parentSection;
        this.childSections = [];
        if (parentSection) {
            parentSection.childSections.push(this);
        }
    }

    toTableOfContents() {
        if (this.childSections) {
            const list = document.createElement('ul');
            this.childSections.forEach((childSection) => {
                const listElement = document.createElement('li');
                listElement.innerHTML = childSection.toLink();
                list.appendChild(listElement);
                const subList = childSection.toTableOfContents();
                if (subList) {
                    list.appendChild(subList);
                }
            });
            return list;
        }
        return undefined;
    }

    toString() {
        return `${this.indexPath} ${this.title}`;
    }

    toLink() {
        return `<a href="#toc${this.indexPath}">${this.toString()}</a>`;
    }
    
}