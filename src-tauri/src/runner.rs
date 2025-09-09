use anyhow::Result;
use tauri::{Builder, Runtime};

pub trait Runner<T: Runtime> {
    fn run_app(self) -> Result<()>;
}

impl<T: Runtime> Runner<T> for Builder<T> {
    fn run_app(self) -> Result<()> {
        self.run(tauri::generate_context!())
            .expect("Failed to run application.");
        Ok(())
    }
}
