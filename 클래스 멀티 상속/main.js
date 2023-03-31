import { part1, part2, part3 } from "./parts.js";
import { Base } from "./base.js";

const creator = (allParts, part) => part(allParts);
const extender = (...parts) => parts.reduce(creator, Base);

class Final extends extender(part1,part2,part3){
    constructor(){
        super();
        this.test(); //전부 this는 Final{}
    }
}//class-Final


new Final().init();
