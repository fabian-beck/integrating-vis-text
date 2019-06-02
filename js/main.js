const generatedWordStatisticsExample = {
    generate() {
        generatedDiv = document.createElement('div');
        generatedDiv.classList.add('generated');
        generatedDiv.innerHTML = `This document contains ${document.body.innerHTML.length} characters.`
        document.querySelector('#generated_word_statistics_example').replaceWith(generatedDiv);
    }
}

// https://html-online.com/articles/get-url-parameters-javascript/
function getUrlParam(parameter, defaultvalue) {
    getUrlVars = function () {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    };    
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

const debugMode = getUrlParam('mode') === 'debug';
const myDocument = new MyDocument();

generatedWordStatisticsExample.generate();