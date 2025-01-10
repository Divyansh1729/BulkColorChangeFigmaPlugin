figma.showUI(__html__, { width: 300, height: 400 });

function updateSelection() {
  const selection = figma.currentPage.selection;
  const elements = selection
    .filter(node => node.type === 'RECTANGLE' || node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'GROUP')
    .map(node => {
      let color = null;
      if ('fills' in node && node.fills.length > 0 && node.fills[0].type === 'SOLID') {
        color = node.fills[0].color;
      }
      return {
        name: node.name,
        color: color,
        type: node.type.toLowerCase()
      };
    })
    .filter(element => element.color !== null);

  figma.ui.postMessage({
    type: 'selection-update',
    count: selection.length,
    elements: elements
  });
}

// Listen for selection changes
figma.on('selectionchange', () => {
  updateSelection();
});

// Initial selection update
updateSelection();

// Listen for messages from the UI
figma.ui.onmessage = msg => {
  if (msg.type === 'update-colors') {
    const selection = figma.currentPage.selection;
    
    selection.forEach(node => {
      if ('fills' in node) {
        const fills = [...node.fills];
        if (fills.length > 0 && fills[0].type === 'SOLID') {
          fills[0].color = msg.color;
          node.fills = fills;
        }
      }
    });
  }
  
  if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }
};
  