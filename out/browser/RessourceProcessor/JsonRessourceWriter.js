define(["require", "exports", "./TextureWriter"], function (require, exports, TextureWriter_1) {
    "use strict";
    var JsonRessourceWriter = (function () {
        function JsonRessourceWriter() {
            this._textures = {};
            this._palettes = {};
        }
        JsonRessourceWriter.prototype.addTexture = function (key, texture) {
            this._textures[key] = texture;
        };
        JsonRessourceWriter.prototype.addPalette = function (key, texture) {
            this._palettes[key] = texture;
        };
        JsonRessourceWriter.prototype.getJson = function () {
            var textures = {};
            for (var key in this._textures) {
                textures[key] = new TextureWriter_1.TextureWriter(this._textures[key]).getJson();
            }
            return {
                textures: textures
            };
        };
        JsonRessourceWriter.prototype.getJsonString = function () {
            return JSON.stringify(this.getJson());
        };
        // http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
        JsonRessourceWriter.prototype.download = function (filename) {
            var element = document.createElement("a");
            element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(this.getJsonString()));
            element.setAttribute("download", filename);
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        };
        return JsonRessourceWriter;
    }());
    exports.JsonRessourceWriter = JsonRessourceWriter;
});
//# sourceMappingURL=JsonRessourceWriter.js.map