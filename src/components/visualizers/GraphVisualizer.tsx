'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphEdge } from '@/lib/algorithms/graphTraversal';

interface GraphVisualizerProps {
    nodes: GraphNode[];
    edges: GraphEdge[];
    visitedNodes: Set<string>;
    currentNode?: string;
    activeEdge?: [string, string];
    phase: 'idle' | 'running' | 'complete';
}

export function GraphVisualizer({ nodes, edges, visitedNodes, currentNode, activeEdge, phase }: GraphVisualizerProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    const getNodeState = (id: string) => {
        if (id === currentNode) return 'current';
        if (visitedNodes.has(id)) return 'visited';
        if (phase === 'complete') return 'complete';
        return 'default';
    };

    const isEdgeActive = (e: GraphEdge) => {
        if (!activeEdge) return false;
        return (e.from === activeEdge[0] && e.to === activeEdge[1]) ||
            (e.from === activeEdge[1] && e.to === activeEdge[0]);
    };

    const nodeColors: Record<string, string> = {
        default: 'rgba(255,255,255,0.06)',
        visited: 'rgba(124,58,237,0.4)',
        current: '#06B6D4',
        complete: 'rgba(16,185,129,0.5)',
    };

    const nodeBorders: Record<string, string> = {
        default: 'rgba(255,255,255,0.12)',
        visited: '#7C3AED',
        current: '#22D3EE',
        complete: '#10B981',
    };

    return (
        <div className="graph-container" style={{ height: 360 }}>
            <svg ref={svgRef} width="100%" height="360" style={{ overflow: 'visible' }}>
                <defs>
                    <filter id="glow-cyan">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="glow-purple">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Edges */}
                {edges.map((e, i) => {
                    const from = nodes.find(n => n.id === e.from)!;
                    const to = nodes.find(n => n.id === e.to)!;
                    const active = isEdgeActive(e);
                    return (
                        <motion.line
                            key={i}
                            x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                            stroke={active ? '#9F67FF' : 'rgba(255,255,255,0.1)'}
                            strokeWidth={active ? 2.5 : 1.5}
                            animate={{
                                stroke: active ? '#9F67FF' : 'rgba(255,255,255,0.1)',
                                strokeWidth: active ? 2.5 : 1.5,
                                opacity: active ? 1 : 0.5,
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    );
                })}

                {/* Nodes */}
                {nodes.map((node) => {
                    const state = getNodeState(node.id);
                    return (
                        <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                            <motion.circle
                                r={22}
                                fill={nodeColors[state]}
                                stroke={nodeBorders[state]}
                                strokeWidth={2}
                                filter={state === 'current' ? 'url(#glow-cyan)' : state === 'visited' ? 'url(#glow-purple)' : ''}
                                animate={{
                                    fill: nodeColors[state],
                                    stroke: nodeBorders[state],
                                    scale: state === 'current' ? 1.2 : 1,
                                }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            />
                            <text
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill={state === 'current' ? '#fff' : state === 'default' ? '#94A3B8' : '#fff'}
                                fontSize="13"
                                fontFamily="Space Grotesk, sans-serif"
                                fontWeight="600"
                            >
                                {node.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
