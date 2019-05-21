
const generatedWordStatisticsExample = {
    generate() {
        generatedDiv = document.createElement('div');
        generatedDiv.classList.add('generated');
        generatedDiv.innerHTML = `This document contains ${document.body.innerHTML.length} characters.`
        document.querySelector('#generated_word_statistics_example').replaceWith(generatedDiv);
    }
}

const myDocument = new MyDocument();

generatedWordStatisticsExample.generate();