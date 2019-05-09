const bibManager = {
    createListOfReferences() {
        createReference = function (reference) {
            var s = '';
            reference.author = reference.author.replace(/\.$/g, '') // removes a '.' if there is one at the end of the author list (can happen for abbreviated middle names)
            reference.author = reference.author.replace(/ and /g, '; ')
            s += `${reference.author}. <b>${reference.title}</b>, ${reference.year}.`;
            if (reference.doi) {
                s += ` doi: <a href="https://dx.doi.org/${reference.doi}">${reference.doi}</a>`;
            }
            return `<li>${s}</li>`;
        };
        generatedDiv = document.createElement('ol');
        generatedDiv.classList.add('references');
        for (referenceKey in references) {
            generatedDiv.innerHTML += createReference(references[referenceKey]);
        }
        document.querySelector('references').replaceWith(generatedDiv);
    }
    
}