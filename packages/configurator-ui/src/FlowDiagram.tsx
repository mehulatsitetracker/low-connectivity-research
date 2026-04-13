import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { theme } from './theme';
import type { FlowNode, FlowEdge } from './types';

// ─── Custom Nodes ──────────────────────────────────────────
function ScreenNode({ data }: NodeProps) {
  const isActive = data.isActive as boolean;
  const nodeLabel = data.label as string;
  const scenarioCount = (data.scenarioCount as number) || 0;

  return (
    <div
      style={{
        padding: '10px 18px',
        borderRadius: 10,
        background: isActive ? theme.colors.surfaceActive : theme.colors.diagramNodeBg,
        border: `${isActive ? 2 : 1}px solid ${isActive ? theme.colors.accent : theme.colors.diagramNodeBorder}`,
        color: isActive ? theme.colors.accent : theme.colors.text,
        fontSize: 13,
        fontWeight: isActive ? 600 : 500,
        fontFamily: theme.font.family,
        cursor: 'pointer',
        transition: `all ${theme.transition.fast}`,
        minWidth: 120,
        textAlign: 'center' as const,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0, width: 1, height: 1 }} />
      <div>{nodeLabel}</div>
      {scenarioCount > 0 && (
        <div style={{
          marginTop: 3, fontSize: 9, color: theme.colors.textMuted, fontWeight: 400,
        }}>
          {scenarioCount} scenario{scenarioCount !== 1 ? 's' : ''}
        </div>
      )}
      <Handle type="source" position={Position.Right} style={{ opacity: 0, width: 1, height: 1 }} />
      <Handle type="source" position={Position.Bottom} id="scenarios" style={{ opacity: 0, width: 1, height: 1 }} />
    </div>
  );
}

function ScenarioNode({ data }: NodeProps) {
  const isActive = data.isActive as boolean;
  const nodeLabel = data.label as string;

  return (
    <div
      style={{
        padding: '5px 10px',
        borderRadius: 5,
        background: isActive ? 'rgba(0,132,124,0.15)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isActive ? theme.colors.accent : theme.colors.border}`,
        color: isActive ? theme.colors.accent : theme.colors.textSecondary,
        fontSize: 10,
        fontWeight: isActive ? 600 : 400,
        fontFamily: theme.font.family,
        cursor: 'pointer',
        transition: `all ${theme.transition.fast}`,
        whiteSpace: 'nowrap' as const,
        textAlign: 'center' as const,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0, width: 1, height: 1 }} />
      {nodeLabel}
    </div>
  );
}

