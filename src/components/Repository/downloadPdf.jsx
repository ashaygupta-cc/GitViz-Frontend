import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generateRepositoryPdf = async (repoData) => {
  const pdf = new jsPDF('portrait', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();

  // Main container
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = `${pageWidth - 40}px`;
  tempDiv.style.padding = '20px';
  tempDiv.style.fontFamily = "'Inter', sans-serif";
  tempDiv.style.background = '#ffffff';
  document.body.appendChild(tempDiv);

  // Hierarchical Formation
  const style = document.createElement('style');
  style.textContent = `
    .node-container { margin: 4px 0; }
    .folder-node {
      font-size: 13px;
      color: #1e293b;
      margin: 6px 0;
      display: flex;
      align-items: center;
    }
    .file-node {
      font-size: 11px;
      color: #64748b;
      margin-left: 24px;
      position: relative;
      display: flex;
      align-items: center;
    }
    .file-node::before {
      content: '↳';
      position: absolute;
      left: -18px;
      color: #94a3b8;
      font-size: 10px;
    }
    .node-icon {
      width: 16px;
      margin-right: 8px;
    }
    .children-container {
      margin-left: 24px;
      border-left: 1px dashed #e2e8f0;
      padding-left: 12px;
    }
    .more-items {
      font-size: 10px;
      color: #64748b;
      margin-left: 24px;
    }
  `;
  tempDiv.appendChild(style);

  const renderNode = (item,truncate = false) => {
    const container = document.createElement('div');
    container.className = 'node-container';

    const node = document.createElement('div');
    node.className = item.type === 'tree' ? 'folder-node' : 'file-node';

    const icon = document.createElement('span');
    icon.className = 'node-icon';
    icon.textContent = item.type === 'tree' ? '📁' : '📄';

    const text = document.createElement('span');
    text.textContent = item.name;

    node.appendChild(icon);
    node.appendChild(text);

    if(item.type === 'tree' && item.children?.length){
      const childrenContainer = document.createElement('div');
      childrenContainer.className = 'children-container';

      const children = truncate ? item.children.slice(0, 3) : item.children;
      children.forEach(child => childrenContainer.appendChild(renderNode(child, truncate)));

      if(truncate && item.children.length > 3){
        const more = document.createElement('div');
        more.className = 'more-items';
        more.textContent = `+ ${item.children.length - 3} more...`;
        childrenContainer.appendChild(more);
      }

      container.append(node, childrenContainer);
    } 
    else{
      container.appendChild(node);
    }

    return container;
  };

  const mainTitle = document.createElement('div');
  mainTitle.textContent = `📦 ${repoData.name}`;
  mainTitle.style.fontSize = '16px';
  mainTitle.style.marginBottom = '15px';
  tempDiv.appendChild(mainTitle);

  repoData.children.slice(0, 9).forEach(item => {
    tempDiv.appendChild(renderNode(item, true));
  });

  if(repoData.children.length > 9){
    const more = document.createElement('div');
    more.className = 'more-items';
    more.textContent = `+ ${repoData.children.length - 9} more...`;
    tempDiv.appendChild(more);
  }

  let canvas = await html2canvas(tempDiv, {
    scale: 3,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: parseInt(tempDiv.style.width)
  });
  pdf.addImage(canvas, 'PNG', 20, 20, pageWidth-40, (canvas.height*(pageWidth-40))/canvas.width);

  const processDirectory = async (node, path = []) => {
    if (!node?.children) return;

    tempDiv.innerHTML = '';
    
    const header = document.createElement('div');
    header.innerHTML = `
      <div style="font-size:16px;color:#1e293b;margin-bottom:8px">
        📁 ${path.concat(node.name).join(' / ')}
      </div>
      <div style="font-size:12px;color:#64748b;margin-bottom:15px">
        ${node.children.filter(c => c.type === 'tree').length} folders • 
        ${node.children.filter(c => c.type === 'blob').length} files
      </div>
    `;
    tempDiv.appendChild(header);

    node.children.forEach(child => {
      tempDiv.appendChild(renderNode(child)); 
    });

    const dirCanvas = await html2canvas(tempDiv, {
      scale: 3,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: parseInt(tempDiv.style.width)
    });
    
    pdf.addPage();
    pdf.addImage(dirCanvas, 'PNG', 20, 20, pageWidth-40, (dirCanvas.height*(pageWidth-40))/dirCanvas.width);

    for(const child of node.children.filter(c => c.type === 'tree')){
      await processDirectory(child, [...path, node.name]);
    }
  };

  for(const item of repoData.children.filter(n => n.type === 'tree')){
    await processDirectory(item, []);
  }

  document.body.removeChild(tempDiv);
  return pdf;
};