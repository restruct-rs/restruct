interface ToolBarProps {

}

export function ToolBar() {
    return (
        <div className="bg-[#2d2d30] border-b border-[#3e3e42] px-4 py-2 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <label className="text-gray-400 text-xs">Process:</label>
                <select
                    value=""
                    className="bg-[#1e1e1e] border border-[#3e3e42] text-gray-200 px-2 py-1 text-xs rounded"
                >
                    <option value="">Select Process...</option>
                </select>
            </div>

            <div className="flex items-center space-x-2">
                <label className="text-gray-400 text-xs">Base Address:</label>
                <input
                    type="text"
                    className="bg-[#1e1e1e] border border-[#3e3e42] text-gray-200 px-2 py-1 text-xs rounded w-24 font-mono"
                    placeholder="0x00000000"
                />
            </div>
        </div>
    );
}