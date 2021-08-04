import { Piece } from "src/app/types/types";
import { Role } from "../role/role";

export class Square{

    index: number;
    white: boolean
    piece?: Piece;

    constructor(index: number, white: boolean){
        this.index = index;
        this.white = white;
    }

    setPiece(role: Role, white: boolean, id: number){
        this.piece = {role: role, white: white, id: id};
    }

    movePieceIn(piece: Piece){
        this.piece = piece;
    }

    removePiece(){
        this.piece = undefined;
    }

    hasPiece(): boolean{
        return this.piece != null
    }
}