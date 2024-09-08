const API_KEY = '';

const SYSTEM_1 = `
  Your job is to remove any PII information from the user input so it can be shared with other people.
    
  Replace any PII infomation you see with the token <REDACTED_X> where X is a counter your increase every time you see a new PII chunk.
    
  After the text, return the list of replaces snippets in JSON format.
`;

const SYSTEM_2 = `
You are given a content text where personal information (PII) such as names, locations, and financial details must be replaced with pseudonyms. 
Follow these steps:
1. Identify and replace any person's names with realistic but different names.
2. Identify and replace any locations with fictional, context-appropriate names.
3. Identify and replace any financial information with slightly altered amounts (e.g., increase or decrease by 10-20%).

For each replacement, create a table with three columns in JSON format:
1. Original: the original PII entity
2. Description: what type of PII it is and the context (e.g., name of a child, city name, financial amount)
3. Pseudonym: the new pseudonym or altered value that replaces the original

Return the altered text along with the table.

When you replace a text, wrap the new text between <span class="r"> and </span>.

Don't output anything before the altered text. Separete altered text and the replacement table with REPLACEMENT_TABLE token.
`;

const SYSTEM_3 = `
You are given a content text where personal information (PII) such as names, locations, and financial details must be replaced with REDACTED_X where X is a counter. 
Follow these steps:
1. Identify and replace any person's names.
2. Identify and replace any locations.
3. Identify and replace any financial information with slightly altered amounts (e.g., increase or decrease by 10-20%).

For each replacement, create a table with three columns in JSON format:
1. Original: the original PII entity
2. Description: what type of PII it is and the context (e.g., name of a child, city name, financial amount)
3. Pseudonym: the new pseudonym or altered value that replaces the original

Return the altered text along with the table.

When you replace a text, wrap the new text between <span class="r"> and </span>.

Don't output anything before the altered text. Separete altered text and the replacement table with REPLACEMENT_TABLE token.
`;

const SYSTEM_4 = `
You are given a content_text where personal information (PII) such as names, locations, financial details, phone numbers, addresses, and car-related information must be replaced with generic pseudonyms. Follow these steps:

1. Identify and replace any person's names with a generic type and number.
   - For males, use "Male" followed by a number (e.g., Male_1, Male_2).
   - For females, use "Female" followed by a number (e.g., Female_1, Female_2).
   - Example:  
     - Original: "John was at the meeting yesterday."  
     - Pseudonym: "Male1 was at the meeting yesterday."
   - Example:  
     - Original: "Ashley went to pick up the kids."  
     - Pseudonym: "Female1 went to pick up the kids."

2. Identify and replace any locations (cities, towns, landmarks) with a generic location type and number.
   - Use "Location" followed by a number (e.g., Location_1, Location_2).
   - Example:  
     - Original: "They met at Central Park in New York."  
     - Pseudonym: "They met at Location1 in Location2."
   - Example:  
     - Original: "She moved to Los Angeles last year."  
     - Pseudonym: "She moved to Location3 last year."

3. Identify and replace any financial information with approximate values.
   - Use rough estimates (increase or decrease by about 10-20%) but maintain the context of the financial information.
   - Example:  
     - Original: "The house sold for $300,000."  
     - Pseudonym: "The house sold for approximately $320,000."
   - Example:  
     - Original: "They were paid $150 for the work."  
     - Pseudonym: "They were paid approximately $160 for the work."

4. Identify and replace any Social Security Numbers or sensitive IDs with generic formats.
   - Use the format "XXX-XX-XXXX."
   - Example:  
     - Original: "Her SSN is 123-45-6789."  
     - Pseudonym: "Her SSN is XXX-XX-XXXX."

5. Identify and replace any phone numbers with a generic phone format.
   - Use the format "(XXX) XXX-XXXX."
   - Example:  
     - Original: "You can reach me at 555-123-4567."  
     - Pseudonym: "You can reach me at (XXX) XXX-XXXX."

6. Identify and replace any addresses with a generic address format.
   - Replace street addresses with "Street_1", "Street_2", and use a generic "Location" for cities/towns.
   - Example:  
     - Original: "She lives at 123 Main St, New York, NY 10001."  
     - Pseudonym: "She lives at Street1, Location1, Location2 10001."

7. Identify and replace any car information (make, model, year) with generic placeholders.
   - Replace car brands with "CarBrand", model names with "Model", and years with "Year."
   - Example:  
     - Original: "He drives a 2015 Toyota Camry."  
     - Pseudonym: "He drives a Year CarBrand Model."
   - Example:  
     - Original: "Her car is a 2020 Ford F-150."  
     - Pseudonym: "Her car is a Year CarBrand Model."

For each replacement, create a table with three columns in JSON format:
1. Original: the original PII entity
2. Description: what type of PII it is and the context (e.g., name of a child, city name, financial amount)
3. Pseudonym: the new pseudonym or altered value that replaces the original

Return the altered text along with the table.

When you replace a text, wrap the new text between <span class="r"> and </span>.

Don't output anything before the altered text. Separete altered text and the replacement table with REPLACEMENT_TABLE token.
`;

