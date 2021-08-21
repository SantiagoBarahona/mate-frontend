import { assertNotNull } from "@angular/compiler/src/output/output_ast";
import { OnInit } from "@angular/core";
import { Move, Piece, Player, Request, Role, RoleEnum } from "src/app/types/types";
import { Square } from "./square";

export class Board {

    boardUID = "";
    whiteTurn: boolean;
    squares: Square[]
    pieceTypeFromSybol = new Map<String, Role>()

    constructor(whiteTurn: boolean) {
        this.whiteTurn = whiteTurn;
        this.pieceTypeFromSybol.set('k', {role: "KING", id:5})
        this.pieceTypeFromSybol.set('b', {role: "BISHOP", id:2})
        this.pieceTypeFromSybol.set('p', {role: "PAWN", id:0})
        this.pieceTypeFromSybol.set('n', {role: "KNIGHT", id:1})
        this.pieceTypeFromSybol.set('q', {role: "QUEEN", id: 4})
        this.pieceTypeFromSybol.set('r', {role: "ROOK", id:3})
        this.squares = this.initSquares();
        this.connectBoard().then(res => {
            this.boardUID = res;
        });
        this.loadPositionFromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    }

    private sendXMLHttpRequest(action: string, data: string){
        return new Promise<string>((resolve, reject)=> {
            try {
                let XMLReq = new XMLHttpRequest();
                let req : Request = {action: action, data: data, boardID: this.boardUID }
                XMLReq.open("POST", "http://localhost:7000/api/mate-engine");
                XMLReq.send(JSON.stringify(req))
                XMLReq.addEventListener("loadend", () => {
                    console.log("response: " + XMLReq.response)
                    resolve(XMLReq.response as string);
                })
                
            } catch (error) {
                reject(error.message)
            }
        })
    }

    private connectBoard() {
        return this.sendXMLHttpRequest("newConnection", "");
        
        
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
                    let id = role?.id! | (white ? 16 : 8);
                    this.squares[rank * 8 + file].setPiece(role?.role!, white, id!);
                    file++
                }
            }
        }
    }

    calculatePieceMoves(squareIndex: number) {
        return this.sendXMLHttpRequest("calculatePieceMoves", squareIndex+"")

    }

    play(move: Move){
        return new Promise((resolve, reject)=> {
            try {
                this.squares[move.to].movePieceIn(move.piece);
                this.squares[move.from].removePiece();
                this.changeTurn();
                this.sendXMLHttpRequest("playMove", JSON.stringify(move)).then(res => {
                    console.log(`played move. ${res}`)
                    resolve(res)    
                })
            } catch (error) {
                reject(error.message)
            }
        })

    }

    changeTurn(){
        this.whiteTurn = !this.whiteTurn;
        console.log(this.whiteTurn)
    }
}