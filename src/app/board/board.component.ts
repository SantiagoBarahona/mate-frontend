import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Board } from '../com/engine/board/board';
import { Square } from '../com/engine/board/square';
import { Piece } from '../types/types';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements AfterViewInit {

  board: Board
  squares: HTMLDivElement[] = []
  SQUARE_MAP: Map<HTMLDivElement, Square> = new Map()
  modifiedSquares: HTMLDivElement[] = []
  possibleMoves: any[] = []
  sourceSq!: Square | null;

  constructor() {
    this.board = new Board(true);
  }

  ngAfterViewInit(): void {
    for(let i = 0; i < 64; i++){
      let square = document.getElementById(i+"") as HTMLDivElement;
      this.squares.push(square)
      this.SQUARE_MAP.set(square, this.board.squares[i])
    }
    this.flipBoard();
    console.log(this.squares, this.SQUARE_MAP)
  }

  cleanSquares(){
      this.modifiedSquares?.forEach(square => square.classList.remove("possible_move"))
      this.modifiedSquares = []
    
  }

  showMoves(e: MouseEvent) {
    this.cleanSquares()
    let square = this.SQUARE_MAP.get((e.target as HTMLImageElement).parentElement as HTMLDivElement);
    this.sourceSq = square!
    this.board.calculatePieceMoves(square?.index!).then(moves => {
      if(moves.length == 0) return;
      let each = moves.split(",")
      each.forEach(move => {
        this.possibleMoves = each
        let sqDiv = document.getElementById(move) as HTMLDivElement
        sqDiv.classList.add("possible_move")
        this.modifiedSquares.push(sqDiv)
      })
    })
  }


  squareClick(e: Event){
        let sq = this.SQUARE_MAP.get(e.target as HTMLDivElement)
        if(this.sourceSq && this.possibleMoves.includes(sq?.index.toString()) && this.sourceSq.piece?.white == this.board.whiteTurn){
          this.board.play({
            type: "normal",
            capture: false,
            to: sq!.index,
            from: this.sourceSq.index,
            piece: this.sourceSq.piece!,
            promotion: null
          })
          this.cleanSquares();
          this.possibleMoves = [];
          this.sourceSq = null
        }
  }

  pieceClick(e: MouseEvent) {
    let targetSq = this.SQUARE_MAP.get((e.target as HTMLImageElement).parentElement as HTMLDivElement)
    if(targetSq?.piece){
      if(targetSq!.piece.white == this.board.whiteTurn)
      this.showMoves(e);
      else if(this.sourceSq && this.sourceSq.piece && this.possibleMoves.includes(targetSq?.index+""))
        this.board.play({
          capture: true,
          from: this.sourceSq.index,
          to: targetSq.index,
          piece: this.sourceSq.piece,
          promotion: null,
          type: "normal"
        }).then(()=> {
          this.cleanSquares();
        })
    }
  }

  flipBoard(){
    let board = document.getElementById("board");
    board?.classList.add('flipped')
  }
  
}