const SYSTEM = {
  role: 'system',
  content: SYSTEM_4,
};

async function callChatGPT(text) {
  const request = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        SYSTEM,
        {
          role: 'user',
          content: text,
        },
      ],
      top_p: 1,
    }),
  });
  const data = await request.json();
  console.log('Data', data);
  return data.choices[0].message.content;
}

async function callLlama(text) {
  const request = await fetch('http://192.168.1.123:11434/api/generate', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama3p1',
      prompt: SYSTEM_4 + '\n' + text,
      // SYSTEM,
      // {
      //   role: 'user',
      //   content: text,
      // },
      // ],
      stream: false,
    }),
  });
  const data = await request.json();
  console.log('Data', data);
  return data.response;
  // return data.choices[0].message.content;
}

// curl -X POST -d "{ \"model\": \"llama3p1\", \"prompt\": \"Why is the sky blue?\", \"stream\": false}"

async function main() {
  const beforeText = document.getElementById('text-before');
  const afterText = document.getElementById('text-after');
  const afterText2 = document.getElementById('text-after-2');
  const replacementsText = document.getElementById('text-replacements');

  const uploadButton = document.getElementById('upload');
  const anonymizeButton = document.getElementById('anonymize');
  const pasteButton = document.getElementById('paste');
  const copyButton = document.getElementById('copy-after');

  uploadButton.addEventListener('click', async () => {
    const handles = await showOpenFilePicker();
    const files = await Promise.all(handles.map((handle) => handle.getFile()));
    if (!files.length) return;
    const file = files[0];
    const text = await file.text();
    beforeText.value = text;
    afterText.value = '';
    replacementsText.textContent = '';
  });

  anonymizeButton.addEventListener('click', async () => {
    try {
      anonymizeButton.textContent = 'Working...';
      const text = beforeText.value;
      // const anonymized = await callChatGPT(text);
      const anonymized = await callLlama(text);

      const [altered, table] = anonymized.split('REPLACEMENT_TABLE');

      // const anonymized = await chrome.runtime.sendMessage({
      //   type: 'anonymize',
      //   text,
      // });
      afterText.value = altered;
      afterText2.innerHTML = altered;
      replacementsText.textContent = table
        .replace('```json\n', '')
        .replace('```', '');

      try {
        const json = JSON.parse(
          table.replace('```json\n', '').replace('```', '')
        );
        const tbl = document.createElement('table');
        json.forEach((r) => {
          const tr = document.createElement('tr');
          const td1 = document.createElement('td');
          td1.textContent = r.Pseudonym;
          tr.appendChild(td1);

          const td2 = document.createElement('td');
          td2.textContent = r.Original;
          tr.appendChild(td2);

          tbl.appendChild(tr);
        });

        replacementsText.replaceChildren(tbl);
        console.log(tbl);
      } catch (e) {
        console.log(e);
      }

      console.log(table);
    } finally {
      anonymizeButton.textContent = 'Anonymize';
    }
  });

  pasteButton.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return chrome.tabs.sendMessage(tab.id, {
      type: 'PASTE',
      text: afterText2.textContent,
    });
  });

  copyButton.addEventListener('click', async () => {
    console.log('Here');
    await navigator.clipboard.writeText(afterText2.textContent);
    await showSnackbar('Text copied to clipboard');
  });
}

async function showSnackbar(text) {
  const bar = document.createElement('div');
  bar.setAttribute('popover', 'manual');
  const span = document.createElement('span');
  span.classList.add('text');
  span.textContent = text;

  bar.appendChild(span);
  document.body.appendChild(bar);
  bar.showPopover();
  setTimeout(() => {
    bar.hidePopover();
  }, 2000);

  // <div popover="manual" ?error=${this.error}>
  //       <span class="text">${this.labelText}</span>
  //       ${this.hasDismiss
  //         ? html`<span class="icon" @click=${this.close}>close</span>`
  //         : nothing}
  //     </div>
}

main();
