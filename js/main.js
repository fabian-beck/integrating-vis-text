
const generatedWordStatisticsExample = {
    generate() {
        generatedDiv = document.createElement('div');
        generatedDiv.classList.add('generated');
        generatedDiv.innerHTML = `This document contains ${document.body.innerHTML.length} characters.`
        document.querySelector('#generated_word_statistics_example').replaceWith(generatedDiv);
    }
}

documentObject.createAndApply();

generatedWordStatisticsExample.generate();

console.log(bibManager);
bibManager.createListOfReferences();

tableReferenceManager.updateTableReferences();
bibManager.updateCitations();

headerObject.initStickyHeader();