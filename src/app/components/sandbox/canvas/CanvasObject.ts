export interface CanvasObject {
  isHidden: boolean;
  isDragEnabled: boolean;
  draw(context: CanvasRenderingContext2D, timestamp: number);
  isPositionHit(posX: number, posY: number): boolean;
  addAnimations(duration: number, properties: any);
}
