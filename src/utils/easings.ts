class Easings {
    constructor () {
            
    }
    public easeOutBounce(x: number): number {
        const n1 = 7.5625;
        const d1 = 2.75;
        
        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
        
    }

    public easeInOutBounce(x: number): number {
        
        return x < 0.5
          ? (1 - this.easeOutBounce(1 - 2 * x)) / 2
          : (1 + this.easeOutBounce(2 * x - 1)) / 2;
        
    }

    public easeOutCirc(x: number): number {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
        
    }

    public easeOutQuad(x: number): number {
        return 1 - (1 - x) * (1 - x);
    }

    public easeInQuad(x: number): number {
        return x * x;
    }

    public easeInSine(x: number): number {
        return 1 - Math.cos((x * Math.PI) / 2);
    }
}

export default Easings;