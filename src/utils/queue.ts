class QueueNode<T> {
    value : T;
    next : QueueNode<T> | null = null;
    
    constructor(value : T) {
        this.value = value;
    }
}

class Queue<T> {
    private head : QueueNode<T> | null = null;
    private tail : QueueNode<T> | null = null;
    public len : number = 0;

    public push(val : T) : void {
        const newNode : QueueNode<T> = new QueueNode<T>(val);
        this.len++;
        if (! this.head) {
            this.head = newNode;
            this.tail = newNode;
            return;
        }
        if(this.tail) {
            this.tail.next = newNode;
            this.tail = this.tail.next;
        }
    }

    public front() : T | undefined {
        return (this.head) ? this.head.value : undefined;
    }

    public pop() : void {
        if (!this.head) return; 
        
        this.head = this.head.next

        if (! this.head) this.tail = null;

        this.len--;
    }

    public size(): number {
        return this.len;
    }

    public empty() : boolean {
        return this.len === 0; 
    }
}

export default Queue