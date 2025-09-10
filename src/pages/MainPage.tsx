"use client";

import { ToolBar } from "@components/ToolBar";
import { MenuBar } from "@components/MenuBar";
import ProjectTree from "@components/ProjectTree";
import { useState } from "react";
import { ProcessAttachDialog } from "@components/dialog/ProcessAttachDialog";

export function MainPage() {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    return (
        <div
            className="h-screen bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] text-gray-200 flex flex-col font-mono text-xs overflow-hidden shadow-2xl font-mono">
            <MenuBar />
            <ToolBar />

            <div className="flex flex-1 overflow-hidden">
                <ProjectTree selectedNode={selectedNode} onNodeSelect={setSelectedNode}/>
            </div>
        </div>
    );
}