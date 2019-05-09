const titleObject = {
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
        } else {
            header.classList.remove('sticky');
            header.innerHTML = '';
        }
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

const generatedWordStatisticsExample = {
    generate() {
        generatedDiv = document.createElement('div');
        generatedDiv.classList.add('generated');
        generatedDiv.innerHTML = `This document contains ${document.body.innerHTML.length} characters.`
        document.querySelector('#generated_word_statistics_example').replaceWith(generatedDiv);
    }
}

document.body.prepend(headerObject.create());
document.body.prepend(titleObject.create());

generatedWordStatisticsExample.generate();

bibManager.createListOfReferences();

tableReferenceManager.updateTableReferences();

headerObject.initStickyHeader();