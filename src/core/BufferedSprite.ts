import { Sprite, SpriteAttributes } from "./interfaces";
import { Transform2d } from "./Transform";
import { QuadBuffer } from "./QuadBuffer";

export class BufferedSprite implements Sprite {
    readonly tag: {[key: string]: any} = {}
    
    private _transform: Transform2d;
    private _options: SpriteAttributes;
    private _isDirty = true;
    
    constructor(private _id: number, private _buffer: QuadBuffer, transform?: Transform2d, options?: SpriteAttributes){
        this._transform = transform || new Transform2d();
        if(options){
            _buffer.setAttributes(
                _id,
                options.x,
                options.y,
                options.x + options.w,
                options.y + options.h,
                options.textureX,
                options.textureY,
                options.textureX + options.w,
                options.textureY + options.h,
                options.r,
                options.g,
                options.b,
                options.a
            );
        }
        this._options = options || _buffer.getAttributeInfo(_id);
    }

    get transform(){
        return this._transform;
    }

    get isDirty(){
        return this._isDirty;
    }

    get x(){
        return this._options.x;
    }

    get y(){
        return this._options.y;
    }

    // setAttribute(key: AttributeKey, value: any){
    //     this._isDirty = true;
    //     this._options[key] = value;
    // }

    update(){
        if(this._transform.isDirty || this._isDirty){
            let a = this._options;
            let m = this._transform.matrix;
            let id = this._id;

            this._buffer.setPositionTransformed(id,a.x,a.y,a.x+a.w,a.y+a.h,m);
            this._buffer.setZ(id, a.z || 1);
            this._buffer.setPalShift(id, a.palOffset || 0);
            this._buffer.setUv(id, a.textureX, a.textureY, a.textureX+a.w, a.textureY+a.h);
            this._isDirty = false;
        }
    }

    center(){
        this._transform.ox = this._options.x + this._options.w/2;
        this._transform.oy = this._options.y + this._options.h/2;
    }

}