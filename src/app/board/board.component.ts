import { Component, OnInit } from '@angular/core';
import { Board } from '../com/engine/board/board';
import { Role } from '../com/engine/role/role';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  board: Board
  sourceSquare!: HTMLDivElement;
  targetSquare!: HTMLDivElement;
  modifiedSquares!: HTMLDivElement[];
  possibleMoves!: HTMLDivElement[]; 
  selectedPiece!: HTMLImageElement;
  constructor() {
    this.board = new Board();
  }

  ngOnInit(): void {
    
  }

  cleanSquares(){
    this.modifiedSquares?.forEach(square => square.classList.remove("possible-move"))
    this.modifiedSquares = [];
  }
  
  getSquareIndex(square: HTMLDivElement){
    return Number.parseInt(square.id);
  }
  getTargetSquare(event: Event){
      return ((event.target as HTMLElement).parentElement as HTMLDivElement);
  }

  getTargetSquareIndex(event: Event){
    return Number.parseInt(((event.target as HTMLElement).parentElement as HTMLDivElement).id);
  }

  getTargetPieceRole(square: HTMLDivElement){
    return 
  }

  getTargetPieceParent(event: MouseEvent){
    return (event.target as HTMLImageElement).parentElement as HTMLDivElement;
  }

  flipBoard(){
    this.board.squares.reverse();
  }

  handlePieceDragStart(event: DragEvent){
    this.sourceSquare = this.getTargetSquare(event);
    this.showPossibleMoves(this.getTargetSquareIndex(event));
  }
  
  handlePieceDragEnd(event: DragEvent){
    this.targetSquare = event.target as HTMLDivElement
  }

  handlePieceClick(event: MouseEvent){
    this.showPossibleMoves(this.getTargetSquareIndex(event));
    this.sourceSquare = this.getTargetPieceParent(event)
  }

  handleSquareClick(event: MouseEvent){
    let i = event.target as HTMLDivElement;
    if(this.possibleMoves){
      if(this.possibleMoves.includes(i)){
        this.board.play(
          {
            from: this.getSquareIndex(this.sourceSquare),
            to: this.getSquareIndex(i),
            capture: false,
            promotion: false,
            piece: this.board.squares[this.getSquareIndex(i)].piece!,
           })
      }
    }
  }
  
  handleSquareDragOver(event: DragEvent){
    event.preventDefault();
  }
  
  handleSquareDrop(event: DragEvent){
    this.targetSquare = event.target as HTMLDivElement;
    if(!this.possibleMoves.includes(this.targetSquare)) return;
    if(this.targetSquare.id)
    console.log(`${this.targetSquare} == ${this.sourceSquare}`, this.targetSquare.parentElement == this.sourceSquare)
    if(this.targetSquare.parentElement == this.sourceSquare) return;
    this.targetSquare.innerHTML = event.dataTransfer!.getData('text/html')
    this.sourceSquare.innerHTML = ''
    this.sourceSquare = this.targetSquare    
  }

  showPossibleMoves(index: number){
    this.cleanSquares();
    this.possibleMoves = [];
    this.board.calculatePieceMoves(index).then(squares => {
      squares.forEach(i => {
        let square = document.getElementById(i+"") as HTMLDivElement;
        this.possibleMoves.push(square);
          square.classList.add("possible-move") 
          this.modifiedSquares.push(square);
      })
    });
  }
  
}


