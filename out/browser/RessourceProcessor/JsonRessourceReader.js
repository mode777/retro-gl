define(["require", "exports", "./IndexedTextureReader"], function (require, exports, IndexedTextureReader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //import { RgbaTextureReader } from "./RgbaTextureReader";
    var JsonRessourceReader = (function () {
        function JsonRessourceReader(_gl, _resource) {
            this._gl = _gl;
            this._resource = _resource;
        }
        JsonRessourceReader.prototype.getTexture = function (key) {
            var tex = this._resource.textures[key];
            if (!tex)
                throw "Ressource not found: " + key;
            switch (tex.colorDepth) {
                case 8:
                    return new IndexedTextureReader_1.IndexedTextureReader(this._gl, tex).getRessource();
                case 32:
                //return new RgbaTextureReader(this._gl, tex).getRessource();
                default:
                    throw "Unsupported color depth " + tex.colorDepth;
            }
        };
        return JsonRessourceReader;
    }());
    exports.JsonRessourceReader = JsonRessourceReader;
});
//# sourceMappingURL=JsonRessourceReader.js.map