
// A simple simulation of a Merkle Tree for the Rollup State
// In production, this would use a specialized library like `fixed-merkle-tree`

export class MerkleTree {
    private leaves: string[];
    private levels: number;
    
    constructor(levels: number = 4) {
        this.levels = levels;
        this.leaves = new Array(Math.pow(2, levels)).fill('0x00000000000000000000000000000000');
    }

    // Simple hash function simulation (DJB2 variant for visual distinctness)
    private hash(left: string, right: string): string {
        let hash = 5381;
        const str = left + right;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
        }
        // Return hex string
        return '0x' + (hash >>> 0).toString(16).padStart(32, '0');
    }

    insert(index: number, value: string) {
        if (index >= this.leaves.length) return;
        this.leaves[index] = value;
    }

    getRoot(): string {
        let currentLevel = [...this.leaves];

        while (currentLevel.length > 1) {
            const nextLevel = [];
            for (let i = 0; i < currentLevel.length; i += 2) {
                nextLevel.push(this.hash(currentLevel[i], currentLevel[i + 1]));
            }
            currentLevel = nextLevel;
        }

        return currentLevel[0];
    }

    getProof(index: number): string[] {
        // Simplified proof generation
        return ["0xproof_sibling_1", "0xproof_sibling_2"];
    }
}
