export function part1(Base) {
    class Part1 extends Base {
        constructor() {
            super();
            this.name = "name-part1";
        }

        test() { super.test(); console.log(this.name, 'part1',this); }
        test_1() { console.log('part1'); }

    }//class-Part1;
    return Part1;
}//part1

export function part2(Base) {
    class Part2 extends Base {
        constructor() {
            super();
            this.name = "name-part2";
        }

        test() { console.log(this.name, 'part2',this); }
        test_2() { console.log('part2'); }

    }//class-Part2;
    return Part2;
}//part2

export function part3(Base) {
    class Part3 extends Base {
        constructor() {
            super();
            this.name = "name-part3";
        }

        test() { super.test(); console.log(this.name, 'part3',this); }
        test_3() { console.log('part3'); }

    }//class-Part3;
    return Part3;
}//part3