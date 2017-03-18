import { MAT4_IDENT } from './constants';
import { MatrixTransform } from './interfaces';

export class Transform2d implements MatrixTransform {
    
    private _matrix: mat4;
    private _dirty = true;
    private _rDirty = true;
    
    private _trans: vec3;
    private _scale: vec3;
    private _origin: vec3;

    private _axis: vec3;
    private _angle: number;
    private _quat: quat;

    constructor(){
        this._matrix = mat4.create();
        this._quat = quat.create();
        this._trans = vec3.fromValues(0,0,0);
        this._origin = vec3.fromValues(0,0,0);
        this._scale = vec3.fromValues(1,1,1);
        this._axis = vec3.fromValues(0,0,1);
        this._angle = 0;
    }

    get matrix(){
        if(this._dirty)
            this._buildMatrix();

        this._buildMatrix();
        return this._matrix;
    }

    get x(){
        return this._trans[0];
    }

    set x(value: number){
        this._trans[0] = value;
        this._dirty = true;
    }

    get y(){
        return this._trans[1];
    }

    set y(value: number){
        this._trans[1] = value;
        this._dirty = true;
    }

    get z(){
        return this._trans[2];
    }

    set z(value: number){
        this._trans[2] = value;
        this._dirty = true;
    }

    get rot(){
        return this._angle;
    }

    set rot(value: number){
        this._angle = value;
        this._rDirty = true;
        this._dirty = true;
    }

    get sx(){
        return this._scale[0];
    }

    set sx(value: number){
        this._scale[0] = value;
        this._dirty = true;
    }

    get sy(){
        return this._scale[1];
    }

    set sy(value: number){
        this._scale[1] = value;
        this._dirty = true;
    }

    get ox(){
        return this._origin[0];
    }

    set ox(value: number){
        this._origin[0] = value;
        this._dirty = true;
    }

    get oy(){
        return this._origin[1];
    }

    set oy(value: number){
        this._origin[1] = value;
        this._dirty = true;
    }

    get isDirty(){
        return this._dirty;   
    }
    
    update(){
        if(this._dirty)
            this._buildMatrix();
    }


    private _buildMatrix(){        
        if(this._rDirty)
            this._buildQuat();

        mat4.fromRotationTranslationScaleOrigin(this._matrix,this._quat, this._trans, this._scale, this._origin);
        this._dirty = false;
    }

    private _buildQuat(){
        quat.setAxisAngle(this._quat, this._axis, this._angle);
        this._rDirty = false;
    }
}