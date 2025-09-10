"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Search } from "lucide-react";

interface Process {
    pid: number,
    name: string,
    path: string,
    arch: string,
    memory: number,
    cpu_usage: number,
    disk_usage: number,
    user_id: string
}

interface ProcessAttachDialogProps {
    isOpen: boolean,
    onClose: () => void
    onAttach: (process: Process) => void
}

export function ProcessAttachDialog({ isOpen, onClose, onAttach }: ProcessAttachDialogProps) {
    const [processes, setProcesses] = useState<Process[]>([]);
    const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchType, setSearchType] = useState<"name" | "pid">("name");

    const refreshProcesses = async () => {
        let _processes = await invoke<Process[]>("list_processes");
        setProcesses(_processes);
    }

    useEffect(() => {
        refreshProcesses();
    }, []);

    const filteredProcesses = processes.filter((process) => {
        if (searchType == "name") {
            return process.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
            return process.pid.toString().includes(searchTerm);
        }
    })

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 backdrop-blur-md bg-[#000000]/50 flex items-center justify-center z-50 select-none pt-10 min-h-[calc(100vh-40px]">
            <div className="bg-[#2d2d30] border border-[#3e3e42] rounded-lg w-[800px] h-[600px] flex flex-col">
                {/* HEADER */}
                <div className="flex items-center justify-between p-4 border-b border-[#3e3e42]">
                    <h2 className="text-gray-200 font-medium">Attach to Process</h2>
                </div>

                {/* SEARCH */}
                <div className="p-4 border-b border-[#3e3e42]">
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={14}/>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={searchType === "name" ? "Search by process name..." : "Search by process ID..."}
                                className="w-full bg-[#1e1e1e] border border-[#3e3e42] text-gray-200 pl-8 pr-3 py-2 text-xs rounded"
                            />
                        </div>
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value as "name" | "pid")}
                            className="bg-[#1e1e1e] border border-[#3e3e42] text-gray-200 px-2 py-2 rounded"
                        >
                            <option value="name">Process Name</option>
                            <option value="pid">Process ID</option>
                        </select>
                    </div>
                </div>

                {/* PROCESS LIST AND DETAILS */}
                <div className="flex flex-1 overflow-hidden">
                    {/* PROCESS LIST */}
                    <div className="w-1/2 border-r border-[#3e3e42] overflow-y-auto">
                        <div className="p-2">
                            <div className="text-xs text-gray-400 mb-2 px-2">{filteredProcesses.length} process(es)
                                found
                            </div>
                            {filteredProcesses.map((process) => (
                                <div
                                    key={process.pid}
                                    onClick={() => setSelectedProcess(process)}
                                    className={`p-2 cursor-pointer rounded text-xs ${selectedProcess?.pid === process.pid ? "bg-[#0e639c] text-white" : "hover:bg-[#3e3e42] text-gray-200"}`}
                                >
                                    <div className="font-medium">{process.name}</div>
                                    <div className="text-gray-400">PID: {process.pid}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PROCESS DETAILS */}
                    <div className="w-9/10 p-4 overflow-y-auto">
                        {selectedProcess ? (
                            <div className="space-y-3">
                                <h3 className="text-gray-200 font-medium text-sm">Process Information</h3>
                                <div className="space-y-2 text-xs">
                                    <div>
                                        <span className="text-gray-400">Name:</span>
                                        <span className="text-gray-200 ml-2">{selectedProcess.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Process ID:</span>
                                        <span className="text-gray-200 ml-2">{selectedProcess.pid}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Path:</span>
                                        <span className="text-gray-200 ml-2">{selectedProcess.path}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Architecture:</span>
                                        <span className="text-gray-200 ml-2">{selectedProcess.arch}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Memory:</span>
                                        <span
                                            className="text-gray-200 ml-2">{selectedProcess.memory / 1024 / 1024}MB</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">CPU Usage:</span>
                                        <span className="text-gray-200 ml-2">{selectedProcess.cpu_usage}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Disk Usage:</span>
                                        <span className="text-gray-200 ml-2">{selectedProcess.disk_usage}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Running User ID:</span>
                                        <span className="text-gray-200 ml-2">{selectedProcess.user_id}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-400 text-xs">Select a process to view details</div>
                        )}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-[#3e3e42] flex justify-end space-x-2">
                    <button onClick={onClose}
                            className="bg-[#3e3e42] hover:bg-[#4e4e52] text-gray-200 px-4 py-2 text-xs rounded">Cancel
                    </button>
                    <button
                        onClick={() => onAttach(selectedProcess)}
                        disabled={!selectedProcess}
                        className={`px-4 py-2 text-xs rounded ${selectedProcess ? "bg-[#0e639c] hover:bg-[#1177bb] text-white" : "bg-[#2a2a2a] text-gray-500 cursor-not-allowed"}`}
                    >Attach
                    </button>
                </div>
            </div>
        </div>
    );
}