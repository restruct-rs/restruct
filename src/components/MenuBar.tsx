import { useCallback, useEffect, useState } from "react";
import { WindowIcons } from "@components/WindowIcons";
import { Window } from "@tauri-apps/api/window";
import { ProcessAttachDialog } from "@components/dialog/ProcessAttachDialog";

interface Menu {
    name: string,
    items: MenuItem[]
}

interface MenuItem {
    name: string,
    onClick: () => void
}

export function MenuBar() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [lastProcess, setLastProcess] = useState<string | null>(null);
    const [isProcessAttachDialogOpen, setIsProcessAttachDialogOpen] = useState(false);

    const menus = [
        {
            name: "File",
            items: [
                {
                    name: "Attach Process",
                    onClick: () => {
                        setIsProcessAttachDialogOpen(true);
                    }
                }
            ]
        }
    ];

    if (lastProcess) {
        menus[0].items.push({
            name: `Re-Attach ${lastProcess}`,
            onClick: () => {
            }
        });
    }

    const [isWindowMaximized, setIsWindowMaximized] = useState(false);
    const [appWindow, setAppWindow] = useState<Window | null>(null);

    const minimizeWindow = async () => {
        await appWindow.minimize();
    }

    const maximizeWindow = async () => {
        await appWindow.toggleMaximize();
    }

    const closeWindow = async () => {
        await appWindow.close();
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("@tauri-apps/api").then((module) => {
                setAppWindow(module.window.getCurrentWindow());
            })
        }
    }, []);

    const updateIsWindowMaximized = useCallback(async () => {
        const _isWindowMaximized = await appWindow.isMaximized();
        setIsWindowMaximized(_isWindowMaximized);
    }, [appWindow]);

    useEffect(() => {
        updateIsWindowMaximized();
        let unlisten: () => void = () => {
        };

        const listen = async () => {
            unlisten = await appWindow.onResized(() => {
                updateIsWindowMaximized();
            });
        }
        listen();

        return () => unlisten && unlisten();
    }, [appWindow, updateIsWindowMaximized]);

    return (
        <div className="flex flex-row bg-[#171717] border-b border-[#3e3e42] px-2 py-1 w-full h-10 select-none">
            <div className="flex flex-row space-x-4">
                {menus.map((menu) => (
                    <div key={menu.name} className="relative">
                        <button
                            className="px-3 py-0 text-gray-300 hover:bg-[#3e3e42] rounded text-sm h-full"
                            onMouseEnter={() => setActiveMenu(menu.name)}
                            onMouseLeave={() => setActiveMenu(null)}
                        >
                            {menu.name}
                        </button>

                        {activeMenu === menu.name && (
                            <div
                                className="absolute top-full left-0 bg-[#262626] border border-[#3e3e42] shadow-lg z-50 min-w-fit whitespace-nowrap overflow-x-hidden"
                                onMouseEnter={() => setActiveMenu(menu.name)}
                                onMouseLeave={() => setActiveMenu(null)}
                            >
                                {menu.items.map((item) => (
                                    <button
                                        key={item.name}
                                        className="block w-full text-left px-3 py-2 text-gray-300 hover:bg-[#3e3e42] text-sm"
                                        onClick={item.onClick}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div data-tauri-drag-region className="flex flex-1 min-h-full"></div>
            <div className="flex flex-row py-1 space-x-2">
                <button
                    onClick={minimizeWindow}
                    className="inline-flex items-center justify-center max-h-8 p-1 cursor-default rounded-none bg-transparent text-white hover:bg-white/[.06] hover:text-white active: bg-[#C42B1C]/90"
                >
                    <WindowIcons.minimizeWin />
                </button>
                <button
                    onClick={maximizeWindow}
                    className="inline-flex items-center justify-center max-h-8 p-1 cursor-default rounded-none bg-transparent text-white hover:bg-white/[.06] hover:text-white active: bg-[#C42B1C]/90"
                >
                    {!isWindowMaximized ? (
                        <WindowIcons.maximizeWin/>
                    ) : (
                        <WindowIcons.maximizeRestoreWin/>
                    )}
                </button>
                <button
                    onClick={closeWindow}
                    className="inline-flex items-center justify-center max-h-8 p-1 cursor-default rounded-none bg-transparent text-white hover:bg-[#C42B1C]/50 hover:text-white active: bg-[#C42B1C]/90"
                >
                    <WindowIcons.closeWin />
                </button>
            </div>
            <ProcessAttachDialog
                isOpen={isProcessAttachDialogOpen}
                onClose={() => setIsProcessAttachDialogOpen(false)}
                onAttach={(process) => {
                    setLastProcess(process.name);
                    setIsProcessAttachDialogOpen(false);
                }}
            />
        </div>
    );
}