import * as vscode from 'vscode';

// TreeDataProvider implementation for displaying extension commands in a tree view
export class CommandTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | void> = new vscode.EventEmitter<vscode.TreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;

    // Mapping of command IDs to their display names, icons, and colors
    private extensionCommands: { [key: string]: { label: string, icon: string, color: string } } = {
        'leetcode-cph-helper-by-ashish.fetchLeetCodeTestCases': { label: 'Fetch Test Cases(CTRL+1)', icon: 'cloud-download', color: 'charts.green' },
        'leetcode-cph-helper-by-ashish.runTestCases': { label: 'Run Test Cases(CTRL+4)', icon: 'play-circle', color: 'charts.blue' },
        'leetcode-cph-helper-by-ashish.writeSolutionFile': { label: 'Write Solution File(CTRL3)', icon: 'file-code', color: 'charts.yellow' },
        'leetcode-cph-helper-by-ashish.getIOFileDirectory': { label: 'Get I/O & Soluton File Directory(CTRL+2)', icon: 'folder', color: 'charts.red' },
        'leetcode-cph-helper-by-ashish.showLeetCodeProblemLinks': { label: 'Show LeetCode Problem Links(CTRL+5)', icon: 'link', color: 'charts.purple' }
    };

    // Returns a TreeItem representation of the given element
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    // Returns the children of the given element or the root elements if no element is provided
    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        if (element) {
            // No children for individual commands
            return Promise.resolve([]);
        } else {
            // Get all registered commands and filter for extension-specific commands
            const commands = vscode.commands.getCommands(true);
            return commands.then(cmds => 
                cmds
                    .filter(cmd => Object.keys(this.extensionCommands).includes(cmd))
                    .map(cmd => {
                        const commandInfo = this.extensionCommands[cmd];
                        const treeItem = new CommandTreeItem(cmd, commandInfo.label, commandInfo.icon, commandInfo.color);
                        return treeItem;
                    })
            );
        }
    }

    // Refreshes the tree view by firing the onDidChangeTreeData event
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}

// TreeItem implementation for representing individual commands in the tree view
class CommandTreeItem extends vscode.TreeItem {
    constructor(
        public readonly commandId: string,
        public readonly label: string,
        public readonly icon: string,
        public readonly color: string
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.tooltip = this.label;
        this.iconPath = new vscode.ThemeIcon(this.icon);
        this.command = {
            command: commandId,
            title: '',
        };
        this.resourceUri = vscode.Uri.parse(`color:${this.color}`);
    }
}