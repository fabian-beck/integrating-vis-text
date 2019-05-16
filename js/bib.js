let bibManager = function () {

    /* adapted from SurVis https://github.com/fabian-beck/survis/blob/master/src/js/app/util.js */
    latexToHtml = function (latex) {
        if (!latex) {
            return '';
        }
        latex = latex.replace(/{|}/g, '');
        latex = latex.replace(/---/g, '&mdash;');
        latex = latex.replace(/--/g, '&ndash;');
        var encoding = {
            "'": "acute",
            "`": "grave",
            "^": "circ",
            "\"": "uml",
            "s": "zlig",
            '~': 'tilde',
            'c': 'cedil',
            'l': '&#x0142;',
            'L': '&#x0141;',
            'o': '&#xF8;',
            'O': '&#xD8;',
            'v': '_&#x030C;',
            'k': '_&#x328;',
            '=': '_&#x0304;',
            'b': '_&#x0331;',
            '.': '_&#x0307',
            'd': '_&#x0323',
            'r': '_&#x1E01',
            'u': '_&#x0306',
            'H': '_&#x030B;'
        };
        var html = "";
        for (var i = 0; i < latex.length; i++) {
            var c = latex[i];
            if (c == "\\") {
                if (i + 1 < latex.length && latex[i + 1] == '&') {
                    c = '&';
                    i++;
                } else if (i + 1 < latex.length && latex[i + 1] == '_') {
                    c = '_';
                    i++;
                } else if (i + 2 < latex.length && encoding[latex[i + 1]]) {
                    if (encoding[latex[i + 1]].indexOf('&') == -1) {
                        c = "&" + latex[i + 2] + encoding[latex[i + 1]] + ";";
                        i += 2;
                    } else if (encoding[latex[i + 1]].indexOf('_') >= 0) {
                        c = encoding[latex[i + 1]].replace('_', latex[i + 2]);
                        i += 2;
                    } else {
                        c = encoding[latex[i + 1]];
                        i += 1;
                    }
                }
            }
            html += c;
        }
        return html;
    }

    createDoiLink = function (reference) {
        return ``;
    }

    createRefDetails = function (reference) {
        var s = `${reference.year}.`;
        if (reference.doi) {
            s += ` doi: <a href="https://dx.doi.org/${reference.doi}">${reference.doi}</a>`;
        }
        return s;
    }

    createShortReference = function (referenceKey, reference) {
        var s = '';
        reference.author = reference.author.replace(/\.$/g, '') // removes a '.' if there is one at the end of the author list (can happen for abbreviated middle names)
        reference.author = reference.author.replace(/ and /g, '; ')
        s += `<a id="cit:${referenceKey}"></a>${reference.author}. <b>${latexToHtml(reference.title)}</b>, `
        s += createRefDetails(reference);
        return `<li>${s}</li>`;
    };

    createLongReference = function (referenceKey, referenceIndex) {
        const referenceDiv = document.createElement('div');
        referenceDiv.classList.add('ref');
        const reference = references[referenceKey];
        referenceDiv.innerHTML += `<div class="refIndex">[${referenceIndex}]</div>`;
        referenceDiv.innerHTML += `<div class="refTitle">${reference.title}</div>`;
        referenceDiv.innerHTML += `<div class="refAuthor">${reference.author}</div>`;
        referenceDiv.innerHTML += `<div class="refDetails">${createRefDetails(reference)}</div>`;
        referenceDiv.innerHTML += `<div class="refAbstract">${reference.abstract}</div>`;
        return referenceDiv;
    };

    return {
        createListOfReferences() {
            generatedDiv = document.createElement('ol');
            generatedDiv.classList.add('references');
            for (referenceKey in references) {
                generatedDiv.innerHTML += createShortReference(referenceKey, references[referenceKey]);
            }
            document.querySelector('references').replaceWith(generatedDiv);
        },

        updateCitations() {
            document.querySelectorAll('cit').forEach(cit => {
                const referenceKey = cit.innerHTML;
                const index = Object.keys(references).indexOf(referenceKey) + 1;
                if (index) {
                    cit.addEventListener('click', function () {
                        info.innerHTML = '';
                        info.appendChild(createLongReference(referenceKey, index));
                        info.style.display = 'block';
                        infoCloseButton.style.display = 'block';
                    });
                    cit.innerHTML = `<a>[${index}]</a>`;
                }
            });
        }
    }

}();