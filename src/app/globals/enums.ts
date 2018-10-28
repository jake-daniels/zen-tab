
export {}

enum EView {
	Dashboard = 'Dashboard',
	Workspace = 'Workspace',
	History = 'History',
	Settings = 'Settings',
}

declare global {

	enum EView {
		Dashboard = 'Dashboard',
		Workspace = 'Workspace',
		WorkspaceIntro = 'WorkspaceIntro',
		History = 'History',
		Settings = 'Settings',
	}

}

const GLOBAL = (window as any)
GLOBAL.EView = EView
