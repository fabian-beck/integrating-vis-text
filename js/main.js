
const generatedWordStatisticsExample = {
    generate() {
        generatedDiv = document.createElement('div');
        generatedDiv.classList.add('generated');
        generatedDiv.innerHTML = `This document contains ${document.body.innerHTML.length} characters.`
        document.querySelector('#generated_word_statistics_example').replaceWith(generatedDiv);
    }
}

document.body.prepend(tableOfContentsObject.create());
document.body.prepend(headerObject.create());
document.body.prepend(titleObject.create());

generatedWordStatisticsExample.generate();

bibManager.createListOfReferences();

tableReferenceManager.updateTableReferences();
bibManager.updateCitations();

headerObject.initStickyHeader();