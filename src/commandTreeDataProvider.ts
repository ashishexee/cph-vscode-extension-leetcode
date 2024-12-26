import * as vscode from 'vscode';

// TreeDataProvider implementation for displaying extension commands in a tree view
export class CommandTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | void> = new vscode.EventEmitter<vscode.TreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;

    // Mapping of command IDs to their display names
    private extensionCommands: { [key: string]: string } = {
        'leetcode-cph-helper-by-ashish.fetchLeetCodeTestCases': '👉🏻 Fetch Test Cases',
        'leetcode-cph-helper-by-ashish.runTestCases': '👉🏻 Run Test Cases',
        'leetcode-cph-helper-by-ashish.writeSolutionFile': '👉🏻 Write Solution File',
        'leetcode-test-case-manager.getSolutionFileDirectory': '👉🏻 Get Solution File Directory',
        'leetcode-cph-helper-by-ashish.getIOFileDirectory': '👉🏻 Get I/O File Directory'
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
                    .map(cmd => new CommandTreeItem(cmd, this.extensionCommands[cmd]))
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
    constructor(public readonly commandId: string, public readonly label: string) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.command = {
            command: commandId,
            title: '',
        };
    }
}