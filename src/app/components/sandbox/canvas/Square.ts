import { CanvasObject } from './CanvasObject';
import { createAnimationFuncForTuple, createAnimationFuncForNumber } from './AnimationHelper';

const animatablePropertiesTuple = [
  'position'
];
const animatablePropertiesNumber = [
  'size',
  'strokeWeight'
];

export class Square implements CanvasObject {
  private _position: [number, number] = [0, 0];
  private _size: number = 0;

  private _canvasPosition: [number, number] = [0, 0];
  private _rectBottomRight: [number, number] = [0, 0];

  isHidden: boolean = false;
  isDragEnabled: boolean = false;

  strokeDash: Array<number> = [];
  strokeWeight: number = 1;
  strokeStyle: string = '#000';
  fillStyle: string = '#FFF';

  private animations: Array<Function> = [];

  private updatePositionSize() {
    this._canvasPosition[0] = this._position[0] - this._size / 2;
    this._canvasPosition[1] = this._position[1] - this._size / 2;
    this._rectBottomRight[0] = this._canvasPosition[0] + this._size;
    this._rectBottomRight[1] = this._canvasPosition[1] + this._size;
  }

  get position(): [number, number] {
    return this._position;
  }

  set position(p: [number, number]) {
    this._position = p;
    this.updatePositionSize();
  }

  get size(): number {
    return this._size;
  }

  set size(s: number) {
    this._size = s;
    this.updatePositionSize();
  }

  draw(context: CanvasRenderingContext2D, timestamp: number) {
    if (this.isHidden) {
      return;
    }
    let newAnimations = [];
    this.animations.forEach((animation) => {
      let result = animation(timestamp);
      if (result !== false) {
        newAnimations.push(animation);
      }
    });
    this.animations = newAnimations;

    context.beginPath();
    context.setLineDash(this.strokeDash);
    context.strokeStyle = this.strokeStyle;
    context.fillStyle = this.fillStyle;

    context.fillRect(
      this._canvasPosition[0],
      this._canvasPosition[1],
      this._size,
      this._size
    );
    if (this.strokeWeight > 0) {
      context.lineWidth = this.strokeWeight;
      context.strokeRect(
        this._canvasPosition[0],
        this._canvasPosition[1],
        this._size,
        this._size
      );
    }
  }

  addAnimations(duration: number, properties: any) {
    Object.keys(properties).forEach((key) => {
      if (animatablePropertiesTuple.indexOf(key) !== -1) {
        this.animations.push(createAnimationFuncForTuple(this, key, properties[key], duration));
      } else if (animatablePropertiesNumber.indexOf(key) !== -1) {
        this.animations.push(createAnimationFuncForNumber(this, key, properties[key], duration));
      }
    });
  }

  isPositionHit(posX: number, posY: number): boolean {
    if (this.isHidden) {
      return false;
    }
    return posX >= this._canvasPosition[0]
      && posX <= this._rectBottomRight[0]
      && posY >= this._canvasPosition[1]
      && posY <= this._rectBottomRight[1];
  }
}
