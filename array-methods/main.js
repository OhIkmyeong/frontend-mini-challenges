import { ArrayMethod } from "./ArrayMethod.js";

const AM = new ArrayMethod();

AM.add_item("filter", "index > 3");
AM.add_item("map", "value / 5");
AM.evaluate();

AM.init();