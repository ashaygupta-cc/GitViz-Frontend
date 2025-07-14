export const processTreeData = (tree) => {
  const rootNode = [];
  const map = {};

  // First pass: All nodes
  tree.forEach((item) => {
    const parts = item.path.split('/');
    let currentPath = '';
    parts.forEach((part, index) => {
      currentPath = index === 0 ? part : `${currentPath}/${part}`;

      // If not in map -> new Node
      if(!map[currentPath]){
        map[currentPath] = {
          path: currentPath,
          type: index === parts.length - 1 ? item.type : 'tree',
          sha: index === parts.length - 1 ? item.sha : undefined,
          children: [],
        };
      }
    });
  });

  // Second pass: Children to parent nodes
  Object.keys(map).forEach((path) => {
    const node = map[path];
    const parts = path.split('/');

    if(parts.length === 1){
      rootNode.push(node);
    } 
    else{
      const parentPath = parts.slice(0, -1).join('/');
      if(map[parentPath]){
        map[parentPath].children.push(node);
      }
    }
  });

  return rootNode;
};

export const convertTreeToFlowData = (treeData, basePath = '') => {
  const nodes = [];
  const edges = [];

  const NODE_WIDTH = 180;
  const NODE_HEIGHT = 40;
  const LEVEL_HEIGHT = 100;
  const HORIZONTAL_SPACING = 200;

  const processNode = (node, level, position, parentId) => {
    const id = `${basePath}${node.path}`;
    const nodeType = node.type === 'tree' ? 'folder' : 'file';

    nodes.push({
      id,
      type: nodeType,
      data: {
        label: node.path.split('/').pop() || node.path,
        path: node.path,
        type: node.type,
      },
      position: {
        x: position * HORIZONTAL_SPACING,
        y: level * LEVEL_HEIGHT,
      },
    });

    if(parentId){
      edges.push({
        id: `e${parentId}-${id}`,
        source: parentId,
        target: id,
        type: 'smoothstep',
      });
    }

    if(node.children && node.children.length > 0){
      node.children.forEach((child, index) => {
        const childPosition = position - node.children.length / 2 + index;
        processNode(child, level + 1, childPosition, id);
      });
    }
  };

  treeData.forEach((node, index) => {
    const startPosition = index - treeData.length / 2;
    processNode(node, 0, startPosition);
  });

  return { nodes, edges };
};

export const calculateDirectorySizes = (treeData) => {
  const sizes = {};

  const calculateSize = (node) => {
    if(node.type === 'blob'){
      return 1;
    }

    let size = 0;
    if(node.children && node.children.length > 0){
      size = node.children.reduce((acc, child) => acc + calculateSize(child), 0);
    }

    sizes[node.path] = size;
    return size;
  };

  treeData.forEach((node) => {
    calculateSize(node);
  });

  return sizes;
};

export const getPathParts = (path) => {
  const parts = path.split('/');
  return parts.map((part, index) => {
    const currentPath = parts.slice(0, index + 1).join('/');
    return {
      name: part,
      path: currentPath,
    };
  });
};

export const getFileIcon = (filename) => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';

  const iconMap = {
    js: 'file-js',
    jsx: 'file-jsx',
    ts: 'file-ts',
    tsx: 'file-tsx',
    html: 'file-html',
    css: 'file-css',
    scss: 'file-scss',
    json: 'file-json',
    md: 'file-md',
    py: 'file-py',
    java: 'file-java',
    go: 'file-go',
    rs: 'file-rs',
    c: 'file-c',
    cpp: 'file-cpp',
    php: 'file-php',
    rb: 'file-rb',
  };

  return iconMap[extension] || 'file';
};