function SectionNode({ data }: NodeProps) {
  return (
    <div style={{
      padding: '16px 20px',
      borderRadius: 12,
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${theme.colors.border}`,
      width: data.width as number,
      height: data.height as number,
      pointerEvents: 'none' as const,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '1.2px',
        color: theme.colors.categoryLabel, fontFamily: theme.font.family,
        textTransform: 'uppercase' as const,
      }}>
        {data.label as string}
      </div>
    </div>
  );
}

const nodeTypes = { screen: ScreenNode, scenario: ScenarioNode, section: SectionNode };

// ─── Layout ────────────────────────────────────────────────
const SCREEN_NODE_W = 150;
const SCREEN_NODE_H = 55;
const SCENARIO_NODE_W = 120;
const SCENARIO_NODE_H = 26;
const SCENARIO_COL_GAP = 8;
const SCENARIO_ROW_GAP = 6;
const SCREEN_GAP = 60;          // gap between screen columns
const SCREEN_TO_SCENARIO = 24;  // vertical gap screen → scenarios
const SECTION_PAD_X = 24;
const SECTION_PAD_TOP = 44;     // space for section label
const SECTION_PAD_BOTTOM = 20;
const SECTION_GAP = 40;         // gap between section boxes
const ROW_START_X = 0;

function buildReactFlowData(
  flowNodes: FlowNode[],
  flowEdges: FlowEdge[],
  activeNodeId?: string,
): { rfNodes: Node[]; rfEdges: Edge[] } {
  const categories = [...new Set(flowNodes.map((n) => n.category))];
  const rows = new Map<string, FlowNode[]>();
  for (const cat of categories) {
    rows.set(cat, flowNodes.filter((n) => n.category === cat && n.nodeType !== 'scenario'));
  }

  const rfNodes: Node[] = [];
  const rfEdges: Edge[] = [];

  let sectionY = 0;

  for (const [cat, rowNodes] of rows) {
    // Calculate per-screen column widths (based on number of scenarios)
    const columnWidths: number[] = rowNodes.map(node => {
      if (!node.scenarios || node.scenarios.length === 0) return SCREEN_NODE_W;
      const scenarioCols = Math.min(node.scenarios.length, 2);
      const scenariosWidth = scenarioCols * SCENARIO_NODE_W + (scenarioCols - 1) * SCENARIO_COL_GAP;
      return Math.max(SCREEN_NODE_W, scenariosWidth);
    });

    // Calculate per-screen scenario block height
    const maxScenarioRows = Math.max(0, ...rowNodes.map(node => {
      if (!node.scenarios || node.scenarios.length === 0) return 0;
      return Math.ceil(node.scenarios.length / 2);
    }));
    const scenarioBlockH = maxScenarioRows > 0
      ? SCREEN_TO_SCENARIO + maxScenarioRows * SCENARIO_NODE_H + (maxScenarioRows - 1) * SCENARIO_ROW_GAP
      : 0;

    // Total row width
    const totalRowW = columnWidths.reduce((a, b) => a + b, 0) + (columnWidths.length - 1) * SCREEN_GAP;

    // Section bounding box
    const sectionW = totalRowW + SECTION_PAD_X * 2;
    const sectionH = SECTION_PAD_TOP + SCREEN_NODE_H + scenarioBlockH + SECTION_PAD_BOTTOM;

    rfNodes.push({
      id: `section-${cat}`,
      type: 'section',
      position: { x: ROW_START_X, y: sectionY },
      data: { label: cat, width: sectionW, height: sectionH },
      selectable: false,
      draggable: false,
      zIndex: -1,
    });

    // Place screen nodes and their scenarios
    let colX = SECTION_PAD_X;
    const screenY = sectionY + SECTION_PAD_TOP;

    rowNodes.forEach((node, i) => {
      const colW = columnWidths[i];
      const screenX = colX + (colW - SCREEN_NODE_W) / 2; // center screen in column

      rfNodes.push({
        id: node.id,
        type: 'screen',
        position: { x: screenX, y: screenY },
        data: {
          label: node.label,
          isActive: node.id === activeNodeId,
          scenarioCount: node.scenarios?.length || 0,
        },
        zIndex: 1,
      });

      // Scenarios below the screen node, in 2 columns
      if (node.scenarios && node.scenarios.length > 0) {
        const cols = Math.min(node.scenarios.length, 2);
        const gridW = cols * SCENARIO_NODE_W + (cols - 1) * SCENARIO_COL_GAP;
        const gridStartX = colX + (colW - gridW) / 2;
        const gridStartY = screenY + SCREEN_NODE_H + SCREEN_TO_SCENARIO;

        node.scenarios.forEach((scenario, si) => {
          const col = si % 2;
          const row = Math.floor(si / 2);
          const scenarioId = `${node.id}-scenario-${si}`;

          rfNodes.push({
            id: scenarioId,
            type: 'scenario',
            position: {
              x: gridStartX + col * (SCENARIO_NODE_W + SCENARIO_COL_GAP),
              y: gridStartY + row * (SCENARIO_NODE_H + SCENARIO_ROW_GAP),
            },
            data: { label: scenario, isActive: false },
            zIndex: 1,
          });

          rfEdges.push({
            id: `edge-sc-${node.id}-${si}`,
            source: node.id,
            sourceHandle: 'scenarios',
            target: scenarioId,
            type: 'smoothstep',
            style: { stroke: theme.colors.border, strokeWidth: 1, strokeDasharray: '3 3' },
          });
        });
      }

      colX += colW + SCREEN_GAP;
    });

    sectionY += sectionH + SECTION_GAP;
  }

  // Main flow edges (screen → screen)
  for (const edge of flowEdges) {
    rfEdges.push({
      id: `edge-${edge.from}-${edge.to}`,
      source: edge.from,
      target: edge.to,
      type: 'smoothstep',
      style: { stroke: theme.colors.diagramEdge, strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: theme.colors.diagramEdge, width: 14, height: 14 },
      zIndex: 2,
    });
  }

  return { rfNodes, rfEdges };
}

// ─── FlowDiagram Component ─────────────────────────────────
interface FlowDiagramProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  activeNodeId?: string;
  onNodeClick: (nodeId: string) => void;
}

export function FlowDiagram({ nodes, edges, activeNodeId, onNodeClick }: FlowDiagramProps) {
  const { rfNodes, rfEdges } = useMemo(
    () => buildReactFlowData(nodes, edges, activeNodeId),
    [nodes, edges, activeNodeId],
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === 'section') return;
      if (node.type === 'scenario') {
        const parentId = node.id.split('-scenario-')[0];
        onNodeClick(parentId);
        return;
      }
      onNodeClick(node.id);
    },
    [onNodeClick],
  );

  if (nodes.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: theme.colors.textMuted }}>
        No flow data available
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnScroll
        zoomOnScroll
        style={{ background: theme.colors.bg }}
      >
        <Background color={theme.colors.border} gap={40} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'section') return 'rgba(255,255,255,0.05)';
            if (node.type === 'scenario') return theme.colors.border;
            return node.data?.isActive ? theme.colors.accent : theme.colors.diagramNodeBorder;
          }}
          maskColor="rgba(0, 0, 0, 0.7)"
          style={{
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 8,
          }}
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}
