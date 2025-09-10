use crate::error::Result;
use crate::managers::process_manager::ProcessInfo;
use crate::AppState;
use tauri::State;

#[tauri::command]
pub async fn list_processes(state: State<'_, AppState>) -> Result<Vec<ProcessInfo>> {
    Ok(state.process_manager.list_processes())
}
