import { debounce } from 'lodash'

// Define the Dot class with the required properties and methods
export class Dot {
  constructor(
    public radius: number,
    public x: number,
    public y: number,
    public dx: number,
    public dy: number,
    public fillColor: string,
    public shadowBlur: number,
    public shadowColor: string,
    public globalAlpha: number,
    public alpha: number
  ) {}

  public updateDots(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ): void {
    if (this.dx > 0 && this.x + this.radius > canvas.clientWidth) {
      this.x = -this.radius // Move dot to just outside the left edge
    } else if (this.dx < 0 && this.x - this.radius < 0) {
      this.x = canvas.clientWidth + this.radius // Move dot to just outside the right edge
    }

    if (this.dy > 0 && this.y + this.radius > canvas.clientHeight) {
      this.y = -this.radius // Move dot to just outside the top edge
    } else if (this.dy < 0 && this.y - this.radius < 0) {
      this.y = canvas.clientHeight + this.radius // Move dot to just outside the bottom edge
    }

    this.x += this.dx
    this.y += this.dy

    // Update alpha based on distance to the nearest edge
    this.adjustAlpha(canvas)
    this.drawDots(ctx)
  }

  private adjustAlpha(canvas: HTMLCanvasElement): void {
    const distances = [
      this.x - this.radius, // Distance from the left edge
      canvas.clientWidth - (this.x + this.radius), // Distance from the right edge
      this.y - this.radius, // Distance from the top edge
      canvas.clientHeight - (this.y + this.radius), // Distance from the bottom edge
    ]
    const minDistance = Math.min(...distances)
    const edgeThreshold = 20.0 // Define how close to the edge alpha starts changing

    // Map minDistance to alpha
    if (minDistance < edgeThreshold) {
      this.alpha = Math.abs((minDistance / edgeThreshold) * this.globalAlpha)
    } else {
      this.alpha = this.globalAlpha
    }
  }

  private drawDots(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.shadowBlur = this.shadowBlur
    ctx.shadowColor = this.shadowColor
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.fillColor
    ctx.fill()
  }
}

// Define a class to encapsulate the canvas and dot behavior
export class Stars {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private dotArray: Dot[] = []
  private animationFrameId: number | null = null // Store the ID of the animation frame
  private dpr: number = window.devicePixelRatio || 1
  private cssWidth: number = 0
  private cssHeight: number = 0
  private maxRadius: number
  private minRadius: number
  private density: string
  private active: boolean = true
  private resizeFadeout: () => void
  private debouncedResize: () => void
  private prevCssWidth: number = 0
  private prevCssHeight: number = 0
  private fadeDuration: number = 700
  private observer: IntersectionObserver

  constructor(
    canvas: HTMLCanvasElement | null,
    maxRadius: number = 3,
    minRadius: number = 1,
    density: string = 'low'
  ) {
    this.maxRadius = maxRadius
    this.minRadius = minRadius
    this.density = density
    if (!canvas || !canvas.parentElement) {
      throw new Error('Canvas or canvas container not found')
    }
    this.canvas = canvas
    this.canvas.classList.remove('opacity-0')
    this.ctx = canvas.getContext('2d')!
    this.resizeFadeout = this.fadeOutCanvas.bind(this)
    this.debouncedResize = debounce(this.resizeCanvas.bind(this), 300)
    this.initialize()
    this.observer = new IntersectionObserver(
      this.handleVisibilityChange.bind(this),
      {
        threshold: 0.01,
      }
    )
    this.observer.observe(this.canvas)
  }

  private initialize(): void {
    this.initCanvas()
    this.initDots()
    window.addEventListener('resize', this.resizeFadeout)
    window.addEventListener('resize', this.debouncedResize)
  }

  private initCanvas(): void {
    this.cssWidth = this.canvas.parentElement!.clientWidth
    this.cssHeight = this.canvas.parentElement!.clientHeight
    this.prevCssWidth = this.cssWidth
    this.prevCssHeight = this.cssHeight

    // Set the drawing buffer size to match the physical pixel size.
    this.canvas.width = this.cssWidth * this.dpr
    this.canvas.height = this.cssHeight * this.dpr

    // Set the CSS size of the canvas to match the layout size in CSS pixels.
    this.canvas.style.width = this.cssWidth + 'px'
    this.canvas.style.height = this.cssHeight + 'px'

    // Correct the coordinate system to account for the increased density.
    this.ctx.scale(this.dpr, this.dpr)
  }

  private isSizeChanged(): boolean {
    // Check if the size has changed significantly
    const newCssWidth = this.canvas.parentElement!.clientWidth
    const newCssHeight = this.canvas.parentElement!.clientHeight
    return (
      Math.abs(newCssWidth - this.prevCssWidth) > 50 ||
      Math.abs(newCssHeight - this.prevCssHeight) > 50
    )
  }

  private resizeCanvas(): void {
    if (this.isSizeChanged()) {
      setTimeout(() => {
        this.active = false
        this.initCanvas()
        this.initDots() // Reinitialize dots to adjust to new size
        this.fadeInCanvas()
      }, this.fadeDuration)
    }
  }

  private fadeOutCanvas(): void {
    if (this.isSizeChanged()) {
      this.canvas.classList.add('opacity-0')
    }
  }

  private fadeInCanvas(): void {
    this.canvas.classList.remove('opacity-0')
  }

  private initDots(): void {
    this.dotArray = []
    const dotCount = this.calculateDots()
    this.createDots(dotCount)
    this.active = true
  }

  private calculateDots(): number {
    const densityMultiplier = this.getDensityMultiplier(this.density)
    return Math.floor(
      ((this.cssWidth / 2) * (this.cssHeight / 2)) / (1500 * densityMultiplier)
    )
  }

  private getDensityMultiplier(density: string): number {
    const densityMap: { [key: string]: number } = {
      low: 6.667,
      medium: 1,
      high: 0.667,
    }
    return densityMap[density] || 1
  }

  private createDots(dotCount: number): void {
    for (let i = 0; i < dotCount; i++) {
      const radius = Math.max(Math.random() * this.maxRadius, this.minRadius)
      const x = Math.random() * (this.cssWidth - radius * 2) + radius
      const y = Math.random() * (this.cssHeight - radius * 2) + radius
      const dx = (Math.random() * radius - 1) / 10
      const dy = (Math.random() * radius - 1) / 10
      const fillColor = '#ede9fe'
      const shadowBlur = 10
      const shadowColor = 'white'
      const globalAlpha = Math.random() * 0.1 + 0.35
      const alpha = globalAlpha

      this.dotArray.push(
        new Dot(
          radius,
          x,
          y,
          dx,
          dy,
          fillColor,
          shadowBlur,
          shadowColor,
          globalAlpha,
          alpha
        )
      )
    }
  }

  private animate(): void {
    // Cancel the previous frame before setting a new one
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
    }

    if (!this.active) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      return
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate())
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.dotArray.forEach((dot) => dot.updateDots(this.canvas, this.ctx))
  }

  private handleVisibilityChange(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.active = true
        this.animate()
      } else {
        this.active = false
      }
    })
  }

  // Method to destroy the star field and clean up resources
  destroy() {
    this.active = false
    this.observer.disconnect()
    window.removeEventListener('resize', this.resizeFadeout)
    window.removeEventListener('resize', this.debouncedResize)
  }
}
