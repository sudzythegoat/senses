(function() {
    // Create and style the UI elements
    const sensesUI = document.createElement('div');
    sensesUI.style.position = 'fixed';
    sensesUI.style.top = '20px';
    sensesUI.style.left = '20px';
    sensesUI.style.width = '600px';  // Width
    sensesUI.style.height = '400px'; // Height
    sensesUI.style.border = '2px solid #3a018f'; // Updated purple color
    sensesUI.style.backgroundColor = 'black';
    sensesUI.style.color = 'white';
    sensesUI.style.padding = '10px';
    sensesUI.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    sensesUI.style.zIndex = '1000';
    sensesUI.style.cursor = 'move';  // Add cursor for draggable
    sensesUI.style.display = 'flex';
    sensesUI.style.flexDirection = 'column';
    sensesUI.style.transition = 'transform 0.3s'; // Smooth transition

    // Store original position
    const originalPosition = { top: '20px', left: '20px' };
    const offscreenPosition = { top: '-2000px', left: '-2000px' };

    // Create tab bar
    const tabBar = document.createElement('div');
    tabBar.style.display = 'flex';
    tabBar.style.marginBottom = '10px';
    tabBar.style.borderBottom = '1px solid #3a018f'; // Updated purple color
    tabBar.style.position = 'relative';
    sensesUI.appendChild(tabBar);

    // Create and style the code input area
    const tabContent = document.createElement('div');
    tabContent.style.flex = '1';
    tabContent.style.position = 'relative';
    tabContent.style.display = 'flex';
    tabContent.style.flexDirection = 'column';
    sensesUI.appendChild(tabContent);

    // Create and style the output/error box
    const errorOutput = document.createElement('textarea');
    errorOutput.style.width = 'calc(100% - 20px)';
    errorOutput.style.height = '40px'; // Adjusted height
    errorOutput.style.backgroundColor = '#333';
    errorOutput.style.border = '1px solid #3a018f'; // Updated purple color
    errorOutput.style.color = 'white';
    errorOutput.style.padding = '10px';
    errorOutput.style.fontFamily = 'Courier New, monospace';
    errorOutput.style.resize = 'none';
    errorOutput.style.overflow = 'auto';
    errorOutput.style.position = 'absolute';
    errorOutput.style.bottom = '50px'; // Positioned above the execute button
    errorOutput.readOnly = true;
    tabContent.appendChild(errorOutput);

    // Create execute button
    const executeButton = document.createElement('button');
    executeButton.textContent = 'Execute';
    executeButton.style.width = '100%';
    executeButton.style.height = '40px';
    executeButton.style.backgroundColor = '#3a018f'; // Updated purple color
    executeButton.style.border = 'none';
    executeButton.style.color = 'white';
    executeButton.style.fontSize = '16px';
    executeButton.style.cursor = 'pointer';
    executeButton.style.position = 'absolute';
    executeButton.style.bottom = '10px'; // Spaced at the bottom
    executeButton.onclick = () => {
        const activeTab = tabs.find(tab => tab.isActive);
        if (activeTab) {
            const code = activeTab.textarea.value;
            try {
                eval(code);
                errorOutput.value = 'Code Executed Successfully'; // Success message
            } catch (error) {
                errorOutput.value = 'Error: ' + error.message;
            }
        }
    };
    tabContent.appendChild(executeButton);

    // Create and style the toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '☰';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '20px';
    toggleButton.style.left = '20px';
    toggleButton.style.width = '40px';
    toggleButton.style.height = '40px';
    toggleButton.style.backgroundColor = '#3a018f'; // Updated purple color
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.fontSize = '20px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.zIndex = '1001';
    toggleButton.onclick = () => {
        sensesUI.style.display = sensesUI.style.display === 'none' ? 'block' : 'none';
        if (sensesUI.style.display === 'none') {
            sensesUI.style.transform = `translate(${offscreenPosition.left}, ${offscreenPosition.top})`;
        } else {
            sensesUI.style.transform = `translate(${originalPosition.left}, ${originalPosition.top})`;
        }
    };

    // Add the elements to the body
    document.body.appendChild(sensesUI);
    document.body.appendChild(toggleButton);

    // Make the UI draggable
    let isDragging = false;
    let offsetX, offsetY;

    sensesUI.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - sensesUI.getBoundingClientRect().left;
        offsetY = e.clientY - sensesUI.getBoundingClientRect().top;
        sensesUI.style.cursor = 'move';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            sensesUI.style.left = `${e.clientX - offsetX}px`;
            sensesUI.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        sensesUI.style.cursor = 'move';
    });

    // Tab system
    const tabs = [];
    let activeTab = null;

    function createTab(name) {
        if (tabs.length >= 9) {
            errorOutput.value = 'Maximum number of tabs reached'; // Display error message
            return;
        }
        const tab = document.createElement('div');
        tab.textContent = name;
        tab.style.padding = '5px 10px';
        tab.style.cursor = 'pointer';
        tab.style.border = '1px solid transparent';
        tab.style.borderRadius = '5px 5px 0 0';
        tab.style.marginRight = '5px';
        tab.style.backgroundColor = '#333';
        tab.style.color = 'white';
        tab.style.fontWeight = 'bold';
        tab.onclick = () => switchTab(name);
        tabBar.appendChild(tab);
        const textarea = createTextArea(name);
        tabs.push({ name, element: tab, textarea, isActive: false });
        if (tabs.length === 1) {
            switchTab(name);
        }
    }

    function createTextArea(name) {
        const textArea = document.createElement('textarea');
        textArea.style.width = 'calc(100% - 20px)';
        textArea.style.height = 'calc(100% - 60px)'; // Adjusted height
        textArea.style.backgroundColor = '#333';
        textArea.style.border = '1px solid #3a018f'; // Updated purple color
        textArea.style.color = 'white';
        textArea.style.padding = '10px';
        textArea.style.fontFamily = 'Courier New, monospace';
        textArea.style.display = 'none'; // Initially hidden
        textArea.placeholder = 'Type your JavaScript code here...';
        tabContent.appendChild(textArea);
        return textArea;
    }

    function switchTab(name) {
        if (activeTab) {
            activeTab.textarea.style.display = 'none';
            activeTab.isActive = false;
            activeTab.textarea.value = codeInput ? codeInput.value : ''; // Save the current code
            activeTab.element.style.backgroundColor = '#333'; // Inactive tab color
        }
        const tab = tabs.find(tab => tab.name === name);
        tab.element.style.backgroundColor = '#3a018f'; // Active tab color
        tab.textarea.style.display = 'block';
        codeInput = tab.textarea; // Sync content
        activeTab = tab;
        tab.isActive = true;
    }

    // Add a new tab button
    const newTabButton = document.createElement('button');
    newTabButton.textContent = '+';
    newTabButton.style.position = 'absolute';
    newTabButton.style.top = '5px'; // Position at the top right
    newTabButton.style.right = '5px';
    newTabButton.style.width = '40px';
    newTabButton.style.height = '40px';
    newTabButton.style.backgroundColor = '#3a018f'; // Updated purple color
    newTabButton.style.border = 'none';
    newTabButton.style.color = 'white';
    newTabButton.style.fontSize = '20px';
    newTabButton.style.cursor = 'pointer';
    newTabButton.onclick = () => {
        if (tabs.length < 9) {
            const tabName = `Tab ${tabs.length + 1}`;
            createTab(tabName);
        }
    };
    tabBar.appendChild(newTabButton);

    // Create the initial tab
    createTab('Tab 1');
})();
