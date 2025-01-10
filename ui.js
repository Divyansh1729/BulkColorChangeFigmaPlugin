let isColorPickerActive = false;
let currentColor = '#000000';

document.getElementById('closePlugin').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'close-plugin' } }, '*');
};

document.getElementById('closeColorPicker').onclick = () => {
  document.getElementById('colorPickerModal').style.display = 'none';
};

document.getElementById('bulkColorChange').onclick = () => {
  document.getElementById('colorPickerModal').style.display = 'block';
};

document.getElementById('colorPicker').addEventListener('input', (e) => {
  currentColor = e.target.value;
  updateColorValues(currentColor);
  parent.postMessage({ 
    pluginMessage: { 
      type: 'update-colors',
      color: hexToRgb(currentColor)
    }
  }, '*');
});

document.getElementById('applyColor').onclick = () => {
  document.getElementById('colorPickerModal').style.display = 'none';
};

function updateColorValues(hex) {
  document.getElementById('hexValue').textContent = hex.toUpperCase();
  const rgb = hexToRgb(hex);
  document.getElementById('rValue').textContent = Math.round(rgb.r * 255);
  document.getElementById('gValue').textContent = Math.round(rgb.g * 255);
  document.getElementById('bValue').textContent = Math.round(rgb.b * 255);
}

window.onmessage = (event) => {
  const message = event.data.pluginMessage;
  
  if (message.type === 'selection-update') {
    updateSelectionInfo(message.count, message.elements);
  }
};

function updateSelectionInfo(count, elements) {
  const selectionCount = document.getElementById('selectionCount');
  const colorList = document.getElementById('colorList');
  
  selectionCount.textContent = `${count} Elements selected`;
  
  colorList.innerHTML = '';
  elements.forEach((element, index) => {
    const colorItem = document.createElement('div');
    colorItem.className = 'color-item';
    
    const itemNumber = document.createElement('div');
    itemNumber.className = 'item-number';
    itemNumber.textContent = index + 1;
    
    const elementName = document.createElement('div');
    elementName.className = 'element-name';
    elementName.textContent = element.name;
    
    const colorPreview = document.createElement('div');
    colorPreview.className = 'color-preview';
    colorPreview.style.backgroundColor = rgbToHex(element.color);
    
    colorItem.appendChild(itemNumber);
    colorItem.appendChild(elementName);
    colorItem.appendChild(colorPreview);
    colorList.appendChild(colorItem);
  });
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : null;
}

function rgbToHex(color) {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
} 