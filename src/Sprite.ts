import { QuadBuffer } from './QuadBuffer';
import { Transform2d } from './Transform';

export class Sprite{
    private _transform: Transform2d;
    
    constructor(private _id: number, private _buffer: QuadBuffer){

    }
}