import {createContext, useContext, useEffect, useState} from "react";
import {getCurrentWindow, Window} from "@tauri-apps/api/window";
import { WindowIcons } from "@components/WindowIcons";

let isMaximized: boolean = false;

export function MenuBar() {

    const closeWindow = async () => {
        await getCurrentWindow().close();
    };

    const toggleMaximize = async () => {
        await getCurrentWindow().toggleMaximize();
        isMaximized = await getCurrentWindow().isMaximized();
    };

    const minimize = async () => {
        await getCurrentWindow().minimize();
    }

    const [activeMenu, setActiveMenu] = useState<String | null>(null);

    const menus = [
        {
            name: "File",
            items: []
        }
    ];

    return (
        <div data-tauri-drag-region className="flex flex-row bg-[#171717] border-b border-[#3e3e42] px-2 py-1">
            <div className="flex flex-row space-x-4">
                {menus.map((menu) => (
                    <div data-tauri-drag-region key={menu.name} className="relative">
                        <button className="px-3 py-1 text-gray-300 hover:bg-[#3e3e42] rounded text-sm"
                        >
                            {menu.name}
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex flex-1"></div>
            <div className="flex flex-row py-1 space-x-2">
                <button
                    onClick={minimize}
                    className="inline-flex items-center justify-center max-h-8 p-1 cursor-default rounded-none bg-transparent text-white hover:bg-white/[.06] hover:text-white active: bg-[#C42B1C]/90"
                >
                    <WindowIcons.minimizeWin />
                </button>
                <button
                    onClick={toggleMaximize}
                    className="inline-flex items-center justify-center max-h-8 p-1 cursor-default rounded-none bg-transparent text-white hover:bg-white/[.06] hover:text-white active: bg-[#C42B1C]/90"
                >
                    <WindowIcons.maximizeWin />
                </button>
                <button
                    onClick={closeWindow}
                    className="inline-flex items-center justify-center max-h-8 p-1 cursor-default rounded-none bg-transparent text-white hover:bg-[#C42B1C]/50 hover:text-white active: bg-[#C42B1C]/90"
                >
                    <WindowIcons.closeWin />
                </button>
            </div>
        </div>
    );
}