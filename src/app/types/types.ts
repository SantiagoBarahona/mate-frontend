import { Role } from "../com/engine/role/role";

export interface Move{
    from: number,
    to: number,
    piece: Piece,
    capture: boolean,
    promotion: boolean
}

export interface Piece{
    role: Role,
    white: boolean,
    id: number,
}