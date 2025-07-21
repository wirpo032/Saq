document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');
    const saveButton = document.getElementById('saveButton');

    fetch('lfrb-saq.json')
        .then(response => response.json())
        .then(data => {
            const properties = data.$defs.payload.properties;
            for (const key in properties) {
                if (properties.hasOwnProperty(key)) {
                    createQuestion(form, key, properties[key]);
                }
            }
        });

    saveButton.addEventListener('click', () => {
        const formData = new FormData(form);
        const answers = {};
        for (const [key, value] of formData.entries()) {
            answers[key] = value;
        }
        const json = JSON.stringify(answers, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'answers.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    function createQuestion(parent, key, questionData) {
        const container = document.createElement('fieldset');
        container.classList.add('question');

        const legend = document.createElement('legend');
        legend.textContent = questionData.title;
        container.appendChild(legend);

        if (questionData.properties) {
            for (const propKey in questionData.properties) {
                if (questionData.properties.hasOwnProperty(propKey)) {
                    createQuestion(container, `${key}.${propKey}`, questionData.properties[propKey]);
                }
            }
        } else if (questionData.oneOf) {
            const select = document.createElement('select');
            select.name = key;
            questionData.oneOf.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.const;
                optionElement.textContent = option.description;
                select.appendChild(optionElement);
            });
            container.appendChild(select);
        } else {
            let input;
            switch (questionData.type) {
                case 'string':
                    if (questionData.format === 'date') {
                        input = document.createElement('input');
                        input.type = 'date';
                    } else if (questionData.format === 'file') {
                        input = document.createElement('input');
                        input.type = 'file';
                    } else {
                        input = document.createElement('input');
                        input.type = 'text';
                    }
                    break;
                case 'integer':
                case 'number':
                    input = document.createElement('input');
                    input.type = 'number';
                    break;
                case 'array':
                    const arrayContainer = document.createElement('div');
                    const addButton = document.createElement('button');
                    addButton.textContent = 'Add';
                    addButton.type = 'button';

                    const initialInput = document.createElement('input');
                    initialInput.type = 'text';
                    initialInput.name = `${key}[]`;
                    arrayContainer.appendChild(initialInput);
                    arrayContainer.appendChild(addButton);
                    container.appendChild(arrayContainer);

                    addButton.addEventListener('click', () => {
                        const newItem = document.createElement('input');
                        newItem.type = 'text';
                        newItem.name = `${key}[]`;
                        arrayContainer.insertBefore(newItem, addButton);
                    });
                    break;
                default:
                    input = document.createElement('input');
                    input.type = 'text';
                    break;
            }
            input.name = key;
            container.appendChild(input);
        }

        parent.appendChild(container);
    }
});
