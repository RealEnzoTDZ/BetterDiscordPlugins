/**
 * @name SendButton
 * @invite http
 * @authorLink undefined
 * @donate {{PAYPAL}}
 * @patreon http
 * @website https://github.com/RealEnzoTDZ/BetterDiscordAddons/tree/master/Plugins/SendButton
 * @source https://raw.githubusercontent.com/RealEnzoTDZ/BetterDiscordAddons/master/Plugins/SendButton/SendButton.plugin.js
 */
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

module.exports = (() => {
    const config = {"info":{"name":"Send Button","authors":[{"name":"It's The 13 Enzo","discord_id":"725070512060891197","github_username":"RealEnzoTDZ","twitter_username":"TheTDZ"}],"version":"0.1.3","authorLinbk":"https://twitter.com/TheTDZ","patreonLink":"http","inviteCode":"http","description":"Adds a clickable send button.","github":"https://github.com/RealEnzoTDZ/BetterDiscordAddons/tree/master/Plugins/SendButton","github_raw":"https://raw.githubusercontent.com/RealEnzoTDZ/BetterDiscordAddons/master/Plugins/SendButton/SendButton.plugin.js"},"changelog":[{"title":"Fixed","type":"fixed","items":["Styling should be more consistent","Less performance drain"]},{"title":"New Stuff","items":["Move to using only the local library."]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const buttonHTML = `<div class="send-button">
    <img src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTIuMDEgMjFMMjMgMTIgMi4wMSAzIDIgMTBsMTUgMi0xNSAyeiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+">
</div>`;

    const press = new KeyboardEvent("keydown", {key: "Enter", code: "Enter", which: 13, keyCode: 13, bubbles: true});
    Object.defineProperties(press, {keyCode: {value: 13}, which: {value: 13}});

    const {DiscordSelectors, PluginUtilities, DOMTools, Logger} = Api;
    return class SendButton extends Plugin {
        onStart() {
            const form = document.querySelector("form");
            if (form) this.addButton(form);
            BdApi.showConfirmationModal("Start-Up", 
                [
                    "I Would Just Like To Let You Know This Is An Early Access Build!",
                    "Coded by It's The 13 Enzo | <@725070512060891197>",
                ],
                {
                    danger: false,
                    cancelText: "Okay"
                }
            );
        }
        
        onStop() {
            const button = document.querySelector(".send-button");
            if (button) button.remove();
            PluginUtilities.removeStyle(this.getName());
        }

        addButton(form) {
            if (form.querySelector(".send-button")) return;
            const button = DOMTools.createElement(buttonHTML);
            form.querySelector(DiscordSelectors.Textarea.buttons).append(button);
            button.addEventListener("click", () => {
                const textareaWrapper = form.querySelector(DiscordSelectors.Textarea.textArea);
                if (!textareaWrapper) return Logger.warn("Could not find textarea wrapper");
                const textarea = textareaWrapper.children && textareaWrapper.children[0];
                if (!textarea) return Logger.warn("Could not find textarea");
                textarea.dispatchEvent(press);
            });
        }

        observer(e) {
            if (!e.addedNodes.length || !e.addedNodes[0] || !e.addedNodes[0].querySelector) return;
            const form = e.addedNodes[0].querySelector(DiscordSelectors.Textarea.inner);
            if (form) this.addButton(form);
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
