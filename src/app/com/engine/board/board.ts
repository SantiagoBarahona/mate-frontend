import { OnInit } from "@angular/core";
import { Move } from "src/app/types/types";
import { Role } from "../role/role";
import { Square } from "./square";

export class Board {

    squares: Square[]
    pieceTypeFromSybol = new Map()

    constructor() {

        this.pieceTypeFromSybol.set('k', Role.King)
        this.pieceTypeFromSybol.set('b', Role.Bishop)
        this.pieceTypeFromSybol.set('p', Role.Pawn)
        this.pieceTypeFromSybol.set('n', Role.Knight)
        this.pieceTypeFromSybol.set('q', Role.Queen)
        this.pieceTypeFromSybol.set('r', Role.Rook)
        this.squares = this.initSquares();
        this.connectBoard();
        this.loadPositionFromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    }

    private sendXMLHttpRequest(reqType: string, type: string, action: string, data: string){
        return new Promise<string []>((resolve, reject)=> {
            try {
                let request = new XMLHttpRequest();
                request.open(reqType, "http://localhost:7000/api/mate-engine")
                let r = {
                    type: type,
                    action: action,   
                    data: data
                }
                request.send(JSON.stringify(r))
                request.addEventListener("loadend", () => {
                    console.log(request.response)
                    resolve((request.response as string).split("\n\r").reverse().slice(1));
                })
                
            } catch (error) {
                reject(error.message)
            }
        })
    }

    private connectBoard() {
        this.sendXMLHttpRequest("POST", "connection", "initialize", "null");
    }

    initSquares() {
        let squares = [];
        for (let row = 0; row < 8; row++) {
            for (let column = 0; column < 8; column++) {
                const square = new Square(row + column * 8, (row % 2) == (column % 2))
                squares[row + column * 8] = square;
            }
        }
        return squares;
    }

    loadPositionFromFEN(FEN: string) {
        let file = 0, rank = 7;
        for (let i = 0; i < FEN.length; i++) {
            let symbol = FEN.charAt(i)
            if (symbol == '/') {
                file = 0;
                rank--;
            } else {
                if (Number.isInteger(Number.parseInt(symbol))) {
                    file += Number.parseInt(symbol)
                } else {
                    let white = symbol == symbol.toUpperCase() ? true : false;
                    let role = this.pieceTypeFromSybol.get(symbol.toLowerCase());
                    let id = role | (white ? Role.White : Role.Black);
                    this.squares[rank * 8 + file].setPiece(role, white, id);
                    file++
                }
            }
        }
    }

    calculatePieceMoves(squareIndex: number) {
        return this.sendXMLHttpRequest("POST", "calculation", "pieceMoves", squareIndex+"")

    }

    play(move: Move){
        console.log(move)
        this.squares[move.to].movePieceIn(move.piece);
        this.squares[move.from].removePiece();
        return this.sendXMLHttpRequest("POST", "action", "move", JSON.stringify(move))
    }
}