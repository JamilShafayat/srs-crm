export class LibCalc {
  static randByMaxMin(max: number, min = 0.0, type = 'int') {
    if (type === 'int') return Math.ceil(Math.random() * (max - min) + min);
    else return Math.random() * (max - min) + min;
  }
}
