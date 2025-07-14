import dagre from "dagre";
import { toPng, toSvg } from "html-to-image";
import {
  ArrowDownCircle,
  ArrowRightCircle,
  Download,
  Maximize,
  Minimize,
  Map,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "react-flow-renderer";
import useRepoStore from "../../stores/repoStore";
import { generateRepositoryPdf } from "./downloadPdf";

const nodeWidth = 220;
const nodeHeight = 60;
const verticalSpacing = 80;
const horizontalSpacing = 40;
const depthColors = ["#e3f2fd", "#bbdefb", "#90caf9", "#64b5f6", "#42a5f5"];
const isMobile = () => window.innerWidth <= 768;

const FlowChartView = () => {
  const reactFlowWrapper = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [flowKey, setFlowKey] = useState(Date.now());
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const dropdownRef = useRef(null);
  const [layoutDirection, setLayoutDirection] = useState("TB");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const treeData = useRepoStore((state) => state.treeData);
  const repoName = useRepoStore((state) => state.repoName);
  const repoOwner = useRepoStore((state) => state.repoOwner);
  const error = useRepoStore((state) => state.error);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Theme detection and handling
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Initial check
    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const buildGraph = useCallback(
    (tree) => {
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));
      dagreGraph.setGraph({
        rankdir: layoutDirection,
        ranksep: layoutDirection === "TB" ? verticalSpacing * 1.5 : verticalSpacing,
        nodesep: horizontalSpacing,
        marginx: 50,
        marginy: 50,
      });

      let graphNodes = [];
      let graphEdges = [];

      const rootId = "__repo_root__";
      graphNodes.push({
        id: rootId,
        data: {
          label: (
            <div className="p-3 text-sm font-semibold  ${isDarkMode ? 'text-white' : 'text-gray-900'}">
              📦 {repoName || "Repository"}
            </div>
          ),
        },
        position: { x: 0, y: 0 },
        style: {
          width: nodeWidth,
          minHeight: nodeHeight,
          borderRadius: 8,
          border: "2px #1e88e5",
          backgroundColor: "rgba(227, 242, 253, 0.25)",
          backgroundImage:
            "linear-gradient(to bottom right, rgba(66, 165, 245, 0.3), rgba(30, 136, 229, 0.3))",
          boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
        },
      });

      const separateItems = (nodes) => {
        const files = nodes.filter((node) => node.type !== "tree");
        const folders = nodes.filter((node) => node.type === "tree");
        return { files, folders };
      };

      const traverse = (node, parentId, depth = 0, position = 0) => {
        if (!node?.path) return;
        const id = node.path;
        const isFolder = node.type === "tree";
        const label = node.path.split("/").pop();
        const depthColor = depthColors[Math.min(depth, depthColors.length - 1)];

        const shouldCompact =
          isFolder &&
          node.children &&
          node.children.filter((c) => c.type !== "tree").length > 8;

        // Calculate width based on label length (minimum nodeWidth, maximum 300px)
        const calculatedWidth = Math.min(
          Math.max(nodeWidth, label.length * 8 + 40),
          300
        );

        const nodeStyle = {
          width: shouldCompact ? nodeWidth * 1.5 : calculatedWidth,
          minHeight: shouldCompact
            ? nodeHeight + Math.ceil(Math.min(node.children.length, 12) / 2) * 24 + 24
            : nodeHeight,
          borderRadius: 8,
          border: `2px solid ${depthColor}`,
          backgroundColor: `${depthColor}40`,
          transition: "all 0.3s ease",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          color: isDarkMode ? '#ffffff' : '#111827'
        };

        const posMultiplier = layoutDirection === "TB" ? 2 : 1;
        const positionIndex = position * posMultiplier;

        graphNodes.push({
          id,
          data: {
            label: (
              <div
                onClick={() => {
                  if (!isFolder) {
                    const fileUrl = `https://github.com/${repoOwner}/${repoName}/blob/main/${id}`;
                    window.open(fileUrl, "_blank");
                  }
                }}
                className={`p-3 text-sm font-medium flex flex-col ${isDarkMode ? 'text-white' : 'text-gray-900'} ${
                  !isFolder ? "cursor-pointer hover:underline" : ""
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2">{isFolder ? "📁" : "📄"}</span>
                  <span className="truncate" title={label}>
                    {label}
                  </span>
                </div>
                {shouldCompact && (
                  <div className="w-full mt-2">
                    <div className="flex flex-wrap">
                      {node.children
                        .filter(child => child.type !== "tree")
                        .slice(0, 12)
                        .map((child, index) => {
                          const fileName = child.path.split("/").pop();
                          return (
                            <div
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                const fileUrl = `https://github.com/${repoOwner}/${repoName}/blob/main/${child.path}`;
                                window.open(fileUrl, "_blank");
                              }}
                              className={`text-sm px-1 py-0.5 rounded mb-1 w-1/2 truncate ${
                                child.type !== "tree"
                                  ? "cursor-pointer hover:underline bg-rgba(187, 222, 251) bg-opacity-50 hover:bg-opacity-70"
                                  : "bg-gray-100 bg-opacity-50"
                              }`}
                              title={fileName}
                            >
                              {fileName}
                            </div>
                          );
                        })}
                    </div>
                    {node.children.filter(child => child.type !== "tree").length > 12 && (
                      <div 
                        className={`text-xs px-1 py-0.5 w-full text-center cursor-pointer hover:underline ${
                          isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          const folderUrl = `https://github.com/${repoOwner}/${repoName}/tree/main/${node.path}`;
                          window.open(folderUrl, "_blank");
                        }}
                      >
                        +{node.children.filter(child => child.type !== "tree").length - 12} more files
                      </div>
                    )}
                  </div>
                )}
              </div>
            ),
          },
          position: { x: 0, y: 0 },
          style: nodeStyle,
          depth,
          isFolder,
          positionIndex,
        });

        if (parentId) {
          graphEdges.push({
            id: `${parentId}-${id}`,
            source: parentId,
            target: id,
            style: { stroke: "#90a4ae", strokeWidth: 2 },
            animated: true,
          });
        }

        if (isFolder && node.children && !shouldCompact) {
          const { files, folders } = separateItems(node.children);

          files.forEach((file, i) => {
            const filePos =
              i % 2 === 0
                ? Math.floor(i / 2) + 1
                : -Math.floor(i / 2) - 1;
            traverse(file, id, depth + 1, filePos);
          });

          folders.forEach((folder, i) => {
            const folderPos =
              i % 2 === 0
                ? Math.floor(files.length / 2) + Math.floor(i / 2) + 1
                : -Math.floor(files.length / 2) - Math.floor(i / 2) - 1;
            traverse(folder, id, depth + 1, folderPos);
          });
        }
      };

      const { files, folders } = separateItems(tree);

      files.forEach((file, i) => {
        const pos = i % 2 === 0 ? Math.floor(i / 2) + 1 : -Math.floor(i / 2) - 1;
        traverse(file, rootId, 0, pos);
      });

      folders.forEach((folder, i) => {
        const pos =
          i % 2 === 0
            ? Math.floor(files.length / 2) + Math.floor(i / 2) + 1
            : -Math.floor(files.length / 2) - Math.floor(i / 2) - 1;
        traverse(folder, rootId, 0, pos);
      });

      graphNodes.forEach((node) => {
        dagreGraph.setNode(node.id, {
          width: node.style.width,
          height: node.style.minHeight,
          rank: node.positionIndex * (node.isFolder ? (layoutDirection === "TB" ? 3 : 2) : 1),
        });
      });

      graphEdges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraph);

      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;
      graphNodes.forEach((node) => {
        const pos = dagreGraph.node(node.id);
        minX = Math.min(minX, pos.x);
        maxX = Math.max(maxX, pos.x);
        minY = Math.min(minY, pos.y);
        maxY = Math.max(maxY, pos.y);
      });

      const rootPos = dagreGraph.node(rootId);
      const offsetX = (minX + maxX) / 2 - rootPos.x;
      const offsetY = (minY + maxY) / 2 - rootPos.y;

      return {
        graphNodes: graphNodes.map((node) => {
          const pos = dagreGraph.node(node.id);
          return {
            ...node,
            position: {
              x: pos.x + offsetX - node.style.width / 2,
              y: pos.y + offsetY - node.style.minHeight / 2,
            },
          };
        }),
        graphEdges,
      };
    },
    [repoName, repoOwner, layoutDirection, isDarkMode]
  );

  useEffect(() => {
    if (treeData?.length > 0) {
      setNodes([]);
      setEdges([]);
      setTimeout(() => {
        const { graphNodes, graphEdges } = buildGraph(treeData);
        setNodes(graphNodes);
        setEdges(graphEdges);
        setFlowKey(Date.now());
      }, 150);
    }
  }, [treeData, layoutDirection, setNodes, setEdges, buildGraph]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      
      // Apply theme class to fullscreen element
      if (isFs) {
        const theme = isDarkMode ? 'dark' : 'light';
        document.fullscreenElement.classList.add(theme);
        document.fullscreenElement.classList.add('bg-white', 'dark:bg-gray-900');
      }
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isDarkMode]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      reactFlowWrapper.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleDownload = async (type) => {
    const flowContainer = document.querySelector('.react-flow');
    if (!flowContainer) return;
    
    try {
      // Temporarily disable edge animations
      const edges = flowContainer.querySelectorAll('.react-flow__edge-path');
      edges.forEach(edge => {
        edge.style.animation = 'none';
      });

      // Hide minimap and controls
      const minimap = flowContainer.querySelector('.react-flow__minimap');
      const controls = flowContainer.querySelector('.react-flow__controls');
      const originalMinimapDisplay = minimap?.style.display;
      const originalControlsDisplay = controls?.style.display;
      
      if (minimap) minimap.style.display = 'none';
      if (controls) controls.style.display = 'none';

      // Get background color for proper rendering
      const bgColor = window.getComputedStyle(flowContainer).backgroundColor;

      // Add a small delay to ensure UI updates
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = type === "png" 
        ? await toPng(flowContainer, { backgroundColor: bgColor }) 
        : await toSvg(flowContainer, { backgroundColor: bgColor });
      
      // Restore original styles
      edges.forEach(edge => {
        edge.style.animation = '';
      });
      if (minimap) minimap.style.display = originalMinimapDisplay;
      if (controls) controls.style.display = originalControlsDisplay;

      const link = document.createElement("a");
      link.download = `${repoOwner}-${repoName}-tree.${type}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const flowContainer = document.querySelector('.react-flow');
      if (!flowContainer) throw new Error("Flow container not found");

      const pdfData = {
        name: `${repoOwner}/${repoName}`,
        children: treeData.map((item) => ({
          name: item.path.split("/").pop(),
          type: item.type,
          children: (item.children || []).map((child) => ({
            name: child.path.split("/").pop(),
            type: child.type,
          })),
        })),
      };

      const pdf = await generateRepositoryPdf(pdfData, flowContainer);
      pdf.save(`${repoOwner}-${repoName}-visual-structure.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const toggleLayoutDirection = () => {
    setLayoutDirection((prev) => (prev === "TB" ? "LR" : "TB"));
  };

  const minZoom = isMobile() ? 0.2 : 0.5;

  const fitViewOptions = {
    padding: 0.15,
    minZoom,
    maxZoom: 2,
  };

  return (
    <div
      className="relative bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden transition-colors duration-200 flex flex-col"
      style={{ height: "calc(100vh - 128px)" }}
    >
      {/* Header with controls (always visible) */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center relative">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Repository Structure:
        </h2>

        <div className="flex space-x-3">
          <button
            className="btn-sm btn-outline flex items-center gap-1"
            onClick={toggleLayoutDirection}
            title={`Switch layout to ${
              layoutDirection === "TB" ? "Left-Right" : "Top-Bottom"
            }`}
          >
            {layoutDirection === "TB" ? (
              <ArrowDownCircle size={19} />
            ) : (
              <ArrowRightCircle size={19} />
            )}
          </button>
          <button
            className="btn-sm btn-outline flex items-center gap-1"
            onClick={() => setShowMiniMap(!showMiniMap)}
            title={showMiniMap ? "Hide minimap" : "Show minimap"}
          >
            <Map size={19} />
          </button>
          <button
            className="btn-sm btn-outline flex items-center gap-1"
            onClick={() => setShowDropdown(!showDropdown)}
            title="Download Options"
          >
            <Download size={19} />
          </button>
          <button
            className="btn-sm btn-outline flex items-center gap-1"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize size={19} />
            ) : (
              <Maximize size={19} />
            )}
          </button>
        </div>

        {showDropdown && !isFullscreen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-md z-50"
          >
            <button
              className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                handleDownload("png");
                setShowDropdown(false);
              }}
            >
              Download PNG
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                handleDownload("svg");
                setShowDropdown(false);
              }}
            >
              Download SVG
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                handleDownloadPDF();
                setShowDropdown(false);
              }}
            >
              Download PDF
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 relative" ref={reactFlowWrapper}>
        {/* Floating controls (only visible in fullscreen mode) */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex space-x-2">
              <button
                className={`p-2 rounded-md shadow-md transition-colors border backdrop-blur-sm ${
                  isDarkMode 
                    ? 'bg-gray-800/90 border-gray-700 hover:bg-gray-700 text-gray-300'
                    : 'bg-white/90 border-gray-200 hover:bg-gray-100 text-gray-700'
                }`}
                onClick={toggleLayoutDirection}
                title={`Switch layout to ${
                  layoutDirection === "TB" ? "Left-Right" : "Top-Bottom"
                }`}
              >
                {layoutDirection === "TB" ? (
                  <ArrowDownCircle size={19} />
                ) : (
                  <ArrowRightCircle size={19} />
                )}
              </button>
              <button
                className={`p-2 rounded-md shadow-md transition-colors border backdrop-blur-sm ${
                  isDarkMode 
                    ? 'bg-gray-800/90 border-gray-700 hover:bg-gray-700 text-gray-300'
                    : 'bg-white/90 border-gray-200 hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => setShowMiniMap(!showMiniMap)}
                title={showMiniMap ? "Hide minimap" : "Show minimap"}
              >
                <Map size={19} />
              </button>
              <div className="relative">
                <button
                  className={`p-2 rounded-md shadow-md transition-colors border backdrop-blur-sm ${
                    isDarkMode 
                      ? 'bg-gray-800/90 border-gray-700 hover:bg-gray-700 text-gray-300'
                      : 'bg-white/90 border-gray-200 hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setShowDropdown(!showDropdown)}
                  title="Download Options"
                >
                  <Download size={19} />
                </button>
                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-md z-50"
                  >
                    <button
                      className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        handleDownload("png");
                        setShowDropdown(false);
                      }}
                    >
                      Download PNG
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        handleDownload("svg");
                        setShowDropdown(false);
                      }}
                    >
                      Download SVG
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        handleDownloadPDF();
                        setShowDropdown(false);
                      }}
                    >
                      Download PDF
                    </button>
                  </div>
                )}
              </div>
              <button
                className={`p-2 rounded-md shadow-md transition-colors border backdrop-blur-sm ${
                  isDarkMode 
                    ? 'bg-gray-800/90 border-gray-700 hover:bg-gray-700 text-gray-300'
                    : 'bg-white/90 border-gray-200 hover:bg-gray-100 text-gray-700'
                }`}
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize size={19} />
                ) : (
                  <Maximize size={19} />
                )}
              </button>
            </div>
          </div>
        )}

        <ReactFlow
          key={flowKey}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={fitViewOptions}
          minZoom={minZoom}
        >
          {showMiniMap && (
            <MiniMap
              nodeColor={(node) =>
                depthColors[Math.min(node.depth || 0, depthColors.length - 1)] || "#90caf9"
              }
              nodeStrokeWidth={1}
              style={{
                width: isMobile() ? 100 : 200,
                height: isMobile() ? 80 : 150,
                opacity: 0.9,
                transition: 'opacity 0.2s ease'
              }}
              className="hover:opacity-100"
            />
          )}
          <Controls 
            style={{
              left: 10,
              bottom: 10,
              right: 'auto',
              top: 'auto'
            }}
          />
          <Background gap={12} size={1} color="#e2e8f0" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowChartView;