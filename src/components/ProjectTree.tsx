"use client";

import { ChevronDown, ChevronRight, Folder } from "lucide-react";

interface ProjectTreeProps {
    selectedNode: string,
    onNodeSelect: (nodeId: string) => void
}

export default function ProjectTree({ selectedNode, onNodeSelect }: ProjectTreeProps) {
    const TreeNode = ({
                          id,
                          label,
                          icon: Icon,
                          children,
                          level = 0
                      }: {
        id: string,
        label: string,
        icon: any,
        children?: any[],
        level?: number
    }) => {
        const isExpanded = true;
        const hasChildren = children && children.length > 0;

        return (
            <div>
                <div
                    className={`flex items-center py-1 px-2 cursor-pointer hover:bg-[#2d2d30] ${
                        selectedNode === id ? "bg-[#0e639c]" : ""}`}
                    style={{ paddingLeft: `${8 + level * 16}px` }}
                    onClick={() => {
                        onNodeSelect(id);
                    }}
                >
                    {hasChildren && (
                        <button className="mr-1 p-0.5">
                            {isExpanded ? <ChevronDown className="w-3 h-3"/> : <ChevronRight className="w-3 h-3"/>}
                        </button>
                    )}
                    {!hasChildren && <div className="w-4"/>}
                    <Icon className="w-4 h-4 mr-2 text-gray-400"/>
                    <span className="text-sm">{label}</span>
                </div>
            </div>
        );
    }

    const treeData = [
        {
            id: "classes",
            label: "Classes",
            icon: Folder,
            children: []
        }
    ];

    return (
        <div className="w-64 bg-[#252526] border-r border-[#3e3e42] overflow-y-auto">
            <div className="p-2 border-b border-[#3e3e42]">
                <h3 className="text-sm font-medium text-gray-300">Project Explorer</h3>
            </div>
            <div className="py-2">
                {treeData.map((node) => (
                    <TreeNode key={node.id} {...node} />
                ))}
            </div>
        </div>
    );
}