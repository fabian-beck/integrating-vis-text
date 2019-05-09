const bibManager = {
    createListOfReferences() {
        createReference = function (referenceKey, reference) {
            var s = '';
            reference.author = reference.author.replace(/\.$/g, '') // removes a '.' if there is one at the end of the author list (can happen for abbreviated middle names)
            reference.author = reference.author.replace(/ and /g, '; ')
            s += `<a id="cit:${referenceKey}"></a>${reference.author}. <b>${reference.title}</b>, ${reference.year}.`;
            if (reference.doi) {
                s += ` doi: <a href="https://dx.doi.org/${reference.doi}">${reference.doi}</a>`;
            }
            return `<li>${s}</li>`;
        };
        generatedDiv = document.createElement('ol');
        generatedDiv.classList.add('references');
        for (referenceKey in references) {
            generatedDiv.innerHTML += createReference(referenceKey, references[referenceKey]);
        }
        document.querySelector('references').replaceWith(generatedDiv);
    },
    updateCitations() {
        document.querySelectorAll('cit').forEach(cit => {
            const index = Object.keys(references).indexOf(cit.innerHTML);
            if (index) {
                cit.innerHTML = `<a href="#cit:${cit.innerHTML}">[${index+1}]</a>`;
            }
        });
    }
    
}