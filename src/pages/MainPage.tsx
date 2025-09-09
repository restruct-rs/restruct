"use client";

import { MenuBar } from "../components/MenuBar";

export function MainPage() {
    return (
        <div
            className="h-screen bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] text-gray-200 flex flex-col font-mono text-xs overflow-hidden shadow-2xl">
            <MenuBar/>
        </div>
    );
}