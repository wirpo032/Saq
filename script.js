const surveyContainer = document.getElementById('survey-container');
const submitBtn = document.getElementById('submit-btn');

fetch('lfrb-saq.json')
  .then(response => response.json())
  .then(schema => {
    const properties = schema.properties.payload.properties;
    for (const key in properties) {
      const question = properties[key];
      const questionDiv = document.createElement('div');
      questionDiv.classList.add('question');

      const label = document.createElement('label');
      label.textContent = question.title;
      questionDiv.appendChild(label);

      if (question.type === 'string' && question.format === 'date') {
        const input = document.createElement('input');
        input.type = 'date';
        input.name = key;
        questionDiv.appendChild(input);
      } else if (question.type === 'string' && question.oneOf) {
        const select = document.createElement('select');
        select.name = key;
        for (const option of question.oneOf) {
          const opt = document.createElement('option');
          opt.value = option.const;
          opt.textContent = option.description;
          select.appendChild(opt);
        }
        questionDiv.appendChild(select);
      } else if (question.type === 'string') {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = key;
        questionDiv.appendChild(input);
      } else if (question.type === 'integer') {
        const input = document.createElement('input');
        input.type = 'number';
        input.name = key;
        questionDiv.appendChild(input);
      } else if (question.type === 'array') {
        const arrayContainer = document.createElement('div');
        arrayContainer.classList.add('array-container');
        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.addEventListener('click', () => {
          const newItem = document.createElement('div');
          newItem.classList.add('array-item');
          const subProperties = question.items.properties;
          for (const subKey in subProperties) {
            const subQuestion = subProperties[subKey];
            const subLabel = document.createElement('label');
            subLabel.textContent = subQuestion.title;
            newItem.appendChild(subLabel);
            if (subQuestion.type === 'string' && subQuestion.format === 'date') {
              const subInput = document.createElement('input');
              subInput.type = 'date';
              subInput.name = `${key}-${subKey}`;
              newItem.appendChild(subInput);
            } else if (subQuestion.type === 'string' && subQuestion.oneOf) {
              const subSelect = document.createElement('select');
              subSelect.name = `${key}-${subKey}`;
              for (const option of subQuestion.oneOf) {
                const opt = document.createElement('option');
                opt.value = option.const;
                opt.textContent = option.description;
                subSelect.appendChild(opt);
              }
              newItem.appendChild(subSelect);
            } else if (subQuestion.type === 'string') {
              const subInput = document.createElement('input');
              subInput.type = 'text';
              subInput.name = `${key}-${subKey}`;
              newItem.appendChild(subInput);
            } else if (subQuestion.type === 'integer') {
                const subInput = document.createElement('input');
                subInput.type = 'number';
                subInput.name = `${key}-${subKey}`;
                newItem.appendChild(subInput);
            }
          }
          arrayContainer.appendChild(newItem);
        });
        questionDiv.appendChild(addButton);
        questionDiv.appendChild(arrayContainer);
      }

      surveyContainer.appendChild(questionDiv);
    }
  });

submitBtn.addEventListener('click', () => {
  const surveyData = {};
  const inputs = surveyContainer.querySelectorAll('input, select');
  for (const input of inputs) {
    surveyData[input.name] = input.value;
  }
  console.log(surveyData);
});
