define(["require", "exports", "./TextureWriter"], function (require, exports, TextureWriter_1) {
    "use strict";
    var RessourceWriter = (function () {
        function RessourceWriter() {
            this._textures = {};
            this._palettes = {};
        }
        RessourceWriter.prototype.addTexture = function (key, texture) {
            this._textures[key] = texture;
        };
        RessourceWriter.prototype.addPalette = function (key, texture) {
            this._palettes[key] = texture;
        };
        RessourceWriter.prototype.getJson = function () {
            var textures = {};
            for (var key in this._textures) {
                textures[key] = new TextureWriter_1.TextureWriter(this._textures[key]).getJson();
            }
            return {
                textures: textures
            };
        };
        RessourceWriter.prototype.getJsonString = function () {
            return JSON.stringify(this.getJson());
        };
        // http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
        RessourceWriter.prototype.download = function (filename) {
            var element = document.createElement("a");
            element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(this.getJsonString()));
            element.setAttribute("download", filename);
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        };
        return RessourceWriter;
    }());
    exports.RessourceWriter = RessourceWriter;
});
//# sourceMappingURL=RessourceWriter.js.map