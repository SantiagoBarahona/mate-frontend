export interface Request{
    action: string,
    data: string,
    boardID: string,
}


export interface Move{
    type: string,
    from: number,
    to: number,
    piece: Piece,
    capture: boolean,
    promotion: Role | null;
}

export interface Piece{
    role: string,
    white: boolean,
    id: number,
}

export interface Role{
    role: string,
    id: number
}

export interface Player{
    name: string,
    ip: string,
    white: boolean,
}

export enum RoleEnum{

    
    WHITE = 8,
    BLACK = 16,
    
    VOID = 0,
    KING = 1,
    QUEEN = 2,
    BISHOP = 3,
    KNIGHT = 4,
    ROOK = 5,
    PAWN = 6,

    
    
}