export class LevelData {
  public index: number;
  public chars: string[][];
  public question: string[];
  public answer: string[];

  constructor(index: number, chars: string[][], question: string[], answer: string[]) {
    this.index = index;
    this.chars = chars;
    this.question = question;
    this.answer = answer;
  }
}
