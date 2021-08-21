import { Piece, Role } from "src/app/types/types";

export class Square{

    index: number;
    white: boolean
    piece?: Piece | null;

    constructor(index: number, white: boolean){
        this.index = index;
        this.white = white;
    }

    setPiece(role: string, white: boolean, id: number){
        this.piece = {role: role, white: white, id: id};
    }

    movePieceIn(piece: Piece){
        this.piece = piece;
    }

    removePiece(){
        this.piece = null;
    }

    hasPiece(): boolean{
        return this.piece != null
    }
}