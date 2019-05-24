class MyDocument {

    constructor() {

        this.sideLayoutContainer = document.createElement('div');
        this.sideLayoutContainer.id = 'sideLayoutContainer';
        document.body.prepend(this.sideLayoutContainer);

        document.body.prepend(new Title().toHtml());

        this.sectionHierarchy = new SectionHierarchy();
        this.tableOfContentsPanel = new TableOfContentsPanel(this.sectionHierarchy);
        this.infoPanel = new InfoPanel();
        this.headerPanel = new HeaderPanel();
        const headerDiv = this.headerPanel.toHtml(this.tableOfContentsPanel.createHeader(), this.infoPanel.createHeader());
        this.sideLayoutContainer.append(headerDiv);
        this.sideLayoutContainer.append(this.tableOfContentsPanel.toHtml());
        this.sideLayoutContainer.append(this.infoPanel.toHtml());

        this.updateReferences();
        bibManager.createListOfReferences();
        bibManager.updateCitations();

        this.headerPanel.initStickyHeader();
    }

    updateReferences() {
        const figureLabelIndexMap = this.indexFigures();
        const tableLabelIndexMap = this.indexTables();
        document.querySelectorAll('ref').forEach(ref => {
            const refTarget = ref.getAttribute('href');
            if (refTarget.indexOf('fig:') === 0) {
                const index = figureLabelIndexMap[refTarget];
                if (index) {
                    ref.innerHTML = `<a>Figure&nbsp;${index}</a>`;
                    ref.addEventListener('click', () => {
                        const figDiv = document.querySelector(`figure[data-label='${refTarget}']`).cloneNode(true);
                        this.infoPanel.open(`Figure ${index}`, figDiv);
                    });
                }
            } else if (refTarget.indexOf('table:') === 0) {
                const index = tableLabelIndexMap[refTarget];
                if (index) {
                    ref.innerHTML = `<a href="#${refTarget}">Table&nbsp;${index}</a>`;
                }
            } else if (refTarget.indexOf('info:') === 0) {
                ref.innerHTML += '<i class="fas fa-info-circle"></i>';
                ref.addEventListener('click', () => {
                    const infoDiv = document.querySelector(`info[data-label='${refTarget}']`).cloneNode(true);
                    this.infoPanel.open(infoDiv.getAttribute('title'), infoDiv);
                });
            }
        });
    }

    indexFigures() {
        let figureCount = 0;
        const figureLabelIndexMap = {};
        document.querySelectorAll('figure').forEach(figure => {
            const caption = figure.querySelector('figcaption');
            if (caption) {
                figureCount++;
                const label = figure.getAttribute('data-label');
                caption.innerHTML = `<a id="${label}"></a><b>Figure ${figureCount}:</b> ${caption.innerHTML}`;
                figureLabelIndexMap[label] = figureCount;
            }
            figure.addEventListener('click', () => {
                myDocument.infoPanel.open(`Figure ${figureCount}`, figure.cloneNode(true));
            });
        });
        return figureLabelIndexMap;
    }

    indexTables() {
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
        return tableLabelIndexMap;
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

    toHtml(tocHeaderDiv, infoHeaderDiv) {
        const headerDiv = document.createElement('div');
        headerDiv.id = 'header';
        headerDiv.innerHTML = '<div id="headerTitle"></div>';
        headerDiv.appendChild(tocHeaderDiv);
        headerDiv.appendChild(infoHeaderDiv);
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
            tocHeader.classList.add('sticky');
            infoHeader.classList.add('sticky');
            toc.style.visibility = 'visible';
            info.style.visibility = 'visible';
        } else {
            header.classList.remove('sticky');
            main.classList.remove('sticky');
            headerTitle.innerHTML = '';
            tocHeader.classList.remove('sticky');
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

class TableOfContentsPanel {

    constructor(sectionHierarchy) {
        this.sectionHierarchy = sectionHierarchy;
    }

    toHtml() {
        const tocDiv = document.createElement('div');
        tocDiv.id = 'toc';
        tocDiv.appendChild(this.sectionHierarchy.rootSection.toTableOfContents());
        return tocDiv;
    }

    createHeader() {
        const tocHeaderDiv = document.createElement('div');
        tocHeaderDiv.id = 'tocHeader';
        const tocToggleButtonDiv = document.createElement('div');
        tocToggleButtonDiv.id = 'tocToggleButton';
        tocToggleButtonDiv.classList.add('button');
        tocToggleButtonDiv.innerHTML = '<i class="fas fa-list"></i>';
        tocHeaderDiv.appendChild(tocToggleButtonDiv);
        const tocHeaderTitleDiv = document.createElement('div');
        tocHeaderTitleDiv.id = 'tocTitle';
        tocHeaderTitleDiv.innerHTML = 'Table of Contents';
        tocHeaderDiv.appendChild(tocHeaderTitleDiv);
        tocHeaderDiv.addEventListener('click', function () {
            toc.style.display = (!toc.style.display || toc.style.display === 'none') ? 'block' : 'none';
        });
        return tocHeaderDiv;
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
            currentSection = new Section(indexCounter, sectionHeader.innerHTML, parentSection, !sectionHeader.classList.contains('noNumbering'));
            sectionHeader.id = `toc${currentSection.indexPath}`;
            sectionHeader.innerHTML = `${currentSection.toString()}`;
            indexCounter++;
        });
    }

}

class Section {

    constructor(index, title, parentSection, numbering) {
        this.title = title;
        this.index = index;
        this.indexPath = (parentSection && parentSection.index ? `${parentSection.index}.` : '') + String(index);
        this.level = parentSection ? parentSection.level + 1 : 0;
        this.parentSection = parentSection;
        this.numbering = numbering;
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
        if (this.numbering) {
            return `${this.indexPath} ${this.title}`;
        }
        return this.title;
    }

    toLink() {
        return `<a href="#toc${this.indexPath}">${this.toString()}</a>`;
    }

}